// ==UserScript==
// @name         Qidian 2017 year check
// @namespace    https://github.com/xyauhideto/
// @version      0.1.2017123113
// @description  2017起点年终盛典
// @author       xyau
// @match        http*://activity.qidian.com/2017/yearsCheck/*
// @downloadURL  https://github.com/xyauhideto/qidian/raw/master/qidian2017yearCheck.user.js
// ==/UserScript==

(function year2017(answerIndex, likeIDs, voteInfo, voteNum) {
    "use strict";

    var load = function load() {
        /* 召唤，分享，点赞，剩余全投，投票，问答，领取礼包 */
        summon();
        share();
        like();
        var all = true;
        if (voteInfo && voteNum) vote(all);
        answerQuestion();
        exchange();
    },
        infoBox = (!$(".info-box").length &&
                   $("body").prepend(
            $(
                '<div class=info-box style=z-index:9999;position:fixed;max-height:360px;overflow-y:auto;background:rgba(255,255,255,.8);padding:5px><p><span style=cursor:pointer onclick=$(".info-box").remove()>[关闭]</span></p></div>'
            )
        ),
                   $(".info-box")),
        info = function info(json, task, content) {
            var state =
                arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : "失败";

            console.log(task, json);
            infoBox.append(
                $("<p><b>" + task + "</b> <i>" + state + "</i> " + content + "</p>")
            );
        },
        exchange = function exchange() {
            var state, content;
            var task = "领取礼包";
            $.post("/ajax/CharacterCard/exchangeReward", function(json) {
                if (json.code != 0) content = json.msg;
                else state = '成功';
                var logged = JSON.parse(localStorage.exchanged||'[]'),
                    userInfo = JSON.parse(/userInfo":([^}]+})/.exec($('script').eq(-2).text())[1]);
                if ((0 == json.code || 23103 == json.code) && -1>=logged.findIndex(function(info){return info.id == userInfo.id;})) {
                    logged.push(userInfo);
                    localStorage.exchanged = JSON.stringify(logged);
                }
                if (logged.length)
                    content += '<p>已领取' + logged.length + '个礼包：<br>' + logged.map(function(info){return '<a href=//my.qidian.com/user/' + info.id + ' target=_blank>' + info.name + '</a>';}).join('<br>');
                info(json, task, content, state);
            });
        },
        summon = function summon() {
            var state, content;
            var task = "卡牌召唤";
            $.post("/ajax/CharacterCard/summon", { precision: 1 }, function(json) {
                if (json.code != 0) content = json.msg;
                else {
                    var data = json.data || {};
                    if (data.empiric) content = "经验值 × " + data.empiric;
                    if (false != data.card && "false" != data.card) {
                        state = "成功";
                        content = "获得 " + ["萧炎", "莫凡", "乔安好", "叶修", "陈长生"][data.card - 1];
                    }
                }
                info(json, task, content, state);
            });
        },
        answerQuestion = function answerQuestion() {
            var state, content, question, index, xhr;
            var date = new Date().toLocaleDateString("br", {
                timeZone: "Asia/Shanghai"
            }),
                task = "每日一答",
                getQuestion = function getQuestion() {
                    var doc =
                        arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : document;
                    return JSON.parse(
                        $("script", doc)
                        .last()
                        .text()
                        .split("question.init(")
                        .pop()
                        .split(',"yourAnswer')
                        .shift() + "}"
                    );
                },
                answer =
                (date === sessionStorage.date && sessionStorage.answer) ||
                ((question =
                  "superstar" === location.pathname.split("/").pop()
                  ? getQuestion()
                  : ((xhr = new XMLHttpRequest()),
                     xhr.open("get", "/2017/yearsCheck/superstar", false),
                     xhr.send(),
                     getQuestion(
                    new DOMParser().parseFromString(xhr.responseText, "text/html")
                ))),
                 (index =
                  answerIndex ||
                  +prompt(
                    [
                        question.content,
                        question.question,
                        "0:随机",
                        question.answers
                        .map(function(answer, index) {
                            return index + 1 + ":" + answer;
                        })
                        .join("\n"),
                        "选择："
                    ].join("\n"),
                    0
                )),
                 question.answers[
                    0 < index ? index - 1 : Math.floor(3 * Math.random())
                ]);
            $.post("/ajax/communityStar/answerQuestion", { answer: answer }, function(
                   json
            ) {
                if (json.code != 0) content = json.msg;
                else {
                    var data = json.data || {};
                    if (Object.keys(data).length) {
                        sessionStorage.date = date;
                        sessionStorage.answer = data.correctAnswer;
                        if (data.correct) {
                            state = "正确";
                            content =
                                "<p>\u83B7\u5F97\u300C\u4E54\u5B89\u597D \xB7 \u5E78\u8FD0\u724C\u300D\u7ECF\u9A8C+" +
                                data.empiric +
                                "</p>";
                        } else {
                            state = "错误";
                            content =
                                "<p>\u7ECF\u9A8C+" +
                                data.empiric +
                                "<br>\u6B63\u786E\u7B54\u6848\u662F " +
                                data.correctAnswer +
                                "</p>";
                        }
                    }
                }
                info(json, task, content, state);
            });
        },
        share = function share() {
            var state, content;
            var task = "活动分享";
            $.post(
                "/ajax/shortHoliday/shared?activityId=60635275",
                { type: "share" },
                function(json) {
                    return 0 != json.code
                        ? (content = json.msg)
                    : ((state = "成功"),
                       (content = ""),
                       $.post(
                        "/ajax/shortHoliday/getAward?activityId=60635275",
                        {
                            taskType:
                            "share" /* 任务类型 share|takeDot|giveDot|listenDot|flower */
                        },
                        function(json) {
                            var task = "领圣诞袜";
                            if (json.code != 0) content = json.msg;
                            else {
                                var data = json.data || {};
                                if (data.surPlusNum) {
                                    state = "成功";
                                    content = "圣诞袜+1";
                                }
                                $.post(
                                    "/ajax/component/cardDraw?activityId=60635275&orderId=0",
                                    { index: Math.floor(Math.random() * 6) },
                                    function(json) {
                                        var task = "拆礼物";
                                        if (json.code != 0) content = json.msg;
                                        else {
                                            var _data = json.data || {};
                                            if (_data.prizeId) {
                                                state = "获得";
                                                content = [
                                                    "起点币×99",
                                                    "起点币×19",
                                                    "经验值×19",
                                                    "2017圣诞徽章",
                                                    "畅读券×1",
                                                    "叶修·天赋牌"
                                                ][_data.prizeId - 1];
                                            }
                                        }
                                        info(json, task, content, state);
                                    }
                                );
                            }
                        }
                    ),
                       info(json, task, content, state));
                }
            );
        },
        vote = function vote(all) {
            var state, content;
            var task = "投评价票";
            if (all) {
                var xhr = new XMLHttpRequest();
                xhr.open("get", "/ajax/popularity/surplusItem", false);
                xhr.send();
                voteNum=JSON.parse(xhr.responseText).data.surplusItem;
            }
            $.post(
                "/ajax/popularity/vote",
                Object.assign(voteInfo, { num: voteNum }),
                function(json) {
                    if (json.code != 0) content = json.msg;
                    else {
                        var data = json.data || {};
                        if (data.code == 0) {
                            state = "成功";
                            content =
                                "<p class=ticket><span class=c-red>" +
                                voteNum +
                                "</span> \u7968</p>\u6295\u7ED9 <span class=c-main>" +
                                voteInfo.actor +
                                "</span>" +
                                (voteInfo.type === "comic" ? "（动漫）" : "");
                        }
                    }
                    info(json, task, content, state);
                }
            );
        },
        like = function like() {
            likeIDs.forEach(function(commentId) {
                $.post("/ajax/popularity/like", { commentId: commentId });
            });
        };
    load();
})(
    /* 问答序号 */
    1,
    /* 点赞评论ID(右击【点赞❤】‘检查/审查元素’，对应data-id值)如 [859477,] */
    [863139]/* 不投票去掉右边的星斜杠 */,
    /* 评选票设定:信息(右击【投票】‘检查/审查元素’，对应data-info值),数量 不投票去掉右边的星斜杠 */
    //{ actor: "叶修", bookId: 1887208, type: "comic" },
    {"actor":"林苏青","bookId":1010298084,"type":"book"},
    1/**/
);
