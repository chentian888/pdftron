import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ConvertImageFile } from '@/types/convert';

export default () => {
  // 选择的文件列表
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 勾选文件列表
  const [checkFileList, setCheckFileList] = useState<UploadFile[]>([]);

  // 转换后的图片列表
  const [imageList, setImageList] = useState<ConvertImageFile[]>([]);

  // 移除文件
  function onRemove(file: UploadFile) {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }

  // 替换文件
  function onReplace(oldFile: UploadFile, newFile: UploadFile) {
    const index = fileList.indexOf(oldFile);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    newFileList.splice(index, 0, newFile);
    setFileList(newFileList);
  }

  async function beforeUpload(file: UploadFile, files: UploadFile[]) {
    setFileList([...fileList, ...files]);
    console.log(fileList);
    return false;
  }

  // 勾选文件
  async function checkFile(file: UploadFile) {
    setCheckFileList([...checkFileList, file]);
  }

  // 取消文件勾选
  async function unCheckFile(file: UploadFile) {
    const index = checkFileList.indexOf(file);
    const newFileList = checkFileList.slice();
    newFileList.splice(index, 1);
    setCheckFileList(newFileList);
  }

  // 移除转换后的图片文件
  function onRemoveImage(index: number) {
    console.log(index);
    const newImageList = imageList.slice();
    newImageList.splice(index, 1);
    console.log(newImageList);
    setImageList(newImageList);
  }

  return {
    fileList,
    setFileList,
    onRemove,
    onReplace,
    beforeUpload,
    checkFileList,
    checkFile,
    unCheckFile,
    setCheckFileList,
    imageList,
    setImageList,
    onRemoveImage,
  };
};
