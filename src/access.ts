export default (initialState: API.UserInfo) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access
  console.log('refresh access', initialState);

  // 游客
  const isVisitor = !initialState.id;

  // 会员
  const isVip = initialState && initialState.vip === '1';

  return {
    isVisitor,
    isVip,
  };
};
