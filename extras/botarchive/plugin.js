const GITLAB_URL = config["GITLAB_URL"]
const PRIVATE_TOKEN = config["PRIVATE_TOKEN"]
const VALID_PROJECTS_URL = config["VALID_PROJECTS"]


//one line solution
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

exports.get_random = async function(elements) {
    if (elements) {
        let els = elements.split(" ")

        if (els.length == 1) {
            return {
                text: "元素长度大于1，例如发送 `shuf 张三 李四 王五 ...`，不同元素使用空格间隔"
            }
        }

        return {
            text: shuffle(els).join(" ")
        }

    } else {
        return {
            "text": "发送 `shuf 张三 李四 王五 ...`，不同元素使用空格间隔"
        }

    }

}

const fetchValidProjects = async function() {
    debug("fetchValidProjects: fetch from remote url %s ...", VALID_PROJECTS_URL);
    let resp = await http.get(VALID_PROJECTS_URL);
    return resp.data;
};

/**
 * 获得有效的项目列表
 */
exports.getValidProjects = async function() {
    const projects = await fetchValidProjects()
    const VALID_PROJECTS_KEYS = Object.keys(projects)

    let txt = ""
    for (let x of VALID_PROJECTS_KEYS) {
        txt += `【${x}】--> ${GITLAB_URL}/${projects[x]}` + "\n" + "    "
    }

    return {
        text: `有效的项目列表: \n    ${txt}`
    }
}


/**
 * 更新 Issue 状态
 */
async function update_issue(projects, proj, iid, state) {
    if (!projects)
        projects = await fetchValidProjects();
    let encoded_prj = encodeURIComponent(projects[proj])
    let req_url = `${GITLAB_URL}/api/v4/projects/${encoded_prj}/issues/${iid}?state_event=${state}`;
    debug("req_url %s", req_url)

    let response = await http.put(req_url, null, {
        headers: {
            "PRIVATE-TOKEN": PRIVATE_TOKEN
        }
    })
    return response
}


/**
 * 重新开启 Issue
 */
exports.reopenIssue = async function(cap1) {
    debug("reopenIssue %s", cap1)

    let sp = cap1.split(" ");

    if (sp.length > 1) {
        let proj = sp[0];
        let iid = sp[1];
        if (iid.startsWith("#"))
            iid = iid.replace(/#/g, "");

        debug("[reopenIssue] project %s, iid %s", proj, iid);

        let VALID_PROJECTS = await fetchValidProjects();
        let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

        if (!VALID_PROJECTS[proj])
            return {
                "text": `重开 Issue - 不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`
            }
        let response = await update_issue(VALID_PROJECTS, proj, iid, "reopen");

        debug("[reopenIssue] gitlab api response %j", response)
        return {
            text: "#silent#"
        }
    } else {
        return {
            text: "重开 Issue - 命令未正确执行，请查看使用说明，发送【帮助】或 help"
        }
    }
}


/**
 * 关闭 Issue
 */
exports.closeIssue = async function(cap1) {

    debug("closeIssue %s", cap1)

    let sp = cap1.split(" ");

    if (sp.length > 1) {
        let proj = sp[0];
        let iid = sp[1];
        if (iid.startsWith("#"))
            iid = iid.replace(/#/g, "");

        debug("[closeIssue] project %s, iid %s", proj, iid);
        let VALID_PROJECTS = await fetchValidProjects();
        let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

        if (!VALID_PROJECTS[proj])
            return {
                "text": `关闭 Issue - 不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`
            }
        let response = await update_issue(VALID_PROJECTS, proj, iid, "close");

        debug("[closeIssue] gitlab api response %j", response)
        return {
            text: "#silent#"
        }
    } else {
        return {
            text: "关闭 Issue - 命令未正确执行，请查看使用说明，发送【帮助】或 help"
        }
    }
}

/**
 * 创建 Issue 
 */
exports.createIssue = async function(cap1, labels) {
    debug("createIssue %s, labels %s", cap1, labels)

    let sp = cap1.split(" ");

    if (sp.length > 1) {
        let proj = sp[0];
        let title = sp.slice(1).join(" ");
        debug("[createIssue] project %s, title %s", proj, title);
        let VALID_PROJECTS = await fetchValidProjects();
        let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

        if (!VALID_PROJECTS[proj])
            return {
                "text": `不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`
            }
        let encoded_prj = encodeURIComponent(VALID_PROJECTS[proj])
        let req_url = `${GITLAB_URL}/api/v4/projects/${encoded_prj}/issues?title=${encodeURIComponent(title)}&description=${encodeURIComponent("## Issue created with\n[chatopera/chatopera.feishu](https://github.com/chatopera/chatopera.feishu)")}`;
        if (labels) {
            req_url = req_url + `&labels=${labels}`
        }
        debug("req_url %s", req_url)

        let response = await http.post(req_url, null, {
            headers: {
                "PRIVATE-TOKEN": PRIVATE_TOKEN
            }
        })
        debug("[createIssue] gitlab api response %j", response)
        return {
            text: "#silent#"
        }
    } else {
        return {
            text: "命令未正确执行，请查看使用说明，发送【帮助】或 help"
        }
    }
}


/**
 * Search Issue
 * https://gitlab.chatopera.com/help/api/issues.md#list-issues
 */
exports.searchIssues = async function(cap1) {
    debug("searchIssues query %s", cap1)

    let sp = cap1.split(" ");

    if (sp.length > 1) {
        let proj = sp[0];
        let title = sp.slice(1).join(" ");
        debug("[searchIssues] project %s, title %s", proj, title);
        let VALID_PROJECTS = await fetchValidProjects();
        let VALID_PROJECTS_KEYS = Object.keys(VALID_PROJECTS);

        if (!VALID_PROJECTS[proj])
            return {
                "text": `不支持项目【${proj}】的 Issue 管理，有效的项目列表 ${VALID_PROJECTS_KEYS}`
            }
        let encoded_prj = encodeURIComponent(VALID_PROJECTS[proj])
        let req_url = `${GITLAB_URL}/api/v4/projects/${encoded_prj}/issues?per_page=10&order_by=updated_at&search=${encodeURIComponent(title)}`;
        debug("req_url %s", req_url)

        let response = await http.get(req_url, {
            headers: {
                "PRIVATE-TOKEN": PRIVATE_TOKEN
            }
        })

        // debug("[searchIssues] gitlab api response %j", response.data)
        let content = {
            "post": {
                "zh_cn": {
                    "title": "检索结果",
                    "content": [
                        []
                    ]
                }
            }
        }

        if (response.data && response.data.length > 0) {
            for (let x of response.data) {
                let issue_info = `[${ x["state"]}] #${x["iid"]} ${x["title"]} opened by ${x["author"]["name"]} (${x["created_at"]})`;
                let issue_url = x["web_url"];

                content["post"]["zh_cn"]["content"][0].push({
                    "tag": "a",
                    "text": `${issue_info}\n`,
                    "href": issue_url
                });
                // debug("searchIssues: [%s] #%s %s opened by %s (%s)", x["state"], x["iid"], x["title"], x["author"]["name"], x["created_at"])
                // debug("Url %s ", x["web_url"])

            }
        } else {
            content["post"]["zh_cn"]["title"] = "未得到相关 Issue 结果，优化检索条件"
        }

        return {
            text: "#params#",
            params: {
                "msg_type": "post",
                "content": content
            }
        }
    } else {
        return {
            text: "命令未正确执行，请查看使用说明，发送【帮助】或 help"
        }
    }
}

/**
 * 获得帮助 
 */
exports.get_help = async function() {
    return {
        text: "#params#",
        params: {
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": "帮助",
                        "content": [
                            [{
                                    "tag": "text",
                                    "text": "list projects\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "search issue 项目 条件\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "create [issue|bug|task|story] 项目 标题\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "close issue 项目 #序号\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "reopen issue 项目 #序号\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "shuf value1 value2 [...]\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "示例：\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   list projects\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   search issue cskefu ME 渠道\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   create issue cskefu 优化春松客服 ME 渠道管理创建表单\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   create story cskefu 优化春松客服 ME 渠道管理创建表单\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   create bug cskefu 优化春松客服 ME 渠道管理创建表单\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   close issue cskefu #1120\n"
                                },
                                {
                                    "tag": "text",
                                    "text": "   reopen issue cskefu #1120\n"
                                },
                                {
                                    "tag": "a",
                                    "text": "详细介绍\n",
                                    "href": "https://github.com/chatopera/chatopera.feishu/wiki/Custom-App---DevOps-Usage"
                                },
                            ]
                        ]
                    }
                }
            }
        }
    }
}


/**
 * 查询天气
 */

var WForewast = function(apiKey) {
    if (!apiKey) throw new Error('Invalid token, get it from http://www.heweather.com/my/service');
    this.key = apiKey;
}


WForewast.prototype.getWeatherByCity = function(city) {
    return new Promise((resolve, reject) => {
        if (!city)
            return reject("城市名不能为空");
        let url = config["HEWEATHER_URL"] + "/weather?city=" + encodeURIComponent(city) + "&key=" + this.key
        http
            .get(url)
            .then((res) => {
                if (res.data.HeWeather5[0] && res.data.HeWeather5[0].suggestion) {
                    resolve(res.data.HeWeather5[0].suggestion);
                } else {
                    reject("天气建议未返回约定结果！");
                }

            })
            .catch(function(err) {
                if (err) return reject(err);
            });
    })
}

const wf = new WForewast(config["HEWEATHER_KEY"]);


exports.getWeatherByCity = function(city, cb) {
    debug("getWeatherByCity: %s", city);
    if (!city)
        throw new Error("城市名不能为空");

    wf.getWeatherByCity(city)
        .then((suggestions) => {
            cb(null, {
                text: suggestions["comf"]["txt"]
            })
        }, (err) => {
            debug("getWeatherByCity error: %j", err)
            cb(null, {
                text: `很抱歉，没有获得${city}的天气信息。`
            })
        })
}



exports.getAirByCity = function(city, cb) {
    debug("getAirByCity: %s", city);
    if (!city)
        throw new Error("城市名不能为空");

    wf.getWeatherByCity(city)
        .then((suggestions) => {
            cb(null, {
                text: suggestions["air"]["txt"]
            })
        }, (err) => {
            debug("getAirByCity error: %j", err);
            cb(null, {
                text: `很抱歉，没有获得${city}的空气信息。`
            })
        })
}


exports.getSportByCity = function(city, cb) {
    debug("getSportByCity: %s", city);
    wf.getWeatherByCity(city)
        .then((suggestions) => {
            cb(null, {
                text: suggestions["sport"]["txt"]
            })
        }, (err) => {
            debug("getSportByCity error: %j", err);
            cb(null, {
                text: `很抱歉，没有获得${city}的信息。`
            })
        })
}

exports.getDresscodeByCity = function(city, cb) {
    debug("getDresscodeByCity: %s", city);
    if (!city)
        throw new Error("城市名不能为空");

    wf.getWeatherByCity(city)
        .then((suggestions) => {
            cb(null, {
                text: suggestions["drsg"]["txt"]
            })
        }, (err) => {
            debug("getDresscodeByCity error: %j", err);
            cb(null, {
                text: `很抱歉，没有获得${city}的信息。`
            })
        })
}