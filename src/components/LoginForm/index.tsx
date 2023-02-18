import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useModel } from '@umijs/max';
import './index.less';

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { userLogin, setShowLoginModal } = useModel('user');
  const [loading, setLoading] = useState<boolean>(false);

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };
  const toLogin = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const { userName, password } = values;
      const data = await userLogin({ userName, password });
      console.log(data);
      form.resetFields();
      setLoading(false);
      setShowLoginModal(false);
    });
  };

  return (
    <Form
      className="login-form"
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={toLogin}
    >
      <Form.Item
        name="userName"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确邮箱' },
        ]}
      >
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
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, max: 12, message: '密码最短6位最长12位' },
        ]}
      >
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
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          htmlType="submit"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
