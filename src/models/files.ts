import { useState } from 'react';
import { Modal } from 'antd';
import { useModel } from '@umijs/max';
import PDF from '@/utils/pdf';
import type { UploadFile } from 'antd/es/upload/interface';
// import type { ConvertFile } from '@/types/typings';

export default () => {
  const { instance } = useModel('pdf');

  // 选择的文件列表
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 勾选文件列表
  const [checkFileList, setCheckFileList] = useState<UploadFile[]>([]);

  // 转换后的文件列表
  const [convertList, setConvertList] = useState<ConvertFile[]>([]);

  const [success, setSuccess] = useState<boolean>(false);

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
    try {
      const hasPassword = await PDF.hasPassword(instance!, files[0]);
      if (hasPassword) {
        Modal.warning({
          title: '无效文档',
          content: '暂不支持有密码的文档进行转换',
        });
        return false;
      }
      setFileList([...fileList, ...files]);
    } catch (e) {
      Modal.warning({
        title: '无效文档',
        content: '暂不支持有密码的文档进行转换',
      });
    }
    return false;
  }

  // 文档加密功能不需要判断文档是否加密
  async function beforeUpload2(file: UploadFile, files: UploadFile[]) {
    setFileList([...fileList, ...files]);
    return false;
  }

  // 清除文件列联表
  function clearFileList() {
    setFileList([]);
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

  // 清除勾选列表
  function clearCheckFileList() {
    setCheckFileList([]);
  }

  function resetList() {
    setSuccess(false);
    setFileList([]);
    setConvertList([]);
    setCheckFileList([]);
  }

  // 移除转换后的文件
  function removeConvertFile(file: ConvertFile) {
    const index = convertList.findIndex((f) => f.newfile === file.newfile);
    const newConvertList = convertList.slice();
    newConvertList.splice(index, 1);
    if (newConvertList.length) {
      setConvertList(newConvertList);
    } else {
      resetList();
    }
  }

  // 清除转换后的文件列表
  function clearConvertFile() {
    setConvertList([]);
  }

  return {
    fileList,
    setFileList,
    onRemove,
    onReplace,
    beforeUpload,
    beforeUpload2,
    clearFileList,
    checkFileList,
    checkFile,
    unCheckFile,
    setCheckFileList,
    clearCheckFileList,
    convertList,
    setConvertList,
    removeConvertFile,
    clearConvertFile,
    resetList,
    success,
    setSuccess,
  };
};
