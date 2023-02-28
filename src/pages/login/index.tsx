import { Link } from '@umijs/max';
import LoginForm from '@/components/LoginForm';
import Feature from '@/components/Feature';

const Login: React.FC = () => {
  return (
    <div
      className=" w-full h-full bg-cover py-20 px-40 flex justify-end items-center"
      style={{ backgroundImage: `url(${require('./img/bg-login.png')})` }}
    >
      <div className="w-[450px]">
        <Feature />
        <div className="mb-24"></div>
        <div>
          <LoginForm redirect={'/'} />
          <div className="flex justify-between px-5">
            <Link className="no-underline text-black" to="/register">
              去注册
            </Link>
            <Link className="no-underline text-black" to="/forget">
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
