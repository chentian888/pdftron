import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, message } from 'antd';
import { useModel } from '@umijs/max';
import PDF from '@/utils/pdf';
import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
import type { UploadProps } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const PageManipulation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setBread } = useModel('global');
  const {
    fileList,
    success,
    setSuccess,
    onRemove,
    beforeUpload,
    convertList,
    setConvertList,
    resetList,
  } = useModel('files');
  const {
    instance,
    showWebviewer,
    setShowWebviewer,
    ready,
    setReady,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: false,
    title: 'PDF压缩',
    desc: 'PDF压缩',
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

  // 继续
  const going = () => {
    resetList();
  };

  // 页面卸载
  const pageUmount = () => {
    going();
    setReady(false);
    setBread([]);
  };

  useEffect(() => {
    setBread([{ title: '首页', link: '/' }, { title: 'PDF压缩' }]);
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
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
        <DragedFile file={file} accept={baseData.accept} />
      </Col>
    ));
    if (!success && fileList.length) {
      return (
        <Row gutter={[16, 16]}>
          {list}
          {renderMoreFileButton()}
        </Row>
      );
    }
  };

  // 转换为image列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile convert={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  // 提取页面
  const convert = async () => {
    try {
      setLoading(true);
      const res = await PDF.compress(instance!, fileList);
      await PDF.downloadZip(res);
      setConvertList(res);
      setSuccess(true);
    } catch (e) {
      message.error('转换失败请检查文档是否有密码或已损坏！');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
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
          <Button
            className="mb-8"
            type="primary"
            size="large"
            block
            loading={!ready}
            ghost
          >
            可以拖拽至此
          </Button>
          <Upload className="w-full" {...props}>
            <Button
              className="w-full"
              type="primary"
              size="large"
              loading={!ready}
              block
            >
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
        <>
          <Button type="primary" size="large" block onClick={downloadAll}>
            全部下载
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={going}>
            继续
          </div>
        </>
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
          压缩
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
      <Dragger
        disabled={!ready}
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
        title={webviewerTtile}
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
