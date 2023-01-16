import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';

export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  function onRemove(file: UploadFile) {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }
  async function beforeUpload(file: UploadFile) {
    setFileList([...fileList, file]);
    return false;
  }
  return {
    fileList,
    setFileList,
    onRemove,
    beforeUpload,
  };
};
