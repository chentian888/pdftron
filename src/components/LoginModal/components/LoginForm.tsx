import React from 'react';
import { Button, Form, Input } from 'antd';
import { useModel } from '@umijs/max';

import { login } from '@/services/user';

interface Props {
  changeType: () => any;
}

const LoginForm: React.FC<Props> = (props) => {
  const { changeType } = props;
  const [form] = Form.useForm();
  const { setShowLoginModal } = useModel('user');

  const toLogin = (values: any) => {
    form.validateFields().then(async (values) => {
      const { userName, password } = values;
      await login({ userName, password });
      setShowLoginModal(false);
    });
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={toLogin}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      colon={false}
      labelAlign="left"
    >
      <Form.Item label="邮箱账号" name="userName">
        <Input placeholder="请输入邮箱账号" />
      </Form.Item>

      <Form.Item label="登录密码" name="password">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <div className="login-desc">
        <div className="forget">忘记密码</div>
        <div className="registry-switch" onClick={() => changeType()}>
          注册
        </div>
      </div>

      <Button
        className="submit-btn"
        type="primary"
        size="large"
        block
        htmlType="submit"
      >
        登录
      </Button>
    </Form>
  );
};
export default LoginForm;
