import type { UploadFile } from 'antd/es/upload/interface';
import { ConvertFile } from '@/types/typings.d';

export default class Tools {
  static *sequence(
    arr: UploadFile[],
    task: (f: UploadFile) => Promise<ConvertFile>,
  ) {
    for (let i = 0; i < arr.length; i++) {
      yield task(arr[i]);
    }
  }

  static runSequence(
    fn: Generator<Promise<ConvertFile>>,
  ): Promise<ConvertFile[]> {
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
}
