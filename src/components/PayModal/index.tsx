import React, { useEffect, useState } from 'react';
import { Modal, Col, Row, Radio, Button } from 'antd';
import {
  useModel,
  useAccess,
  Access,
  FormattedMessage,
  useIntl,
} from '@umijs/max';
import { CheckSquareTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { vipList, paypal, alipay } from '@/services/user';

import './index.less';

const LoginModal: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const { showVipModal, setShowLoginModal, setShowVipModal, getUserVipInfo } =
    useModel('user');
  const [value, setValue] = useState<number>();
  const [vips, setVips] = useState<API.VipRes[]>([]);
  const [price, setPrice] = useState<API.VipRes>();
  const [loading, setLoading] = useState<boolean>(false);

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

  // 选择商品
  const checkPrice = (ele: API.VipRes) => {
    setPrice(ele);
  };

  // 商品列表
  const getVipList = async () => {
    const { data = [] } = await vipList();
    setVips(data);
  };

  useEffect(() => {
    if (showVipModal) {
      getVipList();
    }
  }, [showVipModal]);

  // 去支付
  const toPay = async () => {
    setLoading(true);
    try {
      setLoading(true);
      if (value === 1) {
        const data = await alipay(price!.id);
        window.open(data);
      } else {
        const { data } = await paypal(price!.id);
        window.open(data.approve);
      }
      setLoading(false);
      handleCancel();
      Modal.info({
        title: '支付结果',
        icon: <CheckSquareTwoTone />,
        content: '您是否已经完成了支付',
        okText: '我已经完成支付',
        async onOk() {
          await getUserVipInfo();
        },
      });
    } catch (e) {}
  };

  // 套餐类型
  const renderVip = () => {
    return (
      vips.length &&
      vips.map((ele) => {
        return (
          <div
            className={`vip-item cursor-pointer border border-solid  ${
              ele.id === price?.id ? 'border-purple-600' : 'border-gray-200'
            }`}
            key={ele.id}
            onClick={() => checkPrice(ele)}
          >
            <div className="month">{ele.describes}</div>
            <div className="price">￥{ele.totalPrice}</div>
            <div className="old-price">￥{ele.originalPrice}</div>
          </div>
        );
      })
    );
  };

  const pays = [
    {
      text: intl.formatMessage({ id: 'alipay' }),
      icon: 'icon-alipay',
      value: 1,
    },
    {
      text: intl.formatMessage({ id: 'paypal' }),
      icon: 'icon-paypal',
      value: 2,
    },
  ];

  // 支付方式
  const renderPays = () => {
    return (
      <Radio.Group className="w-full" onChange={onChange} value={value}>
        {pays.map((ele, index) => {
          return (
            <div className="pay-item" key={index}>
              <Radio
                className="w-full flex items-center justify-end flex-row-reverse"
                value={ele.value}
              >
                <div className="text text-lg">
                  <img
                    className={ele.icon}
                    src={require(`./img/${ele.icon}.png`)}
                    alt=""
                  />
                  {ele.text}
                </div>
              </Radio>
            </div>
          );
        })}
      </Radio.Group>
    );
  };

  const toLogin = () => {
    handleCancel();
    setShowLoginModal(true);
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
              <div className="pay-card-title">
                <FormattedMessage id="vipTitle" />
              </div>
              <div className="vip-box">{renderVip()}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="pay-list">
              <div className="pay-card-title">
                <FormattedMessage id="payTitle" />
              </div>
              {renderPays()}
              <Access
                accessible={!access.isVisitor}
                fallback={
                  <Button
                    className="pay-btn"
                    type="primary"
                    block
                    size="large"
                    onClick={toLogin}
                  >
                    <FormattedMessage id="loginBtn" />
                  </Button>
                }
              >
                <Button
                  className="pay-btn"
                  type="primary"
                  block
                  disabled={!price?.id || !value}
                  loading={loading}
                  size="large"
                  onClick={toPay}
                >
                  <FormattedMessage id="payBtn" />
                </Button>
              </Access>
            </div>
            <div className="pay-tips">
              <div className="pay-card-title">
                <FormattedMessage id="tipsTitle" />
              </div>
              <div>
                <FormattedMessage id="tipsDesc" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default LoginModal;
