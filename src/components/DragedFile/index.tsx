import { Checkbox, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

import './index.less';

const DragedFile: React.FC = () => {
  return (
    <>
      <div className="draged-file">
        <div className="draged-file-thumb"></div>
        <div className="draged-file-info">
          <div className="file-name">nbavipstar.com.certificate.jpg</div>
        </div>
        <div className="file-pages">10 pages</div>
        <Checkbox
          style={{ fontSize: '19px', color: '#6478B3' }}
          className="file-pick"
        />

        <Tooltip title="预览文件">
          <EyeOutlined
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-preview"
          />
        </Tooltip>

        <Tooltip title="删除文件">
          <DeleteOutlined
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-remove"
          />
        </Tooltip>

        <Tooltip title="替换文件">
          <UploadOutlined
            style={{ fontSize: '19px', color: '#6478B3' }}
            className="file-reload"
          />
        </Tooltip>
      </div>
    </>
  );
};

export default DragedFile;
