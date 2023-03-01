// import { Core } from '@pdftron/webviewer';
import type { UploadFile } from 'antd/es/upload/interface';

declare global {
  const LICENSE_KEY: string;
  const BROWSER_FILE: string;
  const TOTAL_SIZE: number;
  const SINGLE_SIZE: number;

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

  type PageThumbnailType = {
    totalPage: number;
    currentPage: number;
  } & ConvertFile;

  type CropType = 'vertical' | 'horizontal' | null;

  type ReplaceTextListType = { from: string; to: string };

  interface BreadCrumbsType {
    title: string;
    link?: string;
  }

  interface HomeItemType {
    title: string;
    desc: string;
    icon: string;
    className: string;
    to?: string;
    callback?: (...args: unknown[]) => unknown;
  }
}
