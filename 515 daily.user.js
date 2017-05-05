// ==UserScript==
// @name         515 daily
// @version      0.3.3
// @description  2017起点515活动自动
// @author       xyau
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/515%20daily.user.js
// @run-at         document-start
// @include *activity.qidian.com/2017/515*
// @include *www.yuewen.com/app*
// @include *acts.qidian.com/2017/5813823*
// ==/UserScript==

//功能开关,是为1，否为0
//投票对象
author = '蝴蝶蓝';
//自动投赞赏
autoVote = 1;
//赞赏全投，否则投1张
voteAll = 0;
//自动兑称号
autoExchange = 1;
//自动发贴分享
autoShare = 1;
//领取礼包
getBag = 1;
//自动回答问题
autoAnswer = 1;
//自定义回答内容
answer = '233';
//自动开宝球
autoOpen = 1;
//赞赏、宝球自动刷新
autoRefresh = 1;
//自动刷新间隔，单位毫秒
interval = 1500;

window.addEventListener('DOMContentLoaded', 
                        function() {
url = location.href;
    // 投赞赏
if(autoVote==1&&/godLink/i.test(url)){eval("$('a[data-info*="+author+"]')[0].click()");if($('.my-vote-number')[0].innerText>0){if(voteAll==1)$("a[title='充值']").slice(-1)[0].click();$("a[data-click='voteApply']")[0].click();}if(autoRefresh==1)setTimeout('location.reload()', interval);}
	// 兑称号
if(autoExchange==1&&/godLink/i.test(url)){setTimeout(function(){eval("$('a[data-info*="+author+"]')[1].click()");$("a[data-click='toExChange']")[0].click();},autoVote==1?500:0);}
    if(getBag==1){
    // 领礼包并发帖
if(autoShare==1&&/jhMeet/i.test(url)){bu=$('li[data-type]');var j=0;function r(){bu[j].click();$('a[title="领取"]')[1].click();j++;if(j==2)clearInterval(e);}var e=setInterval(r,200);be=$('li[data-num]');var k=0;function re(){be[k].click();$('a[title="领取"]')[0].click();k++;if(k==4)clearInterval(ee);}var ee=setInterval(re,200);setTimeout(function(){$('a[title="发帖"]')[0].click();},1000);}
} else{
    // 仅发帖
if(autoShare==1&&/jhMeet/i.test(url))$('a[title="发帖"]')[0].click();
}
    // 从APP推广页后退
    if(!/515/i.test(url))setTimeout("location.href='https://activity.qidian.com/2017/515/jhMeet';",1500);
    // 回问答
if(autoAnswer==1&&/faceToFace/i.test(url)){$('#myAnswerContent')[0].value=answer;$('button')[0].click();}
    // 开宝球
if(autoOpen==1&&/orbLib/i.test(url)){$('a.btn').slice(-1)[0].click();if(autoRefresh==1)setTimeout('location.reload()', interval*2)}
},
  false);
