const GITLAB_URL = config["GITLAB_URL"];
const PRIVATE_TOKEN = config["PRIVATE_TOKEN"];
const VALID_PROJECTS_URL = config["VALID_PROJECTS"];

const fetchValidProjects = async function () {
  debug("fetchValidProjects: fetch from remote url %s ...", VALID_PROJECTS_URL);
  let resp = await http.get(VALID_PROJECTS_URL);
  return resp.data;
};

/**
 * 获得有效的项目列表
 */
exports.getValidProjects = async function () {
  const projects = await fetchValidProjects();
  const VALID_PROJECTS_KEYS = Object.keys(projects);

  let txt = "";
  for (let x of VALID_PROJECTS_KEYS) {
    txt += `【${x}】--> ${GITLAB_URL}/${projects[x]}` + "\n" + "    ";
  }

  return {
    text: `有效的项目列表: \n    ${txt}`,
  };
};

/**
 * 更新 Issue 状态
 */
async function update_issue(projects, proj, iid, state) {
  if (!projects) projects = await fetchValidProjects();
  let encoded_prj = encodeURIComponent(projects[proj]);
  let req_url = `${GITLAB_URL}/api/v4/projects/${encoded_prj}/issues/${iid}?state_event=${state}`;
  debug("req_url %s", req_url);

  let response = await http.put(req_url, null, {
    headers: {
      "PRIVATE-TOKEN": PRIVATE_TOKEN,
    },
  });
  return response;
}

/**
 * 重新开启 Issue
 */
exports.reopenIssue = async function (cap1) {
  debug("reopenIssue %s", cap1);

  let sp = cap1.split(" ");

  if (sp.length > 1) {
    let proj = sp[0];
    let iid = sp[1];
    if (iid.startsWith("#")) iid = iid.replace(/#/g, "");

    debug("[reopenIssue] project %s, iid %s", proj, iid);

    let VALID_PROJECTS = await fetchValidProjects();
    let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

    if (!VALID_PROJECTS[proj])
      return {
        text: `重开 Issue - 不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`,
      };
    let response = await update_issue(VALID_PROJECTS, proj, iid, "reopen");

    debug("[reopenIssue] gitlab api response %j", response);
    return {
      text: "#silent#",
    };
  } else {
    return {
      text: "重开 Issue - 命令未正确执行，请查看使用说明，发送【帮助】或 help",
    };
  }
};

/**
 * 关闭 Issue
 */
exports.closeIssue = async function (cap1) {
  debug("closeIssue %s", cap1);

  let sp = cap1.split(" ");

  if (sp.length > 1) {
    let proj = sp[0];
    let iid = sp[1];
    if (iid.startsWith("#")) iid = iid.replace(/#/g, "");

    debug("[closeIssue] project %s, iid %s", proj, iid);
    let VALID_PROJECTS = await fetchValidProjects();
    let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

    if (!VALID_PROJECTS[proj])
      return {
        text: `关闭 Issue - 不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`,
      };
    let response = await update_issue(VALID_PROJECTS, proj, iid, "close");

    debug("[closeIssue] gitlab api response %j", response);
    return {
      text: "#silent#",
    };
  } else {
    return {
      text: "关闭 Issue - 命令未正确执行，请查看使用说明，发送【帮助】或 help",
    };
  }
};

/**
 * 创建 Issue
 */
exports.createIssue = async function (cap1) {
  debug("createIssue %s", cap1);

  let sp = cap1.split(" ");

  if (sp.length > 1) {
    let proj = sp[0];
    let title = sp.slice(1).join(" ");
    debug("[createIssue] project %s, title %s", proj, title);
    let VALID_PROJECTS = await fetchValidProjects();
    let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

    if (!VALID_PROJECTS[proj])
      return {
        text: `不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`,
      };
    let encoded_prj = encodeURIComponent(VALID_PROJECTS[proj]);
    let req_url = `${GITLAB_URL}/api/v4/projects/${encoded_prj}/issues?title=${encodeURIComponent(
      title
    )}&description=${encodeURIComponent(
      "## Issue created with\n[chatopera/chatopera.feishu](https://github.com/chatopera/chatopera.feishu)"
    )}`;
    debug("req_url %s", req_url);

    let response = await http.post(req_url, null, {
      headers: {
        "PRIVATE-TOKEN": PRIVATE_TOKEN,
      },
    });
    debug("[createIssue] gitlab api response %j", response);
    return {
      text: "#silent#",
    };
  } else {
    return {
      text: "命令未正确执行，请查看使用说明，发送【帮助】或 help",
    };
  }
};

/**
 * 获得帮助
 */
exports.get_help = async function () {
  return {
    text: "#params#",
    params: {
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: "帮助",
            content: [
              [
                {
                  tag: "text",
                  text: "list projects\n",
                },
                {
                  tag: "text",
                  text: "create issue 项目 标题\n",
                },
                {
                  tag: "text",
                  text: "close issue 项目 #序号\n",
                },
                {
                  tag: "text",
                  text: "reopen issue 项目 #序号\n",
                },
                {
                  tag: "text",
                  text: "示例：\n",
                },
                {
                  tag: "text",
                  text: "   list projects\n",
                },
                {
                  tag: "text",
                  text:
                    "   create issue cskefu 优化春松客服 ME 渠道管理创建表单\n",
                },
                {
                  tag: "text",
                  text: "   close issue cskefu #1120\n",
                },
                {
                  tag: "text",
                  text: "   reopen issue cskefu #1120\n",
                },
                {
                  tag: "a",
                  text: "详细介绍\n",
                  href:
                    "https://github.com/chatopera/chatopera.feishu/wiki/Custom-App---DevOps-Usage",
                },
              ],
            ],
          },
        },
      },
    },
  };
};
