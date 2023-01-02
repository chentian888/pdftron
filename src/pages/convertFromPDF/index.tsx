import React from 'react';
import { Col, Row, Upload } from 'antd';
import { useIntl } from '@umijs/max';

const ConvertFromPDF: React.FC = () => {
  const intl = useIntl();
  const columns = [
    { text: 'PDF至BMP', langId: 'pdf2bmp', img: 'icon-convert-img' },
    { text: 'PDF至JPG', langId: 'pdf2jpg', img: 'icon-convert-img' },
    { text: 'PDF至PNG', langId: 'pdf2png', img: 'icon-convert-img' },
    { text: 'PDF至TIFF', langId: 'pdf2tiff', img: 'icon-convert-img' },
    { text: 'PDF至SVG', langId: 'pdf2svg', img: 'icon-convert-svg' },
    { text: 'PDF至Word', langId: 'pdf2word', img: 'icon-convert-word' },
    {
      text: 'PDF至Excel',
      langId: 'pdf2excel',
      img: 'icon-convert-excel',
    },
    {
      text: 'PDF至PowerPoint',
      langId: 'pdf2ppt',
      img: 'icon-convert-ppt',
    },
    { text: 'PDF至HTML', langId: 'pdf2html', img: 'icon-convert-html' },
    {
      text: 'PDF至PDF/A',
      langId: 'pdf2pdfa',
      img: 'icon-convert-pdfa',
    },
  ];
  return (
    <Row gutter={[16, 16]} align="middle">
      {columns.map((ele, index) => (
        <Col key={index} span={4}>
          <Upload accept=".pdf" className="pdf-func-col">
            <img
              className="icon"
              src={require(`./img/${ele.img}.png`)}
              alt=""
            />
            <div className="text">{intl.formatMessage({ id: ele.langId })}</div>
          </Upload>
        </Col>
      ))}
    </Row>
  );
};

export default ConvertFromPDF;
