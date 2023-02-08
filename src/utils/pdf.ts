import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Core, WebViewerInstance } from '@pdftron/webviewer';
import JSZip from 'jszip';
import {
  map,
  slice,
  forEach,
  flatten,
  times,
  includes,
  fill,
  join,
} from 'lodash-es';
import Tools from '@/utils/tools';
// import { ConvertFile } from '@/types/typings';

export default class PDF {
  private static licenseKey = LICENSE_KEY;

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
    const { Core } = instance;

    const convert = async (file: UploadFile): Promise<ConvertFile> => {
      const { prefix, suffix } = Tools.fileMsg(file);
      // const data = await (instance.Core as any).officeToPDFBuffer(file, {
      //   l: this.licenseKey,
      // });
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
        loadAsPDF: true,
      });
      console.log(doc.getFilename());
      const data = await doc.getFileData();
      const blob = await Tools.buf2Blob(data);
      const newFileName = `${prefix}.pdf`;
      const newfile = Tools.blob2File(data, newFileName);
      doc.unloadResources();
      return { file: file, newfile, newFileName, newFileBlob: blob };
    };

    const convertSequence = function* () {
      for (let i = 0; i < files.length; i++) {
        yield convert(files[i]);
      }
    };
    const blobArray = await Tools.runSequence(convertSequence());
    // const blobArray = await Promise.all(map(files, convert));

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
    const { Core } = instance;

    // 通过文件创建pdf类型文档
    const docsPromise = map(files, async (file) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      return await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
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
    const newFileName = `all.pdf`;
    const newfile = Tools.blob2File(data, newFileName);
    return [
      { file: files[0], newfile, newFileName: 'all.pdf', newFileBlob: blob },
    ];
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
    const { Core } = instance;

    const convert = async (file: UploadFile) => {
      let allBlob: ConvertFile[] = [];
      const { prefix } = Tools.fileMsg(file);
      const buf = await Tools.file2Buf(file as any as File);
      const pdfDoc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const pdfdraw = await Core.PDFNet.PDFDraw.create(92);
      const itr = await pdfDoc?.getPageIterator(1);

      while (await itr?.hasNext()) {
        const currPage = await itr?.current();
        const pageIndex = await currPage.getIndex();
        const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
        const blob = await Tools.buf2Blob(pngBuffer, 'image/png');
        const newFileName = `${prefix}-${pageIndex}.png`;
        const newfile = Tools.blob2File(pngBuffer, newFileName, 'image/png');

        allBlob.push({
          file: file,
          newfile,
          newFileBlob: blob,
          newFileName,
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
  static async pdf2pdfa(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;
    const pdfa = (file: UploadFile) => {
      return new Promise<ConvertFile>((resolve) => {
        async function main() {
          const { prefix } = Tools.fileMsg(file);
          const source = await Tools.file2Buf(file as any as File);
          const pdfa = await Core.PDFNet.PDFACompliance.createFromBuffer(
            true,
            source,
          );
          const buf = await pdfa!.saveAsFromBuffer(false);
          const blob = new Blob([buf], { type: 'application/pdf' });
          const newFileName = `${prefix}.pdf`;
          const newfile = Tools.blob2File(buf, newFileName);
          resolve({ file, newfile, newFileName, newFileBlob: blob });
        }
        Core.PDFNet.runWithCleanup(main, this.licenseKey);
      });
    };
    const arr = await Promise.all(map(files, pdfa));
    return arr;
  }

  /**
   * 生成稳当缩略图
   * @param instance
   * @param file
   * @returns
   */
  static async genThumbnail(
    instance: WebViewerInstance,
    file: UploadFile,
    pageNo: number = 1,
  ): Promise<string> {
    const { Core } = instance;
    return new Promise((resolve) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
      }).then((doc) => {
        const loadThumbnail = (
          thumbnail: HTMLCanvasElement | HTMLImageElement,
        ) => {
          if (/image\/\w+/.test((file as any as File).type)) {
            (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
            (thumbnail as HTMLImageElement).onload = function () {
              const base64 = Tools.getBase64Image(
                thumbnail as HTMLImageElement,
              );
              doc.unloadResources();
              resolve(base64);
            };
          } else {
            const base64 = (thumbnail as HTMLCanvasElement).toDataURL();
            doc.unloadResources();
            resolve(base64);
          }
        };
        doc.loadThumbnail(pageNo, loadThumbnail);
      });
    });
  }

  static async mergeDocuments(
    instance: WebViewerInstance,
    files: UploadFile[],
  ) {
    const { Core } = instance;

    const docsPromise = map(files, async (file) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      return await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
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
    const newFileName = `all.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);

    return [{ file: files[0], newfile, newFileName, newFileBlob: blob }];
  }

  /**
   * 提取文档页面
   * @param instance 文档实例
   * @param doc 目标文档
   * @param file 原始File文件
   * @param pages 目标页面
   * @returns 提取后文件拼装数据
   */
  static async exrtaPage(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pages: number[],
  ): Promise<ConvertFile[]> {
    const { annotationManager } = instance.Core;
    const { prefix } = Tools.fileMsg(file);
    // only include annotations on the pages to extract
    const annotList = annotationManager
      .getAnnotationsList()
      .filter((annot) => pages.indexOf(annot.PageNumber) > -1);
    const xfdfString = await annotationManager.exportAnnotations({ annotList });
    const data = await doc.extractPages(pages, xfdfString);
    const blob = await Tools.buf2Blob(data);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(data, newFileName);

    return [{ file: file, newfile, newFileName, newFileBlob: blob }];
  }

  /**
   * 分割文档
   * @param instance 文档实例
   * @param doc 目标文档
   * @param file 原始File文件
   * @param pages 目标页面
   * @returns 分割后文件拼装数据
   */
  static async splitPage(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pages: number[],
  ): Promise<ConvertFile[]> {
    const { prefix } = Tools.fileMsg(file);
    // 分割文件单个页面
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
      const newFileName = `${prefix}-${index}.pdf`;
      const newfile = Tools.blob2File(data, newFileName);

      return {
        file: file,
        newfile,
        newFileName,
        newFileBlob: blob,
      };
    };

    const res = await Promise.all(map(pages, (index) => startSplit(index)));
    return res;
  }

  /**
   * 裁剪PDF
   * @param doc 裁剪目标文档
   * @param file 原始File文件
   * @param deirection 裁剪方向水平竖直
   * @param exclude 不需要裁剪的页面
   * @returns 裁剪后文件拼装数据
   */
  static async cropPage(
    doc: Core.Document,
    file: UploadFile,
    deirection?: CropType,
    exclude?: number[],
  ): Promise<ConvertFile[]> {
    const { prefix } = Tools.fileMsg(file);
    const count = doc.getPageCount();

    // 裁剪单个页面
    const cut = async (page: number) => {
      const { width, height } = doc.getPageInfo(page);
      let cropTop = 0,
        cropLeft = 0,
        cropRight = 0,
        cropBottom = 0;
      if (deirection === 'horizontal') {
        cropTop = height / 2;
      } else {
        cropLeft = width / 2;
      }
      if (exclude && exclude.length && includes(exclude, page)) return;
      await doc.cropPages([page], cropTop, cropBottom, cropLeft, cropRight);
    };
    const allCutPaage = map(times(count, Number), (index) => cut(index + 1));
    await Promise.all(allCutPaage);
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}-crop.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);

    return [{ file: file, newfile, newFileName, newFileBlob: blob }];
  }

  static async extraText(
    instance: WebViewerInstance,
    files: UploadFile[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;

    // 提取单个文件文字
    const extraDocText = async (file: UploadFile) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
      });
      const count = doc.getPageCount();
      const arr = fill(Array(count), '');

      const loadTextSequence = function* () {
        for (let i = 0; i < arr.length; i++) {
          yield doc.loadPageText(i + 1);
        }
      };

      const textArr = await Tools.runSequence<string>(loadTextSequence());
      const textStr = join(textArr, '');
      const blob = new Blob([textStr], {
        type: 'text/plain;charset=utf-8',
      });
      const newFileName = `${prefix}.txt`;
      const newfile = Tools.blob2File(blob, newFileName, 'text/plain;');

      return { file, newfile, newFileName, newFileBlob: blob };
    };

    // 处理多文件清空
    const multipleFileText = map(files, extraDocText);

    // 多个
    const textList = await Promise.all(multipleFileText);
    console.log(textList);
    return textList;
  }

  // static async extraImage(
  //   instance: WebViewerInstance,
  //   files: UploadFile[],
  // ): Promise<ConvertFile[]> {
  //   const file = files[0];
  //   const buf = await Tools.file2Buf(file as any as File);
  //   const doc = await instance?.Core.PDFNet.PDFDoc.createFromBuffer(buf);
  //   const reader = await instance.Core.PDFNet.ElementReader.create();

  //   const ProcessElements = async (reader) => {
  //     // Traverse the page display list
  //     for (
  //       let element = await reader.next();
  //       element !== null;
  //       element = await reader.next()
  //     ) {
  //       const elementType = await element.getType();
  //       // console.log(
  //       //   element !== null,
  //       //   elementType,
  //       //   instance.Core.PDFNet.Element.Type.e_image,
  //       // );

  //       if (elementType === instance.Core.PDFNet.Element.Type.e_image) {
  //         console.log(element);
  //         const xObj = await element.getXObject();
  //         // const bbb = await xObj.getBuffer();
  //         console.log(xObj);
  //         const image = await instance.Core.PDFNet.Image.createFromObj(xObj);
  //         console.log(image);
  //         const tt = await element.getImageData();
  //         // const filter = await instance.Core.PDFNet.Filter.createFlateEncode(
  //         //   new instance.Core.PDFNet.Filter('0'),
  //         // );
  //         // console.log(tt);
  //         const filterWriter = await instance.Core.PDFNet.FilterWriter.create(
  //           tt,
  //         );
  //         // filterWriter.writeBuffer(bbb);
  //         console.log(filterWriter);
  //         // await filterWriter.writeString('23232323');

  //         const bb = await image.exportAsPngFromStream(filterWriter); // or exportAsTiffFromStream or exportAsPngFromStream
  //         // console.log(await image.getImageData());

  //         console.log(bb);

  //         // console.log(await element.getImageData());
  //       }
  //     }
  //   };
  //   // Read page content on every page in the document
  //   const itr = await doc.getPageIterator(1);
  //   for (itr; await itr.hasNext(); await itr.next()) {
  //     // // Read the page
  //     const page = await itr.current();
  //     await reader.beginOnPage(page);
  //     await ProcessElements(reader);
  //     await reader.end();
  //   }
  // }

  static async removeText(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pageNo: number[],
  ) {
    if (!pageNo || !pageNo.length) return [];
    const { Core } = instance;
    const pdfDoc = await doc.getPDFDoc();
    const { prefix } = Tools.fileMsg(file);
    // 删除某个页面数据
    const removeOnePageText = async (index: number) => {
      const page = await pdfDoc.getPage(index);
      const writer = await Core.PDFNet.ElementWriter.create();
      const reader = await Core.PDFNet.ElementReader.create();
      reader.beginOnPage(page);
      writer.beginOnPage(
        page,
        Core.PDFNet.ElementWriter.WriteMode.e_replacement,
        false,
      );

      for (
        let element = await reader.next();
        element !== null;
        element = await reader.next()
      ) {
        const elementType = await element.getType();
        switch (elementType) {
          // case Core.PDFNet.Element.Type.e_image:
          // case Core.PDFNet.Element.Type.e_inline_image:
          //   // remove all images by skipping them
          //   break;
          case Core.PDFNet.Element.Type.e_text:
            break;
          default:
            writer.writeElement(element);
            break;
        }
      }
      writer.end();
      reader.end();
    };
    await Promise.all(map(pageNo, removeOnePageText));
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  static async removeImage(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
    pageNo: number[],
  ) {
    if (!pageNo || !pageNo.length) return [];
    const { Core } = instance;
    const pdfDoc = await doc.getPDFDoc();
    const { prefix } = Tools.fileMsg(file);
    // 删除某个页面图片
    const removeOnePageImage = async (index: number) => {
      const page = await pdfDoc.getPage(index);
      const writer = await Core.PDFNet.ElementWriter.create();
      const reader = await Core.PDFNet.ElementReader.create();
      reader.beginOnPage(page);
      writer.beginOnPage(
        page,
        Core.PDFNet.ElementWriter.WriteMode.e_replacement,
        false,
      );

      for (
        let element = await reader.next();
        element !== null;
        element = await reader.next()
      ) {
        const elementType = await element.getType();
        switch (elementType) {
          case Core.PDFNet.Element.Type.e_image:
          case Core.PDFNet.Element.Type.e_inline_image:
            // remove all images by skipping them
            break;
          default:
            writer.writeElement(element);
            break;
        }
      }
      writer.end();
      reader.end();
    };
    await Promise.all(map(pageNo, removeOnePageImage));
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);

    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  static async compress(
    instance: WebViewerInstance,
    doc: Core.Document,
    file: UploadFile,
  ) {
    const { Core } = instance;
    const { prefix } = Tools.fileMsg(file);
    const pdfDoc = await doc.getPDFDoc();
    await Core.PDFNet.Optimizer.optimize(pdfDoc);
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  // 下载文件
  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }

  // 下载zip
  static async downloadZip(list: ConvertFile[]) {
    const zip = new JSZip();
    forEach(list, (data) => {
      zip.file(data.newFileName, data.newfile);
    });
    const pack = await zip.generateAsync({
      type: 'blob',
    });
    saveAs(pack, 'all.zip');
  }
}
