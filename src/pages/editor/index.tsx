import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spin } from 'antd';
import WebViewer from '@pdftron/webviewer';
import { useModel } from '@umijs/max';
import { last } from 'lodash-es';
import Tools from '@/utils/tools';
import Header from '@/components/Header';
// import type { UploadProps } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';

// const { Title } = Typography;
const Editor: React.FC = () => {
  const viewer = useRef<HTMLDivElement>(null);
  const { fileList, resetList } = useModel('files');
  const [ready, setReady] = useState<boolean>(false);
  const [instance, setInstance] = useState<WebViewerInstance>();

  // const supportFile = [
  //   '.pdf',
  //   '.jpg',
  //   '.jpeg',
  //   '.png',
  //   '.doc',
  //   '.docx',
  //   '.xls',
  //   '.xlsx',
  //   '.ppt',
  //   '.pptx',
  //   '.md',
  //   '.xod',
  // ];

  //   const uploadProps: UploadProps = {
  //     onRemove,
  //     beforeUpload,
  //     fileList,
  //     accept: supportFile.join(','),
  //     showUploadList: false,
  //     multiple: false
  //   };

  // 页面卸载
  const pageUmount = () => {
    setReady(false);
    resetList();
  };

  const initWebViewer = async (mountDom: HTMLDivElement) => {
    const instance = await WebViewer(
      { path: '/webviewer/lib', licenseKey: LICENSE_KEY },
      mountDom,
    );
    setInstance(instance);
    await instance.Core.PDFNet.initialize();
    instance.UI.setLanguage(instance.UI.Languages.ZH_CN);
    instance.UI.enableFeatures([
      instance.UI.Feature.MultiTab,
      instance.UI.Feature.ContentEdit,
    ]);
    instance.UI.addEventListener('tabAdded', (id, src, options) => {
      console.log(id, src, options);
    });
    setReady(true);
  };

  useEffect(() => {
    if (viewer.current) {
      initWebViewer(viewer.current);
    }
    return pageUmount;
  }, []);

  const loadDoc = () => {
    const { UI } = instance!;
    const file = last(fileList);
    const { suffix } = Tools.fileMsg(file!);
    let options = {
      extension: suffix,
      filename: file?.name, // Used as the name of the tab
      setActive: true, // Defaults to true
      saveCurrentActiveTabState: false, // Defaults to true
    };
    UI.TabManager.addTab(file as any as File, options);
  };

  useEffect(() => {
    if (fileList.length) {
      loadDoc();
    }
  }, [fileList]);

  return (
    <div className="flex flex-col h-full bg-gray-200">
      <Header block />
      <div className="h-full border-t border-solid border-gray-100">
        <Row className="h-full">
          <Col span={24}>
            {!ready ? (
              <Spin
                className="absolute w-full h-full flex flex-col justify-center items-center"
                size="large"
                tip="编辑器加载中请耐心等待"
              />
            ) : (
              ''
            )}

            <div className="webviewer h-full shadow-2xl" ref={viewer}></div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Editor;
