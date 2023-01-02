import React from 'react';
import { Col, Row, Upload } from 'antd';
import { useIntl } from '@umijs/max';

const ConvertToPDF: React.FC = () => {
  const intl = useIntl();

  const columns = [
    {
      text: 'BMP至PDF',
      langId: 'bmp2pdf',
      img: 'icon-img-to-pdf',
      props: { accept: '.bmp' },
    },
    {
      text: 'JPG至PDF',
      langId: 'jpg2pdf',
      img: 'icon-img-to-pdf',
      props: { accept: '.jpg,.jpeg' },
    },
    {
      text: 'PNG至PDF',
      langId: 'png2pdf',
      img: 'icon-img-to-pdf',
      props: { accept: '.png' },
    },
    {
      text: 'TIFF至PDF',
      langId: 'tiff2pdf',
      img: 'icon-img-to-pdf',
      props: { accept: '.tiff' },
    },
    {
      text: 'Excel至PDF',
      langId: 'excel2pdf',
      img: 'icon-excel-to-pdf',
      props: { accept: '.excel' },
    },
    {
      text: 'PowerPoint至PDF',
      langId: 'ppt2pdf',
      img: 'icon-ppt-to-pdf',
      props: { accept: '.ppt' },
    },
    {
      text: 'Word至PDF',
      langId: 'word2pdf',
      img: 'icon-word-to-pdf',
      props: { accept: '.doc,.docx' },
    },
    {
      text: '文本至PDF',
      langId: 'text2pdf',
      img: 'icon-text-to-pdf',
      props: { accept: '.text' },
    },
    {
      text: 'HTML至PDF',
      langId: 'html2pdf',
      img: 'icon-html-to-pdf',
      props: { accept: '.html' },
    },
  ];
  return (
    <Row gutter={[16, 16]} align="middle">
      {columns.map((ele, index) => (
        <Col key={index} span={4}>
          <Upload {...ele.props} className="pdf-func-col">
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

export default ConvertToPDF;
