import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel, useParams } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
import Title from '@/components/Title';
import DragedFile from '@/components/DragedFile';
// import PdfDeEncrypt from '@/components/PdfDeEncrypt';
// import PdfReplaceText from '@/components/PdfReplaceText';
// import PdfCrop from '@/components/PdfCrop';
import type { UploadProps } from 'antd/es/upload/interface';
import Office2Pdf from '@/utils/ofice2pdf';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { fileList, onRemove, beforeUpload } = useModel('files');
  const { instance, setInstance } = useModel('pdf');
  const [open, setOpen] = useState(false);
  const { from = 'word' } = useParams();

  const fileType: Record<string, any> = {
    word: {
      accept: '.doc,.docx',
      title: 'Word转PDF',
      desc: 'Word(.doc.docx)转PDF',
    },
    ppt: {
      accept: '.ppt,.pptx',
      title: 'PPT转PDF',
      desc: 'PPT(.ppt.pptx)转PDF',
    },
    excel: {
      accept: '.xls,.xlsx',
      title: 'Excel转PDF',
      desc: 'Excel(.xls.xlsx)转PDF',
    },
    txt: { accept: '.txt', title: 'Txt转PDF', desc: 'Txt转PDF' },
    image: {
      accept: 'image/*',
      multiple: true,
      title: '图片转PDF',
      desc: '图片(.png.jpg)转PDF',
    },
  };

  const baseData = fileType[from];

  const viewer = useRef<HTMLDivElement>(null);
  const props: UploadProps = {
    onRemove,
    beforeUpload,
    fileList,
    accept: baseData.accept,
    showUploadList: false,
    multiple: baseData.multiple || false,
  };

  useEffect(() => {
    WebViewer({ path: '/webviewer/lib', fullAPI: true }, viewer.current!).then(
      async (instance) => {
        setInstance(instance);
        await instance.Core.PDFNet.initialize();
      },
    );
  }, []);

  const renderFile = () => {
    return fileList.map((file, index) => (
      <Col span={4} key={index}>
        <DragedFile file={file} accept={baseData.accept} />
      </Col>
    ));
  };

  const renderMoreFileButton = () => {
    return (
      baseData.multiple && (
        <Col span={4}>
          <Upload className="w-full h-full block" {...props}>
            <div className="draged-action">添加更多文件</div>
          </Upload>
        </Col>
      )
    );
  };

  // office类型文件转blob并保存为pdf
  const toPDFBufferAndSave = async () => {
    setLoading(true);
    const file = fileList[0];
    const fileName = file.name.split('.')[0];
    console.log(file);
    // 转blob
    const blob = await Office2Pdf.toPDFBuffer(instance!, file);
    // 浏览器打开
    // await Office2Pdf.openPdfInNewTab(blob);

    // 下载
    await Office2Pdf.download(blob, `${fileName}.pdf`);
    setLoading(false);
    setSuccess(true);
  };

  // 内容区域
  const renderContent = () => {
    if (!fileList.length) {
      return (
        <div className="w-1/3 m-auto h-full flex justify-center items-center flex-col relative z-10">
          <div className="flex justify-center text-xl font-bold mb-6">
            {baseData.title}
          </div>
          <div className="text-gray-400 text-center mb-14">{baseData.desc}</div>
          <Button className="mb-8" type="primary" size="large" block ghost>
            可以拖拽至此
          </Button>
          <Upload className="w-full" {...props}>
            <Button className="w-full" type="primary" size="large" block>
              选择本地文件
            </Button>
          </Upload>
        </div>
      );
    }
  };

  // 操作按钮
  const renderAction = () => {
    let action;
    if (fileList.length && success) {
      action = (
        <Button type="primary" size="large" block>
          全部下载
        </Button>
      );
    } else if (fileList.length) {
      action = (
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => toPDFBufferAndSave()}
        >
          转换
        </Button>
      );
    }
    return (
      <div className="w-1/3 absolute bottom-20 left-1/2 -translate-x-1/2">
        {action}
      </div>
    );
  };

  return (
    <>
      <Title title="转为PDF" />
      <Dragger {...props} openFileDialogOnClick={false}></Dragger>
      {fileList.length && (
        <Row gutter={16}>
          {renderFile()}
          {renderMoreFileButton()}
        </Row>
      )}

      {renderContent()}
      {/* <Col span={24}>
          <PdfDeEncrypt />
          <PdfReplaceText />
          <PdfCrop />
        </Col> */}
      {renderAction()}
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

export default ConvertFrom;