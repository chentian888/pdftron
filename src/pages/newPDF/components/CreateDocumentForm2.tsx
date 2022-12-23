import React from 'react';
import { Form, Input, Button, Space, Col, Row, Image } from 'antd';

const CreateDocumentForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="文档标题" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="上传文件" name="username">
        <Row gutter={30}>
          <Col span={16}>
            <Space style={{ width: '100%' }} direction="vertical">
              <Button block>上传图片</Button>
              <Button block>拍照</Button>
              <div>仅支持jpg、png和gif等图像文件。</div>
            </Space>
          </Col>
          <Col span={8}>
            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
          </Col>
        </Row>
      </Form.Item>

      <Row className="create-action" gutter={30}>
        <Col span={12}>
          <Button block size="large">
            取消
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" size="large" block htmlType="submit">
            创建PDF
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateDocumentForm;
