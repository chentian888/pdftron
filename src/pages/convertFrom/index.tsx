import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel, useParams } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
// import { last, split, nth } from 'lodash-es';
// import Title from '@/components/Title';
import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
// import PdfDeEncrypt from '@/components/PdfDeEncrypt';
// import PdfReplaceText from '@/components/PdfReplaceText';
// import PdfCrop from '@/components/PdfCrop';
import type { UploadProps } from 'antd/es/upload/interface';
import PDF from '@/utils/pdf';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const {
    fileList,
    onRemove,
    beforeUpload,
    checkFileList,
    convertList,
    setConvertList,
  } = useModel('files');
  const { instance, setInstance, showWebviewer, setShowWebviewer } =
    useModel('pdf');
  const { from = 'word' } = useParams();

  const fileType: Record<string, any> = {
    word: {
      accept: '.doc,.docx',
      multiple: true,
      title: 'Word转PDF',
      desc: 'Word(.doc.docx)转PDF',
    },
    ppt: {
      accept: '.ppt,.pptx',
      multiple: true,
      title: 'PPT转PDF',
      desc: 'PPT(.ppt.pptx)转PDF',
    },
    excel: {
      accept: '.xls,.xlsx',
      multiple: true,
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

  // 渲染需要转换的文件
  const renderInitFile = () => {
    const list = fileList.map((file, index) => (
      <Col span={4} key={index}>
        <DragedFile
          file={file}
          accept={baseData.accept}
          showCheckBox={from === 'image'}
        />
      </Col>
    ));
    if (!success && fileList.length) {
      return (
        <Row gutter={16}>
          {list}
          {renderMoreFileButton()}
        </Row>
      );
    }
  };

  // 渲染转换后的文件
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile img={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={16}>{list}</Row>;
    }
  };

  // 转换
  const convert = async () => {
    setLoading(true);

    // 转blob
    // let blob = null;
    if (from === 'image') {
      const arr = await PDF.image2pdf(instance!, checkFileList);
      setConvertList(arr);
      await PDF.downloadZip(arr);
    } else {
      console.log(fileList);
      const arr = await PDF.office2pdf(instance!, fileList);
      setConvertList(arr);
      // 下载
      await PDF.downloadZip(arr);
    }

    setLoading(false);
    setSuccess(true);
  };

  // 内容区域
  const renderInitContent = () => {
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
    // image转pdf勾选后才能转换
    const convertBtnDisabled = from === 'image' && !checkFileList.length;

    if (success) {
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
          disabled={convertBtnDisabled}
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
      {renderInitContent()}
      {renderInitFile()}
      {renderConvertFile()}

      {/* <Col span={24}>
          <PdfDeEncrypt />
          <PdfReplaceText />
          <PdfCrop />
        </Col> */}
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
