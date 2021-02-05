#!/usr/bin/env python
# --coding:utf-8--

__copyright__ = "Copyright (c) 2017 . All Rights Reserved"
__author__ = "Hai Liang Wang"
__date__ = "2017-10-16:14:13:24"

import os

curdir = os.path.dirname(os.path.abspath(__file__))

# Environment Variables
ENVIRON = os.environ.copy()

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib import request
from chatopera import Chatbot

# load hyper params
APP_ID = os.getenv("APP_ID", "").rstrip()
PORT = int(os.getenv("PORT", 8000))
APP_SECRET = os.getenv("APP_SECRET", "").rstrip()
APP_VERIFICATION_TOKEN = os.getenv("APP_VERIFICATION_TOKEN", "").rstrip()
CHATOPERA_CLIENT_ID = os.getenv("CHATOPERA_CLIENT_ID", "").rstrip()
CHATOPERA_SECRET = os.getenv("CHATOPERA_SECRET", "").rstrip()
CHATOPERA_BOT_PROVIDER = os.getenv("CHATOPERA_BOT_PROVIDER", "https://bot.chatopera.com").rstrip()

# validate values in ENV
if "" in [APP_ID, APP_SECRET, APP_VERIFICATION_TOKEN, CHATOPERA_CLIENT_ID, CHATOPERA_SECRET]:
    [print("%s=%s" % (x[1], x[0])) for x in
     [[APP_ID, "APP_ID"], [APP_SECRET, "APP_SECRET"], [APP_VERIFICATION_TOKEN, "APP_VERIFICATION_TOKEN"],
      [CHATOPERA_CLIENT_ID, "CHATOPERA_CLIENT_ID"], [CHATOPERA_SECRET, "CHATOPERA_SECRET"]] if not x[0]]
    raise BaseException("Invalid params, `None` is not allowed for param value")

print("run app with CHATOPERA_BOT_PROVIDER %s, CHATOPERA_CLIENT_ID %s, APP_ID %s" % (
    CHATOPERA_BOT_PROVIDER, CHATOPERA_CLIENT_ID, APP_ID))

bot = Chatbot(CHATOPERA_CLIENT_ID, CHATOPERA_SECRET, )
bot_info = bot.command("GET", "/")
print("bot info: %s" % bot_info)
if "rc" in bot_info and bot_info["rc"] == 0:
    pass
else:
    raise BaseException("Invalid bot info, does bot exist in your bot provider? " + CHATOPERA_BOT_PROVIDER)


class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 解析请求 body
        req_body = self.rfile.read(int(self.headers['content-length']))
        obj = json.loads(req_body.decode("utf-8"))
        print(req_body)

        # 校验 verification token 是否匹配，token 不匹配说明该回调并非来自开发平台
        token = obj.get("token", "")
        if token != APP_VERIFICATION_TOKEN:
            print("verification token not match, token =", token)
            self.response("")
            return

        # 根据 type 处理不同类型事件
        type = obj.get("type", "")
        if "url_verification" == type:  # 验证请求 URL 是否有效
            self.handle_request_url_verify(obj)
        elif "event_callback" == type:  # 事件回调
            # 获取事件内容和类型，并进行相应处理，此处只关注给机器人推送的消息事件
            event = obj.get("event")
            if event.get("type", "") == "message":
                self.handle_message(event)
                return
        return

    def handle_request_url_verify(self, post_obj):
        # 原样返回 challenge 字段内容
        challenge = post_obj.get("challenge", "")
        rsp = {'challenge': challenge}
        self.response(json.dumps(rsp))
        return

    def handle_message(self, event):
        # 此处只处理 text 类型消息，其他类型消息忽略
        msg_type = event.get("msg_type", "")
        if msg_type != "text":
            print("unknown msg_type =", msg_type)
            self.response("")
            return

        # 调用发消息 API 之前，先要获取 API 调用凭证：tenant_access_token
        access_token = self.get_tenant_access_token()
        if access_token == "":
            self.response("")
            return

        # 机器人 echo 收到的消息
        query = event.get("text")
        from_user_id = event.get("open_id")
        result = bot.command("POST", "/conversation/query", dict({
            "fromUserId": from_user_id,
            "textMessage": query,
            "faqBestReplyThreshold": 0.8,
            "faqSuggReplyThreshold": 0.5
        }))

        print("bot result: %s" % json.dumps(result, ensure_ascii=False, indent=2))

        self.send_message(access_token, from_user_id, result["data"]["string"])
        self.response("")
        return

    def response(self, body):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(body.encode())

    def get_tenant_access_token(self):
        url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/"
        headers = {
            "Content-Type": "application/json"
        }
        req_body = {
            "app_id": APP_ID,
            "app_secret": APP_SECRET
        }

        data = bytes(json.dumps(req_body), encoding='utf8')
        req = request.Request(url=url, data=data, headers=headers, method='POST')
        try:
            response = request.urlopen(req)
        except Exception as e:
            print(e.read().decode())
            return ""

        rsp_body = response.read().decode('utf-8')
        rsp_dict = json.loads(rsp_body)
        code = rsp_dict.get("code", -1)
        if code != 0:
            print("get tenant_access_token error, code =", code)
            return ""
        return rsp_dict.get("tenant_access_token", "")

    def send_message(self, token, open_id, text):
        url = "https://open.feishu.cn/open-apis/message/v4/send/"

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
        req_body = {
            "open_id": open_id,
            "msg_type": "text",
            "content": {
                "text": text
            }
        }

        data = bytes(json.dumps(req_body), encoding='utf8')
        req = request.Request(url=url, data=data, headers=headers, method='POST')
        try:
            response = request.urlopen(req)
        except Exception as e:
            print(e.read().decode())
            return

        rsp_body = response.read().decode('utf-8')
        rsp_dict = json.loads(rsp_body)
        code = rsp_dict.get("code", -1)
        if code != 0:
            print("send message error, code = ", code, ", msg =", rsp_dict.get("msg", ""))


def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print("server is started, listen on port %s ..." % PORT)
    httpd.serve_forever()


if __name__ == '__main__':
    run()
