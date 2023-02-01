import React, { useEffect, useState } from 'react';
import { Checkbox, Tooltip, Upload } from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import PDF from '@/utils/pdf';
import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Props {
  file: UploadFile;
  showCheckBox?: boolean;
  showReplaceBtn?: boolean;
  accept: string;
}

const DragedFile: React.FC<Props> = (props) => {
  const { file, showCheckBox = false, showReplaceBtn = true, accept } = props;
  const { onRemove, onReplace, unCheckFile, checkFile } = useModel('files');
  const { instance, setShowWebviewer } = useModel('pdf');
  const [thumb, setThumb] = useState<string>('');
  const [totalPage] = useState<number>(0);

  const style = { fontSize: '19px', color: '#6478B3' };

  // const getDocument = async (file: File) => {
  //   const newDoc = await instance!.Core.createDocument(file);
  //   return await newDoc.getPDFDoc();
  // };

  const computedThumb = async () => {
    const base64 = await PDF.genThumbnail(instance!, file);
    console.log(base64);
    setThumb(base64);
  };

  useEffect(() => {
    computedThumb();
    // getDocument(file as any as File).then((doc) => console.log(doc));
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

  // 预览
  const handlePreview = () => {
    setShowWebviewer(true);
    instance?.UI.loadDocument(file as any as File, { filename: file.name });
    const { documentViewer } = instance!.Core;
    documentViewer!.addEventListener('documentLoaded', () => {
      // perform document operations
    });
  };

  const checkBoxChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    if (val) {
      checkFile(file);
    } else {
      unCheckFile(file);
    }
    console.log(val);
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
            {file.name}
          </div>
        </div>
        {!!totalPage && (
          <div className="absolute text-center left-8 right-8 bottom-5 text-black">
            {totalPage} pages
          </div>
        )}

        {showCheckBox && (
          <Checkbox
            style={style}
            className="cursor-pointer absolute right-[15px] top-[5px]"
            onChange={checkBoxChange}
          />
        )}

        <Tooltip title="预览文件">
          <EyeOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] top-[8px]"
            onClick={() => handlePreview()}
          />
        </Tooltip>

        <Tooltip title="删除文件">
          <DeleteOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] bottom-[15px]"
            onClick={(e) => handleRemove(e, file)}
          />
        </Tooltip>

        {showReplaceBtn && (
          <Upload
            beforeUpload={beforeUpload}
            accept={accept}
            showUploadList={false}
          >
            <Tooltip title="替换文件">
              <UploadOutlined
                style={style}
                className="cursor-pointer absolute right-[15px] bottom-[15px]"
              />
            </Tooltip>
          </Upload>
        )}
      </div>
    </>
  );
};

export default DragedFile;
