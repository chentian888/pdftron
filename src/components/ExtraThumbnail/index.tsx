import React, { useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
// import PDF from '@/utils/pdf';
import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import Tools from '@/utils/tools';
// import type { ExtraThumbnailType } from '@/types/typings';

interface Props {
  thumb: ExtraThumbnailType;
  showCheckBox?: boolean;
  checkFile?: (index: number) => void;
  unCheckFile?: (index: number) => void;
}

const DragedFile: React.FC<Props> = (props) => {
  const { thumb, checkFile, unCheckFile, showCheckBox = true } = props;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [checked, setChecked] = useState(true);

  const style = { fontSize: '19px', color: '#6478B3' };

  // 预览
  const handlePreview = async () => {
    const { UI, Core } = instance!;
    setShowWebviewer(true);
    setWebviewerTtile(`${thumb.currentPage}/${thumb.totalPage}`);
    Core.PDFNet.runWithCleanup(async () => {
      const { prefix } = Tools.fileMsg(thumb.file as any as UploadFile);
      // 通过当前doc获取当前页面后导出页面图片
      const fileBuf = await Tools.file2Buf(thumb.file as any as File);
      const pdfDoc = await Core.PDFNet.PDFDoc.createFromBuffer(fileBuf);
      const currPage = await pdfDoc.getPage(thumb.currentPage);
      const pdfdraw = await instance?.Core.PDFNet.PDFDraw.create(92);
      const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
      const blob = await Tools.buf2Blob(pngBuffer!);
      UI.loadDocument(blob, {
        filename: prefix,
        extension: 'png',
      });
    }, LICENSE_KEY);
  };

  const checkBoxChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    setChecked(e.target.checked);
    if (val && checkFile) {
      checkFile(thumb.currentPage);
    } else if (unCheckFile) {
      unCheckFile(thumb.currentPage);
    }
  };

  return (
    <>
      <div className="h-[240px] relative flex flex-col bg-white rounded-md border border-dashed border-purple-600 overflow-hidden">
        <div className="bg-[#f2f3f6] flex-1 p-2 pt-8">
          <div className="h-[127px] flex justify-center items-center">
            <img
              className="block max-w-full max-h-full border border-[#dfe2ed] bg-white"
              src={thumb.img}
              alt=""
            />
          </div>
        </div>

        <div className="absolute text-center left-8 right-8 bottom-5 text-black">
          {thumb.currentPage} / {thumb.totalPage}
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
