// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.3.20171029
// @description  自动领取起点经验、活跃度礼包
// @author       xyau
// @match        http*://my.qidian.com/*
// @match        http*://bbs.qidian.com/signeveryday.aspx*
// @match        http*://forum.qidian.com/index/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidianAutoGetExp.user.js
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// ==/UserScript==
window.addEventListener('load', function() {
	'use strict';
	const guid = +/ywguid=(\d+);/.exec(document.cookie)[1],
		  date = new Date(new Date().getTime() + 288e5).toJSON().substr(0, 10),
		  url = location.href,
		  bids = [24857, 88071, 1039430, 1887208, 3206900];

	if (/forum/.test(url) && bids.includes(+g_data.bid)) {
		var eS = $('.blue-btn');
		if (eS.hasClass('forum-sign'))
			eS.click();
		}

	// 在线经验
	if (/level/.test(url)) {
		var eE = $('#elTaskWrap a');
		if (eE.length) {
			let text = eE.text();
			if (text === '领取')
				eE.click();
			else {
				let oE = new MutationObserver((ms) => ms.forEach(m => eE.click()));
				oE.observe(eE[0], {attributes: true});
			}
		}

		// 旧经验
		let lastGet = GM_getValue(guid);
		if (!lastGet || date != lastGet) {
			$.each([157811195,124536726,5393042,1129498,103646169], (_, uid) =>	open('https://my.qidian.com/user/'+uid));// 访问书友UID
			$.each(bids, (_, bid) => open('https://forum.qidian.com/NewForum/List.aspx?forumId='+bid));// 论坛签到
			$.ajax({
				url: '/ajax/score/ExchangeOld',
				type: 'post',
				data: /(_csrfToken=\w+)(?:;|$)/.exec(document.cookie)[1],
			}).then((r) => {
				$('#elOldexp').append(r.msg);
				console.log(r);
				if (r.code === 0 || r.code === -1000006)
					GM_setValue(guid, date);
			});
		}
	}

	// 活跃度礼包
	var eA = $('#elTaskPackage'),
		getGift = () => {
			var eAB = $("a.elGetGift").toArray();
			if (eAB.length)
				$.each(eAB, (_, e) => e.click());
		};
	if (eA && eA.length) {
		getGift();
		let oA = new MutationObserver((ms) => ms.forEach(getGift));
		oA.observe(eA[0], {attributes: true});
	}

	// 天天打卡
	if (/signeveryday/.test(url) && document.querySelector('.BDtop2left3 img').src.includes('2')) {
		new Ajax('/Ajax/SignHandler.ashx',
				 'content=&type=3&img=a&random=',
				 (r) => document.querySelector('.BDtop2right').append(/result:(\d+)/g.exec(r)[1] ? '签到成功' : /'(.+)'/.exec(r)[1]),
				 'post',
				 'addusersign');
	}
}, false);