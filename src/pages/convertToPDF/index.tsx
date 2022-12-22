import React from 'react';
import { Col, Row } from 'antd';
import { NavLink } from '@umijs/max';

const ConvertToPDF: React.FC = () => {
  const columns = [
    { text: 'BMP至PDF', img: 'icon-img-to-pdf', to: '' },
    { text: 'JPG至PDF', img: 'icon-img-to-pdf', to: '' },
    { text: 'PNG至PDF', img: 'icon-img-to-pdf', to: '' },
    { text: 'TIFF至PDF', img: 'icon-img-to-pdf', to: '' },
    { text: 'Excel至PDF', img: 'icon-excel-to-pdf', to: '' },
    { text: 'PowerPoint至PDF', img: 'icon-ppt-to-pdf', to: '' },
    { text: 'Word至PDF', img: 'icon-word-to-pdf', to: '' },
    { text: '文本至PDF', img: 'icon-text-to-pdf', to: '' },
    { text: 'HTML至PDF', img: 'icon-html-to-pdf', to: '' },
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

export default ConvertToPDF;
