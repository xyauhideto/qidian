// ==UserScript==
// @name         515ya
// @version      0.1
// @description  2017起点515红包押宝
// @author       xyau
// @run-at         document-start
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/515ya.user.js
// @include *activity.qidian.com/2017/515/luckyMoney*
// ==/UserScript==

//参数
//球数
n = 19;
//等待搜索结果延迟
delay = 1000;
//是否自动投票
autoYa = 1;
//投票间隔，单位毫秒
interval = 400;

window.addEventListener('DOMContentLoaded', 
                        function() {
    $('.catlog')[1].click();
    $('#keyword')[0].value='天醒之路';
    $('.search-submit')[0].click();
    setTimeout(function(){eval("$('#ya2Btn')[0].click();$('#ya2Btn')[0].click();if(autoYa==1){var i=0;function r(){$('#ya3Btn')[0].click();i++;if(i==n)clearInterval(e);}var e=setInterval(r,"+interval+")}");},delay);
    },
                        false);
