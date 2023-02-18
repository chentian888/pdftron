import React, { PropsWithChildren } from 'react';
import { Button } from 'antd';
import { useModel, useAccess, Access } from '@umijs/max';

type Props = PropsWithChildren<{ text?: string }>;

const Header: React.FC<Props> = (props) => {
  const { text = '', children } = props;
  const access = useAccess();
  const { setShowLoginModal, setShowVipModal } = useModel('user');

  const validateUser = () => {
    console.log('isVisitor===', access.isVisitor);
    console.log('isVip===', access.isVip);
    // 游客需要登录
    if (access.isVisitor) {
      setShowLoginModal(true);
      return;
    }

    // 非会员需要充值
    if (!access.isVip) {
      setShowVipModal(true);
      return;
    }
  };
  return (
    <Access
      accessible={!access.isVisitor && access.isVip}
      fallback={
        <Button type="primary" size="large" block onClick={validateUser}>
          {text}
        </Button>
      }
    >
      {children}
    </Access>
  );
};

export default Header;
