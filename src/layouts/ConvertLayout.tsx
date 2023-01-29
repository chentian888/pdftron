import { Outlet } from '@umijs/max';

const ConvertLayout: React.FC = () => {
  return (
    <div className="h-full">
      <div className="w-1200 m-auto pdf-convert h-full py-12">
        <div className="pdf-drag-box h-full relative bg-[#f2f3f6] p-12 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ConvertLayout;
