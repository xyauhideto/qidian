// ==UserScript==
// @name         515 daily
// @version      0.2
// @description  2017起点515活动自动
// @author       xyau
// @run-at         document-start
// @include *activity.qidian.com/2017/515*
// @include *www.yuewen.com/app*
// @include *acts.qidian.com/2017/5813823*
// ==/UserScript==
//自定义参数,是为1，否为0
//自动投赞赏
autoVote = 1;
//领取礼包
getBag = 1;
//赞赏、宝球自动刷新
autoRefresh = 0;
window.addEventListener('DOMContentLoaded', 
                        function() {
url = location.href;
    // 自动投赞赏
if(autoVote==1&&/godLink/i.test(url)){n=$('.name'); for(var i=0;i<n.length;i++){if(/蝴蝶蓝/.test(n[i].innerText)){n[i].nextElementSibling.nextElementSibling.firstChild.click();break;}} if(parseInt($('.my-vote-number')[0].innerText)>0){$("a[title='充值']").slice(-1)[0].click();$("a[data-click='voteApply']")[0].click();}if(autoRefresh==1)setTimeout('location.reload()', 2500)}
    if(getBag==1){
    // 自动领礼包并发帖
if(/jhMeet/i.test(url)){bu=$('li[data-type]');var j=0;function r(){bu[j].click();$('a[title="领取"]')[1].click();j++;if(j==2)clearInterval(e);}var e=setInterval(r,500);be=$('li[data-num]');var k=0;function re(){be[k].click();$('a[title="领取"]')[0].click();k++;if(k==4)clearInterval(ee);}var ee=setInterval(re,500);setTimeout(function(){$('a[title="发帖"]')[0].click();},2500);}
} else{
    // 仅自动发帖
if(/jhMeet/i.test(url))$('a[title="发帖"]')[0].click();
}
    // 从APP推广页后退
    if(!/515/i.test(url))location.href='http://activity.qidian.com/2017/515/jhMeet';
    // 自动回问答
    if(/faceToFace/i.test(url)){$('#myAnswerContent')[0].value="233";$('button')[0].click();}
    // 自动开宝球
if(/orbLib/i.test(url)){$('a.btn').slice(-1)[0].click();if(autoRefresh==1)setTimeout('location.reload()', 500)}
},
  false);