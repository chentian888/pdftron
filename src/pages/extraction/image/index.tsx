import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import { pullAllBy, sortBy, map } from 'lodash-es';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ExtraThumbnail from '@/components/ExtraThumbnail';
import ConvertedFile from '@/components/ConvertedFile';
import type { UploadProps } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const ExtractText: React.FC = () => {
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
    // setConvertList,
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
    multiple: true,
    title: 'PDF提取图片',
    desc: '提取PDF中的所有小图片',
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

  // const test = async () => {
  //   const { Core } = instance!;
  //   const { PDFNet } = Core;
  //   const doc = await PDFNet.PDFDoc.create();

  //   // ElementBuilder is used to build new Element objects
  //   const eb = await PDFNet.ElementBuilder.create();
  //   // ElementWriter is used to write Elements to the page
  //   const writer = await PDFNet.ElementWriter.create();
  //   let element;

  //   const img = await PDFNet.Image.createFromURL(
  //     doc,
  //     ' https://wxp.cardpu.com/upload/image/1673939715548.png',
  //   );
  //   console.log('=======');
  //   const w = await img.getImageWidth();
  //   const h = await img.getImageHeight();
  //   const pageRect = await PDFNet.Rect.init(0, 0, w, h);
  //   console.log(pageRect);
  //   let page = await doc.pageCreate(pageRect);

  //   writer.beginOnPage(page);
  //   element = await eb.createImageFromMatrix(
  //     img,
  //     await PDFNet.Matrix2D.create(w, 0, 0, h, 0, 0),
  //   );
  //   writer.writePlacedElement(element);

  //   writer.end();
  //   doc.pagePushBack(page);
  //   // UI.loadDocument(doc);
  //   const docBuffer = await doc.saveMemoryBuffer(
  //     Core.PDFNet.SDFDoc.SaveOptions.e_remove_unused,
  //   );
  //   const blob = new Blob([docBuffer], {
  //     type: 'application/pdf',
  //   });
  //   // PDF.download(blob, 'aa.pdf');
  // };
  // 测试
  // useEffect(() => {
  //   if (ready) {
  //     test();
  //   }
  // }, [ready]);

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
  const extraPageImage = async () => {
    setLoading(true);
    // const res = await PDF.extraImage(instance!, fileList);
    // console.log(res);
    // await PDF.downloadZip(res);
    // setThumbnailList([]);
    // setConvertList(res);
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
          onClick={extraPageImage}
        >
          {thumbnailList?.length ? '提取图片' : '页面加载中请稍等'}
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
