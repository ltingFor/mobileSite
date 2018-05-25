(function(w,j,r,h,l,t){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || ''),
		term = param_obj.term,
		rewardType = param_obj.rewardType,//奖励类型，1红包  3加息券
		amount = param_obj.amount || 0,
		prizeId = decodeURIComponent(param_obj.prizeId || ''),//红包ID
		LOCK = param_obj.LOCK,//红包锁定的开关
		balance = param_obj.balance;//红包金额
	/*if(prizeId){
		prizeId = decodeURIComponent(prizeId);
	}
	*/
	param_obj.token = '';//token提交时使用，避免重复提交
	var btn = j('#btn'),
		tenders = j('#tenders');
	tenders.delegate('.tenders_li','click',function(){//绑定跳转到详情页面
		var id = encodeURIComponent(j(this).attr('id'));
		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+"&tid="+id+"&v="+Math.random();
	});
	btn.bind('click',function(){
		var that = this;
		if(!j(this).hasClass('btn_active'))return;
		l.setOkAction(function(){
			var sendData = {
					requesturl : '2xC2knBHKqVkN4Ek9tI0%2FVObH4ama9Ck',
					amount : amount,
					prodDetail : pid,
					extend : param_obj.extend || '1111'
				};
			if(LOCK == '1'){
				sendData.prizeId = prizeId;//红包锁定要加上
			}
			l.hideLayer();
			/*t.pauseCountDown();
			btn.removeClass('btn_active');*/
			r.postLayer({//确认出借
				url : PUBLIC._COMMON,
				data : sendData,
				content : "出借中...",
				success : function(data){
					tenders.undelegate('.tenders_li','click');
					if(data.code == '0000'){
						var info = data.data||{};
						// l.alert2(info.message);
						// l.setKnowAction(function(){
							r.setFlag(false);
							r.post({//判断是否跳转活动页面
								url : PUBLIC._COMMON,
								data : {
									requesturl : 'sU02HJpFAVxPrE6Ay7hpjtk8uaggKnzH'
								},
								success : function(res){
									var skip = res.data || 0;
									if(res.code == "0000" && skip){
										window.location.href = skip;
									}else{
										skip = info.winningUrl||0;
										if(skip){
											window.location.href = skip;
										}
										else{
											window.location.href = '/static/mobileSite/html/success.html?platform='+platform+'&v='+Math.random();
										}
									}
								}
							});
						// });
					}/*else{
						l.alert2(data.message);
					}*/
				}
			});
		});
		l.alert1('您确定要出借' + amount + '元?');
	});
	j('#invest_amount').html(amount);
		var tenderUtil = (function(){
		var tenderNumber = j('#tender_number'),
			tenders = j('#tenders'),
			enddate = j('#enddate'),
			tpl = j("#tender_tpl").html(),
			tenderTemplate = Handlebars.compile(tpl),
			loadingText;
		var inActiveBtn = function(){
			btn.removeClass('btn_active');
		}
		var getTenders = function(url){
			loadingText = url ? '获取中...' : '刷新中...';
			url = url || '2xC2knBHKqVkN4Ek9tI0%2FYiiSObWxUzo';
			// r.postLayer(url,param_obj,function(data){
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : url,
					amount : amount,
					prodDetail : pid,
					extend : param_obj.extend || '1111' //扩展参数
				},
				content : loadingText,
				success : function(data){
					if(data.code == '0000'){
						var info = data.data || {};
						if(info.surplusSeconds == 0 || info.surplusSeconds == '0'){
							btn.removeClass('btn_active').html('已结束');
							enddate.addClass('end').data('lasttime',0);
						}else{
							btn.addClass('btn_active')
							enddate.removeClass('end');
							t.pauseCountDown();
							enddate.data('lasttime',info.surplusSeconds || 0);
							t.countDown(2,inActiveBtn);
						}
						// w.tenderDetailUrl = info.tenderDetailUrl;
						tenderNumber.html(info.matchCount || 0);
						tenders.html(tenderTemplate(info.matchTenderList || []));
						//param_obj.currVersion = info.tenderVersion || param_obj.currVersion;
					} else {

						l.alert2(data.message);
						l.setKnowAction(function(){
							if(data.code == '4510' || data.code == '4511'){
								if(enddate.hasClass('end')){
									window.location.href = '/static/mobileSite/html/sesame/sesame_invest.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&v=' + Math.random();
								}  else {
									w.location.href = '/static/mobileSite/html/success.html?platform='+ platform;
									//l.setKnowRedirectUrl('');
								}
							}
						});
					}
				}
			});
		}
		/*var getToken = function(){
			r.setFlag(false);
			r.post({
				url : PUBLIC.URL_FWD_COMMON,
				data : {
					requesturl : CONFIG.GetToken_URL
				},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						param_obj.token = data.token;
					}

				}
			});
		}*/
		var getRedbag = function(){//获取最佳匹配红包
			//r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Best_AvalableRedbag_URL,
					proType : '2',//翼农计划传1、芝麻开花传2、芝麻开花转让传3
					investMoney : amount,
					proDays : term//天数
				},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						if(data){
							var redbag = data.balance || 0;
							j("#bestRedbag").removeClass('dis_none').html(redbag+"元").attr('id',data.id);
							alert(1);
							prizeId = data.id;
						}else{
							prizeId = 'Okr9LYr9qdI=';//0  Okr9LYr9qdI=的秘串，请求最佳匹配红包失败   LOogHV1WR7M=   -》-1
							j(".investRed").addClass('dis_none');
						}
					}
				}
			});
		}
		return {
			refreshTenders : function(){
				if(!j(this).hasClass('btn_active')){
					getRedbag();
				}
				getTenders();
			},
			init : function(){
				// getToken();
				getTenders('2xC2knBHKqVkN4Ek9tI0%2FYiiSObWxUzo');//获取临时出借关系，获取当前已经锁定的标
				if(LOCK == '0'){//红包锁定打开
					j("#bestRedbag").addClass('dis_none');
					return false;//不会继续请求最佳匹配红包的接口
				}

				if(prizeId && prizeId != -1 && prizeId != 'LOogHV1WR7M=' && prizeId != 'Okr9LYr9qdI='){//prizeId:-1 -> 暂不使用红包   prizeId=值 -> 选中的红包   prizeId=undefined -> 从匹标页面过来获取最佳匹配红包
					if(rewardType =='3'){
						j("#bestRedbag").removeClass('dis_none').addClass('rewardJiaxi').html(balance+"%").attr('id',prizeId);
					}else{
						j("#bestRedbag").removeClass('dis_none').removeClass('rewardJiaxi').html(balance+"元").attr('id',prizeId);
					}
					//j("#bestRedbag").removeClass('dis_none').html(balance+"元").attr('id',prizeId);
				}else if(prizeId == -1 || prizeId == 'LOogHV1WR7M='){//暂不使用
					prizeId = 'LOogHV1WR7M=';// -1的秘串
					j("#noRedbag").removeClass('dis_none').html('暂不使用奖励');
				}else if(prizeId == 0 || prizeId == 'Okr9LYr9qdI='){
					prizeId = 'Okr9LYr9qdI=';
					j("#noRedbag").removeClass('dis_none').html('暂无可用奖励');
				}else{//获取最佳使用红包
					getRedbag();//获取最佳匹配红包
				}
				return this;
			}
		};
	})().init();
	j('.march-change-btn').bind('click',tenderUtil.refreshTenders.bind(tenderUtil));

	j('#investRedList').bind('click',function(){//可用红包入口
		if(!btn.hasClass('btn_active') && j("#enddate").html() == '00:00'){
			l.alertAuto('超时未支付，请重新出借');
			return false;
		}
		var paramStr = '';
		for(var i in param_obj){
			if(i == 'platform' || i == "addr" || i == 'type') continue;
				paramStr += '&'+i+'='+param_obj[i];
		}
		paramStr = '?platform='+platform+paramStr+'&type=2';
		console.log(paramStr);
		//w.location.href = '/static/mobileSite/html/tender/ableRedbag.html?platform='+platform+'&type=2&amount='+amount+'&term='+term+'&pid='+encodeURIComponent(pid);
		w.location.href = '/static/mobileSite/html/tender/ableRedbag.html'+paramStr+'&prizeId='+encodeURIComponent(prizeId);
	});
})(window,$,requestUtil,Handlebars,Layer,Tools);
