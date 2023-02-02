import type { UploadFile } from 'antd/es/upload/interface';

export declare const LICENSE_KEY: string;
export type ConvertFile = { file: UploadFile; newfile: Blob; fileName: string };
export type ExtraThumbnailType = {
  img: string;
  total: number;
  current: number;
};
