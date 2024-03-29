使用 Chatopera 和飞书集成 BOT 应用有两种形式：

* Chatopera 飞书应用: 快速使用，配置为主，和飞书应用控制台集成，在飞书官方应用商店使用
* Chatopera 飞书 Custom App： 面向开发者友好（即项目 https://github.com/chatopera/chatopera.feishu）

# Chatopera 飞书应用

开始使用：[https://chatopera.feishu.cn/docs/doccnnLcv5AuenV1HHSvgVWbJmd](https://chatopera.feishu.cn/docs/doccnnLcv5AuenV1HHSvgVWbJmd)

![image_20230213151245](https://user-images.githubusercontent.com/3538629/218393833-a4bcddb2-fc3e-493b-a752-350149babe0a.png)

# Chatopera 飞书 Custom App

[https://github.com/chatopera/chatopera.feishu](https://github.com/chatopera/chatopera.feishu)

<img src="./assets/12.png" width = "600" />

通过 Feishu 开放平台和 Chatopera 机器人平台上线企业聊天机器人服务。

- Feishu：高效率的协作办公软件
- Chatopera 机器人平台：定制智能对话机器人的开发者平台，低代码或无代码方式开发 BOT 对话


## 掌握 BOT 应用开发

Feishu 开发者快速入门 Custom App BOT 服务开发！

[Feishu(飞书) 聊天机器人应用（1/3）- 开发快速入门](https://chatopera.blog.csdn.net/article/details/111935461)

[Feishu(飞书) 聊天机器人应用（2/3）- 定制对话，实现知识库、信息查询、意图识别、多轮对话](https://chatopera.blog.csdn.net/article/details/113720749)

[Feishu(飞书) 聊天机器人应用（3/3）- DevOps机器人助手，管理 GitLab Issues，BOT 开源示例程序](https://chatopera.blog.csdn.net/article/details/113768538)

## 示例程序

集成 GitLab 实现项目的 Issue 管理。

![](./assets/15.png)

功能 -

```
帮助
list projects
create issue 项目 标题
close issue 项目 #序号
reopen issue 项目 #序号
示例：
   list projects
   create issue cskefu 优化春松客服 ME 渠道管理创建表单
   close issue cskefu #1120
   reopen issue cskefu #1120
详细介绍(超链接)
```

该示例程序的上线过程，请详细阅读下文获得。

## 快速开始

以下【Feishu Bot 应用】是指[飞书开发者平台](https://open.feishu.cn/app)上的 Custom App，并且 Capability 为 【bot】。

<p align="center">
    <img src="./assets/1.png" width = "500" />
</p>

### 创建 Feishu Bot 应用

根据文档创建 Feishu Custom App [https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN](https://open.feishu.cn/document/uQjL04CN/ukzM04SOzQjL5MDN)

在左侧导航栏，进入【Credentials & Basic Info】，得到 `App ID` 和 `App Secret`。

开启 Bot 功能：在 Features 中设置 【Using Bot】为开启状态。

<p align="center">
    <img src="./assets/3.png" width = "500" />
</p>

进入【Event Subscriptions】，获得 `Verification Token`。

<p align="center">
    <img src="./assets/2.png" width = "500" />
</p>

### 创建 Chatopera Bot 应用

登录 Chatopera 云服务 [https://bot.chatopera.com](https://bot.chatopera.com)，创建【机器人】。

<p align="center">
    <img src="./assets/4.png" width = "500" />
</p>

进入机器人设置页面，得到 `Client Id` 和 `Secret`。

<p align="center">
    <img src="./assets/5.png" width = "500" />
</p>

以上提到了两个“Bot 应用”，实际上是一个对话机器人应用的两个部分：**"Feishu Bot 应用" 是渠道，"Chatopera Bot 应用"是自然语言对话管理；前者是“嘴”，后者是“脑”。**

### 编辑配置文件

我们以 Python 语言为例，进入 Python 程序源文件目录[app](./app)。

复制配置文件示例。

```
cd feishu/app
cp sample.env .env
vi .env # 使用文本编辑器编辑 .env 文件
```

参数对应列表

| KEY                    | VALUE                | DESCRIPTION                                   |
| ---------------------- | -------------------- | --------------------------------------------- |
| APP_ID                 | `App ID`             | Feishu Custom App Credentials & Basic Info 页 |
| APP_SECRET             | `App Secret`         | Feishu Custom App Credentials & Basic Info 页 |
| APP_VERIFICATION_TOKEN | `Verification Token` | Feishu Custom App Event Subscriptions 页      |
| CHATOPERA_CLIENT_ID    | `Client Id`          | Chatopera 聊天机器人设置页                    |
| CHATOPERA_SECRET       | `Secret`             | Chatopera 聊天机器人设置页                    |

<p align="center">
    <img src="./assets/6.png" width = "500" />
</p>

### 安装依赖

- 前提条件 Python3, pip

安装 Python 依赖

```bash
cd feishu/app
pip install -r requirements.txt
```

### 启动服务

```bash
cd feishu/app
./serve.sh
```

服务默认使用 8000 端口，可以在 `.env` 中增加环境变量 `PORT=YOUR_PORT` 自定义。

配置 HTTPs 服务，接入飞书要求使用 https server URL，测试目的建议使用 `ngrok`

```bash
ngrok http 8000
```

<p align="center">
    <img src="./assets/8.png" width = "500" />
</p>

如上，得到 https URL 地址：`https://xxx.ngrok.io`。

[ngrok](https://dashboard.ngrok.com/) 下载和注册：https://dashboard.ngrok.com/。

### 配置 Feishu Custom App 消息事件订阅

再次进入 Feishu Custom App Event Subscriptions 页面，编辑 `Request URL` 的值。

将刚刚获得的 https URL 地址填写上，保存。

### 发布上线机器人

1）设置权限
进入飞书 Custom App 管理控制台，打开【Permissions】页面，发布新版本，并且选择权限如下。

<p align="center">
    <img src="./assets/10.png" width = "500" />
</p>

2）发布到企业内部使用

进入飞书 Custom App 管理控制台，打开【Version Management & Release】页面。

<p align="center">
    <img src="./assets/11.png" width = "500" />
</p>

创建新版本，并提交，此时因为企业内部审核，会自动通过。

在飞书客户端，Workspace 中搜索并激活机器人。

<p align="center">
    <img src="./assets/16.png" width = "500" />
</p>

进入对话界面。

<p align="center">
    <img src="./assets/7.png" width = "500" />
</p>

## 使用 Docker 方式运行程序

### 构建 Docker 镜像

```
cd 根目录/feishu
./admin/build.sh
```

### 运行服务

```
cd 根目录
cp sample.env .env # 修改 .env 文件，配置变量
docker-compose up -d
```

## 开发

### 修改程序，增加功能

建议安装 Node.js 和 npm，然后可使用下面脚本自动重启。

```
cd feishu/app
# liveload script, auto restart app when modifications happens
./dev.sh
```

每次重启后，可能会延迟 20s 生效，因为每次重启会和 Feishu 中间重新做安全校验。

### 增加对话能力

接下来，根据文档定制您的 BOT 对话能力，管理对话，是 Chatopera 机器人平台最核心的功能。

本项目提供面向 DevOps 的助手机器人，和 GitLab 集成，参考 [README.md](./extras/README.md)。

Powered by [Chatopera 机器人平台](https://bot.chatopera.com/)。

## 获得帮助与支持

[Chatopera 文档中心](https://docs.chatopera.com/)

[Create Tickets](https://docs.chatopera.com/products/chatbot-platform/support.html)

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
