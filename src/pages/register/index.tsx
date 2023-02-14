// import { Form, Input, Button } from 'antd';
import { Link } from '@umijs/max';
import RegistryForm from '@/components/RegistryForm';
import Feature from '@/components/Feature';

const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[450px] m-auto">
        <Feature />
        <div className="mb-24"></div>
        <RegistryForm />
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
