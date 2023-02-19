// import { Core } from '@pdftron/webviewer';
import type { UploadFile } from 'antd/es/upload/interface';

declare global {
  const LICENSE_KEY: string;
  const BROWSER_FILE: string;

  type ConvertFile = {
    file: UploadFile;
    newfile: File;
    newFileName: string;
    newFileBlob: Blob;
  };

  type ExtraThumbnailType = {
    img: string;
    file: UploadFile;
    totalPage: number;
    currentPage: number;
  };

  type CropType = 'vertical' | 'horizontal' | null;

  type ReplaceTextListType = { from: string; to: string };
}
