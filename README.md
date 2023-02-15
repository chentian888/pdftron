# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://next.umijs.org/zh-CN/docs/max/introduce)

```json
{
  "code": 200,
  "msg": "注册成功",
  "data": {
    "id": 1490,
    "userName": "1915951893@qq.com",
    "nickName": "1915951893@qq.com",
    "password": "",
    "status": "0",
    "vip": "0",
    "email": null,
    "phone": null,
    "sex": null,
    "avatar": null,
    "userType": "1",
    "createBy": 1,
    "createTime": "2022-12-25T15:52:28.085+00:00",
    "updateBy": 1,
    "updateTime": "2022-12-25T15:52:28.085+00:00",
    "openid": null,
    "delFlag": 0
  }
}
```

## 业务

1. PDF 转 word/ppt/pptx/xls/txt`限制文件单选 不显示添加更多文件按钮`
2. PDF 转图片(png/jpg/tif/bmp)根据 PDF 拆分、PDF 删除内容`缩略图进行选择`
3. 图片(png/jpg/tif/bmp)转 pdf/pdf 合并，`不限制单选可选择多个文件`
4. 右上角新增`下载打印按钮`

## 邮箱验证码

```json
https://www.pdfinto.com/api/user/sendEmailCode?subject=测试发送邮件验证码&email=646981682@qq.com

{
    "code": 0,
    "msg": "ok",
    "data": null
}

{
    "code": 500,
    "msg": "未知异常"
}
```

## 注册

```json
https://www.pdfinto.com/api/user/register
{
  "code": "455261",
  "password": "123456",
  "userName": "646981682@qq.com"
}


{
    "code": 0,
    "msg": "ok",
    "data": null
}

{
    "code": 500,
    "msg": "未知异常"
}
{
    "code": 500,
    "msg": "邮箱验证码已失效"
}
```

## 登录

```json
https://www.pdfinto.com/api/user/login
{
  "password": "123456",
  "userName": "646981682@qq.com"
}


{
    "code": 0,
    "msg": "ok",
    "data": null
}

{
    "code": 500,
    "msg": "未知异常"
}
{
    "code": 500,
    "msg": "用户名或者密码错误"
}
```

## 忘记密码

```json
https://www.pdfinto.com/api/user/restPassword

{
  "code":"",
  "password": "123456",
  "userName": "646981682@qq.com"
}
```

## 获取用户信息接口

```json
https://www.pdfinto.com/api/vip/getUserInfo
{
  "token":"",
}
```

## 商品列表

```json
https://www.pdfinto.com/api/vip/dictList/v2/007
{
  "token":"",
}
```

## 支付

```json
https://www.pdfinto.com/api/paypal/pay/20
https://www.pdfinto.com/api/alipay/pay/20

{
  "token":"",
}
```

## 上传文件

```json
https://www.pdfinto.com/api/common/multiUpload

{
  "token":"",
}

{
    "code": 401,
    "msg": "用户认证失败请查询登录"
}
```

## 转换

```json
https://www.pdfinto.com/api/pdf/asyncConvert
https://www.pdfinto.com/api/pdf/queryState
https://www.pdfinto.com/file/
{
  "id":"",
  "id":"",
  "convertType":"0",
  "convertType":"1",
  "convertType":"2",
}

{
    "code": 401,
    "msg": "用户认证失败请查询登录"
}
```
