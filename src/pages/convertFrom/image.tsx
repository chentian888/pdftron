import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin } from 'antd';
import { useModel, useIntl, FormattedMessage } from '@umijs/max';
import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
import PermissionBtn from '@/components/PermissionBtn';
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
    beforeUpload2,
    checkFileList,
    setCheckFileList,
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
    accept: 'image/*',
    multiple: true,
    title: intl.formatMessage({ id: 'img2pdf' }),
    desc: intl.formatMessage({ id: 'img2pdfDesc' }),
  };

  const viewer = useRef<HTMLDivElement>(null);

  const props: UploadProps = {
    onRemove,
    beforeUpload: beforeUpload2,
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
    setBread([
      { title: intl.formatMessage({ id: 'navHome' }), link: '/' },
      { title: baseData.title },
    ]);
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  useEffect(() => {
    if (fileList.length) {
      setCheckFileList(fileList);
    }
  }, [fileList]);

  const downloadAll = async () => {
    await PDF.downloadZip(convertList);
  };

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

  // 渲染需要转换的文件
  const renderInitFile = () => {
    const list = fileList.map((file, index) => (
      <Col span={4} key={index}>
        <DragedFile file={file} accept={baseData.accept} showCheckBox={true} />
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

  // 渲染转换后的文件
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

  // 转换
  const convert = async () => {
    try {
      setLoading(true);
      const arr = await PDF.image2pdf(instance!, checkFileList);
      // 下载
      await PDF.downloadZip(arr as ConvertFile[]);
      setConvertList(arr as ConvertFile[]);
      setSuccess(true);
    } catch (error) {
      // message.error('请检查，您选择了损坏的图片');
      console.log(error);
    } finally {
      setLoading(false);
    }
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
        <PermissionBtn text={intl.formatMessage({ id: 'convertBtn' })}>
          <Button
            type="primary"
            size="large"
            block
            disabled={!checkFileList.length}
            loading={loading}
            onClick={convert}
          >
            <FormattedMessage id="convertBtn" />
          </Button>
        </PermissionBtn>
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
      {loading && (
        <Spin
          size="large"
          tip={intl.formatMessage({ id: 'converting' })}
          className="w-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0 z-10 flex justify-center items-center flex-col"
        ></Spin>
      )}

      <Dragger
        disabled={!ready}
        className="w-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>
      {renderInitContent()}
      {renderInitFile()}
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
