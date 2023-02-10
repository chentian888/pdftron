import { Skeleton } from 'antd';

const LoadingThumbnail: React.FC = () => {
  return (
    <div className="border border-solid border-gray-300 bg-white w-3/4 h-full p-4">
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </div>
  );
};

export default LoadingThumbnail;
