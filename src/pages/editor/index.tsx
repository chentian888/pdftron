// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Button, Spin, message, Tabs, Modal, Upload } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import WebViewer from '@pdftron/webviewer';
import { useModel, getLocale, FormattedMessage, useIntl } from '@umijs/max';
import { filter, findIndex, find, forEach } from 'lodash-es';
import { decode } from 'js-base64';
import Tools from '@/utils/tools';
import Cache from '@/utils/cache';
import Header from '@/components/Header';
import fonts from '@/fonts.json';
import type { UploadProps } from 'antd';
import type { WebViewerInstance } from '@pdftron/webviewer';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
// type TabType = {
//   label: string;
//   children: string;
//   key: string;
//   id: number;
// };

const { Dragger } = Upload;

const Editor: React.FC = () => {
  const intl = useIntl();
  const { setShowLoginModal, setShowVipModal } = useModel('user');

  const { setBread } = useModel('global');
  const viewer = useRef<HTMLDivElement>(null);
  // const { fileList, resetList } = useModel('files');
  const [ready, setReady] = useState<boolean>(false);
  const [instance, setInstance] = useState<WebViewerInstance>();

  const [activeKey, setActiveKey] = useState<string>('');
  const [items, setItems] = useState<[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [removeTargetKey, setRemoveTargetKey] = useState<TargetKey>();
  let removeTargetKey = useRef(null);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props: UploadProps = {
    name: 'file',
    showUploadList: false,
    multiple: false,
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.md,.xod',
    async beforeUpload(file: UploadFile) {
      // setFileList([...fileList, ...files]);
      console.log(file);
      const { prefix, suffix } = Tools.fileMsg(file);
      let options = {
        extension: suffix,
        filename: file.name, // Used as the name of the tab
        setActive: true, // Defaults to true
        saveCurrentActiveTabState: false, // Defaults to true
      };

      const tabId = await instance.UI.TabManager.addTab(file, options);
      const newActiveKey = `${file.name}${tabId}`;
      setItems([
        ...items,
        { label: prefix, children: '', key: newActiveKey, id: tabId },
      ]);
      setActiveKey(newActiveKey);
      handleCancel();

      return false;
    },
    // async onChange(info) {
    //   const { status } = info.file;
    //   // if (status !== 'uploading') {
    //   //   console.log(info.file, info.fileList);
    //   // }
    //   if (status === 'done') {
    //     // setFileList([...fileList, info.file]);
    //     // message.success(`${info.file.name} file uploaded successfully.`);
    //     const { prefix, suffix } = Tools.fileMsg(info.file);
    //     let options = {
    //       extension: suffix,
    //       filename: info.file?.name, // Used as the name of the tab
    //       setActive: true, // Defaults to true
    //       saveCurrentActiveTabState: false, // Defaults to true
    //     };

    //     const tabId = await instance.UI.TabManager.addTab(
    //       info.file.originFileObj,
    //       options,
    //     );
    //     const newActiveKey = `${info.file.name}${tabId}`;
    //     setItems([
    //       ...items,
    //       { label: prefix, children: '', key: newActiveKey, id: tabId },
    //     ]);
    //     setActiveKey(newActiveKey);
    //     handleCancel();
    //     console.log(info.file);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    maxCount: 1,
  };

  const validateUser = () => {
    const { id, vip } = Cache.getCookieUserInfo();

    // ??????
    const isVip = vip && vip === '1';

    // ??????????????????
    if (!id) {
      setShowLoginModal(true);
      return false;
    }

    // ?????????????????????
    if (!isVip) {
      setShowVipModal(true);
      return false;
    }
    return true;
  };

  // ????????????
  const pageUmount = () => {
    setReady(false);
    // resetList();
    setBread([]);
  };

  const initWebViewer = async (mountDom: HTMLDivElement) => {
    const instance = await WebViewer(
      {
        path: '/webviewer/lib',
        licenseKey: decode(LK),
        preloadWorker: `${WebViewer.WorkerTypes.CONTENT_EDIT}`,
      },
      mountDom,
    );
    setInstance(instance);
    const { UI } = instance;
    const downloadBtn = {
      type: 'actionButton',
      title: '??????',
      img: 'icon-header-download',
      onClick: () => {
        // ??????pdf
        const valid = validateUser();
        if (valid) {
          try {
            UI.downloadPdf();
          } catch (e) {
            message.error('????????????');
          }
        }
      },
    };

    const saveAsBtn = {
      type: 'actionButton',
      title: '?????????',
      img: 'icon-save',
      onClick: () => {
        const valid = validateUser();
        if (valid) {
          try {
            UI.toggleElement('saveModal');
          } catch (e) {
            message.error('????????????');
          }
        }
      },
    };

    const printBtn = {
      type: 'actionButton',
      title: '??????',
      img: 'icon-header-print-line',
      onClick: () => {
        // ??????pdf
        const valid = validateUser();
        if (valid) {
          try {
            UI.print();
          } catch (e) {
            message.error('????????????');
          }
        }
      },
    };
    const lang = getLocale();
    instance.UI.setLanguage(
      lang === 'zh-CN' ? instance.UI.Languages.ZH_CN : instance.UI.Languages.EN,
    );
    forEach(fonts, (f) => instance.UI.Fonts.addAnnotationFont(f));
    forEach(fonts, (f) => instance.UI.Fonts.addSignatureFont(f));

    UI.disableElements(['menuButton', 'multiTabsEmptyPage']);
    UI.enableFeatures([UI.Feature.MultiTab, UI.Feature.ContentEdit]);

    // UI.addEventListener(UI.Events.TAB_ADDED, tabAdded);
    UI.addEventListener('tabDeleted', (id, src, options) => {
      console.log(id, src, options);
    });

    const iframeDoc = UI.iframeWindow.document;
    const TabsHeader = iframeDoc.querySelector('.TabsHeader');
    TabsHeader.style.display = 'none';
    console.log(TabsHeader);
    UI.setHeaderItems(function (header) {
      header.unshift(printBtn);
      header.unshift(saveAsBtn);
      header.unshift(downloadBtn);
    });
    // await Core.PDFNet.initialize();
    setReady(true);
  };

  useEffect(() => {
    setBread([
      { title: intl.formatMessage({ id: 'navHome' }), link: '/' },
      { title: intl.formatMessage({ id: 'edit' }) },
    ]);
    if (viewer.current) {
      initWebViewer(viewer.current);
    }
    return pageUmount;
  }, []);

  const onChange = (targetKey: string) => {
    const { key, id } = find(items, (pane) => (pane as any).key === targetKey);
    setActiveKey(key, id);
    instance?.UI.TabManager.setActiveTab(id);
  };

  const add = () => {
    showModal();
  };

  const remove = () => {
    if (!items.length) return;
    const targetKey = removeTargetKey.current;
    // console.log(items, removeTargetKey.current);
    const targetIndex = findIndex(items, (pane) => pane.key === targetKey);
    const newPanes = filter(items, (pane) => pane.key !== targetKey);
    console.log(targetIndex, newPanes);
    if (newPanes.length && targetKey === activeKey) {
      const { key, id } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      instance?.UI.TabManager.setActiveTab(id);
      setActiveKey(key);
    }

    setItems(newPanes);
  };

  useEffect(() => {
    if (instance) {
      const { UI } = instance;
      UI.addEventListener(UI.Events.TAB_DELETED, remove);
    }
  }, [instance, items]);

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      const valid = validateUser();
      if (!valid) return;
      // remove(targetKey);
      removeTargetKey.current = targetKey;
      // setRemoveTargetKey(targetKey);
      const targetIndex = findIndex(items, (pane) => pane.key === targetKey);
      const { id } = items[targetIndex];
      console.log(id, targetKey);
      instance?.UI.TabManager.deleteTab(id);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <Header block />
      <Modal
        title="?????????????????? WebViewer ?????????"
        open={isModalOpen}
        onOk={handleOk}
        okText="????????????"
        footer={false}
        onCancel={handleCancel}
      >
        <Dragger {...props} className=" h-[300px]">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">?????????????????????????????????</p>
          <p className="ant-upload-hint">?????????????????????</p>
        </Dragger>
      </Modal>
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
        items={items}
        addIcon={
          <div className="px-[16px] py-[8px]">
            <PlusOutlined />
            <FormattedMessage id="editorTabAddBtn" />
          </div>
        }
      />
      <div className="h-full border-t border-solid border-gray-100 relative">
        {!ready ? (
          <Spin
            className="absolute w-full h-full flex flex-col justify-center items-center"
            size="large"
            tip="?????????????????????????????????"
          />
        ) : (
          ''
        )}
        {ready && !items.length ? (
          <div className="absolute w-full h-full flex flex-col justify-center items-center">
            <div className="max-w-1/3">
              {/* <InboxOutlined size={60} /> */}
              <Upload className="w-full" disabled={!ready} {...props}>
                <Button className="w-full" type="primary" size="large" block>
                  <FormattedMessage id="chooseFileBtn" />
                </Button>
              </Upload>
            </div>
          </div>
        ) : (
          ''
        )}

        <div className="webviewer h-full shadow-2xl" ref={viewer}></div>
      </div>
    </div>
  );
};

export default Editor;
