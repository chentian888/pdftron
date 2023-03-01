import React, { useState, useEffect } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import LoadingThumbnail from '@/components/LoadingThumbnail';
import PDF from '@/utils/pdf';
import Tools from '@/utils/tools';
import type { UploadFile } from 'antd/es/upload/interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Props {
  source: PageThumbnailType;
  showCheckBox?: boolean;
  checkFile?: (index: number) => void;
  unCheckFile?: (index: number) => void;
}

const DragedFile: React.FC<Props> = (props) => {
  const { source, checkFile, unCheckFile, showCheckBox = true } = props;
  const [thumb, setThumb] = useState<string>('');
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [checked, setChecked] = useState(true);

  const style = { fontSize: '19px', color: '#6478B3' };

  const computedThumb = async () => {
    try {
      const thumbnail = await PDF.genThumbnail(
        instance!,
        source.newfile as any as UploadFile,
      );
      setThumb(thumbnail[0].img);
      console.log(thumb);
    } catch (e) {}
  };

  useEffect(() => {
    if (source) {
      computedThumb();
    }
  }, [source]);

  // 预览
  const handlePreview = async () => {
    const { UI } = instance!;
    setShowWebviewer(true);
    setWebviewerTtile(`${source.currentPage}/${source.totalPage}`);
    const { prefix } = Tools.fileMsg(source.newFileName as any as UploadFile);
    UI.loadDocument(source.newfile, {
      filename: prefix,
      extension: 'png',
    });
  };

  const checkBoxChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    setChecked(e.target.checked);
    if (val && checkFile) {
      checkFile(source.currentPage);
    } else if (unCheckFile) {
      unCheckFile(source.currentPage);
    }
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

        <div className="absolute text-center left-8 right-8 bottom-5 text-black">
          {source.currentPage} / {source.totalPage}
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
