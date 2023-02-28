import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel, useNavigate } from '@umijs/max';
import useCountDown from '@/hooks/useCountDown';

import { sendEmailCode } from '@/services/user';
import './index.less';

interface Props {
  type?: string;
  redirect?: string;
}

const RegistryForm: React.FC<Props> = (props) => {
  const { type = '1', redirect = '' } = props;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { userRegister, userResetPassword, setShowLoginModal } =
    useModel('user');
  const [loading, setLoading] = useState<boolean>(false);

  const { start, count, sendable } = useCountDown();
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const regsitry = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const { email, password, code } = values;
        if (type === '1') {
          await userRegister({
            userName: email,
            password: password,
            code: code,
          });
        } else {
          await userResetPassword({
            userName: email,
            password: password,
            code: code,
          });
        }

        form.resetFields();
        if (redirect) {
          navigate(redirect, { replace: true });
        } else {
          setShowLoginModal(false);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    });
  };

  const sendCode = () => {
    if (sendable) {
      form.validateFields(['email']).then(async (values) => {
        start();
        await sendEmailCode({ email: values.email });
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
      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确邮箱' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[
          { required: true, message: '请输入邮箱验证码' },
          { min: 6, max: 6, message: '邮箱验证码由6位数字组成' },
        ]}
      >
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
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, max: 12, message: '密码最短6位最长12位' },
        ]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item
        name="password2"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入密码不一致'));
            },
          }),
        ]}
      >
        <Input type="password" placeholder="请再次输入密码" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          htmlType="submit"
        >
          {type === '1' ? '注册账号' : '重置密码'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistryForm;
