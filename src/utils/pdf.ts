import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Core, WebViewerInstance } from '@pdftron/webviewer';
import JSZip from 'jszip';
import {
  map,
  slice,
  forEach,
  nth,
  split,
  flatten,
  times,
  includes,
} from 'lodash-es';
import Tools from '@/utils/tools';
// import { ConvertFile } from '@/types/typings';

export default class PDF {
  private static licenseKey =
    'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0';

  /**
   * office转PDF
   * @param instance
   * @param files
   * @returns
   */
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
      const blob = await Tools.buf2Blob(data);
      console.log(blob);
      return { file: file, newfile: blob, fileName: `${fileName}.pdf` };
    };

    const blobArray = await Tools.runSequence(Tools.sequence(files, convert));
    return blobArray;
  }

  /**
   * image转PDF
   * @param instance
   * @param files
   * @returns
   */
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
    const blob = await Tools.buf2Blob(data);
    return [{ file: files[0], newfile: blob, fileName: 'all.pdf' }];
  }

  /**
   * PDF转Image
   * @param instance
   * @param files
   * @returns
   */
  static async pdf2image(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
    const convert = async (file: UploadFile) => {
      let allBlob: ConvertFile[] = [];
      const fileName = nth(split(file.name, '.'), 0);
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await instance?.Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const pdfdraw = await instance?.Core.PDFNet.PDFDraw.create(92);
      const itr = await doc?.getPageIterator(1);

      while (await itr?.hasNext()) {
        const currPage = await itr?.current();
        const pageIndex = await currPage.getIndex();
        const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
        const blob = await Tools.buf2Blob(pngBuffer, 'image/png');
        allBlob.push({
          file: file,
          newfile: blob,
          fileName: `${fileName}-${pageIndex}.png`,
        });
        itr?.next();
      }
      return allBlob;
    };
    const allFile = map(files, convert);
    const processing = await Promise.all(allFile);
    return flatten(processing);
  }

  /**
   * PDF转PDF/A
   * @param instance
   * @param file
   * @returns
   */
  static async pdf2pdfa(instance: WebViewerInstance, file: UploadFile) {
    return new Promise<Blob>((resolve) => {
      async function main() {
        const source = await Tools.file2Buf(file as any as File);
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

  /**
   * 生成稳当缩略图
   * @param instance
   * @param file
   * @returns
   */
  static genThumbnail(
    instance: WebViewerInstance,
    file: UploadFile | Blob,
  ): Promise<string> {
    return new Promise((resolve) => {
      instance?.Core.createDocument(file as any as File, {
        extension: 'pdf',
        l: this.licenseKey,
      }).then((doc) => {
        doc.loadThumbnail(
          1,
          (thumbnail: HTMLCanvasElement | HTMLImageElement) => {
            // thumbnail is a HTMLCanvasElement or HTMLImageElement
            if (/image\/\w+/.test((file as any as File).type)) {
              (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
              (thumbnail as HTMLImageElement).onload = function () {
                const base64 = Tools.getBase64Image(
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
              console.log(base64);
              resolve(base64);
            }
          },
        );
      });
    });
  }

  static async mergeDocuments(
    instance: WebViewerInstance,
    files: UploadFile[],
  ) {
    const docsPromise = map(files, async (file) => {
      return await instance.Core.createDocument(file as any as File, {
        extension: 'pdf',
        l: this.licenseKey,
      });
    });

    // 插入内容到第一个文档完成合并操作
    const docs = await Promise.all(docsPromise);
    const firstDoc = docs[0];
    const otherDoc = slice(docs, 1);
    forEach(otherDoc, (doc) => firstDoc.insertPages(doc));
    // const mergeEnd = await runMerge(files);
    const buf = await firstDoc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    return [{ file: files[0], newfile: blob, fileName: `all.pdf` }];
  }

  static async exrtaPage(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pages: number[],
  ): Promise<ConvertFile[]> {
    const { annotationManager } = instance.Core;
    const fileName = nth(split(file.name, '.'), 0);
    // only include annotations on the pages to extract
    const annotList = annotationManager
      .getAnnotationsList()
      .filter((annot) => pages.indexOf(annot.PageNumber) > -1);
    const xfdfString = await annotationManager.exportAnnotations({ annotList });
    const data = await doc.extractPages(pages, xfdfString);
    const blob = await Tools.buf2Blob(data);
    return [{ file: file, newfile: blob, fileName: `${fileName}.pdf` }];
  }

  static async splitPage(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pages: number[],
  ): Promise<ConvertFile[]> {
    const fileName = nth(split(file.name, '.'), 0);

    const startSplit = async (index: number) => {
      const p = [index];
      const { annotationManager } = instance.Core;
      // only include annotations on the pages to extract
      const annotList = annotationManager
        .getAnnotationsList()
        .filter((annot) => p.indexOf(annot.PageNumber) > -1);
      const xfdfString = await annotationManager.exportAnnotations({
        annotList,
      });
      const data = await doc.extractPages(p, xfdfString);
      const blob = await Tools.buf2Blob(data);
      return {
        file: file,
        newfile: blob,
        fileName: `${fileName}-${index}.pdf`,
      };
    };

    const res = await Promise.all(map(pages, (index) => startSplit(index)));
    return res;
  }

  static async cropPage(
    doc: Core.Document,
    file: UploadFile,
    deicetion?: CropType,
    exclude?: number[],
  ): Promise<ConvertFile[]> {
    const fileName = nth(split(file.name, '.'), 0);
    const count = doc.getPageCount();

    const cut = async (page: number) => {
      const { width, height } = doc.getPageInfo(page);
      let cropTop = 0,
        cropLeft = 0,
        cropRight = 0,
        cropBottom = 0;
      if (deicetion === 'horizontal') {
        cropTop = height / 2;
      } else {
        cropLeft = width / 2;
      }
      console.log(exclude, page, includes(exclude, page));
      if (exclude && exclude.length && includes(exclude, page)) return;
      await doc.cropPages([page], cropTop, cropBottom, cropLeft, cropRight);
    };
    const allCutPaage = map(times(count, Number), (index) => cut(index + 1));
    await Promise.all(allCutPaage);
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    return [{ file: file, newfile: blob, fileName: `${fileName}-crop.pdf` }];
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
