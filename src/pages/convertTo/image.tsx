import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin, message } from 'antd';
import { useModel, FormattedMessage, useIntl } from '@umijs/max';
// import DragedFile from '@/components/DragedFile';
import ConvertedImage from '@/components/ConvertedImage';
// import PermissionBtn from '@/components/PermissionBtn';
import type { UploadProps } from 'antd/es/upload/interface';
import PDF from '@/utils/pdf';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const intl = useIntl();
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
    ready,
    setReady,
    setShowWebviewer,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: false,
    free: true,
    title: intl.formatMessage({ id: 'pdf2img' }),
    desc: intl.formatMessage({ id: 'pdf2imgDesc' }),
    maxCount: 1,
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
    setBread([{ title: '首页', link: '/' }, { title: baseData.title }]);
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  const downloadAll = async () => {
    await PDF.downloadZip(convertList);
  };

  // 转换为image列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedImage convert={file as PageThumbnailType} index={index} />
      </Col>
    ));
    if (convertList.length) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  // const pdf2imageCallback = (res: ConvertFile[]) => {
  //   setConvertList([...convertList, ...res]);
  // };

  const callback = (res: PageThumbnailType[], finish: boolean = false) => {
    setConvertList([...convertList, ...res]);
    if (finish) {
      setLoading(false);
      setSuccess(true);
      // downloadAll();
      PDF.downloadZip(res);
    }
  };

  // 初始化加载有页面
  const initThumb = async () => {
    try {
      const file = fileList[0];
      setLoading(true);
      await PDF.loadPage(instance!, file, callback);
    } catch (e) {
      setLoading(false);
      going();
      message.error('转换失败请检查文档是否有密码或已损坏！');
    }
  };

  useEffect(() => {
    if (fileList.length) {
      initThumb();
    }
  }, [fileList]);

  // 内容区域
  const renderInitContent = () => {
    if (!fileList.length) {
      return (
        <div className="w-1/3 m-auto min-h-full flex justify-center items-center flex-col relative z-10">
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
            <FormattedMessage id="dragFileBtn" />
          </Button>
          <Upload className="w-full" disabled={!ready} {...props}>
            <Button
              className="w-full"
              type="primary"
              size="large"
              loading={!ready}
              block
            >
              <FormattedMessage id="chooseFileBtn" />
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
            <FormattedMessage id="downloadAll" />
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={going}>
            <FormattedMessage id="continue" />
          </div>
        </div>
      );
    }
    return '';
  };

  return (
    <>
      {loading && (
        <Spin
          size="large"
          tip={intl.formatMessage({ id: 'converting' })}
          className="w-full h-full absolute bg-black bg-opacity-5 rounded-lg top-0 left-0 z-10 flex justify-center items-center flex-col"
        ></Spin>
      )}

      <Dragger
        disabled={!ready || fileList.length >= baseData.maxCount}
        className="w-full min-h-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>
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

export default ConvertFrom;
