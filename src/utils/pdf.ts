import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';
import JSZip from 'jszip';
import { map, slice, forEach, nth, split } from 'lodash-es';
import { ConvertImageFile } from '@/types/convert';
export default class PDF {
  private static licenseKey: 'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0';

  static async office2pdf(instance: WebViewerInstance, file: UploadFile) {
    // perform the conversion with no optional parameters
    const buf = await (instance.Core as any).officeToPDFBuffer(file, {
      l: this.licenseKey,
    });

    //optionally save the blob to a file or upload to a server
    const blob = new Blob([buf], { type: 'application/pdf' });
    return blob;
  }

  static async image2pdf(instance: WebViewerInstance, files: UploadFile[]) {
    // 通过文件创建pdf类型文档
    const docsPromise = map(files, async (file) => {
      return await instance.Core.createDocument(file as any as File, {
        filename: file.name,
        loadAsPDF: true,
      });
    });

    // 插入内容到第一个文档完成合并操作
    const docs = await Promise.all(docsPromise);
    const firstDoc = docs[0];
    const otherDoc = slice(docs, 1);
    forEach(otherDoc, (doc) => firstDoc.insertPages(doc));

    // 获取文件数据流
    const data = await firstDoc.getFileData();
    return await PDF.buf2Blob(data);
  }

  // PDF转Image
  static async pdf2image(
    instance: WebViewerInstance,
    data: ArrayBuffer,
    file: UploadFile,
  ) {
    const fileName = nth(split(file.name, '.'), 0);
    const doc = await instance?.Core.PDFNet.PDFDoc.createFromBuffer(data);
    const pdfdraw = await instance?.Core.PDFNet.PDFDraw.create(92);
    const itr = await doc?.getPageIterator(1);
    let allBlob = [];

    while (await itr?.hasNext()) {
      const currPage = await itr?.current();
      const pageIndex = await currPage.getIndex();
      const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
      const blob = await PDF.buf2Blob(pngBuffer, 'image/png');
      // allBlob.push({ file: blob, fileName: `${file.name}-${pageIndex}.png` });
      allBlob.push({ file: blob, fileName: `${fileName}-${pageIndex}.png` });
      itr?.next();
    }
    return allBlob;
  }

  // ArrayBuffer转为Blob
  static async buf2Blob(buf: ArrayBuffer, type: string = 'application/pdf') {
    const arrBuf = new Uint8Array(buf);
    const blob = new Blob([arrBuf], { type });
    return blob;
  }

  // Blob类型转Base64
  static blob2Base64(data: Blob) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.addEventListener(
        'loadend',
        () => {
          console.log(reader.result);
          resolve(reader.result as string);
        },
        false,
      );
    });
  }

  // File转为ArrayBuffer
  static file2Buf(file: File) {
    return new Promise<ArrayBuffer>((resolve) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener('loadend', () => {
        resolve(fr.result as ArrayBuffer);
      });
    });
  }

  static async openInNewTab(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  // 下载文件
  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }

  // 下载zip
  static async downloadZip(list: ConvertImageFile[]) {
    const zip = new JSZip();
    forEach(list, (data) => {
      zip.file(data.fileName, data.file);
    });
    const pack = await zip.generateAsync({
      type: 'blob',
    });
    saveAs(pack, 'all.zip');
  }
}
