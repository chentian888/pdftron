import React, { useEffect, useState } from 'react';
import { Checkbox, Tooltip, Upload } from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { UploadFile } from 'antd/es/upload/interface';
import './index.less';

interface Props {
  file: UploadFile;
  showCheckBox?: boolean;
  showReplaceBtn?: boolean;
  accept: string;
}

const DragedFile: React.FC<Props> = (props) => {
  const { file, showCheckBox = false, showReplaceBtn = true } = props;
  const { onRemove, onReplace } = useModel('files');
  const { instance } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');
  const [totalPage] = useState<number>(0);

  const style = { fontSize: '19px', color: '#6478B3' };

  // image转base64
  const getBase64Image = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    return dataURL;
    // return dataURL.replace("data:image/png;base64,", "");
  };

  useEffect(() => {
    console.log(file);
    // @pdftron/webviewer api
    instance!.UI.loadDocument(file as any as File, { filename: file.name });
    const { documentViewer } = instance!.Core;
    documentViewer.addEventListener('documentLoaded', () => {
      const doc = documentViewer.getDocument();
      const pageNum = 1;
      doc.loadThumbnail(
        pageNum,
        (thumbnail: HTMLCanvasElement | HTMLImageElement) => {
          // thumbnail is a HTMLCanvasElement or HTMLImageElement
          if (/image\/\w+/.test((file as any as File).type)) {
            (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
            (thumbnail as HTMLImageElement).onload = function () {
              const base64 = getBase64Image(thumbnail as HTMLImageElement);
              setThumb(base64);
            };
          } else {
            const base64 = (thumbnail as HTMLCanvasElement).toDataURL();
            setThumb(base64);
          }
        },
      );
    });
  }, [file]);

  // 移除
  const handleRemove = (e: React.MouseEvent, file: UploadFile) => {
    e.stopPropagation();
    onRemove(file);
  };

  // 替换
  const beforeUpload = (newFile: UploadFile) => {
    onReplace(file, newFile);
    return false;
  };

  const handlePreview = () => {};

  return (
    <>
      <div className="draged-file">
        <div className="draged-file-thumb">
          <div className="thumb-img flex justify-center items-center">
            <img className="thumb" src={thumb} alt="" />
          </div>
        </div>
        <div className="draged-file-info">
          <div className="file-name">{file.name}</div>
        </div>
        {!!totalPage && <div className="file-pages">{totalPage} pages</div>}

        {showCheckBox && <Checkbox style={style} className="file-pick" />}

        <Tooltip title="预览文件">
          <EyeOutlined
            style={style}
            className="file-preview"
            onClick={() => handlePreview()}
          />
        </Tooltip>

        <Tooltip title="删除文件">
          <DeleteOutlined
            style={style}
            className="file-remove"
            onClick={(e) => handleRemove(e, file)}
          />
        </Tooltip>

        {showReplaceBtn && (
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Tooltip title="替换文件">
              <UploadOutlined style={style} className="file-reload" />
            </Tooltip>
          </Upload>
        )}
      </div>
    </>
  );
};

export default DragedFile;
