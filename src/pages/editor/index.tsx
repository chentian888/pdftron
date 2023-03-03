import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spin, message } from 'antd';
import WebViewer from '@pdftron/webviewer';
import { useModel } from '@umijs/max';
import { last } from 'lodash-es';
import { decode } from 'js-base64';
import Tools from '@/utils/tools';
import Cache from '@/utils/cache';
import Header from '@/components/Header';

// import type { UploadProps } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';

// const { Title } = Typography;
const Editor: React.FC = () => {
  const { setShowLoginModal, setShowVipModal } = useModel('user');

  const { setBread } = useModel('global');
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

  const validateUser = () => {
    const { id, vip } = Cache.getCookieUserInfo();

    // 会员
    const isVip = vip && vip === '1';

    // 游客需要登录
    if (!id) {
      setShowLoginModal(true);
      return false;
    }

    // 非会员需要充值
    if (!isVip) {
      setShowVipModal(true);
      return false;
    }
    return true;
  };

  // 页面卸载
  const pageUmount = () => {
    setReady(false);
    resetList();
    setBread([]);
  };

  const initWebViewer = async (mountDom: HTMLDivElement) => {
    const instance = await WebViewer(
      { path: '/webviewer/lib', licenseKey: decode(LK) },
      mountDom,
    );
    setInstance(instance);

    const downloadBtn = {
      type: 'actionButton',
      title: '下载',
      img: 'icon-header-download',
      onClick: () => {
        // 下载pdf
        const valid = validateUser();
        if (valid) {
          try {
            instance.UI.downloadPdf();
          } catch (e) {
            message.error('下载错误');
          }
        }
      },
    };

    const saveAsBtn = {
      type: 'actionButton',
      title: '另存为',
      img: 'icon-save',
      onClick: () => {
        const valid = validateUser();
        if (valid) {
          try {
            instance.UI.toggleElement('saveModal');
          } catch (e) {
            message.error('下载错误');
          }
        }
      },
    };

    const printBtn = {
      type: 'actionButton',
      title: '打印',
      img: 'icon-header-print-line',
      onClick: () => {
        // 打印pdf
        const valid = validateUser();
        if (valid) {
          try {
            instance.UI.print();
          } catch (e) {
            message.error('打印错误');
          }
        }
      },
    };
    instance.UI.setLanguage(instance.UI.Languages.ZH_CN);
    instance.UI.disableElements(['menuButton', 'WarningModalSignButton']);
    instance.UI.enableFeatures([
      instance.UI.Feature.MultiTab,
      instance.UI.Feature.ContentEdit,
    ]);

    instance.UI.addEventListener('tabAdded', (id, src, options) => {
      console.log(id, src, options);
    });
    instance.UI.setHeaderItems(function (header) {
      header.unshift(printBtn);
      header.unshift(saveAsBtn);
      header.unshift(downloadBtn);
    });
    await instance.Core.PDFNet.initialize();
    setReady(true);
  };

  useEffect(() => {
    setBread([{ title: '首页', link: '/' }, { title: 'PDF在线编辑器' }]);
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
