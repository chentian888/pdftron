import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import { split, nth } from 'lodash-es';
import PDF from '@/utils/pdf';
import { ConvertFile } from '@/types/typings.d';
// import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  img: ConvertFile;
  index: number;
}

const ImageFile: React.FC<Props> = (props) => {
  const { img, index } = props;
  const { onRemoveImage } = useModel('files');
  const { instance, setShowWebviewer } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');

  const style = { fontSize: '19px', color: '#6478B3' };

  const computedThumb = async () => {
    const base64 = await PDF.blob2Base64(img.newfile);
    setThumb(base64);
  };

  useEffect(() => {
    computedThumb();
  }, []);

  // 移除
  const handleRemove = () => {
    onRemoveImage(index - 1);
  };

  // 预览
  const handlePreview = () => {
    setShowWebviewer(true);
    instance?.UI.loadDocument(img.file as any as File, {
      filename: img.fileName,
    });
    const { documentViewer } = instance!.Core;
    documentViewer!.addEventListener('documentLoaded', () => {
      // perform document operations
    });
  };

  // 下载图片
  const downloadImage = () => {
    PDF.download(img.newfile, img.fileName);
  };

  return (
    <>
      <div className="h-[240px] relative flex flex-col bg-white rounded-md border border-dashed border-purple-600 overflow-hidden">
        <div className="bg-[#f2f3f6] flex-1 p-2 pt-8">
          <div className="h-[127px] flex justify-center items-center">
            <img
              className="block max-w-full max-h-full border border-[#dfe2ed] bg-white"
              src={thumb}
              alt=""
            />
          </div>
        </div>
        <div className="h-[86px]">
          <div className="text-gray-400 p-1 text-center overflow-hidden text-ellipsis whitespace-normal">
            {img.fileName}
          </div>
        </div>

        <Tooltip title="预览文件">
          <EyeOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] top-[8px]"
            onClick={handlePreview}
          />
        </Tooltip>

        <Tooltip title="删除文件">
          <DeleteOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] bottom-[15px]"
            onClick={handleRemove}
          />
        </Tooltip>

        <Tooltip title="下载文件">
          <DownloadOutlined
            style={style}
            className="cursor-pointer absolute right-[15px] bottom-[15px]"
            onClick={downloadImage}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default ImageFile;
