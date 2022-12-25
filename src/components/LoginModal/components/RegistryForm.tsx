import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel } from '@umijs/max';

import { sendEmailCode, register } from '@/services/user';
interface Props {
  changeType: () => any;
}

const RegistryForm: React.FC<Props> = (props) => {
  const { changeType } = props;
  const [form] = Form.useForm();
  const { setShowLoginModal } = useModel('user');

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

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const sendCode = () => {
    form.validateFields(['email']).then(async (values) => {
      await sendEmailCode({ email: values.email, subject: '测试注册验证码' });
      message.success('验证码发送成功');
    });
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={regsitry}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      colon={false}
      labelAlign="left"
      requiredMark={false}
    >
      <Form.Item
        label="邮箱账号"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder="请输入邮箱账号" />
      </Form.Item>
      <Form.Item label="验证码" name="code">
        <Input
          placeholder="请输入验证码"
          suffix={
            <Button
              type="primary"
              shape="round"
              size="small"
              onClick={() => sendCode()}
            >
              获取验证码
            </Button>
          }
        />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <div className="login-switch" onClick={() => changeType()}>
        登录
      </div>
      <Button
        className="submit-btn"
        type="primary"
        size="large"
        block
        htmlType="submit"
      >
        注册
      </Button>
    </Form>
  );
};

export default RegistryForm;
