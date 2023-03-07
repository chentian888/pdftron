import React from 'react';
import { Button, Avatar, Breadcrumb, Modal, Space, Tag, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useModel, useNavigate, Helmet } from '@umijs/max';
import LoginModal from '@/components/LoginModal';
import PayModal from '@/components/PayModal';
import Cache from '@/utils/cache';

interface Props {
  block?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { block = false } = props;
  const navigate = useNavigate();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { setShowLoginModal, setShowVipModal } = useModel('user');
  const { bread, sysMsg } = useModel('global');

  const SupportFile = () => {
    const fileList = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.md',
      '.xod',
    ];
    return (
      <Space size={[0, 8]} wrap>
        {fileList.map((ele, index) => (
          <Tag key={index} color="success">
            {ele}
          </Tag>
        ))}
      </Space>
    );
  };
  const handleLogoClick = () => {
    navigate('/');
  };
  const viewSupported = (e: React.MouseEvent) => {
    e.preventDefault();
    Modal.info({
      title: 'PDF Edit All 支持以下格式文件',
      content: <SupportFile />,
      onOk() {},
    });
  };

  const logout = () => {
    Cache.clearCookie();
    setInitialState({});
    window.location.reload();
  };

  const avatarContent = () => {
    const nickName = (
      initialState?.nickName ? initialState.nickName : initialState?.userName
    ) as string;
    const userName = (initialState?.userName || '') as string;
    const expirationTime = (initialState?.expirationTime || '') as string;

    return (
      <>
        <div className="w-[270px]">
          <div className="flex justify-between pb-3">
            <div className="font-bold text-black">昵称</div>
            <div className="text-gray-500">{nickName}</div>
          </div>
          <div className="flex justify-between pb-3">
            <div className="font-bold text-black">邮箱</div>
            <div className="text-gray-500">{userName}</div>
          </div>
          <div className="flex justify-between pb-3">
            <div className="font-bold text-black">会员状态</div>
            <div className="text-gray-500">
              {initialState?.vip === '1' ? '已开通' : '未开通'}
            </div>
          </div>
          <div className="flex justify-between pb-3">
            <div className="font-bold text-black">到期时间</div>
            <div className="text-gray-500">{expirationTime}</div>
          </div>
          <Button type="primary" block onClick={logout}>
            退出登录
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{sysMsg.web_title as string}</title>
        <meta name="description" content={sysMsg.web_content as string} />
        <meta name="keywords" content={sysMsg.web_gjc as string} />
      </Helmet>
      <div className={`h-[101px]  ${block ? 'bg-white' : ''}`}>
        <LoginModal />
        <PayModal />
        <div
          className={`${
            block ? 'w-11/12' : 'w-1200'
          } m-auto h-full flex justify-between items-center`}
        >
          <div className="text-lg h-full">
            <div className=" text-black no-underline text-lg flex justify-start items-center h-full cursor-pointer">
              <div
                className="flex justify-start items-center cursor-pointer"
                onClick={handleLogoClick}
              >
                <img className="block w-[50px]" src="/logo.png" alt="" />
                PDF Edit All
              </div>

              <span
                className="text-xs text-gray-500 ml-4"
                onClick={(e) => viewSupported(e)}
              >
                *支持的格式
              </span>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Link to="/" className="px-8 text-black no-underline text-lg">
              首页
            </Link>
            <div
              onClick={() => setShowVipModal(true)}
              className="px-8 text-black no-underline text-lg cursor-pointer"
            >
              购买
            </div>
            {initialState?.id ? (
              <Popover placement="bottomRight" content={() => avatarContent()}>
                <Avatar
                  style={{
                    backgroundColor: '#f56a00',
                    verticalAlign: 'middle',
                  }}
                  size="large"
                  icon={<UserOutlined />}
                ></Avatar>
              </Popover>
            ) : (
              <Button type="primary" onClick={() => setShowLoginModal(true)}>
                登录/注册
              </Button>
            )}
          </div>
        </div>
      </div>
      {bread.length ? (
        <div className="bg-white">
          <div className="w-1200 m-auto mb-3">
            <Breadcrumb>
              {bread.map((b, index) => {
                return (
                  <Breadcrumb.Item key={index}>
                    {b.link ? (
                      <Link to={b.link}>{b.title}</Link>
                    ) : (
                      <span>{b.title}</span>
                    )}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Header;
