import { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
import Title from '@/components/Title';
import DragedFile from '@/components/DragedFile';
// import PdfDeEncrypt from '@/components/PdfDeEncrypt';
// import PdfReplaceText from '@/components/PdfReplaceText';
// import PdfCrop from '@/components/PdfCrop';
import type { UploadProps } from 'antd/es/upload/interface';
import PDF from '@/utils/pdf';

const { Dragger } = Upload;

const PdfToJpg: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { fileList, onRemove, beforeUpload } = useModel('files');
  const { instance, setInstance } = useModel('pdf');
  const [open, setOpen] = useState(false);

  const viewer = useRef<HTMLDivElement>(null);
  const props: UploadProps = {
    onRemove,
    beforeUpload,
    fileList,
    showUploadList: false,
    accept: '.pdf',
  };

  useEffect(() => {
    WebViewer({ path: '/webviewer/lib', fullAPI: true }, viewer.current!).then(
      async (instance) => {
        setInstance(instance);
        await instance.Core.PDFNet.initialize();
      },
    );
  }, []);

  // office类型文件转blob并保存为pdf
  const toPDFBufferAndSave = async () => {
    setLoading(true);
    const file = fileList[0];
    const fileName = file.name.split('.')[0];
    console.log(file);
    // 转blob
    const blob = await PDF.office2pdf(instance!, file);
    // 浏览器打开
    // await PDF.openPdfInNewTab(blob);

    // 下载
    await PDF.download(blob, `${fileName}.pdf`);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <Title title="转为PDF" />
      <Dragger {...props}></Dragger>
      <Row gutter={16}>
        {fileList.map((file, index) => (
          <Col span={4} key={index}>
            <DragedFile file={file} accept=".pdf" />
          </Col>
        ))}
        <Col span={4}>
          <div className="draged-action">添加更多文件</div>
        </Col>
        {/* <Col span={24}>
          <PdfDeEncrypt />
          <PdfReplaceText />
          <PdfCrop />
        </Col> */}
      </Row>

      <div className="file-action">
        {success ? (
          <Button type="primary">全部下载</Button>
        ) : (
          <Button
            type="primary"
            loading={loading}
            onClick={() => toPDFBufferAndSave()}
          >
            转换
          </Button>
        )}
      </div>

      <Modal
        title="Modal 1000px width"
        centered
        forceRender
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
        <div className="webviewer" ref={viewer}></div>
      </Modal>
    </>
  );
};

export default PdfToJpg;
