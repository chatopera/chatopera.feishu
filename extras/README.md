# BOT

机器人对话管理

创建机器人并上传多轮对话 [releases/FeishuDevops.zh_CN.1.0.0.c66](./releases/FeishuDevops.zh_CN.1.0.0.c66)。

设置环境变量

![](../assets/14.png)

## GITLAB_URL

GitLab 服务地址，比如 https://gitlab.chatopera.com

支持版本：GitLab Community Edition 9.4.1 or Higher

## PRIVATE_TOKEN

在 GitLab Profile Setting 页面，创建 Personal Access Token.
机器人将具备该 Token 的权限操作或查询 GitLab 项目。

## VALID_PROJECTS

JSON 文件的 URL，示例：

https://gitee.com/chatopera_admin/metadata/raw/master/gitlab_projects.json

```
{
    "cskefu": "cskefu/cskefu.io",
    "chatopera": "chatopera/chatopera.bot"
}
```

Powered by [Chatopera 机器人平台](https://bot.chatopera.com/)。
