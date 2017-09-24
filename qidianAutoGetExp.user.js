// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.2.20170925
// @description  自动领取起点经验、活跃度礼包
// @author       xyau
// @match        http*://my.qidian.com/*
// @match        http*://bbs.qidian.com/signeveryday.aspx
// @match        http*://forum.qidian.com/index/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidianAutoGetExp.user.js
// @grant        none
// ==/UserScript==
window.addEventListener('load', function() {
    'use strict';
    var url = location.href;
    if (/forum/.test(url)) {
        document.querySelector('.forum-sign').click();
    }
    // 在线经验
    if (/level/.test(url)) {
        function rE() {
            var a = document.querySelector("a.elGetExp");
            if (a) {
                a.click();
                eE = clearInterval(eE);
            }
        }
        var eE = setInterval(rE, 100);
        document.getElementById('elOldexp').click();

        function rO() {
            var o = document.querySelector('.ui-dialog .ui-button');
            if (o) {
                o.click();
                document.querySelector('.ui-dialog-close').click();
                eO = clearInterval(eO);
            }
        }
        var eO = setInterval(rO, 100);
    }
    // 活跃度礼包
    if (document.querySelector('#elActive')) {
        function rA() {
            if (!document.querySelector('.ui-loading-icon')) {
                document.querySelectorAll("a.elGetGift").forEach(function(e) {
                    e.click();
                });
                eA = clearInterval(eA);
            }
        }
        var eA = setInterval(rA, 100);
    }
    // 天天打卡
    if (/signeveryday/.test(url)) {
        var params = "content=&type=3&img=a&random=";
        new Ajax("/Ajax/SignHandler.ashx",
                 params,
                 function() {
            var objresult = eval(arguments[0]);
            if (objresult.result) {
                //location.reload(true);
                // 签到论坛书号
                var bids=[24857, 88071, 1039430, 1887208, 3206900];
                // 访问书友UID
                var uids=[157811195,124536726,5393042,1129498,103646169];
                uids.forEach(function(e){
                    window.open('http://my.qidian.com/user/'+e);
                });
                bids.forEach(function(e){
                    window.open('http://forum.qidian.com/NewForum/List.aspx?forumId='+e);
                });
            } else {
                TipsDialog('提示', objresult.returnString, '');
                obj.setAttribute("onclick", "AddSign(this)");
            }
        },
                 "post",
                 "addusersign");
    }
}, false);
