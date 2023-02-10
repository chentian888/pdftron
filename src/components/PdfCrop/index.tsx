import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import { useModel } from '@umijs/max';
import type { SelectProps } from 'antd';
import { times, split, map } from 'lodash-es';
import Tools from '@/utils/tools';
import { UploadFile } from 'antd/es/upload/interface';

interface Props {
  file: UploadFile;
  loading: boolean;
  crop: (pagesNum: number[], type: CropType) => Promise<void>;
}

const PdfCrop: React.FC<Props> = (props) => {
  const { file, crop, loading } = props;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [excludePages, setExcludePages] = useState<number[]>([]);
  const [cropType, setCropType] = useState<CropType>();
  const [options, setOptions] = useState<SelectProps['options']>([]);

  // let options: SelectProps['options'] = [];

  const initDoc = async () => {
    const { prefix, suffix } = Tools.fileMsg(file);
    const doc = await instance?.Core.createDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
    const count = doc?.getPageCount();
    const options = times(count!, (index) => ({
      label: `第${index + 1}页`,
      value: index + 1,
    }));
    setOptions(options);
    console.log(options);
    doc?.unloadResources();
  };

  useEffect(() => {
    if (file) {
      initDoc();
    }
  }, [file]);

  const handleChange = (value: string) => {
    const arrStr = split(value, ',');
    const arrNum = map(arrStr, (num: string) => Number(num));
    setExcludePages(arrNum);
  };

  // 预览
  const handlePreview = () => {
    const { UI } = instance!;
    const { prefix, suffix } = Tools.fileMsg(file);
    setShowWebviewer(true);
    setWebviewerTtile(file.name);
    UI.loadDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
  };

  // 设置裁剪模式
  const cropModule = (type: CropType) => {
    setCropType(type);
  };

  const handleCrop = () => {
    if (cropType) {
      crop(excludePages, cropType);
    }
  };

  return (
    <div className="w-2/6 z-10 relative m-auto">
      <div className="flex justify-center text-xl">PDF裁剪</div>
      <div className="flex justify-between  my-6">
        <div className=" flex items-center  text-gray-400">
          PDF名称：{file.name || ''}
        </div>
        <div>
          <Button type="primary" onClick={handlePreview}>
            预览
          </Button>
        </div>
      </div>
      <Select
        mode="multiple"
        className="w-full mb-4"
        size="large"
        allowClear
        placeholder="请选择不需要裁剪的页码"
        onChange={handleChange}
        options={options}
      />
      <div className="text-red-500 leading-7">
        不输入则裁剪所有
        {/* ，有多个跳过的页“/”隔开，例：“1/3/6” */}
      </div>
      <div className="text-red-500 leading-7 mb-10">
        该功能是为了解决用户，PDF每页有两页的内容，将每页裁 剪为2页的需求。
      </div>

      <div className="flex justify-between w-full mb-10">
        <div
          className={`w-48 h-48 flex flex-col justify-center items-center bg-white rounded-lg  ${
            cropType === 'vertical'
              ? 'border border-dashed border-purple-600'
              : ''
          } cursor-pointer`}
          onClick={() => cropModule('vertical')}
        >
          <img
            className=" w-[46px] h-[46px] block"
            src={require('./img/icon-corp-horizontal.png')}
            alt=""
          />
          <div className="mt-4">左右对半裁剪</div>
        </div>
        <div
          className={`w-48 h-48 flex flex-col justify-center items-center bg-white rounded-lg ${
            cropType === 'horizontal'
              ? 'border border-dashed border-purple-600'
              : ''
          } cursor-pointer`}
          onClick={() => cropModule('horizontal')}
        >
          <img
            className=" w-[46px] h-[46px] block"
            src={require('./img/icon-corp-vertical.png')}
            alt=""
          />
          <div className="mt-4">上下对半裁剪</div>
        </div>
      </div>
      <Button
        block
        size="large"
        type="primary"
        disabled={!cropType}
        loading={loading}
        onClick={handleCrop}
      >
        裁剪
      </Button>
    </div>
  );
};

export default PdfCrop;
