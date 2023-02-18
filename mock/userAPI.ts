const userInfo = {
  userId: null,
  vipName: '高级会员',
  expirationTime: '2024-02-24 22:52:35',
  createTime: '2023-02-17 22:52:35',
  updateTime: '2023-02-17 22:52:35',
  vip: true,
};

const queryState = {
  state: 1,
  convertedPaths: ['2023-02-17/1676647255760.docx'],
};

const login = {
  user: {
    id: 3652,
    userName: '646981682@qq.com',
    nickName: null,
    password: '',
    status: '0',
    vip: '0',
    email: null,
    phone: null,
    sex: null,
    avatar: null,
    userType: '1',
    createBy: 1,
    createTime: '2023-02-17T14:24:32.000+00:00',
    updateBy: 1,
    updateTime: '2023-02-17T14:24:32.000+00:00',
    openid: null,
    delFlag: 0,
  },
  permissions: null,
  loginDate: '2023-02-17T14:26:35.708+00:00',
  authorities: null,
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  password: '',
  username: '646981682@qq.com',
};

const vips = [
  {
    id: 20,
    name: '初级会员',
    describes: '月',
    secondNumber: 2678400,
    originalPrice: 18.0,
    totalPrice: 1.0,
    status: 1,
    type: 2,
    sortNumber: 2,
  },
  {
    id: 21,
    name: '高级会员',
    describes: '年',
    secondNumber: 32140800,
    originalPrice: 100.0,
    totalPrice: 1.0,
    status: 1,
    type: 2,
    sortNumber: 3,
  },
];
export default {
  'GET /api/user/sendEmailCode': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: 222,
      code: 200,
    });
  },
  'GET /api/user/getUserInfo': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: userInfo,
      code: 200,
    });
  },
  'GET /api/vip/dictList/v2/007': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: vips,
      code: 200,
    });
  },
  'GET /api/pdf/queryState': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: queryState,
      code: 0,
    });
  },
  'POST /api/user/register': (req: any, res: any) => {
    res.json({
      msg: '注册成功',
      data: userInfo,
      code: 200,
    });
  },
  'POST /api/user/login': (req: any, res: any) => {
    res.json({
      msg: '登录成功',
      data: login,
      code: 200,
    });
  },
  'POST /api/user/restPassword': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: null,
      code: 200,
    });
  },
  'POST /api/paypal/pay/:id': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: {
        approve: 'https://www.paypal.com/checkoutnow?token=76B39769AS467033M',
        paymentId: '76B39769AS467033M',
      },
      code: 0,
    });
  },
  'POST /api/alipay/pay/:id': (req: any, res: any) => {
    res.json({
      msg: '',
      data: 'https://openapi.alipay.com/gateway.do?alipay_sdk=alipay-sdk-java-dynamicVersionNo&app_id=2021003143624951&biz_content=%7B%22body%22%3A%22%E9%AB%98%E7%BA%A7%E4%BC%9A%E5%91%98%22%2C%22out_trade_no%22%3A%22c9c2e336cf3d4bd498dcf7828c6dc3d3%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22subject%22%3A%22%E9%AB%98%E7%BA%A7%E4%BC%9A%E5%91%98%22%2C%22total_amount%22%3A%221.00%22%7D&charset=utf-8&format=json&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fpdfinto.com%2Fapi%2Falipay%2Fsuccess&return_url=https%3A%2F%2Fpdfinto.com%2F&sign=iz0bncjmy9owtgHfUhqnW3kgHSrOaaP1fmYQgYXasMxJahkxuaOgl%2Fd23%2F%2FMa%2B4SdmrYK01DZ0l%2FgmvJ0QmvvoGMzZvEI8OjmLprU34TULF3MOpP6O3y52SIxDPKI%2FcXNGpbx%2FgLh2nZzBUdz%2BXFY4LJoiARnyOMtahCrC%2BgZUE16sIlTFMtVHiX1kuW7yPFE1iiUKqtV50DCZHQ63afUInyTAJMGz2JWPdR6TnImZfN6hQM7VWv1kzt0ypJ%2B53ik%2BOmDcDyaquyL3COY7aVqzD9TZSLWmAKSHRgcYbHDPNZU1A14ucn%2F5Ql%2BNbN6JHALNRaDHiqV0EAuBxsYMuAbA%3D%3D&sign_type=RSA2&timestamp=2023-02-17+22%3A42%3A04&version=1.0',
      code: 0,
    });
  },
  'POST /api/common/multiUpload': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: { fileId: '3658' },
      code: 200,
    });
  },
  'POST /api/pdf/asyncConvert': (req: any, res: any) => {
    res.json({
      msg: 'ok',
      data: null,
      code: 0,
    });
  },
};
