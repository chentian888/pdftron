import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import { split } from 'lodash-es';
import PDF from '@/utils/pdf';
import Tools from '@/utils/tools';
// import { ConvertFile } from '@/types/typings';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  img: ConvertFile;
  index: number;
  nonsupport?: boolean;
  toFileType?: string; // PDF转换后的文件类型默认
}

const ImageFile: React.FC<Props> = (props) => {
  const { img, index, toFileType = 'pdf', nonsupport = false } = props;
  const { removeConvertFile } = useModel('files');
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');

  const style = { fontSize: '19px', color: '#6478B3' };

  const computedThumb = async () => {
    if (nonsupport) return;
    try {
      let base64 = '';
      if (toFileType === 'image') {
        // PDF转图片
        base64 = await Tools.blob2Base64(img.newfile);
      } else {
        base64 = await PDF.genThumbnail(
          instance!,
          img.newfile as any as UploadFile,
        );
      }
      setThumb(base64);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (img.newfile) {
      computedThumb();
    }
  }, []);

  // 移除
  const handleRemove = () => {
    removeConvertFile(index - 1);
  };

  // 预览
  const handlePreview = () => {
    if (nonsupport) return;
    const { UI } = instance!;
    const { prefix, suffix } = Tools.fileMsg(img.newfile as any as UploadFile);
    setShowWebviewer(true);
    setWebviewerTtile(img.newFileName);
    UI.loadDocument(img.newfile as any as File, {
      filename: prefix,
      extension: suffix,
    });
  };

  // 下载图片
  const downloadImage = () => {
    PDF.download(img.newfile, img.newFileName);
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
            {img.newFileName}
          </div>
        </div>

        {!nonsupport && (
          <Tooltip title="预览文件">
            <EyeOutlined
              style={style}
              className="cursor-pointer absolute left-[15px] top-[8px]"
              onClick={handlePreview}
            />
          </Tooltip>
        )}

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
