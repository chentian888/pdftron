import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin, message } from 'antd';
import { useModel, FormattedMessage, useIntl } from '@umijs/max';
import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
import PDF from '@/utils/pdf';
import type { UploadProps } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const ExtractText: React.FC = () => {
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
    title: intl.formatMessage({ id: 'pdfText' }),
    desc: intl.formatMessage({ id: 'pdfTextDesc' }),
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
    setBread([{ title: '首页', link: '/' }, { title: '提取文字' }]);
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
            <div className="draged-action">
              <FormattedMessage id="addMoreBtn" />
            </div>
          </Upload>
        </Col>
      )
    );
  };

  // 文件列表
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

  // 提取文本列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile convert={file} index={index} nonsupport={true} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  // 提取文字
  const extraText = async () => {
    try {
      setLoading(true);
      const list = await PDF.extraText(instance!, fileList);
      await PDF.downloadZip(list);
      setConvertList(list);
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
          <Upload className="w-full" {...props}>
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
    let action;

    if (success) {
      action = (
        <>
          <Button type="primary" size="large" block onClick={downloadAll}>
            <FormattedMessage id="downloadAll" />
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={going}>
            <FormattedMessage id="continue" />
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
          onClick={extraText}
        >
          <FormattedMessage id="extractTextBtn" />
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
      {loading && (
        <Spin
          size="large"
          tip={intl.formatMessage({ id: 'extractTexting' })}
          className="w-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0 z-10 flex justify-center items-center flex-col"
        ></Spin>
      )}
      <Dragger
        disabled={!ready || fileList.length >= baseData.maxCount}
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

export default ExtractText;
