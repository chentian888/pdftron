import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { getSysSetting } from '@/services/user';

const AppStore: React.FC = () => {
  const [msg, setMsg] = useState<API.SysSettingParams>({});

  const getSetting = async () => {
    const { data = {} } = await getSysSetting();
    setMsg(data);
    console.log(data);
  };
  useEffect(() => {
    getSetting();
  }, []);
  return (
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
              href={msg?.android_download_china as string}
              target="_blank"
            >
              下载 Android安装包
            </Button>
            <Button
              type="primary"
              href={msg?.android_download_english as string}
              target="_blank"
            >
              Android商店安装
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
              href={msg?.iphone_pdf_ios_download as string}
              target="_blank"
            >
              下载苹果安装包
            </Button>
            <Button
              type="primary"
              href={msg?.iphone_scan_ios_download as string}
              target="_blank"
            >
              苹果商店安装
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
              href={msg?.mac_download_open as string}
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
              href={msg?.windows_download_url as string}
              target="_blank"
            >
              下载Windows安装包
            </Button>
            <Button
              type="primary"
              href={msg?.wndows_download_open as string}
              target="_blank"
            >
              Windows商店安装
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStore;
