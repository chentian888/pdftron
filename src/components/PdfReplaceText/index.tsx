import React from 'react';
import { Input, Button, Row, Col } from 'antd';
import { useModel } from '@umijs/max';
import Tools from '@/utils/tools';
import { UploadFile } from 'antd/es/upload/interface';

interface Props {
  file: UploadFile;
  loading: boolean;
  remove: () => Promise<void>;
}

const PdfReplaceText: React.FC<Props> = (props) => {
  const { file, remove, loading } = props;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');

  // 预览
  const handlePreview = () => {
    const { UI } = instance!;
    const { prefix, suffix } = Tools.fileMsg(file);
    setShowWebviewer(true);
    setWebviewerTtile(file.name);
    UI.loadDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
  };

  return (
    <>
      <div className="w-2/6 z-10 relative m-auto">
        <div className="flex justify-center text-xl">PDF替换文字</div>
        <div className="flex justify-between my-6">
          <div className="flex items-center  text-gray-400">
            PDF名称：{file.name || ''}
          </div>
          <div>
            <Button type="primary" onClick={handlePreview}>
              预览
            </Button>
          </div>
        </div>
        <div className="text-red-500 mb-7 leading-7">
          一定要是原文档/扫描件等才能使用替换功能。默认是替换文档中的所有同样的词，如果只想改某一个位置
          的词，请带上这个词前后文字一起进行输入替换。
        </div>
      </div>
      <div className="w-6/12 z-10 relative m-auto">
        <Row className="mb-5" justify="center" align="middle">
          <Col span={11}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
          <Col span={2}>
            <div className="text-center">替换</div>
          </Col>
          <Col span={11}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
        </Row>
        <Row className="mb-5" justify="center" align="middle">
          <Col span={11}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
          <Col span={2}>
            <div className=" text-center">替换</div>
          </Col>
          <Col span={11}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
        </Row>
      </div>
      <div className="w-2/6 z-10 relative m-auto">
        <Button
          block
          size="large"
          type="primary"
          loading={loading}
          onClick={remove}
        >
          一键替换
        </Button>
        <div className=" text-blue-400"></div>
      </div>
    </>
  );
};

export default PdfReplaceText;
