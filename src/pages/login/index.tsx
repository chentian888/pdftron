import { Form, Input, Button } from 'antd';
import { Link } from '@umijs/max';
import './index.less';

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div
      className=" w-full h-full bg-cover py-20 px-40 flex justify-end items-center"
      style={{ backgroundImage: `url(${require('./img/bg-login.png')})` }}
    >
      <div className="w-[450px]">
        <div className="text-2xl flex justify-center items-center font-bold mb-24">
          <img
            className="w-[69px] h-[69px]"
            src={require('/public/logo.png')}
            alt=""
          />
          万能PDF编辑
        </div>
        <div>
          <Form
            className="login-form"
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item name="email">
              <Input
                placeholder="请输入邮箱"
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
            <Form.Item name="pwd">
              <Input
                placeholder="请输入密码"
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
          <div className="flex justify-between px-5">
            <Link className="no-underline text-black" to="/register">
              去注册
            </Link>
            <Link className="no-underline text-black" to="/">
              忘记密码
            </Link>
          </div>
          <div className="flex justify-center pt-20">
            注册表示同意
            <Link className="no-underline" to="/">
              《用户协议》
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
