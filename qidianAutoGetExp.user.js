// ==UserScript==
// @name         qidianAutoGetExp
// @namespace    https://greasyfork.org/users/10290
// @version      1.3.2018042009
// @description  自动领取起点经验、活跃度礼包
// @author       xyau
// @match        http*://my.qidian.com/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidianAutoGetExp.user.js
// @grant		GM_getValue
// @grant		GM_setValue
// @run-at		document-start
// ==/UserScript==

(function exp() {
	'use strict';
	try {
		const match = /ywguid=(\d+)/.exec(document.cookie),
			  autoLogout = false,
			  guid = match ? +match[1] : 0,
			  date = new Date(Date.now() + 288e5).toJSON().substr(0, 10),
			  host = location.host,
			  title = document.title;

		if (host.startsWith('my') && $('.qdp-content').length) {
			const info = text => {
				if (!$('._autoGet').length)
					$('.qdp-content')
						.prepend('<h3 class=qdp-title>自动领取</h3><div class="qdp-head _autoGet" style=padding:12px><span></span></div>');
				$('._autoGet').prepend(`<p>${text}</p>`);
			};

			// 在线经验
			const eE = $('#elTaskWrap a');
			if (eE.length) {
				if (eE.hasClass('elGetExp'))
					eE.click();
				else {
					const oE = new MutationObserver(
						ms => {
							if (eE.hasClass('elGetExp'))
							{eE.click();debugger;}
							else
								document.title = `${eE.text()}|${eE.data('num')} ${title}`;
						});
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
					  '10407521503965603': '王者时刻',
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
			const userKey = `user${guid}`;
			let userValue = GM_getValue(userKey, '');
			if (! userValue || ! userValue.match(date)) {
				userValue = date;
				GM_setValue(userKey, userValue);
			}
			if (! userValue.match(/,/g) || 5 > userValue.match(/,/g).length) {
				[157811195,124536726,5393042,1129498,103646169]
					.forEach(uid =>	{
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
		}
	}
	catch (ReferenceError) {
		setTimeout(exp, 100);
	}
})();