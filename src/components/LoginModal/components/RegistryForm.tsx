import React from 'react';
import { Button, Form, Input } from 'antd';

interface Props {
  changeType: () => any;
}

const RegistryForm: React.FC<Props> = (props) => {
  const { changeType } = props;

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      colon={false}
      labelAlign="left"
    >
      <Form.Item label="邮箱账号" name="username">
        <Input placeholder="请输入邮箱账号" />
      </Form.Item>
      <Form.Item label="验证码" name="password">
        <Input placeholder="请输入验证码" />
      </Form.Item>

      <Form.Item label="密码" name="password">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <div className="login-switch" onClick={() => changeType()}>
        登录
      </div>
      <Button type="primary" size="large" block htmlType="submit">
        注册
      </Button>
    </Form>
  );
};

export default RegistryForm;
