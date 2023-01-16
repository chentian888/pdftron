import { Outlet } from '@umijs/max';

const ConvertLayout: React.FC = () => {
  return (
    <div className="pdf-to-jpg">
      <div className="layout pdf-convert">
        <div className="pdf-drag-box">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ConvertLayout;
