import { saveAs } from 'file-saver';
import type { UploadFile } from 'antd/es/upload/interface';
import type { WebViewerInstance } from '@pdftron/webviewer';
import JSZip from 'jszip';
import {
  map,
  slice,
  forEach,
  flatten,
  times,
  includes,
  join,
  first,
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
    const firstFile = first(files);
    const otherFile = slice(files, 1);

    const { prefix, suffix } = Tools.fileMsg(firstFile!);
    const firstDoc = await Core.createDocument(firstFile as any as File, {
      filename: prefix,
      extension: suffix,
      loadAsPDF: true,
    });

    for (let i = 0; i < otherFile.length; i++) {
      const file = otherFile[i];
      const { prefix, suffix } = Tools.fileMsg(file);
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
        loadAsPDF: true,
      });
      await firstDoc.insertPages(doc);
      doc.unloadResources();
    }

    // 获取文件数据流
    const data = await firstDoc.getFileData();
    const blob = await Tools.buf2Blob(data);
    const newFileName = `all.pdf`;
    const newfile = Tools.blob2File(data, newFileName);
    // 释放资源
    firstDoc.unloadResources();
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
    callback?: (res: ConvertFile[]) => void,
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
        const res = {
          file: file,
          newfile,
          newFileBlob: blob,
          newFileName,
        };
        allBlob.push(res);
        if (callback) {
          // console.log(res)
          callback(allBlob);
        }
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

  static async loadPage(
    instance: WebViewerInstance,
    file: UploadFile,
    callback?: (res: PageThumbnailType[]) => void,
  ): Promise<PageThumbnailType[]> {
    const { Core } = instance;

    const load = async () => {
      let allBlob: PageThumbnailType[] = [];
      const { prefix } = Tools.fileMsg(file);
      const buf = await Tools.file2Buf(file as any as File);
      const pdfDoc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const pdfdraw = await Core.PDFNet.PDFDraw.create(92);
      const itr = await pdfDoc?.getPageIterator(1);
      const total = await pdfDoc.getPageCount();
      while (await itr?.hasNext()) {
        const currPage = await itr?.current();
        const pageIndex = await currPage.getIndex();
        const pngBuffer = await pdfdraw?.exportBuffer(currPage!, 'PNG');
        const blob = await Tools.buf2Blob(pngBuffer, 'image/png');
        const newFileName = `${prefix}-${pageIndex}.png`;
        const newfile = Tools.blob2File(pngBuffer, newFileName, 'image/png');
        const res = {
          file: file,
          newfile,
          newFileBlob: blob,
          newFileName,
          totalPage: total,
          currentPage: pageIndex,
        };
        allBlob.push(res);
        if (callback) {
          callback(allBlob);
        }
        itr?.next();
      }
      return allBlob;
    };

    return await Core.PDFNet.runWithCleanup(await load, LICENSE_KEY);
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
    full: boolean = false,
  ): Promise<ExtraThumbnailType[]> {
    const { Core } = instance;
    const { prefix, suffix } = Tools.fileMsg(file);
    const doc = await Core.createDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
    const pageCount = doc.getPageCount();
    const count = full ? pageCount : 1;
    const loadThumbnail = (pageNo: number): Promise<ExtraThumbnailType> => {
      return new Promise((resolve) => {
        const loadThumbnail = (
          thumbnail: HTMLCanvasElement | HTMLImageElement,
        ) => {
          let base64 = '';
          if (/image\/\w+/.test((file as any as File).type)) {
            (thumbnail as HTMLImageElement).crossOrigin = 'anonymous';
            (thumbnail as HTMLImageElement).onload = function () {
              base64 = Tools.getBase64Image(thumbnail as HTMLImageElement);
              resolve({
                img: base64,
                file,
                totalPage: pageCount,
                currentPage: pageNo,
              });
            };
          } else {
            base64 = (thumbnail as HTMLCanvasElement).toDataURL();
            resolve({
              img: base64,
              file,
              totalPage: pageCount,
              currentPage: pageNo,
            });
          }
        };
        doc.loadThumbnail(pageNo, loadThumbnail);
      });
    };

    const thumbnailList = await Promise.all(
      map(times(count, Number), (index) => loadThumbnail(index + 1)),
    );
    return thumbnailList;
  }

  /**
   * 合并文档
   * @param instance 文档实例
   * @param files 原始File文件
   * @returns
   */
  static async mergeDocuments(
    instance: WebViewerInstance,
    files: UploadFile[],
  ) {
    const { Core } = instance;
    async function main() {
      const newDoc = await Core.PDFNet.PDFDoc.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buf = await Tools.file2Buf(file as any as File);
        const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
        const pageCount = await doc.getPageCount();
        const count = await newDoc.getPageCount();
        newDoc.insertPages(
          count + 1,
          doc,
          1,
          pageCount,
          Core.PDFNet.PDFDoc.InsertFlag.e_none,
        );
      }

      const buf = await newDoc.saveMemoryBuffer(
        Core.PDFNet.SDFDoc.SaveOptions.e_linearized,
      );
      const blob = await Tools.buf2Blob(buf);
      const newFileName = `all.pdf`;
      const newfile = Tools.blob2File(buf, newFileName);
      // 释放资源

      return [{ file: files[0], newfile, newFileName, newFileBlob: blob }];
    }
    return Core.PDFNet.runWithCleanup(await main, LICENSE_KEY);
  }

  /**
   * 提取文档页面 不支持多文件
   * @param instance 文档实例
   * @param doc 目标文档
   * @param files 原始File文件
   * @param pages 目标页面
   * @returns 提取后文件拼装数据
   */
  static async exrtaPage(
    instance: WebViewerInstance,
    files: UploadFile[],
    pages: number[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;

    const extra = async (file: UploadFile) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      // only include annotations on the pages to extract
      const annotList = Core.annotationManager
        .getAnnotationsList()
        .filter((annot) => pages.indexOf(annot.PageNumber) > -1);
      const xfdfString = await Core.annotationManager.exportAnnotations({
        annotList,
      });
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
      });
      const data = await doc.extractPages(pages, xfdfString);
      const blob = await Tools.buf2Blob(data);
      const newFileName = `${prefix}.pdf`;
      const newfile = Tools.blob2File(data, newFileName);
      doc.unloadResources();
      return { file, newfile, newFileName, newFileBlob: blob };
    };
    return await Promise.all(map(files, extra));
  }

  /**
   * 分割文档 不支持多文件
   * @param instance 文档实例
   * @param doc 目标文档
   * @param file 原始File文件
   * @param pages 目标页面
   * @returns 分割后文件拼装数据
   */
  static async splitPage(
    instance: WebViewerInstance,
    files: UploadFile[],
    pages: number[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;

    // 分割文件单个文件
    const startSplit = async (file: UploadFile) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
      });
      // const count = doc.getPageCount();

      // 提取某一页
      const onPage = async (index: number): Promise<ConvertFile> => {
        // only include annotations on the pages to extract
        const annotList = Core.annotationManager
          .getAnnotationsList()
          .filter((annot) => [index].indexOf(annot.PageNumber) > -1);
        const xfdfString = await Core.annotationManager.exportAnnotations({
          annotList,
        });
        const data = await doc.extractPages([index], xfdfString);
        const blob = await Tools.buf2Blob(data);
        const newFileName = `${prefix}-${index}.pdf`;
        const newfile = Tools.blob2File(data, newFileName);

        return {
          file,
          newfile,
          newFileName,
          newFileBlob: blob,
        };
      };
      const pdfs = await Promise.all(map(pages, (index) => onPage(index)));
      doc.unloadResources();
      return pdfs;
    };

    const allFilePages = await Promise.all(map(files, startSplit));
    return flatten(allFilePages);
  }

  /**
   * 裁剪PDF 不支持多文件
   * @param doc 裁剪目标文档
   * @param file 原始File文件
   * @param deirection 裁剪方向水平竖直
   * @param exclude 不需要裁剪的页面
   * @returns 裁剪后文件拼装数据
   */
  static async cropPage(
    instance: WebViewerInstance,
    file: UploadFile,
    deirection: CropType,
    exclude?: number[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;
    const { prefix, suffix } = Tools.fileMsg(file);
    const doc = await Core.createDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
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
    doc.unloadResources();
    return [{ file: file, newfile, newFileName, newFileBlob: blob }];
  }

  static async replaceText(
    instance: WebViewerInstance,
    file: UploadFile,
    replaceList: ReplaceTextListType[],
  ): Promise<ConvertFile[]> {
    const { Core } = instance;
    const { PDFNet } = Core;
    async function main(): Promise<ConvertFile[]> {
      const { prefix } = await Tools.fileMsg(file);
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await PDFNet.PDFDoc.createFromBuffer(buf);
      const count = await doc.getPageCount();
      // 逐页处理
      for (let i = 1; i <= count; i++) {
        const page = await doc.getPage(i);
        const txt = await PDFNet.TextExtractor.create();
        const rect = await page.getCropBox();
        txt.begin(page, rect); // Read the page.
        // Extract words one by one.
        let line = await txt.getFirstLine();
        let word;

        // 遍历行
        for (; await line.isValid(); line = await line.getNextLine()) {
          for (
            word = await line.getFirstWord();
            await word.isValid();
            word = await word.getNextWord()
          ) {
            let text = await word.getString();
            const rect = await word.getBBox();
            // 对需要替换的列表进行遍历
            for (let i = 0; i < replaceList.length; i++) {
              const searchTerm: ReplaceTextListType = replaceList[i];
              const from = searchTerm.from;
              const to = searchTerm.to;
              if (text.indexOf(from) > -1) {
                text = text.replaceAll(from, to);
                console.log(text);
              }
            }
            const replacer = await PDFNet.ContentReplacer.create();
            await replacer.addText(rect, text);
            await replacer.process(page);
          }
        }
      }

      const docbuf = await doc.saveMemoryBuffer(
        PDFNet.SDFDoc.SaveOptions.e_remove_unused,
      );
      const blob = await Tools.buf2Blob(docbuf);
      const newFileName = `${prefix}-replacetext.pdf`;
      const newfile = Tools.blob2File(docbuf, newFileName);
      return [{ file: file, newfile, newFileName, newFileBlob: blob }];
    }
    return await PDFNet.runWithCleanup(main, LICENSE_KEY);
  }

  /**
   * 提取文字 支持多文件
   * @param instance
   * @param files
   * @returns
   */
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
      const arr = times(count, Number);

      // const loadTextSequence = function* () {
      //   for (let i = 0; i < arr.length; i++) {
      //     yield doc.loadPageText(i + 1);
      //   }
      // };

      // const textArr = await Tools.runSequence<string>(loadTextSequence());
      const textArr = await Promise.all(
        map(arr, async (i) => await doc.loadPageText(i + 1)),
      );
      const textStr = join(textArr, '');
      const blob = new Blob([textStr], {
        type: 'text/plain;charset=utf-8',
      });
      const newFileName = `${prefix}.txt`;
      const newfile = Tools.blob2File(blob, newFileName, 'text/plain;');
      doc.unloadResources();
      return { file, newfile, newFileName, newFileBlob: blob };
    };

    // 处理多文件清空
    const multipleFileText = map(files, extraDocText);

    // 多个
    const textList = await Promise.all(multipleFileText);
    return textList;
  }

  // static async extraImage(
  //   instance: WebViewerInstance,
  //   files: UploadFile[],
  // ): Promise<ConvertFile[]> {
  //   const { Core } = instance;
  //   const file = files[0];
  //   const buf = await Tools.file2Buf(file as any as File);
  //   const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
  //   const blankDoc = await Core.PDFNet.PDFDoc.create();
  //   const eb = await Core.PDFNet.ElementBuilder.create();
  //   const reader = await Core.PDFNet.ElementReader.create();
  //   const writer = await Core.PDFNet.ElementWriter.create();
  //   let blankelement;

  //   const ProcessElements = async (reader) => {
  //     // Traverse the page display list
  //     for (
  //       let element = await reader.next();
  //       element !== null;
  //       element = await reader.next()
  //     ) {
  //       const elementType = await element.getType();

  //       if (elementType === Core.PDFNet.Element.Type.e_image) {
  //         // console.log(element);
  //         const xObj = await element.getXObject();
  //         const image = await Core.PDFNet.Image.createFromObj(xObj);
  //         // console.log(image);
  //         // const sdf = await image.getSDFObj();
  //         const sdf = await image.getSDFObj();
  //         const dec_stm = await sdf.getDecodedStream();
  //         const writer = await Core.PDFNet.FilterWriter.create(dec_stm);
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
  //   // const blankdoc = await Core.PDFNet.PDFDoc.create();
  //   // const eb = await Core.PDFNet.ElementBuilder.create();
  //   // const writer = await Core.PDFNet.ElementWriter.create();
  //   // let element;
  //   // const img = await Core.PDFNet.Image.createFromURL(
  //   //   blankdoc,
  //   //   ' https://wxp.cardpu.com/upload/image/1673939715548.png',
  //   // );
  //   // const w = await img.getImageWidth();
  //   // const h = await img.getImageHeight();
  //   // const pageRect = await Core.PDFNet.Rect.init(0, 0, w, h);
  //   // console.log(pageRect);
  //   // let page = await blankdoc.pageCreate(pageRect);
  //   // writer.beginOnPage(page);
  //   // element = await eb.createImageFromMatrix(
  //   //   img,
  //   //   await Core.PDFNet.Matrix2D.create(w, 0, 0, h, 0, 0),
  //   // );
  //   // writer.writePlacedElement(element);
  //   // writer.end();
  //   // blankdoc.pagePushBack(page);
  //   // const docBuffer = await blankdoc.saveMemoryBuffer(
  //   //   Core.PDFNet.SDFDoc.SaveOptions.e_remove_unused,
  //   // );
  //   // const blob = new Blob([docBuffer], {
  //   //   type: 'application/pdf',
  //   // });
  //   // PDF.download(blob, 'aa.pdf');
  //   // this.download(blob, 'aa.pdf');
  // }

  /**
   * 删除文字内容 不支持多文件
   * @param instance
   * @param files
   * @param pages
   * @returns
   */
  static async removeText(
    instance: WebViewerInstance,
    files: UploadFile[],
    pages: number[],
  ): Promise<ConvertFile[]> {
    if (!pages || !pages.length) return [];
    const { Core } = instance;
    const file = files[0];
    const { prefix, suffix } = Tools.fileMsg(file);
    const doc = await Core.createDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
    const pdfDoc = await doc.getPDFDoc();
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
          case Core.PDFNet.Element.Type.e_inline_image:
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
    await Promise.all(map(pages, removeOnePageText));
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);
    doc.unloadResources();
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  /**
   * 删除图片内容 不支持多文件
   * @param instance
   * @param files
   * @param pages
   * @returns
   */
  static async removeImage(
    instance: WebViewerInstance,
    files: UploadFile[],
    pages: number[],
  ): Promise<ConvertFile[]> {
    if (!pages || !pages.length) return [];
    const { Core } = instance;
    const file = files[0];
    const { prefix, suffix } = Tools.fileMsg(file);
    const doc = await Core.createDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });

    const pdfDoc = await doc.getPDFDoc();
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
    await Promise.all(map(pages, removeOnePageImage));
    const buf = await doc.getFileData();
    const blob = await Tools.buf2Blob(buf);
    const newFileName = `${prefix}.pdf`;
    const newfile = Tools.blob2File(buf, newFileName);
    doc.unloadResources();
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  /**
   * pdf压缩支持多文件
   * @param instance
   * @param files
   * @returns
   */
  static async compress(instance: WebViewerInstance, files: UploadFile[]) {
    const { Core } = instance;
    const compressOneFile = async (file: UploadFile) => {
      const { prefix, suffix } = Tools.fileMsg(file);
      const doc = await Core.createDocument(file as any as File, {
        filename: prefix,
        extension: suffix,
      });
      const pdfDoc = await doc.getPDFDoc();
      await Core.PDFNet.Optimizer.optimize(pdfDoc);
      const buf = await doc.getFileData();
      const blob = await Tools.buf2Blob(buf);
      const newFileName = `${prefix}.pdf`;
      const newfile = Tools.blob2File(buf, newFileName);
      doc.unloadResources();
      return { file, newfile, newFileName, newFileBlob: blob };
    };
    const allCompressFile = await Promise.all(map(files, compressOneFile));
    return allCompressFile;
  }

  // 设置密码
  static async encrypt(
    instance: WebViewerInstance,
    file: UploadFile,
    pwd: string,
  ) {
    const { Core } = instance!;
    const { prefix } = Tools.fileMsg(file);
    const setPwd = async () => {
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const newHandler = await Core.PDFNet.SecurityHandler.createDefault();

      // 设置打开文档所需的新密码
      newHandler.changeUserPasswordUString(pwd);
      // 获得newHandler的所有权。
      doc.setSecurityHandler(newHandler);
      const memoryBuffer = await doc.saveMemoryBuffer(
        Core.PDFNet.SDFDoc.SaveOptions.e_linearized,
      );
      return memoryBuffer;
    };

    const docbuf = await Core.PDFNet.runWithCleanup(await setPwd, LICENSE_KEY);

    const newFileName = `${prefix}.pdf`;
    const blob = await Tools.buf2Blob(docbuf);
    const newfile = Tools.blob2File(blob, newFileName);
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  // 修改或者解除密码
  static async decrypt(
    instance: WebViewerInstance,
    file: UploadFile,
    pwd: string,
    newPwd: string = '',
  ) {
    const { Core } = instance!;
    const { prefix } = Tools.fileMsg(file);

    const resetPwd = async () => {
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const success = await doc.initStdSecurityHandlerUString(pwd);
      if (success) {
        await doc.lock();
        const newHandler = await Core.PDFNet.SecurityHandler.createDefault();
        if (newPwd) {
          newHandler.changeUserPasswordUString(newPwd);
          // Set Permissions
          newHandler.setPermission(
            Core.PDFNet.SecurityHandler.Permission.e_print,
            false,
          );
          newHandler.setPermission(
            Core.PDFNet.SecurityHandler.Permission.e_extract_content,
            true,
          );
          // Note: document takes the ownership of newHandler.
          doc.setSecurityHandler(newHandler);
        } else {
          await doc.removeSecurity();
        }

        const memoryBuffer = await doc.saveMemoryBuffer(
          Core.PDFNet.SDFDoc.SaveOptions.e_linearized,
        );
        return memoryBuffer;
      }
    };

    const docbuf = await Core.PDFNet.runWithCleanup(
      await resetPwd,
      LICENSE_KEY,
    );

    const newFileName = `${prefix}.pdf`;
    const blob = await Tools.buf2Blob(docbuf);
    const newfile = Tools.blob2File(blob, newFileName);
    return [{ file, newfile, newFileName, newFileBlob: blob }];
  }

  /**
   * 判断文档是否有密码
   * @param instance
   * @param file
   * @returns
   */
  static async hasPassword(instance: WebViewerInstance, file: UploadFile) {
    const { Core } = instance;
    const main = async (): Promise<boolean> => {
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      return await doc.isEncrypted();
    };
    const isEncrypted: boolean = await Core.PDFNet.runWithCleanup(
      await main,
      LICENSE_KEY,
    );
    return isEncrypted;
  }

  /**
   * 判断文档是否为空
   * @param instance
   * @param file
   * @returns
   */
  static async isBlank(instance: WebViewerInstance, file: UploadFile) {
    const { Core } = instance;
    // return new Pormise()
    const main = async (): Promise<boolean> => {
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      console.log(await doc.getPageCount());
      return !(await doc.getPageCount());
    };
    const isBlank: boolean = await Core.PDFNet.runWithCleanup(
      await main,
      LICENSE_KEY,
    );
    return isBlank;
  }

  static async correctPassword(
    instance: WebViewerInstance,
    file: UploadFile,
    pwd: string,
  ) {
    const { Core } = instance;
    // return new Pormise()
    const main = async (): Promise<boolean> => {
      const buf = await Tools.file2Buf(file as any as File);
      const doc = await Core.PDFNet.PDFDoc.createFromBuffer(buf);
      const success = await doc.initStdSecurityHandlerUString(pwd);
      return success;
    };
    const pass: boolean = await Core.PDFNet.runWithCleanup(
      await main,
      LICENSE_KEY,
    );
    return pass;
  }

  // 下载文件
  static async download(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }

  // 下载zip
  static async downloadZip(list: ConvertFile[]) {
    // 只有1个文件直接下载文件
    if (list.length > 1) {
      const zip = new JSZip();
      forEach(list, (data) => {
        zip.file(data.newFileName, data.newfile);
      });
      const pack = await zip.generateAsync({
        type: 'blob',
      });
      saveAs(pack, 'pdf_edit_all.zip');
    } else if (list.length === 1) {
      const file = list[0];
      this.download(file.newfile, file.newFileName);
    }
  }
}
