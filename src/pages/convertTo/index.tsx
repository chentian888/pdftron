import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel, useParams } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
import { last, split, nth } from 'lodash-es';
// import Title from '@/components/Title';
import DragedFile from '@/components/DragedFile';
import ImageFile from '@/components/ImageFile';
// import PdfDeEncrypt from '@/components/PdfDeEncrypt';
// import PdfReplaceText from '@/components/PdfReplaceText';
// import PdfCrop from '@/components/PdfCrop';
import type { UploadProps } from 'antd/es/upload/interface';
import PDF from '@/utils/pdf';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { fileList, onRemove, beforeUpload, imageList, setImageList } =
    useModel('files');
  const { instance, setInstance, showWebviewer, setShowWebviewer } =
    useModel('pdf');
  const { to = 'word' } = useParams();

  const fileType: Record<string, any> = {
    word: {
      accept: '.pdf',
      title: 'PDF转Word',
      desc: 'PDF转Word',
    },
    ppt: {
      accept: '.pdf',
      title: 'PDF转PPT',
      desc: 'PDF转PPT',
    },
    excel: {
      accept: '.pdf',
      title: 'PDF转Excel',
      desc: 'PDF转Excel',
    },
    xps: { accept: '.pdf', title: 'PDF转Xps', desc: 'PDF转Xps' },
    epud: { accept: '.pdf', title: 'PDF转Epud', desc: 'PDF转Epud' },
    image: {
      accept: '.pdf',
      title: 'PDF转图片',
      desc: 'PDF转图片（jpeg,png）',
    },
    pdfa: { accept: '.pdf', title: 'PDF转PDF/A', desc: 'PDF转PDF/A' },
  };

  const baseData = fileType[to];

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

  // 文件列表
  const renderFile = () => {
    return fileList.map((file, index) => (
      <Col span={4} key={index}>
        <DragedFile
          file={file}
          accept={baseData.accept}
          showCheckBox={to === 'image'}
        />
      </Col>
    ));
  };

  // 转换为image列表
  const renderConvertImage = () => {
    if (imageList.length) {
      return (
        <Row gutter={[16, 16]}>
          {imageList.map((img, index) => (
            <Col span={4} key={img.file.size}>
              <ImageFile img={img} index={index + 1} />
            </Col>
          ))}
        </Row>
      );
    }
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

  // 转换
  const convert = async () => {
    setLoading(true);
    // 始终取最后一个文件做为下载显示的文件名
    const lastFile = last(fileList);
    const fileName = nth(split(lastFile?.name, '.'), 0);
    console.log(lastFile);

    // 转blob
    let blob = null;
    if (to === 'image') {
      // const buf = await PDF.file2Buf(lastFile as any as File);
      const res = await PDF.pdf2image(instance!, fileList);
      setImageList(res);
    } else if (to === 'pdfa') {
      blob = await PDF.pdf2pdfa(instance!, lastFile!);
      await PDF.download(blob, `${fileName}.pdf`);
    } else {
      const arr = await PDF.office2pdf(instance!, fileList);
      setImageList(arr);
      // 下载
      await PDF.downloadZip(arr);
    }

    setLoading(false);
    setSuccess(true);
  };

  const downloadAll = async () => {
    await PDF.downloadZip(imageList);
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
        <Button type="primary" size="large" block onClick={downloadAll}>
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
          onClick={() => convert()}
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
      {/* <Title title="转为PDF" /> */}
      <Dragger
        className="w-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>

      {!imageList.length && fileList.length && (
        <Row gutter={[16, 16]}>
          {renderFile()}
          {renderMoreFileButton()}
        </Row>
      )}

      {renderConvertImage()}

      {renderContent()}
      {renderAction()}
      <Modal
        className="webviewer-modal"
        title="Modal 1000px width"
        centered
        forceRender
        open={showWebviewer}
        onOk={() => setShowWebviewer(false)}
        onCancel={() => setShowWebviewer(false)}
        width={'100%'}
        footer={null}
      >
        <div className="webviewer" ref={viewer}></div>
      </Modal>
    </>
  );
};

export default ConvertFrom;
