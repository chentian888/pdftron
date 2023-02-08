import { Core } from '@pdftron/webviewer';
import type { UploadFile } from 'antd/es/upload/interface';

declare global {
  const LICENSE_KEY: string;
  type ConvertFile = {
    file: UploadFile;
    newfile: File;
    newFileName: string;
    newFileBlob: Blob;
  };

  type ExtraThumbnailType = {
    img: string;
    total: number;
    current: number;
    blob: Blob;
    sourceFile: UploadFile;
    currentDoc: Core.Document;
  };

  type CropType = 'vertical' | 'horizontal' | null;
}
