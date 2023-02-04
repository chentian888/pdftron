import React, { useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import PDF from '@/utils/pdf';
// import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import Tools from '@/utils/tools';
// import type { ExtraThumbnailType } from '@/types/typings';

interface Props {
  file: ExtraThumbnailType;
  showCheckBox?: boolean;
  checkFile: (index: number) => void;
  unCheckFile: (index: number) => void;
}

const DragedFile: React.FC<Props> = (props) => {
  const { file, checkFile, unCheckFile, showCheckBox = true } = props;
  const { instance, setShowWebviewer } = useModel('pdf');
  const [checked, setChecked] = useState(true);

  const style = { fontSize: '19px', color: '#6478B3' };

  // 预览
  const handlePreview = async () => {
    setShowWebviewer(true);
    // 通过当前doc获取当前页面后导出页面图片
    const pdfDoc = await file.currentDoc?.getPDFDoc();
    const currPage = await pdfDoc.getPage(file.current);
    const pdfdraw = await instance?.Core.PDFNet.PDFDraw.create(92);
    const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
    const blob = await Tools.buf2Blob(pngBuffer!);
    instance?.UI.loadDocument(blob, {
      filename: file.sourceFile.name,
      extension: 'png',
    });

    const { documentViewer } = instance!.Core;
    documentViewer!.addEventListener('documentLoaded', () => {
      // perform document operations
    });
  };

  const checkBoxChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    setChecked(e.target.checked);
    if (val) {
      checkFile(file.current);
    } else {
      unCheckFile(file.current);
    }
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

        {showCheckBox && (
          <Checkbox
            style={style}
            checked={checked}
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
      </div>
    </>
  );
};

export default DragedFile;
