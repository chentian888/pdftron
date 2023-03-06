import { useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { decode } from 'js-base64';
import type { WebViewerInstance } from '@pdftron/webviewer';

export default () => {
  const [instance, setInstance] = useState<WebViewerInstance>();
  const [ready, setReady] = useState<boolean>(false);
  const [showWebviewer, setShowWebviewer] = useState<boolean>(false);
  const [webviewerTtile, setWebviewerTtile] = useState<string>('');

  // 初始化PDF查看器
  const initWebViewer = async (
    mountDom: HTMLDivElement,
    fullAPI: boolean = false,
  ) => {
    const instance = await WebViewer(
      { path: '/webviewer/lib', fullAPI, licenseKey: decode(LK) },
      mountDom,
    );
    instance.UI.setLanguage(instance.UI.Languages.ZH_CN);
    instance.UI.disableElements([
      'leftPanel',
      'leftPanelButton',
      'selectToolButton',
      'searchButton',
      // 'toggleNotesButton',
      // 'viewControlsButton',
      // 'ribbons',
      'toolsHeader',
      'menuButton',
    ]);
    setInstance(instance);
    // await instance.Core.PDFNet.initialize();
    setReady(true);
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
  };
};
