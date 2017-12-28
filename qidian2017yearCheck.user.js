// ==UserScript==
// @name         Qidian 2017 year check
// @namespace    https://github.com/xyauhideto/
// @version      0.1
// @description  2017起点年终盛典
// @author       xyau
// @match        http*://activity.qidian.com/2017/yearsCheck/*
// @downloadURL       https://github.com/xyauhideto/qidian/raw/master/qidian2017yearCheck.user.js
// ==/UserScript==

(function year2017() {
	'use strict';
	const /* 动作执行 */
	load = () => {
		summon();share();like();
		/*vote();*/
		answerQuestion();
	},
		  /* 评选票设定 */
		  toVote = {
			  actor: '叶修', /* 角色 */
			  bookId: 1887208, /* 书号 */
			  type: 'comic', /* 类型 comic|book */
			  num: 1 /* 数量 */
		  },
		  /* 点赞评论 */
		  toLike = [859477],
		  infoBox = (!$('.info-box').length &&
					 $('body').prepend($('<div class=info-box style=z-index:9999;position:fixed;max-height:360px;overflow-y:auto;background:rgba(255,255,255,.8);padding:5px><p><span style=cursor:pointer onclick=$(".info-box").remove()>[关闭]</span></p></div>')),
					 $('.info-box')),
		  info = (json, task, content, state='失败') => {
			  console.log(task, json);
			  infoBox.append($(`<p><b>${task}</b> <i>${state}</i> ${content}</p>`));
		  },
		  summon = () => {
			  var state, content;
			  const task = '卡牌召唤';
			  $.post(
				  '/ajax/CharacterCard/summon',
				  {precision: 1},
				  json => {
					  if (json.code != 0) content = json.msg;
					  else {
						  const data = json.data || {};
						  if (data.empiric) content = '经验值 × ' + data.empiric;
						  if (false != data.card && 'false' != data.card) {
							  state = '成功';
							  content = '成功召唤出 ' + ['萧炎','莫凡','乔安好','叶修','陈长生'][data.card-1];
						  }
					  }
					  info(json, task, content, state);
				  });
		  },
		  answerQuestion = () => {
			  var state, content, question, index, xhr;
			  const date = new Date().toLocaleDateString('br', {timeZone: 'Asia/Shanghai'}),
					task = '每日一答',
					getQuestion = (doc=document) => JSON.parse($('script',doc).last().text().split('question.init(').pop().split(',"yourAnswer').shift()+'}'),
					answer = date === sessionStorage.date && sessionStorage.answer || (
						question = 'superstar' === location.pathname.split('/').pop() ? getQuestion() : (
							(xhr = new XMLHttpRequest()),
							xhr.open('get','/2017/yearsCheck/superstar',false),
							xhr.send(),
							getQuestion(new DOMParser().parseFromString(xhr.responseText, 'text/html'))
						), (index = +prompt([question.content, question.question, '0:随机',
											 question.answers.map((answer, index) => `${index+1}:${answer}`).join('\n'), '选择：'].join('\n'),
											0
										   )), question.answers[0 < index ? index - 1 : Math.floor(3*Math.random())]
					);
			  $.post(
				  '/ajax/communityStar/answerQuestion',
				  {answer},
				  json => {
					  if (json.code != 0) content = json.msg;
					  else {
						  const data = json.data || {};
						  if (Object.keys(data).length) {
							  sessionStorage.date = date;
							  sessionStorage.answer = data.correctAnswer;
							  if (data.correct) {
								  state = '正确';
								  content = `<p>获得「乔安好 · 幸运牌」经验+${data.empiric}</p>`;
							  } else {
								  state = '错误';
								  content = `<p>经验+${data.empiric}<br>正确答案是 ${data.correctAnswer}</p>`;
							  }
						  }
					  }
					  info(json, task, content, state);
				  });
		  },
		  share = () => {
			  var state, content;
			  const task = '活动分享';
			  $.post('/ajax/shortHoliday/shared?activityId=60635275',
					 {type: 'share'},
					 json => (0 != json.code ?
							  (content = json.msg) : (
				  (state = '成功'), (content = ''),
				  $.post('/ajax/shortHoliday/getAward?activityId=60635275',
						 {taskType: 'share'}, /* 任务类型 share|takeDot|giveDot|listenDot|flower */
						 json => {
					  const task = '领圣诞袜';
					  if (json.code != 0) content = json.msg;
					  else {
						  const data = json.data || {};
						  if (data.surPlusNum) {
							  state = '成功';
							  content = '圣诞袜+1';
						  }
						  $.post('/ajax/component/cardDraw?activityId=60635275&orderId=0',
								 {index: Math.floor(Math.random()*6)},
								 json => {
							  const task = '拆礼物';
							  if (json.code != 0) content = json.msg;
							  else {
								  const data = json.data || {};
								  if (data.prizeId) {
									  state = '获得';
									  content = ['起点币×99',
												 '起点币×19',
												 '经验值×19',
												 '2017圣诞徽章',
												 '畅读券×1',
												 '叶修·天赋牌'][data.prizeId-1];
								  }
							  }
							  info(json, task, content, state);
						  });
					  }
				  }),
				  info(json, task, content, state)
			  )
							 )
					);
		  },
		  vote = () => {
			  var state, content;
			  const task = '投评价票';
			  $.post('/ajax/popularity/vote',
					 toVote,
					 json => {
				  if (json.code != 0) content = json.msg;
				  else {
					  const data = json.data || {};
					  if (data.code == 0) {
						  state = '投票成功';
						  content = `<p class=ticket><span class=c-red>${toVote.num}</span> 票</p>投给 <span class=c-main>${toVote.actor}</span>${toVote.type === 'comic' ? '（动漫）' : ''}  票`;
					  }
				  }
				  info(json, task, content, state);
			  });
		  },
		  like = () => toLike.forEach(commentId => $.post('/ajax/popularity/like',{commentId}));
	load();
})();