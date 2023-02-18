import { useState } from 'react';
import { Modal } from 'antd';
import WebViewer from '@pdftron/webviewer';
import PDF from '@/utils/pdf';
import type { WebViewerInstance } from '@pdftron/webviewer';
import type { UploadFile } from 'antd/es/upload/interface';

export default () => {
  const [instance, setInstance] = useState<WebViewerInstance>();
  const [ready, setReady] = useState<boolean>(false);
  const [showWebviewer, setShowWebviewer] = useState<boolean>(false);
  const [webviewerTtile, setWebviewerTtile] = useState<string>('');

  // 初始化PDF查看器
  const initWebViewer = async (mountDom: HTMLDivElement) => {
    const instance = await WebViewer(
      { path: '/webviewer/lib', fullAPI: true, licenseKey: LICENSE_KEY },
      mountDom,
    );
    instance.UI.setLanguage(instance.UI.Languages.ZH_CN);
    instance.UI.disableElements([
      'leftPanel',
      'leftPanelButton',
      'selectToolButton',
      'searchButton',
      'toggleNotesButton',
      'viewControlsButton',
      'ribbons',
      'toolsHeader',
    ]);
    setInstance(instance);
    await instance.Core.PDFNet.initialize();
    setReady(true);
  };

  const validateFile = async (file: UploadFile) => {
    console.log(file);
    const password = await PDF.hasPassword(instance!, file);
    if (password) {
      Modal.warning({
        title: '无效文档',
        content: '文档不能加密',
      });
      return Promise.reject('文档不能加密');
    }
    const blank = await PDF.isBlank(instance!, file);
    if (blank) {
      Modal.warning({
        title: '无效文档',
        content: '文档不能为空',
      });
      return Promise.reject('文档不能为空');
    }
    return Promise.resolve();
  };
  return {
    instance,
    setInstance,
    webviewerTtile,
    setWebviewerTtile,
    showWebviewer,
    setShowWebviewer,
    ready,
    setReady,
    initWebViewer,
    validateFile,
  };
};
