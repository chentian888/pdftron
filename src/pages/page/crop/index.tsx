import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import WebViewer, { Core } from '@pdftron/webviewer';
// import { times } from 'lodash-es';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ConvertedFile from '@/components/ConvertedFile';
import PdfCrop from '@/components/PdfCrop';
import type { UploadProps } from 'antd/es/upload/interface';
// import type { ExtraThumbnailType } from '@/types/typings';

const { Dragger } = Upload;

const PageManipulation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  // const [cropNumber, setCropNumber] = useState<number[]>([]);
  const [doc, setDoc] = useState<unknown>();
  const [docCount, setDocCount] = useState<number>();
  const [cropType, setCropType] = useState<CropType>();

  const {
    fileList,
    onRemove,
    beforeUpload,
    setFileList,
    convertList,
    setConvertList,
  } = useModel('files');
  const { instance, setInstance, showWebviewer, setShowWebviewer } =
    useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: true,
    title: 'PDF裁剪',
    desc: '将PDF拆分成两半再按正确顺序合并',
  };

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

  const initDoc = async () => {
    const file = fileList[0];
    const doc = await instance?.Core.createDocument(file as any as File, {
      filename: file.name,
    });
    const count = doc?.getPageCount();
    setDoc(doc);
    setDocCount(count!);
  };

  useEffect(() => {
    if (fileList.length) {
      initDoc();
    }
  }, [fileList]);

  // 裁剪页面
  const handleCrop = async (pagesNum: number[] = []) => {
    const file = fileList[0];
    setLoading(true);
    const res = await PDF.cropPage(
      doc! as Core.Document,
      file,
      cropType,
      pagesNum,
    );
    setConvertList(res);
    await PDF.downloadZip(res);
    setLoading(false);
    setSuccess(true);
  };

  // 设置裁剪模式
  const setCropModule = (type: CropType) => {
    setCropType(type);
  };

  // 文件列表
  const renderInitFile = () => {
    if (fileList?.length && !success) {
      return (
        <PdfCrop
          file={fileList[0]}
          count={docCount!}
          crop={handleCrop}
          loading={loading}
          setCropModule={setCropModule}
        />
      );
    }
  };

  // 转换为image列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile img={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  const reset = () => {
    setConvertList([]);
    setFileList([]);
    setDoc(null as unknown);
    // setCropNumber([]);
    setSuccess(false);
    setCropType(null);
  };

  const downloadAll = async () => {
    console.log(convertList);
    await PDF.downloadZip(convertList);
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
    if (success) {
      return (
        <div className="w-1/3 absolute bottom-20 left-1/2 -translate-x-1/2">
          <Button type="primary" size="large" block onClick={downloadAll}>
            全部下载
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={reset}>
            继续
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* <Title title="转为PDF" /> */}
      <Dragger
        className="w-full min-h-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>
      {renderInitFile()}
      {renderInitContent()}
      {renderConvertFile()}

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

export default PageManipulation;
