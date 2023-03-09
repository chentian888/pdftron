import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin, message } from 'antd';
import {
  useModel,
  useParams,
  useRequest,
  FormattedMessage,
  useIntl,
} from '@umijs/max';
import DragedFile from '@/components/DragedFile';
import ConvertedFileOline from '@/components/ConvertedFileOline';
import PermissionBtn from '@/components/PermissionBtn';
import Cache from '@/utils/cache';
import type { UploadProps } from 'antd/es/upload/interface';
// import PDF from '@/utils/pdf';
import { uploadFile, pdf2Office } from '@/services/user';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const { setBread } = useModel('global');
  const { getUserVipInfo } = useModel('user');
  const { fileList, success, setSuccess, onRemove, beforeUpload, resetList } =
    useModel('files');
  const {
    showWebviewer,
    ready,
    setReady,
    setShowWebviewer,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');
  const { to = 'word' } = useParams();

  const { data, run, cancel } = useRequest(
    {
      url: `/api/pdf/queryState`,
      method: 'GET',
      headers: { token: Cache.getCookieToken() as string },
    },
    {
      manual: true,
      pollingInterval: 5000,
      async onSuccess(data) {
        if (data.state === 1) {
          cancel();
          window.open(BROWSER_FILE + data?.convertedPaths[0]);
          setLoading(false);
          setSuccess(true);
        }
      },
    },
  );

  const downloadAll = async () => {
    window.open(BROWSER_FILE + data?.convertedPaths[0]);
  };

  const fileType: Record<string, any> = {
    word: {
      accept: '.pdf',
      convertType: '0',
      multiple: false,
      title: intl.formatMessage({ id: 'pdf2word' }),
      desc: intl.formatMessage({ id: 'pdf2wordDesc' }),
      maxCount: 1,
    },
    ppt: {
      accept: '.pdf',
      convertType: '1',
      multiple: false,
      title: intl.formatMessage({ id: 'pdf2ppt' }),
      desc: intl.formatMessage({ id: 'pdf2pptDesc' }),
      maxCount: 1,
    },
    excel: {
      accept: '.pdf',
      convertType: '2',
      multiple: false,
      title: intl.formatMessage({ id: 'pdf2excel' }),
      desc: intl.formatMessage({ id: 'pdf2excelDesc' }),
      maxCount: 1,
    },
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

  // 继续
  const going = () => {
    // data.convertedPaths = [];
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

  // 转换为image列表
  const renderConvertFile = () => {
    if (success && data && data.convertedPaths) {
      return (
        <Row gutter={[16, 16]}>
          {data.convertedPaths.map((url: string, index: number) => (
            <Col span={4} key={index}>
              <ConvertedFileOline src={url} remove={going} file={fileList[0]} />
            </Col>
          ))}
        </Row>
      );
    }
  };

  // 转换
  const convert = async () => {
    setLoading(true);
    try {
      // 在线转换
      const file = fileList[0];
      await getUserVipInfo();
      const { data } = await uploadFile({ files: file as any as File });
      await pdf2Office({
        fileId: data.fileId,
        convertType: baseData.convertType,
      });
      run('');

      // 下载
      // await PDF.downloadZip(arr);
      // setConvertList(arr);
    } catch (e) {
      setLoading(false);
      message.error('转换失败请检查文档是否有密码或已损坏！');
    }
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
      {loading && (
        <Spin
          size="large"
          tip={intl.formatMessage({ id: 'converting' })}
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

export default ConvertFrom;
