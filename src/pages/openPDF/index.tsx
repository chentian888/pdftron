import React from 'react';
import { Button, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import iconUpload from './img/icon-upload.png';
const { Dragger } = Upload;
const OpenPDF: React.FC = () => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: '.pdf',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <Dragger {...props}>
      <div className="pdf-upload-area">
        <img src={iconUpload} alt="" className="icon-upload" />
        <div className="desc">选择文件或将文件拖放至此处</div>
        <Button>添加文件</Button>
      </div>
    </Dragger>
  );
};

export default OpenPDF;
