import { nth, split } from 'lodash-es';
import type { UploadFile } from 'antd/es/upload/interface';
// import { ConvertFile } from '@/types/typings';

export default class Tools {
  // static *sequence(
  //   arr: UploadFile[],
  //   task: (f: UploadFile) => Promise<ConvertFile>,
  // ) {
  //   for (let i = 0; i < arr.length; i++) {
  //     yield task(arr[i]);
  //   }
  // }

  static runSequence<T = ConvertFile>(fn: Generator<Promise<T>>): Promise<T[]> {
    return new Promise((resolve) => {
      const g = fn;
      const arr: T[] = [];
      function next(preData?: T) {
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
          result.value.then((nowData: T) => {
            next(nowData);
          });
        }
      }
      next();
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

  static fileMsg(file: UploadFile) {
    const splitFile = split(file.name, '.');
    const prefix = nth(splitFile, 0);
    const suffix = nth(splitFile, 1);
    return { prefix, suffix };
  }

  static async openInNewTab(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  static isImg(): boolean {
    return false;
  }

  static isPdf(): boolean {
    return false;
  }

  static isOffice(): boolean {
    return false;
  }
}
