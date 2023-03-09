import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useModel, useNavigate, FormattedMessage, useIntl } from '@umijs/max';
import './index.less';

interface Props {
  redirect?: string;
}

const LoginForm: React.FC<Props> = (props) => {
  const { redirect = '' } = props;
  const intl = useIntl();
  const navigate = useNavigate();
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
      try {
        const { userName, password } = values;
        const data = await userLogin({ userName, password });
        form.resetFields();
        setLoading(false);
        if (data && redirect) {
          navigate(redirect, { replace: true });
        } else if (data) {
          setShowLoginModal(false);
        }
      } catch (e) {
        console.log(e);
      }
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
          { required: true, message: intl.formatMessage({ id: 'loginEmail' }) },
          {
            type: 'email',
            message: intl.formatMessage({ id: 'loginEmailFormat' }),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({ id: 'loginEmail' })}
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
          { required: true, message: intl.formatMessage({ id: 'loginPwd' }) },
          {
            min: 6,
            max: 12,
            message: intl.formatMessage({ id: 'loginPwdFormat' }),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({ id: 'loginPwd' })}
          type="password"
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
          <FormattedMessage id="loginBtn" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
