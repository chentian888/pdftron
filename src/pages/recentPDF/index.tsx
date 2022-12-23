import React from 'react';
import { CloseSquareFilled } from '@ant-design/icons';
import './index.less';

const RecentPDF: React.FC = () => {
  return (
    <div className="pdf-recent">
      <div className="recent-docment">
        <CloseSquareFilled
          className="icon-remove"
          style={{ fontSize: '24px' }}
        />
        <div className="document-thumb"></div>
        <div className="document-name">字典配置</div>
      </div>
    </div>
  );
};

export default RecentPDF;
