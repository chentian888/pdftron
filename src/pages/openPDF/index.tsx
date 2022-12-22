import React from 'react';
import { Button } from 'antd';
import iconUpload from './img/icon-upload.png';

const OpenPDF: React.FC = () => {
  return (
    <div className="pdf-upload-area">
      <img src={iconUpload} alt="" className="icon-upload" />
      <div className="desc">选择文件或将文件拖放至此处</div>
      <Button>添加文件</Button>
    </div>
  );
};

export default OpenPDF;
