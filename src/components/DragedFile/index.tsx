import { useEffect, useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { UploadFile } from 'antd/es/upload/interface';
import './index.less';

interface Props {
  file: UploadFile;
  showCheckBox?: boolean;
  showReplaceBtn?: boolean;
}

const DragedFile: React.FC<Props> = (props) => {
  const { file, showCheckBox = false, showReplaceBtn = true } = props;
  const { onRemove } = useModel('files');
  const { instance } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');
  const [totalPage] = useState<number>(0);

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
    instance!.UI.loadDocument(file as any as File, { filename: file.name });
    const { documentViewer } = instance!.Core;
    documentViewer.addEventListener('documentLoaded', () => {
      const doc = documentViewer.getDocument();
      const pageNum = 1;
      doc.loadThumbnail(pageNum, (thumbnail) => {
        // thumbnail is a HTMLCanvasElement or HTMLImageElement
        if (thumbnail instanceof HTMLCanvasElement) {
          const base64 = thumbnail.toDataURL();
          setThumb(base64);
        } else if (thumbnail instanceof HTMLImageElement) {
          thumbnail.crossOrigin = 'anonymous';
          thumbnail.onload = function () {
            const base64 = getBase64Image(thumbnail);
            setThumb(base64);
          };
        }
        // if (/image\/\w+/.test((file as any as File).type)) {
        //   const reader = new FileReader();
        //   reader.readAsDataURL(file);
        //   reader.onload = function (e) {
        //     const base64 = e.target!.result || '';
        //     setThumb(base64);
        //   };
        // } else {
        //   const base64 = thumbnail.toDataURL();
        //   setThumb(base64);
        //   console.log(base64);
        // }
      });
    });
  }, []);

  return (
    <>
      <div className="draged-file">
        <div className="draged-file-thumb">
          <div className="thumb-img">
            <img className="thumb" src={thumb} alt="" />
          </div>
        </div>
        <div className="draged-file-info">
          <div className="file-name">{file.name}</div>
        </div>
        {!!totalPage && <div className="file-pages">{totalPage} pages</div>}

        {showCheckBox && (
          <Checkbox
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-pick"
          />
        )}

        <Tooltip title="预览文件">
          <EyeOutlined
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-preview"
          />
        </Tooltip>

        <Tooltip title="删除文件">
          <DeleteOutlined
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-remove"
            onClick={() => onRemove(file)}
          />
        </Tooltip>

        {showReplaceBtn && (
          <Tooltip title="替换文件">
            <UploadOutlined
              style={{ fontSize: '19px', color: '#6478B3' }}
              className="file-reload"
            />
          </Tooltip>
        )}
      </div>
    </>
  );
};

export default DragedFile;
