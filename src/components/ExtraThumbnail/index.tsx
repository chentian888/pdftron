import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import PDF from '@/utils/pdf';
// import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import type { ExtraThumbnailType } from '@/types/typings';

interface Props {
  file: ExtraThumbnailType;
}

const DragedFile: React.FC<Props> = (props) => {
  const { file } = props;
  const { instance, setShowWebviewer } = useModel('pdf');

  const style = { fontSize: '19px', color: '#6478B3' };

  // 预览
  const handlePreview = () => {
    setShowWebviewer(true);
    instance?.UI.loadDocument(file as any as File);
    const { documentViewer } = instance!.Core;
    documentViewer!.addEventListener('documentLoaded', () => {
      // perform document operations
    });
  };

  const checkBoxChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    if (val) {
      // checkFile(file.current);
    } else {
      // unCheckFile(file.current);
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
              src={file.img}
              alt=""
            />
          </div>
        </div>

        <div className="absolute text-center left-8 right-8 bottom-5 text-black">
          {file.current} / {file.total}
        </div>

        <Checkbox
          style={style}
          className="cursor-pointer absolute right-[15px] top-[5px]"
          onChange={checkBoxChange}
        />

        <Tooltip title="预览文件">
          <EyeOutlined
            style={style}
            className="cursor-pointer absolute left-[15px] top-[8px]"
            onClick={() => handlePreview()}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default DragedFile;
