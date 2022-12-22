import React from 'react';
import { Col, Row } from 'antd';
import { NavLink } from '@umijs/max';

const EditPDF: React.FC = () => {
  const columns = [
    { text: 'PDF替换图片', img: 'icon-replace-img', to: '' },
    { text: 'PDF替换文字', img: 'icon-replace-text', to: '' },
    { text: 'PDF拆分', img: 'icon-split', to: '' },
    { text: 'PDF合并', img: 'icon-concat', to: '' },
    { text: 'PDF提取文字', img: 'icon-replace-text', to: '' },
    { text: 'PDF提取图片', img: 'icon-replace-img', to: '' },
    { text: 'PDF加密解密', img: 'icon-encrypt', to: '' },
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

export default EditPDF;
