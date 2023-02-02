import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import WebViewer from '@pdftron/webviewer';
// import { nth, split, times } from 'lodash-es';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ExtraThumbnail from '@/components/ExtraThumbnail';
import ConvertedFile from '@/components/ConvertedFile';
import type { UploadProps } from 'antd/es/upload/interface';
import type { ExtraThumbnailType } from '@/types/typings';

const { Dragger } = Upload;

const PageManipulation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [thumbnailList, setThumbnailList] = useState<ExtraThumbnailType[]>();

  const { fileList, onRemove, beforeUpload, convertList, setConvertList } =
    useModel('files');
  const { instance, setInstance, showWebviewer, setShowWebviewer } =
    useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: true,
    title: 'PDF提取',
    desc: '选择PDF中的页面拆分成新的文档',
  };

  const viewer = useRef<HTMLDivElement>(null);

  const props: UploadProps = {
    onRemove,
    beforeUpload,
    fileList,
    accept: baseData.accept,
    showUploadList: false,
    multiple: baseData.multiple || false,
    onChange: async ({ file }) => {
      console.log(file);
      const doc = await instance?.Core.createDocument(file as any as File, {
        extension: 'pdf',
        l: 'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0',
      });
      const arr: Promise<ExtraThumbnailType>[] = [];
      const count = doc?.getPageCount() as number;

      const loadThumbnail = (index: number): Promise<ExtraThumbnailType> => {
        return new Promise((resolve) => {
          doc?.loadThumbnail(
            index,
            (thumbnail: HTMLCanvasElement | HTMLImageElement) => {
              const base64 = (thumbnail as HTMLCanvasElement).toDataURL();
              resolve({ img: base64, total: count, current: index });
            },
          );
        });
      };
      for (let i = 0; i < count; i++) {
        arr.push(loadThumbnail(i + 1));
      }
      const res = await Promise.all(arr);
      setThumbnailList(res);
    },
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
  const renderInitFile = () => {
    const list = thumbnailList?.map((file, index) => (
      <Col span={4} key={index}>
        <ExtraThumbnail file={file} />
      </Col>
    ));
    if (thumbnailList?.length) {
      return <Row gutter={[16, 16]}>{list}</Row>;
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

  // 提取页面
  const extractPage = async () => {
    const res = await PDF.mergeDocuments(instance!, fileList);
    setConvertList(res);
    await PDF.downloadZip(res);
  };

  // useEffect(() => {
  //   extractPage();
  // }, [fileList]);

  // 转换
  const convert = async () => {
    setLoading(true);
    await extractPage();
    setLoading(false);
    setSuccess(true);
  };

  const downloadAll = async () => {
    console.log(convertList);
    await PDF.downloadZip(convertList);
  };

  // 内容区域
  const renderInitContent = () => {
    if (!fileList.length) {
      return (
        <div className="w-1/3 m-auto min-h-full flex justify-center items-center flex-col relative z-10">
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

    if (success) {
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
