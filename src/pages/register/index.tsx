import { Form, Input, Button } from 'antd';
import { Link } from '@umijs/max';
import './index.less';

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[450px] m-auto">
        <div className="text-2xl flex justify-center items-center font-bold mb-24">
          <img
            className="w-[69px] h-[69px]"
            src={require('/public/logo.png')}
            alt=""
          />
          万能PDF编辑
        </div>
        <Form
          className="register-form"
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="code">
            <Input placeholder="请输入邮箱验证码" />
          </Form.Item>
          <Form.Item name="pwd">
            <Input placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="pwd2">
            <Input placeholder="请再次输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              注册账号
            </Button>
          </Form.Item>
        </Form>
        <Link
          className=" text-center text-black no-underline m-auto block"
          to="/login"
        >
          已有账号，去登录
        </Link>
      </div>
    </div>
  );
};
export default Register;
