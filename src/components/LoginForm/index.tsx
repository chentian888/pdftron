import React from 'react';
import { Button, Form, Input } from 'antd';
import { useModel } from '@umijs/max';

import { login } from '@/services/user';
import './index.less';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { setShowLoginModal } = useModel('user');

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };
  const toLogin = (values: any) => {
    form.validateFields().then(async (values) => {
      const { userName, password } = values;
      await login({ userName, password });
      setShowLoginModal(false);
    });
    console.log('Success:', values);
  };

  return (
    <Form
      className="login-form"
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={toLogin}
    >
      <Form.Item name="userName">
        <Input
          placeholder="请输入登录邮箱"
          prefix={
            <div className="w-[18px] h-[22px]">
              <img
                className="max-w-full"
                src={require('./img/icon-user.png')}
                alt=""
              />
            </div>
          }
        />
      </Form.Item>
      <Form.Item name="password">
        <Input
          placeholder="请输入登录密码"
          prefix={
            <div className="w-[18px] h-[22px]">
              <img
                className="max-w-full"
                src={require('./img/icon-pwd.png')}
                alt=""
              />
            </div>
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" size="large" block htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
