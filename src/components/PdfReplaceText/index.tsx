import React from 'react';
import { Input, Button, Row, Col } from 'antd';

const PdfReplaceText: React.FC = () => {
  return (
    <>
      <div className="w-2/6 z-10 relative m-auto">
        <div className="flex justify-center text-xl">PDF加密解密</div>
        <div className="flex justify-between my-6">
          <div className="flex items-center  text-gray-400">
            PDF名称：我的手机
          </div>
          <div>
            <Button type="primary">预览</Button>
          </div>
        </div>
        <div className="text-blue-600">
          一定要是原文档/扫描件等才能使用替换功能。默认是替换文档中的所有同样的词，如果只想改某一个位置
          的词，请带上这个词前后文字一起进行输入替换。
        </div>
      </div>
      <div className="w-6/12 z-10 relative m-auto">
        <Row>
          <Col span={10}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
          <Col span={4}>
            <div>替换</div>
          </Col>
          <Col span={10}>
            <Input size="large" placeholder="输入需要修改的文字" />
          </Col>
        </Row>
      </div>
      <div className="w-2/6 z-10 relative m-auto">
        <Button block size="large" type="primary">
          一键替换
        </Button>
        <div className=" text-blue-400"></div>
      </div>
    </>
  );
};

export default PdfReplaceText;
