import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import { pullAllBy, sortBy, map } from 'lodash-es';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ExtraThumbnail from '@/components/ExtraThumbnail';
import ConvertedFile from '@/components/ConvertedFile';
import type { UploadProps } from 'antd/es/upload/interface';
// import type { ExtraThumbnailType } from '@/types/typings';

const { Dragger } = Upload;

const PageManipulation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnailList, setThumbnailList] = useState<ExtraThumbnailType[]>();
  const [extractNo, setExtractNo] = useState<number[]>([]);

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
    title: 'PDF拆分',
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
  };

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

  useEffect(() => {
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  const initThumb = async () => {
    const res = await PDF.genThumbnail(instance!, fileList[0], true);
    const pageNo = map(res, (ele) => ele.currentPage);
    setExtractNo(pageNo);
    setThumbnailList(res);
  };

  useEffect(() => {
    if (fileList.length) {
      initThumb();
    }
  }, [fileList]);

  // 文件列表
  const renderInitFile = () => {
    const list = thumbnailList?.map((file, index) => (
      <Col span={4} key={index}>
        <ExtraThumbnail
          thumb={file}
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
    setLoading(true);
    const res = await PDF.exrtaPage(instance!, fileList, extractNo);
    await PDF.downloadZip(res);
    setThumbnailList([]);
    setConvertList(res);
    setLoading(false);
    setSuccess(true);
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
          loading={loading || !thumbnailList?.length}
          onClick={() => convert()}
        >
          {thumbnailList?.length ? '提取' : '页面加载中请稍等'}
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
