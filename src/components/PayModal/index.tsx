import React, { useState } from 'react';
import { Modal, Col, Row, Radio, Button } from 'antd';
import { useModel } from '@umijs/max';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

import './index.less';

const LoginModal: React.FC = () => {
  const { showVipModal, setShowVipModal } = useModel('user');
  const [value, setValue] = useState(1);

  const handleOk = () => {
    setShowVipModal(false);
  };

  const handleCancel = () => {
    setShowVipModal(false);
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const vips = [
    { month: '3个月', price: '99.9', oldPrice: '199.9' },
    { month: '6个月', price: '99.9', oldPrice: '199.9' },
    { month: '9个月', price: '99.9', oldPrice: '199.9' },
    { month: '12个月', price: '99.9', oldPrice: '199.9' },
  ];

  // 套餐类型
  const renderVip = () => {
    return vips.map((ele, index) => {
      return (
        <div className="vip-item" key={index}>
          <div className="month">{ele.month}</div>
          <div className="price">￥{ele.price}</div>
          <div className="old-price">￥{ele.oldPrice}</div>
        </div>
      );
    });
  };

  const pays = [
    { text: '支付宝支付', icon: 'icon-alipay', value: 1 },
    { text: 'paypal支付', icon: 'icon-paypal', value: 2 },
  ];

  // 支付方式
  const renderPays = () => {
    return (
      <Radio.Group className="w-full" onChange={onChange} value={value}>
        {pays.map((ele, index) => {
          return (
            <div className="pay-item" key={index}>
              <div className="text text-lg">
                <img
                  className={ele.icon}
                  src={require(`./img/${ele.icon}.png`)}
                  alt=""
                />
                {ele.text}
              </div>
              <div className="radio">
                <Radio value={ele.value}></Radio>
              </div>
            </div>
          );
        })}
      </Radio.Group>
    );
  };
  return (
    <Modal
      className="pay-modal"
      open={showVipModal}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      width={940}
    >
      <div className="pay-modal-content">
        <Row>
          <Col span={12}>
            <div className="vip-card">
              <div className="pay-card-title">套餐选择</div>
              <div className="vip-box">{renderVip()}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="pay-list">
              <div className="pay-card-title">支付方式选择</div>
              {renderPays()}
              <Button className="pay-btn" type="primary" block size="large">
                立即支付
              </Button>
            </div>
            <div className="pay-tips">
              <div className="pay-card-title">温馨提示</div>
              <div>
                扫码支付成功后、系统将自动关闭该页面。如遇订单问题请联系客服QQ：347126478164178。感谢您的支持与信任。
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default LoginModal;
