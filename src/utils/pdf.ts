import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';

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

  static async image2pdf(instance: WebViewerInstance, file: UploadFile) {
    const doc = await instance.Core.createDocument(file as any as File, {
      filename: file.name,
    });
    const data = await doc.getFileData();
    // const arrBuf = new Uint8Array(data);

    // const blob = new Blob([arrBuf], { type: 'application/pdf' });
    return data;
  }

  static async openInNewTab(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }
}
