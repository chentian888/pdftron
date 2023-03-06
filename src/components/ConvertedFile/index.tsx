import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {
  // DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { split, last } from 'lodash-es';
import LoadingThumbnail from '@/components/LoadingThumbnail';
import PDF from '@/utils/pdf';
import Tools from '@/utils/tools';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  convert: ConvertFile;
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
    try {
      let base64 = '';
      const suffix = last(split(convert.newFileName, '.'));
      if (suffix === 'txt') {
        base64 =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABECAYAAADdjVbeAAAAAXNSR0IArs4c6QAABtlJREFUeF7tm2tMVEcUx/+zl12Xl7AsD0VUVJT6TFsVKQrER41WGqu0WGsx2hj9UGONbUxqTayJxlbTaGuK2qa1aYpa6UPbqGm0YqrVRBtTaitpBQUWkIei7sqyex8zzVwWRED07kLdS3e+EMKdM+c3/zNzzp07EHha5PZrkQaTvBqEzANjw0AgtPztcfxkAIaGC46sZMvMjSmW37vLB8INRW4vTiSmoJOEYEh3GfbVDmNAUqQRL48Iq691InNrZnSxrzZ5f4I9zGiRr5wnhDzZHQa7y0YrcHI4RMqqGxxKxrbpcaW+2icRu0qzBSp/A2Lw1Va39m8LLFGAMZRVO5G+c6q10peBiOXjf3YTQlb4YqQn+rYH5mMoFMVXbzunfDZrYIO3YxLLrpJ9hLGF3hroqX6dAfMNR6TsnK1enPHJ8/FOb8bmCu8jhOgCuHnTAdyUHb8UZs0qGENErdC6A26FVth3l2zWnIIcomiB1iVwC7RLYXs3PBP92v8CuAW6idJt76bGrH1UaN0q3AJIwGCXDW9vTot671GgdQ/crDSDQ6KrNk2O3fkw6F4BrEITUIeoLNs0OXZvV9C9BtgDLd2WWM6WtOhDD4LuVcAeSOdNlzxzW0bcr51B+zXwsEgjFiaHg9fSWhpj7JbdTaZsybBebt/Pr4EtJoqVT8dAVPjbsbZGGWpvuZT0bZmxV9r29Ftg7qQsSXhrghUmY5A2Ws/TlMF28647/YPp8eWtacxfa2nuIBd2YoSI2SPjISka49pDyBgpsTnl9LypsTXqxubPwNxBSRSR+0QYhkbztczUlwetjTIU/XWzISP/ueF2vwfmcG63G1mJwRifEAnBYABjDFpWNZ8kmaGwVmqcowtgVWlJhtFtx6BQgn4RIQgxGTUJTQhwu0k8pBtglY6XU7IEsdEBxe3SBMwfZoQU6Qv4vvyifTUzxgr1C6xZX/B1fyoA7MXE6aZLQGHdSOWlowGFvZw43XQLKKwbqbx0NKCwlxOnm24BhXUjlZeOBhT2cuJ00y2gsG6k8tLRgMJeTpxuumlW2C1T0IechwsCgUloPm9ySRT8d6Oh8/MnyhjcEkOwqfmOmEwZJIk131zporU8r3WmNQHzQ/Ct6TEYGWXil8Q6bfwo9HRVE96/0ABKGXbN6Idz15uQf/kOjEH3X3zjcKn9zVg7wYoFR6vV70fZSeFYOrovaBeHzo0SxfITtXB58b1JEzB3cPeMOMSHBqmH4Bx6YpxZ/Rpwsc4FwUBUYYrq3XjnTL36meT7uQMwLSEEM761oeiGGwKfEd4XQLhAcOHVwbCLFBPyy9Xnl4yOwEsjwlRgbn9ohBH9Q4Nw9npT6wS7ZIYVx2txV9b+6UUTsBqiMm098VcUhstLh6DCLmPmgQoYzc0KGghBH09I9yHAxdxEFSblqzK4PMq5RIoj8xMwsZ8ZGQdtuHZHBCFEnTw+sWp4ywwfTYvD0jERGPJpKW63+WZqFgz8iFpz0wzcdgRJYSjKTYTNIWFWgQ3B5o63jRXGMCnOjKPzEvCzzYm5h6sQRIA146OwMS0aqwvr8PmfPNw7eu9WGHZkxmLxqL5I2nsVjXxt+9h6HJj7xze6dZOsWJdixfoz9Thd2YQTOQNxqMSB3GM1CPVsWO1ZdAvcslsff3EgxkX3wU2XAg4zZX85lC7iUtfAHHpAsIDfFifCZCB44XAVCiudCHpAulIjQ68hzZ1vFCn2z+mP2YmhuCNS3BUpJu+vgNTFmtQtsChTrHrKgs1TYrDh7A2cr27C0ewEHC5txIIj1QjrTWuY79LjY8w4Nj8BhTYn5v1QBZ68+A795oQorP2lDruLetEuHWwALixKVPNran453J4QdksUJ3MGYWy0CdMLbCi+Jar5u23TXUjzPM3zb0o/M9IOVKD0zj0onlGjTAZcWDRYXdOp+8rRPs1y4A8zY5E7qi+G772Ku487D/P8enrBYFQ4JCz8sRrBfe7VyrwsHBAi4NKSIVh5ogZfFts71tIKw7ODQvB1VjyW/FSDI2WN970z8Np6/SQrlo+NQPIX19RqzdfmU+HBL5aEGQ1qEd+ZM/xNKC5YwHWn8sD0w6Ogf6iA+iZFLS07a2FBBHaJdgh5b+B9Am55CfCipL3PVy6crzYeFd5n4EcdyF+eCwD7ixI95UezwnlX8gnwSk8N4k92VeCoXSU7wNgb/uRYz/nCCogl7+/ZBIajPTeI/1hWmLKM4CATom6UnAWQ4j+u9YgnVxrqKsepKdCyp3QQZOUUIcRv/mG6m5FtMiPT7K8nlbTm/Ii8PywCzGsAkg1gMD+P6+ZB/1tz/IYxQRk/PJUFut2xIvkGd+BfkbQPnzxG4yIAAAAASUVORK5CYII=';
      } else {
        const thumbnail = await PDF.genThumbnail(
          instance!,
          convert.newfile as any as UploadFile,
        );
        base64 = thumbnail[0].img;
      }
      setThumb(base64);
    } catch (e) {
      console.log(e);
    }
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
            onClick={downloadImage}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default ConvertedFile;
