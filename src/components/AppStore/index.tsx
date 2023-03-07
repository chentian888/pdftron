import React, { useEffect } from 'react';
import { Button, Typography } from 'antd';
import { useModel } from '@umijs/max';
import { getSysSetting } from '@/services/user';

const { Title } = Typography;

const AppStore: React.FC = () => {
  const { sysMsg, setSysMsg } = useModel('global');
  // const [msg, setMsg] = useState<API.SysSettingParams>({});

  const getSetting = async () => {
    const { data = {} } = await getSysSetting();
    // setMsg(data);
    setSysMsg(data);
  };
  useEffect(() => {
    getSetting();
  }, []);
  return (
    <>
      <Title className="text-center pt-12" level={2}>
        编辑帮助视频
      </Title>
      <div className="w-[1000px] h-[500px] bg-white m-auto my-10 rounded-2xl">
        {sysMsg.video_china ? (
          <video
            width="100%"
            height="100%"
            src={sysMsg.video_china as string}
            controls
            autoPlay
            loop
            muted
          ></video>
        ) : (
          ''
        )}
      </div>
      <div className="w-[1000px] m-auto py-10">
        <div className="grid grid-cols-2 gap-x-10 gap-y-16 place-items-center">
          <div className="flex justify-start items-center">
            <div className="w-[62px] mr-6">
              <img
                className="max-w-full m-auto block"
                src={require('./img/icon-android.png')}
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <Button
                className="mb-4 w-[160px]"
                type="primary"
                ghost
                href={sysMsg?.android_download_china as string}
                target="_blank"
              >
                中文版下载
              </Button>
              <Button
                type="primary"
                href={sysMsg?.android_download_english as string}
                target="_blank"
              >
                英文版下载
              </Button>
            </div>
          </div>
          <div className="flex justify-start items-center">
            <div className="w-[62px] mr-6">
              <img
                className="max-w-full m-auto block"
                src={require('./img/icon-iphone.png')}
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <Button
                className="mb-4 w-[160px]"
                type="primary"
                ghost
                href={sysMsg?.iphone_pdf_ios_download as string}
                target="_blank"
              >
                官方地址下载
              </Button>
              <Button
                type="primary"
                href={sysMsg?.iphone_scan_ios_download as string}
                target="_blank"
              >
                文档扫描app下载
              </Button>
            </div>
          </div>
          <div className="flex justify-start items-center">
            <div className="w-[62px] mr-6">
              <img
                className="max-w-full m-auto block"
                src={require('./img/icon-pc.png')}
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <Button
                className="w-[160px]"
                type="primary"
                href={sysMsg?.mac_download_open as string}
                target="_blank"
              >
                Mac端安装
              </Button>
            </div>
          </div>
          <div className="flex justify-start items-center">
            <div className="w-[62px] mr-6">
              <img
                className="max-w-full m-auto block"
                src={require('./img/icon-windows.png')}
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <Button
                className="mb-4 w-[160px]"
                type="primary"
                ghost
                href={sysMsg?.windows_download_url as string}
                target="_blank"
              >
                下载Windows安装包
              </Button>
              <Button
                type="primary"
                href={sysMsg?.wndows_download_open as string}
                target="_blank"
              >
                Windows商店安装
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppStore;
