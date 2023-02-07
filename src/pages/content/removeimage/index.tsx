import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal } from 'antd';
import { useModel } from '@umijs/max';
import WebViewer, { Core } from '@pdftron/webviewer';
import { pullAllBy, sortBy } from 'lodash-es';
import PDF from '@/utils/pdf';
// import Tools from '@/utils/tools';
import ExtraThumbnail from '@/components/ExtraThumbnail';
import ConvertedFile from '@/components/ConvertedFile';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
// import type { ExtraThumbnailType } from '@/types/typings';

const { Dragger } = Upload;

const ContentRemoveImage: React.FC = () => {
  const [actionDisabled, setActionDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [thumbnailList, setThumbnailList] = useState<ExtraThumbnailType[]>();
  const [extractNumber, setExtractNumber] = useState<number[]>([]);
  const [doc, setDoc] = useState<unknown>();
  const [currentFile, setCurrentFile] = useState<UploadFile>();

  const {
    fileList,
    onRemove,
    beforeUpload,
    setFileList,
    convertList,
    setConvertList,
  } = useModel('files');
  const { instance, setInstance, showWebviewer, setShowWebviewer } =
    useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: true,
    title: 'PDF删除图片数据',
    desc: '删除PDF中已选择的图片',
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

  // 初始化缩图图
  const initloadThumbnail = async () => {
    const file = fileList[0];
    setCurrentFile(file);
    console.log(file);
    const doc = await instance?.Core.createDocument(file as any as File, {
      filename: file.name,
      l: LICENSE_KEY,
    });
    setDoc(doc);

    const arr: Promise<ExtraThumbnailType>[] = [];
    const pageNo: number[] = []; // 需要提取页面编号
    const count = doc?.getPageCount() as number;
    const loadThumbnail = (index: number): Promise<ExtraThumbnailType> => {
      return new Promise((resolve) => {
        doc?.loadThumbnail(index, (thumbnail: HTMLCanvasElement) => {
          const base64 = (thumbnail as HTMLCanvasElement).toDataURL();
          (thumbnail as HTMLCanvasElement).toBlob((blob) => {
            console.log(doc);
            resolve({
              blob: blob!,
              img: base64,
              total: count,
              current: index,
              sourceFile: file,
              currentDoc: doc,
            });
          });
        });
      });
    };
    for (let i = 0; i < count; i++) {
      const current = i + 1;
      arr.push(loadThumbnail(current));
      pageNo.push(current);
    }
    const res = await Promise.all(arr);
    setActionDisabled(false);
    setThumbnailList(res);
    setExtractNumber(pageNo);
  };

  useEffect(() => {
    setActionDisabled(true);
    if (fileList.length) {
      initloadThumbnail();
    }
  }, [fileList]);

  // 勾选文件
  const checkFile = (index: number) => {
    extractNumber.push(index);
    const sort = sortBy(extractNumber, (o) => o);
    setExtractNumber(sort);
  };

  // 反选文件
  const unCheckFile = (index: number) => {
    pullAllBy(extractNumber, [index]);
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
        <ExtraThumbnail
          file={file}
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
        <ConvertedFile img={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  // 提取页面
  const convert = async () => {
    setLoading(true);
    console.log(extractNumber);
    const res = await PDF.removeImage(
      instance!,
      doc as Core.Document,
      currentFile!,
      extractNumber,
    );
    setThumbnailList([]);
    setConvertList(res);
    setLoading(false);
    setSuccess(true);
    await PDF.downloadZip(res);
  };

  const reset = () => {
    setConvertList([]);
    setFileList([]);
    setDoc(null as unknown);
    setExtractNumber([]);
    setThumbnailList([]);
    setSuccess(false);
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
        <>
          <Button type="primary" size="large" block onClick={downloadAll}>
            全部下载
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={reset}>
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
          disabled={actionDisabled}
          loading={loading}
          onClick={() => convert()}
        >
          删除图片
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

export default ContentRemoveImage;
