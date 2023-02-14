import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from '@umijs/max';
import useCountDown from '@/hooks/useCountDown';

import { sendEmailCode, register } from '@/services/user';
import './index.less';

const RegistryForm: React.FC = () => {
  const [form] = Form.useForm();
  const { setShowLoginModal } = useModel('user');
  const { start, count, sendable } = useCountDown();
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const regsitry = (values: any) => {
    form.validateFields().then(async (values) => {
      const { email, password, code } = values;
      await register({
        userName: email,
        nickName: email,
        password: password,
        code: code,
      });
      setShowLoginModal(false);
    });
    console.log('Success:', values);
  };

  const sendCode = () => {
    if (sendable) {
      start();
      form.validateFields(['email']).then(async (values) => {
        await sendEmailCode({ email: values.email, subject: '测试注册验证码' });
        message.success('验证码发送成功');
      });
    }
  };

  return (
    <Form
      className="register-form"
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={regsitry}
    >
      <Form.Item name="email">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="code">
        <Input
          placeholder="请输入邮箱验证码"
          suffix={
            <Button
              shape="round"
              size="large"
              type="primary"
              disabled={!sendable}
              onClick={sendCode}
            >
              {sendable ? '发送验证码' : count + 's后发送'}
            </Button>
          }
        ></Input>
      </Form.Item>
      <Form.Item name="password">
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item name="password2">
        <Input placeholder="请再次输入密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" size="large" block htmlType="submit">
          注册账号
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistryForm;
