import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';
import { map, slice, forEach } from 'lodash-es';
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
    return PDF.buf2Blob(data);
  }

  // ArrayBuffer转为blob
  static buf2Blob(buf: ArrayBuffer, type: string = 'application/pdf') {
    const arrBuf = new Uint8Array(buf);
    const blob = new Blob([arrBuf], { type });
    return blob;
  }

  // file转为ArrayBuffer
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

  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }
}
