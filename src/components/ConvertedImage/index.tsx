import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  // DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import { split, last } from 'lodash-es';
import LoadingThumbnail from '@/components/LoadingThumbnail';
import PDF from '@/utils/pdf';
import Tools from '@/utils/tools';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  convert: PageThumbnailType;
  index: number;
  nonsupport?: boolean;
}

const ConvertedFile: React.FC<Props> = (props) => {
  // txt格式文件不支持
  const { convert, nonsupport = false } = props;
  // const { removeConvertFile } = useModel('files');
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');

  const style = { fontSize: '19px', color: '#6478B3' };

  const computedThumb = async () => {
    setThumb(convert.img);
  };

  useEffect(() => {
    if (convert.newfile) {
      computedThumb();
    }
  }, []);

  // 移除
  // const handleRemove = () => {
  //   removeConvertFile(convert);
  // };

  // 预览
  const handlePreview = () => {
    if (nonsupport) return;
    const { UI, Core } = instance!;
    const { prefix, suffix } = Tools.fileMsg(
      convert.newfile as any as UploadFile,
    );
    setShowWebviewer(true);
    setWebviewerTtile(convert.newFileName);
    UI.loadDocument(convert.newfile as any as File, {
      filename: prefix,
      extension: suffix,
    });
    Core.documentViewer.addEventListener('documentLoaded', () => {
      UI.setLayoutMode(UI.LayoutMode.Continuous);
    });
  };

  // 下载图片
  const downloadImage = () => {
    PDF.download(convert.newfile, convert.newFileName);
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
          <div className="multi-ellipsis text-gray-400 m-1 text-center overflow-hidden text-ellipsis whitespace-normal">
            {convert.newFileName}
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

export default ConvertedFile;
