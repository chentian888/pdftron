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

## 邮箱验证码-subject 非必填

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
    "code": 200,
    "msg": "注册成功",
    "data": {
        "id": 3652,
        "userName": "646981682@qq.com",
        "nickName": null,
        "password": "",
        "status": "0",
        "vip": "0",
        "email": null,
        "phone": null,
        "sex": null,
        "avatar": null,
        "userType": "1",
        "createBy": 1,
        "createTime": "2023-02-17T14:24:32.121+00:00",
        "updateBy": 1,
        "updateTime": "2023-02-17T14:24:32.121+00:00",
        "openid": null,
        "delFlag": 0
    }
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

## 登录-Header-authorization 字段

eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlNGExZTY5Y2Q4YjQ0OTY4OTUwY2E3MmY5YmIzOGYwZSIsInN1YiI6IjM2NTIiLCJpc3MiOiJzZyIsImlhdCI6MTY3NjY0NDAwMCwiZXhwIjoxNjkyMTk1OTk1fQ.C37H_Z6SEHNl4hDS7RgSVJoua358NwBX6uPDNYxYGys

```json
https://www.pdfinto.com/api/user/login
{
    "code": 200,
    "msg": "登录成功",
    "data": {
        "user": {
            "id": 3652,
            "userName": "646981682@qq.com",
            "nickName": null,
            "password": "",
            "status": "0",
            "vip": "0",
            "email": null,
            "phone": null,
            "sex": null,
            "avatar": null,
            "userType": "1",
            "createBy": 1,
            "createTime": "2023-02-17T14:24:32.000+00:00",
            "updateBy": 1,
            "updateTime": "2023-02-17T14:24:32.000+00:00",
            "openid": null,
            "delFlag": 0
        },
        "permissions": null,
        "loginDate": "2023-02-17T14:26:35.708+00:00",
        "authorities": null,
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true,
        "password": "",
        "username": "646981682@qq.com"
    }
}

{
    "code": 500,
    "msg": "未知异常"
}
{
    "code": 500,
    "msg": "Bad credentials"
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
    "code": 0,
    "msg": "ok",
    "data": {
        "userId": null,
        "vipName": null,
        "expirationTime": null,
        "createTime": null,
        "updateTime": null,
        "vip": false
    }
}
```

## 商品列表

```json
https://www.pdfinto.com/api/vip/dictList/v2/007

{
    "code": 0,
    "msg": "ok",
    "data": [
        {
            "id": 20,
            "name": "初级会员",
            "describes": "月",
            "secondNumber": 2678400,
            "originalPrice": 18.00,
            "totalPrice": 1.00,
            "status": 1,
            "type": 2,
            "sortNumber": 2
        },
        {
            "id": 21,
            "name": "高级会员",
            "describes": "年",
            "secondNumber": 32140800,
            "originalPrice": 100.00,
            "totalPrice": 1.00,
            "status": 1,
            "type": 2,
            "sortNumber": 3
        }
    ]
}

{
    "code": 403,
    "msg": "您的权限不足"
}
```

## 支付

```json
https://www.pdfinto.com/api/paypal/pay/20
https://www.pdfinto.com/api/alipay/pay/20

{
    "code": 0,
    "msg": "ok",
    "data": {
        "approve": "https://www.paypal.com/checkoutnow?token=76B39769AS467033M",
        "paymentId": "76B39769AS467033M"
    }
}

https://openapi.alipay.com/gateway.do?alipay_sdk=alipay-sdk-java-dynamicVersionNo&app_id=2021003143624951&biz_content=%7B%22body%22%3A%22%E9%AB%98%E7%BA%A7%E4%BC%9A%E5%91%98%22%2C%22out_trade_no%22%3A%22c9c2e336cf3d4bd498dcf7828c6dc3d3%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22subject%22%3A%22%E9%AB%98%E7%BA%A7%E4%BC%9A%E5%91%98%22%2C%22total_amount%22%3A%221.00%22%7D&charset=utf-8&format=json&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fpdfinto.com%2Fapi%2Falipay%2Fsuccess&return_url=https%3A%2F%2Fpdfinto.com%2F&sign=iz0bncjmy9owtgHfUhqnW3kgHSrOaaP1fmYQgYXasMxJahkxuaOgl%2Fd23%2F%2FMa%2B4SdmrYK01DZ0l%2FgmvJ0QmvvoGMzZvEI8OjmLprU34TULF3MOpP6O3y52SIxDPKI%2FcXNGpbx%2FgLh2nZzBUdz%2BXFY4LJoiARnyOMtahCrC%2BgZUE16sIlTFMtVHiX1kuW7yPFE1iiUKqtV50DCZHQ63afUInyTAJMGz2JWPdR6TnImZfN6hQM7VWv1kzt0ypJ%2B53ik%2BOmDcDyaquyL3COY7aVqzD9TZSLWmAKSHRgcYbHDPNZU1A14ucn%2F5Ql%2BNbN6JHALNRaDHiqV0EAuBxsYMuAbA%3D%3D&sign_type=RSA2&timestamp=2023-02-17+22%3A42%3A04&version=1.0

https://pdfinto.com/?charset=utf-8&out_trade_no=fec860ba66764ffea49796930ba2ad56&method=alipay.trade.page.pay.return&total_amount=1.00&sign=a8Jgos%2BU7YLDRuq06hK9NLGrA1MzoYSwVmg%2FMewtXkqEwI3rJdnmvBHlZ%2F%2BRcnMrCSGqLXA2ZUXOjce647wwIlrZ3aIJsON%2BGCCBoBwUiqftFg%2Fb0tPcSkOadOTsjuIn197MyeFro1AF4PCM86nga%2Bvzr%2BHM2MWQKP7Ad9JRvv2wR4f4lDnxXttnBjeMwkn0uLPT5RldBsWEFiSqWiRtGUGW5Ddscshwh2GiBGic1xLGh%2BhGEEqN%2F1uosgWFrz1JTXl3RcQQ07pjuCVWlqHex6S%2FytwMUmKYn2%2F2ml9d%2FomD1958c4QDUZukM3HylwFel9NJ3fDNVPww%2BQvhooGKsg%3D%3D&trade_no=2023021722001469801458289040&auth_app_id=2021003143624951&version=1.0&app_id=2021003143624951&sign_type=RSA2&seller_id=2088041596561539&timestamp=2023-02-17%2022%3A52%3A47
```

## 上传文件

```json
https://www.pdfinto.com/api/common/multiUpload

{
    "code": 200,
    "data": {
        "fileId": "3658"
    }
}

{
    "code": 401,
    "msg": "用户认证失败请查询登录"
}
```

## 转换

```json
https://www.pdfinto.com/api/pdf/asyncConvert
{
  "id":"",
  "id":"",
  "convertType":"0",
  "convertType":"1",
  "convertType":"2",
}
{
    "code": 0,
    "msg": "ok",
    "data": null
}

https://www.pdfinto.com/api/pdf/queryState
{
    "code": 0,
    "msg": "ok",
    "data": {
        "state": 1,
        "convertedPaths": [
            "2023-02-17/1676647255760.docx"
        ]
    }
}

{
    "code": 401,
    "msg": "用户认证失败请查询登录"
}

https://www.pdfinto.com/file/2023-02-17/1676647255760.docx
```
