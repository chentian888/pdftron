import React from 'react';
import { Col, Row } from 'antd';
import { NavLink, useIntl } from '@umijs/max';

const ConvertToPDF: React.FC = () => {
  const intl = useIntl();

  const columns = [
    { text: 'BMP至PDF', langId: 'bmp2pdf', img: 'icon-img-to-pdf', to: '' },
    { text: 'JPG至PDF', langId: 'jpg2pdf', img: 'icon-img-to-pdf', to: '' },
    { text: 'PNG至PDF', langId: 'png2pdf', img: 'icon-img-to-pdf', to: '' },
    { text: 'TIFF至PDF', langId: 'tiff2pdf', img: 'icon-img-to-pdf', to: '' },
    {
      text: 'Excel至PDF',
      langId: 'excel2pdf',
      img: 'icon-excel-to-pdf',
      to: '',
    },
    {
      text: 'PowerPoint至PDF',
      langId: 'ppt2pdf',
      img: 'icon-ppt-to-pdf',
      to: '',
    },
    { text: 'Word至PDF', langId: 'word2pdf', img: 'icon-word-to-pdf', to: '' },
    { text: '文本至PDF', langId: 'text2pdf', img: 'icon-text-to-pdf', to: '' },
    { text: 'HTML至PDF', langId: 'html2pdf', img: 'icon-html-to-pdf', to: '' },
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

export default ConvertToPDF;
