import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';
import JSZip from 'jszip';
import { map, slice, forEach, nth, split, flatten } from 'lodash-es';
import { ConvertFile } from '@/types/typings.d';

export default class PDF {
  private static licenseKey =
    'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0';

  static async office2pdf(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
    const convert = async (file: UploadFile): Promise<ConvertFile> => {
      const fileName = nth(split(file?.name, '.'), 0);
      // const buf = await (instance.Core as any).officeToPDFBuffer(file, {
      //   l: this.licenseKey,
      // });

      const doc = await instance.Core.createDocument(file as any as File, {
        filename: file.name,
        loadAsPDF: true,
      });

      const data = await doc.getFileData();
      const blob = await this.buf2Blob(data);
      console.log(blob);
      return { file: file, newfile: blob, fileName: `${fileName}.pdf` };
    };

    // const aa = map(files, convert);
    const mergePromise = function* () {
      for (let i = 0; i < files.length; i++) {
        yield convert(files[i]);
      }
    };

    function run(fn: Generator<Promise<ConvertFile>>): Promise<ConvertFile[]> {
      return new Promise((resolve) => {
        const g = fn;
        const arr: ConvertFile[] = [];
        function next(preData?: ConvertFile) {
          if (preData) {
            //如果有数据则push进数组
            arr.push(preData);
          }
          let result = g.next(preData); //获取每一步执行结果，其中value为promise对象，done表示是否执行完成
          if (result.done) {
            //函数执行完毕则resolve数组
            resolve(arr);
          } else {
            //函数没有执行完毕则递归执行
            result.value.then((nowData: ConvertFile) => {
              next(nowData);
            });
          }
        }
        next();
      });
    }
    const blobArray = await run(mergePromise());
    // const blobArray = await Promise.all(aa);
    // console.log(blobArray);
    return blobArray;
  }

  static async image2pdf(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
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
    const blob = await PDF.buf2Blob(data);
    return [{ file: files[0], newfile: blob, fileName: 'all.pdf' }];
  }

  // PDF转Image
  static async pdf2image(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
    const convert = async (file: UploadFile) => {
      let allBlob: ConvertFile[] = [];
      const fileName = nth(split(file.name, '.'), 0);
      const buf = await PDF.file2Buf(file as any as File);
      const doc = await instance?.Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const pdfdraw = await instance?.Core.PDFNet.PDFDraw.create(92);
      const itr = await doc?.getPageIterator(1);

      while (await itr?.hasNext()) {
        const currPage = await itr?.current();
        const pageIndex = await currPage.getIndex();
        const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
        const blob = await PDF.buf2Blob(pngBuffer, 'image/png');
        allBlob.push({
          file: file,
          newfile: blob,
          fileName: `${fileName}-${pageIndex}.png`,
        });
        itr?.next();
      }
      return allBlob;
    };
    const a = map(files, convert);
    console.log(a);
    const aal = await Promise.all(a);
    console.log(aal);
    return flatten(aal);
  }

  // PDF转PDF/A
  static async pdf2pdfa(instance: WebViewerInstance, file: UploadFile) {
    return new Promise<Blob>((resolve) => {
      async function main() {
        const source = await PDF.file2Buf(file as any as File);
        const pdfa =
          await instance?.Core.PDFNet.PDFACompliance.createFromBuffer(
            true,
            source,
          );
        const buf = await pdfa!.saveAsFromBuffer(false);
        const blob = new Blob([buf], { type: 'application/pdf' });
        resolve(blob);
      }
      instance?.Core.PDFNet.runWithCleanup(main, this.licenseKey);
    });
  }

  static genThumbnail(
    instance: WebViewerInstance,
    file: UploadFile,
  ): Promise<string> {
    return new Promise((resolve) => {
      instance?.Core.createDocument(file as any as File).then((doc) => {
        doc.loadThumbnail(
          1,
          (thumbnail: HTMLCanvasElement | HTMLImageElement) => {
            // thumbnail is a HTMLCanvasElement or HTMLImageElement
            if (/image\/\w+/.test((file as any as File).type)) {
              (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
              (thumbnail as HTMLImageElement).onload = function () {
                const base64 = PDF.getBase64Image(
                  thumbnail as HTMLImageElement,
                );
                console.log(base64);
                // console.log(thumb)
                // const reader = new FileReader();
                // reader.readAsDataURL(file as any as File);
                // reader.addEventListener(
                //   'load',
                //   () => {
                //     console.log(reader.result);
                //   },
                //   false,
                // );
                resolve(base64);
              };
            } else {
              const base64 = (thumbnail as HTMLCanvasElement).toDataURL();
              resolve(base64);
            }
          },
        );
      });
    });
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

  static getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    const dataURL = canvas.toDataURL();
    // console.log(dataURL);
    return dataURL;
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
  static async downloadZip(list: ConvertFile[]) {
    const zip = new JSZip();
    forEach(list, (data) => {
      zip.file(data.fileName, data.newfile);
    });
    const pack = await zip.generateAsync({
      type: 'blob',
    });
    saveAs(pack, 'all.zip');
  }
}
