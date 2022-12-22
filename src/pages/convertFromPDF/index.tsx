import React from 'react';
import { Col, Row } from 'antd';
import { NavLink, useIntl } from '@umijs/max';

const ConvertFromPDF: React.FC = () => {
  const intl = useIntl();
  const columns = [
    { text: 'PDF至BMP', langId: 'pdf2bmp', img: 'icon-convert-img', to: '' },
    { text: 'PDF至JPG', langId: 'pdf2jpg', img: 'icon-convert-img', to: '' },
    { text: 'PDF至PNG', langId: 'pdf2png', img: 'icon-convert-img', to: '' },
    { text: 'PDF至TIFF', langId: 'pdf2tiff', img: 'icon-convert-img', to: '' },
    { text: 'PDF至SVG', langId: 'pdf2svg', img: 'icon-convert-svg', to: '' },
    { text: 'PDF至Word', langId: 'pdf2word', img: 'icon-convert-word', to: '' },
    {
      text: 'PDF至Excel',
      langId: 'pdf2excel',
      img: 'icon-convert-excel',
      to: '',
    },
    {
      text: 'PDF至PowerPoint',
      langId: 'pdf2ppt',
      img: 'icon-convert-ppt',
      to: '',
    },
    { text: 'PDF至HTML', langId: 'pdf2html', img: 'icon-convert-html', to: '' },
    {
      text: 'PDF至PDF/A',
      langId: 'pdf2pdfa',
      img: 'icon-convert-pdfa',
      to: '',
    },
  ];
  return (
    <Row gutter={[16, 16]} align="middle">
      {columns.map((ele, index) => (
        <Col key={index} span={4}>
          <NavLink to={ele.to} className="pdf-func-col">
            <img
              className="icon"
              src={require(`./img/${ele.img}.png`)}
              alt=""
            />
            <div className="text">{intl.formatMessage({ id: ele.langId })}</div>
          </NavLink>
        </Col>
      ))}
    </Row>
  );
};

export default ConvertFromPDF;
