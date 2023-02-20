import { Button, Result } from 'antd';
import { useNavigate } from '@umijs/max';
const Forbid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="功能暂未开放"
      subTitle="抱歉，改功能正在紧急开发中。可尝试在其他端使用此功能"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
};
export default Forbid;
