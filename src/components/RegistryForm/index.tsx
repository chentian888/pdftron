import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useModel, useNavigate, FormattedMessage, useIntl } from '@umijs/max';
import useCountDown from '@/hooks/useCountDown';

import { sendEmailCode } from '@/services/user';
import './index.less';

interface Props {
  type?: string;
  redirect?: string;
}

const RegistryForm: React.FC<Props> = (props) => {
  const { type = '1', redirect = '' } = props;
  const intl = useIntl();
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
          {
            required: true,
            message: intl.formatMessage({ id: 'registryEmail' }),
          },
          {
            type: 'email',
            message: intl.formatMessage({ id: 'loginEmailFormat' }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: 'registryEmail' })} />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'registryCode' }),
          },
          {
            min: 6,
            max: 6,
            message: intl.formatMessage({ id: 'registryCodeFormat' }),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({ id: 'registryCode' })}
          suffix={
            <Button
              shape="round"
              size="large"
              type="primary"
              disabled={!sendable}
              onClick={sendCode}
            >
              {sendable ? <FormattedMessage id="sendCode" /> : count + 's'}
            </Button>
          }
        ></Input>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'registryPwd' }),
          },
          {
            min: 6,
            max: 12,
            message: intl.formatMessage({ id: 'registryPwdFormat' }),
          },
        ]}
      >
        <Input
          type="password"
          placeholder={intl.formatMessage({ id: 'registryPwd' })}
        />
      </Form.Item>
      <Form.Item
        name="password2"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'registryPwdConfirm' }),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(intl.formatMessage({ id: 'registryPwdNoEqual' })),
              );
            },
          }),
        ]}
      >
        <Input
          type="password"
          placeholder={intl.formatMessage({ id: 'registryPwdConfirm' })}
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
          {type === '1' ? (
            <FormattedMessage id="registryBtn" />
          ) : (
            <FormattedMessage id="resetPwdBtn" />
          )}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistryForm;
