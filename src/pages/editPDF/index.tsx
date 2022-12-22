import React from 'react';
import { Col, Row } from 'antd';
import { NavLink, useIntl } from '@umijs/max';

const EditPDF: React.FC = () => {
  const intl = useIntl();
  const columns = [
    {
      text: 'PDF替换图片',
      langId: 'pdfReplaceImg',
      img: 'icon-replace-img',
      to: '',
    },
    {
      text: 'PDF替换文字',
      langId: 'pdfReplaceText',
      img: 'icon-replace-text',
      to: '',
    },
    { text: 'PDF拆分', langId: 'pdfSplit', img: 'icon-split', to: '' },
    { text: 'PDF合并', langId: 'pdfConcat', img: 'icon-concat', to: '' },
    {
      text: 'PDF提取文字',
      langId: 'pdfFilterText',
      img: 'icon-replace-text',
      to: '',
    },
    {
      text: 'PDF提取图片',
      langId: 'pdfFilterImg',
      img: 'icon-replace-img',
      to: '',
    },
    { text: 'PDF加密解密', langId: 'pdfEncrypt', img: 'icon-encrypt', to: '' },
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

export default EditPDF;
