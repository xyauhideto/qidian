// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.3.2017103117
// @description  自动领取起点经验、活跃度礼包
// @author       xyau
// @match        http*://my.qidian.com/level*
// @match        http*://bbs.qidian.com/signeveryday.aspx*
// @match        http*://forum.qidian.com/index/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidianAutoGetExp.user.js
// @grant		GM_getValue
// @grant		GM_setValue
// @run-at		document-start
// ==/UserScript==
window.addEventListener('load', () => {
	'use strict';
	const guid = +/ywguid=(\d+)(?:;|$)/.exec(document.cookie)[1],
		  _csrfToken = /_csrfToken=(\w+)(?:;|$)/.exec(document.cookie)[1],
		  date = new Date(new Date().getTime() + 288e5).toJSON().substr(0, 10),
		  url = location.pathname,
		  uids = [157811195,124536726,5393042,1129498,103646169], // 访问书友UID
		  bids = [24857, 88071, 1039430, 1887208, 3206900]; //论坛签到书号

	if (/index/.test(url) && bids.includes(+g_data.bid) && !$('.blue-btn').hasClass('signed'))
		$.ajax({
			url: '/ajax/my/BookForum/signIn',
			type: 'post',
			data: {
				_csrfToken,
				forumId:  g_data.forumId,
			},
		}).then(r=>$('.blue-btn').append(r.msg));

	// 在线经验
	if (/level/.test(url)) {
		let eE = $('#elTaskWrap a');
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
			uids.forEach(uid =>	open('https://my.qidian.com/user/' + uid));
			bids.forEach(bid => open('https://forum.qidian.com/NewForum/List.aspx?forumId=' + bid));
			$.ajax({
				url: '/ajax/score/ExchangeOld',
				type: 'post',
				data: {_csrfToken},
			}).then((r) => {
				$('#elOldexp').append(r.msg);
				console.log(r);
				if (r.code === 0 || r.code === -1000006)
					GM_setValue(guid, date);
			});
		}

		// 活跃度礼包
		$.ajax({
			url: '/ajax/userActivity/mission',
			type: 'get',
			data: {_csrfToken},
		}).then(r => r.data.bagList.filter(bag => bag.status === 1).forEach(bag =>
																			$.ajax({
			url: '/ajax/userActivity/take',
			type: 'post',
			data: {
				_csrfToken,
				bagId: bag.bagId,
			},
		}).then(r => $('#elTaskButton').after(`<p>领取活跃度${bag.score}礼包${r.data.award}</p>`))));
	}

	// 天天打卡
	if (/signeveryday/.test(url) && document.querySelector('.BDtop2left3 img').src.includes('2')) {
		new Ajax('/Ajax/SignHandler.ashx',
				 {type: 3, img: 'a'},
				 r => document.querySelector('.BDtop2right').append(/result:(\d+)/g.exec(r)[1] ? '签到成功' : /'(.+)'/.exec(r)[1]),
				 'post',
				 'addusersign');
	}
}, false);