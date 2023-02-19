import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin } from 'antd';
import { useModel, useParams, useRequest } from '@umijs/max';
import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
import PermissionBtn from '@/components/PermissionBtn';
import type { UploadProps } from 'antd/es/upload/interface';
// import PDF from '@/utils/pdf';
import { uploadFile, pdf2Office, convertStatus } from '@/services/user';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusData, seStatusData] = useState<API.ConvertOfficeRes>();
  const {
    fileList,
    success,
    setSuccess,
    onRemove,
    beforeUpload,
    convertList,
    resetList,
  } = useModel('files');
  const {
    showWebviewer,
    ready,
    setReady,
    setShowWebviewer,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');
  const { to = 'word' } = useParams();

  const downloadAll = async () => {
    window.open(BROWSER_FILE + statusData?.convertedPaths[0]);
  };

  const { run, cancel } = useRequest(convertStatus, {
    manual: true,
    pollingInterval: 5000,
    onSuccess(data) {
      if (data.state === 1) {
        cancel();
        seStatusData(data);
        downloadAll();
      }
    },
  });

  const fileType: Record<string, any> = {
    word: {
      accept: '.pdf',
      convertType: '0',
      title: 'PDF转Word',
      desc: 'PDF转Word',
    },
    excel: {
      accept: '.pdf',
      convertType: '1',
      title: 'PDF转Excel',
      desc: 'PDF转Excel',
    },
    ppt: {
      accept: '.pdf',
      convertType: '2',
      title: 'PDF转PPT',
      desc: 'PDF转PPT',
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
    seStatusData({} as API.ConvertOfficeRes);
    resetList();
  };

  // 页面卸载
  const pageUmount = () => {
    going();
    setReady(false);
  };

  useEffect(() => {
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
    setLoading(true);
    try {
      // 在线转换
      const file = fileList[0];
      const { data } = await uploadFile({ files: file as any as File });
      await pdf2Office({
        fileId: data.fileId,
        convertType: baseData.convertType,
      });
      await run('');
      console.log(statusData);

      // 下载
      // await PDF.downloadZip(arr);
      // setConvertList(arr);
      setLoading(false);
      setSuccess(true);
    } catch (e) {}
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
            可以拖拽至此
          </Button>
          <Upload className="w-full" disabled={!ready} {...props}>
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
            下载
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={going}>
            继续
          </div>
        </>
      );
    } else if (fileList.length) {
      action = (
        <PermissionBtn text="转换">
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={() => convert()}
          >
            转换
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
          className="w-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0 z-10 flex justify-center items-center"
        ></Spin>
      )}

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

export default ConvertFrom;
