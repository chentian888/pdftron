import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin, message } from 'antd';
import { useModel } from '@umijs/max';
import { pullAllBy, sortBy, map } from 'lodash-es';
// import { Core } from '@pdftron/webviewer';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ExtraThumbnail from '@/components/ExtraThumbnail';
import ConvertedFile from '@/components/ConvertedFile';
import PermissionBtn from '@/components/PermissionBtn';
import type { UploadProps } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const PageManipulation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [thumbnailList, setThumbnailList] = useState<PageThumbnailType[]>([]);
  const [extractNo, setExtractNo] = useState<number[]>([]);

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
    title: 'PDF分割',
    desc: '选择PDF中的页面拆分成多个单独PDF',
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
    setExtractNo([]);
    setThumbnailList([]);
  };

  // 页面卸载
  const pageUmount = () => {
    going();
    setReady(false);
    setBread([]);
  };

  useEffect(() => {
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  const callback = (res: PageThumbnailType[], finish: boolean = false) => {
    const pages = map(res, (ele) => ele.currentPage);
    setExtractNo([...pages]);
    setThumbnailList([...thumbnailList, ...res]);
    if (finish) {
      setLoadingPage(false);
    }
  };

  const initThumb = async () => {
    try {
      const file = fileList[0];
      setLoadingPage(true);
      await PDF.loadPage(instance!, file, callback);
    } catch (e) {
      setLoadingPage(false);
      going();
      message.error('请检查文档是否有密码或已损坏！');
    }
  };

  useEffect(() => {
    setBread([{ title: '首页', link: '/' }, { title: 'PDF分割' }]);
    if (fileList.length) {
      initThumb();
    }
  }, [fileList]);

  // 勾选文件
  const checkFile = (index: number) => {
    extractNo.push(index);
    const sort = sortBy(extractNo, (o) => o);
    setExtractNo(sort);
  };

  // 反选文件
  const unCheckFile = (index: number) => {
    pullAllBy(extractNo, [index]);
  };

  // 文件列表
  const renderInitFile = () => {
    const list = thumbnailList?.map((file, index) => (
      <Col span={4} key={index}>
        <ExtraThumbnail
          source={file}
          checkFile={checkFile}
          unCheckFile={unCheckFile}
        />
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
        <ConvertedFile convert={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  // 提取页面
  const convert = async () => {
    if (!extractNo.length) {
      message.error('至少选择1页');
      return;
    }

    try {
      setLoading(true);
      const res = await PDF.splitPage(instance!, fileList, extractNo);
      await PDF.downloadZip(res);
      setThumbnailList([]);
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
    } else if (fileList.length && !loadingPage) {
      action = (
        <PermissionBtn text="拆分">
          <Button
            type="primary"
            size="large"
            block
            loading={loading || !thumbnailList?.length}
            onClick={() => convert()}
          >
            拆分
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
      {loadingPage && (
        <Spin
          size="large"
          className="w-full h-full absolute bg-black bg-opacity-5 rounded-lg top-0 left-0 z-10 flex justify-center items-center flex-col"
        ></Spin>
      )}
      {loading && (
        <Spin
          size="large"
          tip="文档分割中请耐心等待"
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

export default PageManipulation;
