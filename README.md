# Chatopera 飞书 BOT 示例程序

通过 Feishu 开放平台和 Chatopera 机器人平台上线企业聊天机器人服务。

- Feishu，高效率的协作办公软件
- Chatopera 机器人平台，定制智能对话机器人的开发者平台

## 快速开始

### 创建 Feishu Bot 应用
文档
[https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN](https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN)

获得 xxx

### 创建 Chatopera Bot 应用

这里有两个“Bot 应用”，实际上是一个应用的两个部分，"Feishu Bot 应用" 是渠道，"Chatopera Bot 应用"是自然语言对话管理；前者是“嘴”，后者是“脑”。

### 编辑描述文件

我们以 Python 语言为例，进入 Python 程序源文件目录[py](./py)。

复制配置文件示例。

```
cd py
cp sample.env .env
```

### 安装 Python 依赖包

```
pip install -r requirements.txt
```

### 测试对话

### 发布到企业内部使用

### 开发
修改程序，增加功能

* 依赖 Node.js, npm

```
cd py
# liveload script, auto restart app when modifications happens
./dev.sh
```


## References

[Create a custom app on Feish](https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN)
[Develop a bot app on Feishu](https://open.feishu.cn/document/uQjL04CN/uYTMuYTMuYTM)
[Chatopera 云服务入门](https://docs.chatopera.com/products/chatbot-platform/index.html)
[Chatopera 云服务 Deep Dive](https://www.bilibili.com/video/BV1tz4y1S78k)
[聊天机器人对话模板：招聘机器人、天气查询、活动通知、寒暄等](https://github.com/chatopera/chatbot-samples)

## 开源许可协议

Copyright 2021 <a href="https://www.chatopera.com/" target="_blank">北京华夏春松科技有限公司</a>

[Apache License Version 2.0](./LICENSE)

[![chatoper banner][co-banner-image]][co-url]

[co-banner-image]: https://static-public.chatopera.com/assets/images/42383104-da925942-8168-11e8-8195-868d5fcec170.png
[co-url]: https://www.chatopera.com
