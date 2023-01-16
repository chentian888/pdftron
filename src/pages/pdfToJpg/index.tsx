import { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button } from 'antd';
import { useModel } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
import DragedFile from '@/components/DragedFile';
import type { UploadProps } from 'antd/es/upload/interface';
import Office2Pdf from '@/utils/ofice2pdf';

const { Dragger } = Upload;

const PdfToJpg: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { fileList, onRemove, beforeUpload } = useModel('files');
  const { instance, setInstance } = useModel('pdf');

  const viewer = useRef<HTMLDivElement>(null);
  const props: UploadProps = { onRemove, beforeUpload, fileList };
  useEffect(() => {
    WebViewer({ path: '/webviewer/lib', fullAPI: true }, viewer.current!).then(
      async (instance) => {
        setInstance(instance);
        await instance.Core.PDFNet.initialize();
      },
    );
  }, []);

  const toPDFBufferAndSave = async () => {
    setLoading(true);
    const file = fileList[0];
    console.log(file);
    const blob = await Office2Pdf.toPDFBuffer(instance, file);
    // await Office2Pdf.openPdfInNewTab(blob);
    await Office2Pdf.download(blob, `${file.name}.pdf`);

    // instance.UI.loadDocument(blob, { filename: `${file.name}.pdf` });

    // const { documentViewer } = instance.Core;
    // documentViewer.addEventListener('documentLoaded', () => {
    //   const doc = documentViewer.getDocument();
    //   const pageCount = doc.getPageCount();
    //   console.log(pageCount)
    //   const pageNum = 1;
    //   doc.loadThumbnailAsync(pageNum, (thumbnail: HTMLCanvasElement) => {
    //     // thumbnail is a HTMLCanvasElement or HTMLImageElement
    //     const base64 = thumbnail.toDataURL();
    //     console.log(base64);
    //   });
    // });
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <div className="webviewer" ref={viewer}></div>
      <Dragger
        {...props}
        // accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
        showUploadList={false}
      ></Dragger>
      <Row gutter={16}>
        {fileList.map((file, index) => (
          <Col span={4} key={index}>
            <DragedFile file={file} />
          </Col>
        ))}
        <Col span={4}>
          <div className="draged-action">添加更多文件</div>
        </Col>
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
    </>
  );
};

export default PdfToJpg;
