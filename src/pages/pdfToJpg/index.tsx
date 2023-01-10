import { Upload, Row, Col, Button } from 'antd';
import DragedFile from '@/components/DragedFile';

const PdfToJpg: React.FC = () => {
  return (
    <div className="pdf-to-jpg">
      <div className="layout pdf-convert">
        <div className="pdf-drag-box">
          <Upload>
            <Row gutter={16}>
              <Col span={4}>
                <DragedFile />
              </Col>
              <Col span={4}>
                <div className="draged-action">添加更多文件</div>
              </Col>
            </Row>
          </Upload>
          <div className="file-action">
            <Button type="primary">转换</Button>
            <Button type="primary">全部下载</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToJpg;
