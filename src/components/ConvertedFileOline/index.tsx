import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  // DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import { last, split } from 'lodash-es';
import LoadingThumbnail from '@/components/LoadingThumbnail';
import Tools from '@/utils/tools';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  src: string;
  remove: () => void;
  file: UploadFile;
}

const ConvertedFileOline: React.FC<Props> = (props) => {
  const { src, file } = props;
  const url = `${BROWSER_FILE}${src}`;
  const fileName = file.name;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');

  const style = { fontSize: '19px', color: '#6478B3' };

  const computedThumb = async () => {
    try {
      const doc = await instance?.Core.createDocument(url);
      doc?.loadThumbnail(
        1,
        (thumbnail: HTMLCanvasElement | HTMLImageElement) => {
          let base64 = '';
          (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
          (thumbnail as HTMLImageElement).onload = function () {
            base64 = Tools.getBase64Image(thumbnail as HTMLImageElement);
          };
          doc.unloadResources();
          setThumb(base64);
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (src) {
      computedThumb();
    }
  }, []);

  // 移除
  // const handleRemove = () => {
  //   remove();
  // };

  // 预览
  const handlePreview = () => {
    const { UI } = instance!;
    setShowWebviewer(true);
    setWebviewerTtile(fileName!);
    UI.loadDocument(`${BROWSER_FILE}${src}`);
  };

  // 下载图片
  const downloadOffice = () => {
    window.open(url);
  };

  return (
    <>
      <div className="h-[240px] relative flex flex-col bg-white rounded-md border border-dashed border-purple-600 overflow-hidden">
        <div className="bg-[#f2f3f6] flex-1 p-2 pt-8">
          <div className="h-[127px] flex justify-center items-center">
            {thumb ? (
              <img
                className="block max-w-full max-h-full border border-[#dfe2ed] bg-white"
                src={thumb}
                alt=""
              />
            ) : (
              <LoadingThumbnail />
            )}
          </div>
        </div>
        <div className="h-[86px]">
          <div className="text-gray-400 p-1 text-center overflow-hidden text-ellipsis whitespace-normal">
            {fileName}
          </div>
        </div>

        <Tooltip title="预览文件">
          <EyeOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] top-[8px]"
            onClick={handlePreview}
          />
        </Tooltip>

        {/* <Tooltip title="删除文件">
          <DeleteOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] bottom-[15px]"
            onClick={handleRemove}
          />
        </Tooltip> */}

        <Tooltip title="下载文件">
          <DownloadOutlined
            style={style}
            className="cursor-pointer absolute right-[15px] bottom-[15px]"
            onClick={downloadOffice}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default ConvertedFileOline;
