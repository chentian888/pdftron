import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spin, Space, Tag, Typography } from 'antd';
import WebViewer from '@pdftron/webviewer';
import { useModel } from '@umijs/max';
import { last } from 'lodash-es';
import Tools from '@/utils/tools';
import Header from '@/components/Header';
// import type { UploadProps } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';

const { Title } = Typography;
const Editor: React.FC = () => {
  const viewer = useRef<HTMLDivElement>(null);
  const { fileList, resetList } = useModel('files');
  const [ready, setReady] = useState<boolean>(false);
  const [instance, setInstance] = useState<WebViewerInstance>();

  const supportFile = [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.md',
    '.xod',
  ];

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
      { path: '/webviewer/lib', fullAPI: true, licenseKey: LICENSE_KEY },
      mountDom,
    );
    setInstance(instance);
    await instance.Core.PDFNet.initialize();
    instance.UI.setLanguage(instance.UI.Languages.ZH_CN);
    instance.UI.enableFeatures([instance.UI.Feature.MultiTab]);
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
      <div className="h-full px-4 border-t border-solid border-gray-100">
        <Row className="h-full" gutter={20}>
          <Col className="p-4 bg-white" span={5}>
            <Space direction="vertical">
              {/* <Title level={4}>上传文件</Title>
              {fileList.length ? <span>{fileList[0].name}</span> : ''}
              <Upload className="w-full" {...uploadProps}>
                <Button type="primary" block size="large" loading={!ready}>
                  选择文件
                </Button>
              </Upload> */}

              <Title level={4}>支持文件格式</Title>
              <Space size={[0, 8]} wrap>
                {supportFile.map((t, index) => (
                  <Tag key={index}>{t}</Tag>
                ))}
              </Space>
            </Space>
          </Col>
          <Col className="py-2" span={19}>
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
