// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.3.2017111422
// @description  自动领取起点经验、活跃度礼包
// @author       xyau
// @match        http*://my.qidian.com/*
// @match        http*://bbs.qidian.com/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidianAutoGetExp.user.js
// @grant		GM_getValue
// @grant		GM_setValue
// @run-at		document-start
// ==/UserScript==
window.addEventListener('load', () => {
	'use strict';
	const match = /ywguid=(\d+)/.exec(document.cookie),
		  guid = match ? +match[1] : 0,
		  date = new Date(new Date().getTime() + 288e5).toJSON().substr(0, 10),
		  lastGet = GM_getValue(guid),
		  unChecked = !lastGet || date !== lastGet,
		  host = location.host,
		  uids = [157811195,124536726,5393042,1129498,103646169], // 访问书友UID
		  bids = [24857, 88071, 1039430, 1887208, 3206900]; // 论坛签到书号

	if (host.startsWith('my')) {
		$('.qdp-content')
			.prepend('<h3 class=qdp-title>自动领取</h3><div class="qdp-head _autoGet" style=margin-bottom:12px><span></span></div>');

		// 在线经验
		const eE = $('#elTaskWrap a');
		if (eE.length) {
			if (eE.hasClass('elGetExp'))
				eE.click();
			else {
				$('._autoGet').prepend(`在线经验包${eE.data('num')}: `);
				const oE = new MutationObserver(
					ms => {
						if (eE.hasClass('elGetExp'))
							eE.click();
						else
							$('._autoGet span:first').text(eE.text());});
				oE.observe(eE[0], {attributes: true, childList: true});
			}
		}

		const style = {
			width: '100%',
			display: 'none',
		};

		if (unChecked) {

			// 访问书友
			uids.forEach(uid =>	$('body').prepend(
				$('<iframe></iframe>')
				.css(style)
				.load(function() {$(this).remove();})
				.attr('src', '/user/' + uid)
			)
						);

			// 论坛签到
			bids.forEach(bid => $('body').prepend(
				$('<iframe></iframe>')
				.css(style)
				.load(function() {
					const f = $(this),
						  w = f.prop('contentWindow');
					w.$.post(
						'/ajax/my/BookForum/signIn',
						{forumId:  w.g_data.forumId},
						r => r.code ? (w.$('.blue-btn').append(r.msg), f.css({display: ''})) : f.remove()
					);
				}).attr('src', '//forum.qidian.com/NewForum/List.aspx?forumId=' + bid)
			)
						);

			// 旧经验
			$.post('/ajax/score/ExchangeOld', r => {
				$('_autoGet').append(r.msg);
				if ([0, -1000006].includes(r.code))
					setTimeout(() => GM_setValue(guid, date), 5000);
			});
		}
		// 天天打卡
		// const win = open('//passport.qidian.com/mobile/login?returnurl=https%3A%2F%2Fbbs.qidian.com%2Fsigneveryday.aspx');
		const match = document.cookie.match(/__CONTEXT_BBS_KEY__ ?= ?[^; ]+/g),
			  nickName = g_data.user.nickName,
			  bbsNick = () => match ? decodeURIComponent(match[0]).split('|')[4] : '',
			  isDifferent = () => bbsNick() && bbsNick() !== nickName,
			  src = '//bbs.qidian.com/signeveryday.aspx',
			  frame =  $('<iframe></iframe>')
		.css(style)
		.load(function() {
			console.log(bbsNick(), nickName);
			const f = $(this);
			if (!bbsNick() || isDifferent())
				f.css('display', '');
			f.prop('contentWindow')
				.postMessage(JSON.stringify(isDifferent() ? {nickName} : {}), 'https://bbs.qidian.com');
		})
		.attr('src', src)
		.get(0);
		$('body').prepend(frame);
		$(this).bind('message', (e) => {
			const d = JSON.parse(e.originalEvent.data);
			console.log(d, isDifferent(), frame.src);
			if (d.result && ![0, 1].includes(+d.result))
				$('._autoGet').append(d.returnString);
			else if (!isDifferent())
				setTimeout(frame.remove, 5000);
		});
		//}

		// 活跃度礼包
		$.getJSON(
			'/ajax/userActivity/mission',
			r => r.data.bagList.forEach(
				bag => 1 !== bag.status ? 0 :
				$.post(
					'/ajax/userActivity/take',
					{bagId: bag.bagId},
					r => $('_autoGet').append(`<p>领取活跃度${bag.score}礼包${r.data.award}</p>`)
				)
			)
		);
	}

	// 天天打卡
	if (host.startsWith('bbs')) {
		addEventListener(
			'message',
			e => {
				const d = JSON.parse(e.data),
					  o = 'https://my.qidian.com';
				console.log(d);
				if (d.nickName) {
					qdLogout();
					setTimeout(location.reload, 5000);
				} else if (d.data && !d.data.code) {
					open('/')
						.addEventListener(
						'message',
						function(){
							if (this.location.host.startsWith('my'))
								this.open(`http://bbs.qidian.com/VLogin.aspx?rtnUrl=http://bbs.qidian.com/signeveryday.aspx${
						 Object.entries(d.data.data).reduce((t, [k, v]) => t+=`&${k}=${v}`, '')}`, '_self');
							else {
								this.opener.location.reload();
								this.close();
							}
						}
					);
				} else if (!checkLoginByCookie())
					qdLogin();
				else
					new Ajax(
						'/Ajax/SignHandler.ashx',
						'type=3&img=a',
						r => setTimeout(() => {
							parent.postMessage(JSON.stringify(eval(r)), o);
							//if (confirm('打卡成功，是否登出？'))qdLogout();
						}, 5000),
						'post',
						'addusersign'
					);

			}
		);
	}
}, false);