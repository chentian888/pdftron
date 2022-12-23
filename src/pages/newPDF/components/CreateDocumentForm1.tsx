import React from 'react';
import { Form, Input, Button, Radio, Col, Row } from 'antd';

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
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="纸的类型" name="username">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="页面大小" name="username">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="页面方向" name="username">
            <Radio.Group>
              <Radio value="optional">头像</Radio>
              <Radio value>打印格式</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="页数" name="username">
            <Input />
          </Form.Item>
        </Col>
      </Row>
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
