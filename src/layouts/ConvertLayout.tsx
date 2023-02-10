import { Outlet } from '@umijs/max';
import Header from '@/components/Header';

const ConvertLayout: React.FC = () => {
  return (
    <div className="h-full min-h-full flex flex-col">
      <Header />
      <div className="w-1200 m-auto h-full pb-12">
        <div className="pdf-drag-box min-h-full relative bg-[#f2f3f6] p-12 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ConvertLayout;
