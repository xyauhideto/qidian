// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.3.2017112221
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
		  // autoLogout = true,
		  autoLogout = false,
		  guid = match ? +match[1] : 0,
		  date = new Date(new Date().getTime() + 288e5).toJSON().substr(0, 10),
		  host = location.host,
		  bbsKey = `bbs${guid}`,
		  bbsValue = () => GM_getValue(bbsKey, '');
	// bids = [24857, 88071, 1039430, 1887208, 3206900]; // 论坛签到书号

	if (host.startsWith('my') && $('.qdp-content').length) {
		$('.qdp-content')
			.prepend('<h3 class=qdp-title>自动领取</h3><div class="qdp-head _autoGet" style=padding:12px><span></span></div>');
		const info = text => $('._autoGet').prepend(`<p>${text}</p>`);

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

		// 活跃度礼包
		$.getJSON(
			'/ajax/userActivity/mission',
			r => r.data.bagList.forEach(
				bag => 1 !== bag.status ? 0 :
				$.post(
					'/ajax/userActivity/take',
					{bagId: bag.bagId},
					r => info(`领取活跃度${bag.score}礼包${r.data.award}`)
				)
			)
		);

		const style = {
			width: '100%',
			display: 'none',
		};

		// 论坛签到
		const forumKey = `forum${guid}`,
			  fids = {
				  '22277657000074302': '独闯天涯',
				  '22300167000689402': '星照不宣',
				  '22344706000284502': '网游之近战法师',
				  '22322981000467402': '全职高手',
				  '22661933000779002': '天醒之路',
			  };
		let forumValue = () => GM_getValue(forumKey, '');
		if (! forumValue() || ! forumValue().match(date)) {
			GM_setValue(forumKey, date);
		}
		if (! forumValue().match(/,/g) || Object.keys(fids).length > forumValue().match(/,/g).length) {
			$('body').prepend(
				$('<iframe></iframe>')
				.css(style)
				.load(function() {
					const f = $(this),
						  w = f.prop('contentWindow'),
						  check = setInterval(() => {
							  if (forumValue().match(/,/g) && Object.keys(fids).length <= forumValue().match(/,/g).length) {
								  clearInterval(check);
								  f.remove();
							  }
						  }, 2e3);
					for (let forumId in fids) {
						if (! forumValue().includes(forumId))
							w.$.post(
								'/ajax/my/BookForum/signIn',
								{forumId},
								r => {
									info(`<a href=//forum.qidian.com/index/${forumId} class=blue target=_blank>${fids[forumId]}</a>: ${r.msg}`);
									if (+r.code === 0)
										GM_setValue(forumKey, forumValue() + `,${forumId}`);
								}
							);
					}
				}).attr('src', '//forum.qidian.com/NewForum/List.aspx?forumId=3206900')
			);
		}

		// 访问书友
		const userKey = `user${guid}`,
			  uids = [157811195,124536726,5393042,1129498,103646169]; // 访问书友UID
		let userValue = GM_getValue(userKey, '');
		if (! userValue || ! userValue.match(date)) {
			userValue = date;
			GM_setValue(userKey, userValue);
		}
		if (! userValue.match(/,/g) || uids.length > userValue.match(/,/g).length) {
			uids.forEach(uid =>	{
				if (! userValue.includes(uid))
					$('body').prepend(
						$('<iframe></iframe>')
						.css(style)
						.load(function() {
							$(this).remove();
							userValue += `,${uid}`;
							GM_setValue(userKey, userValue);
						})
						.attr('src', '/user/' + uid)
					);
			}
						);
		}

		// 旧经验
		const lastGet = GM_getValue(guid, '');
		if (! lastGet || date !== lastGet) {
			$.post('/ajax/score/ExchangeOld', r => {
				info(r.msg);
				if ([0, -1000006].includes(r.code))
					GM_setValue(guid, date);
			});
		}

		// 天天打卡
		if (! bbsValue() || date !== bbsValue()) {
			const frame = $('<iframe></iframe>').
			css(style).
			load(function() {
				const w = $(this).prop('contentWindow'),
					  check = setInterval(() => {
						  if (! bbsValue() || date !== bbsValue())
							  w.postMessage(g_data.user.nickName, 'https://bbs.qidian.com');
						  else {
							  clearInterval(check);
							  $(this).remove();
							  info('打卡成功！');
						  }
					  }, 2e3);
			}).
			attr('src', '//bbs.qidian.com/signeveryday.aspx').
			get(0);
			$('body').prepend(frame);
			addEventListener('message', event => {console.log(origin, event);//debugger;
				if ('relogin' !== event.data)
					info(event.data);
				else
					location.reload();
			});
		}

	}

	// 天天打卡
	if (host.startsWith('bbs')) {
		if (! bbsValue() || date !== bbsValue()) {
			const match = () => document.cookie.match(/__CONTEXT_BBS_KEY__ ?= ?[^; ]+/g),
				  bbsNick = () => match() ? decodeURIComponent(match()[0]).split('|')[4] : '';
			if (! location.protocol.includes('s')) {
				if (document.querySelector('.before')) {
					qdLogin();
				} else {
					if (opener) {
						opener.postMessage('', 'https://bbs.qidian.com');
						close();
					}
				}
			} else {
				if (document.querySelector('.before'))
					open('http://bbs.qidian.com/signeveryday.aspx');
				addEventListener('message', event => {console.log(event);
					const checkin = () =>
					new Ajax(
						'/Ajax/SignHandler.ashx',
						'type=3&img=a',
						r => {
							if (/:1}|已/.test(r)) {
								GM_setValue(bbsKey, date);
								if (autoLogout && confirm('打卡成功，是否登出？')) qdLogout();
							} else if (top !== window) {
								top.postMessage(r, 'https://my.qidian.com');
							}
						},
						'post',
						'addusersign'
					);
					if (event.origin === 'http://bbs.qidian.com') {
						checkin();
					}
					if (event.origin === 'https://my.qidian.com') {
						if (event.data !== bbsNick()) {
							open('http://bbs.qidian.com/signeveryday.aspx');
							if ('' !== bbsNick() && top !== window) {
								qdLogout();
								setTimeout(() => top.postMessage('relogin', 'https://my.qidian.com'), 2e3);
							}
						} else
							checkin();
					}
				});

			}
		}

	}
}, false);