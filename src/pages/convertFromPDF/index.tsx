import React from 'react';
import { Col, Row } from 'antd';
import { NavLink } from '@umijs/max';

const ConvertFromPDF: React.FC = () => {
  const columns = [
    { text: 'PDF至BMP', img: 'icon-convert-img', to: '' },
    { text: 'PDF至JPG', img: 'icon-convert-img', to: '' },
    { text: 'PDF至PNG', img: 'icon-convert-img', to: '' },
    { text: 'PDF至TIFF', img: 'icon-convert-img', to: '' },
    { text: 'PDF至SVG', img: 'icon-convert-svg', to: '' },
    { text: 'PDF至Word', img: 'icon-convert-word', to: '' },
    { text: 'PDF至Excel', img: 'icon-convert-excel', to: '' },
    { text: 'PDF至PowerPoint', img: 'icon-convert-ppt', to: '' },
    { text: 'PDF至HTML', img: 'icon-convert-html', to: '' },
    { text: 'PDF至PDF/A', img: 'icon-convert-pdfa', to: '' },
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
            <div className="text">{ele?.text}</div>
          </NavLink>
        </Col>
      ))}
    </Row>
  );
};

export default ConvertFromPDF;
