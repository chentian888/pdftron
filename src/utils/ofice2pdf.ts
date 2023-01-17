import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';

export default class Office2Pdf {
  private static licenseKey: 'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0';

  static async toPDFBuffer(instance: WebViewerInstance, file: UploadFile) {
    // perform the conversion with no optional parameters
    const buf = await (instance.Core as any).officeToPDFBuffer(file, {
      l: this.licenseKey,
    });

    //optionally save the blob to a file or upload to a server
    const blob = new Blob([buf], { type: 'application/pdf' });
    return blob;
  }

  static async openInNewTab(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }
}
