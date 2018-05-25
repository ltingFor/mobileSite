(function(w,j,r,h,t,l){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		prodDetail = decodeURIComponent(param_obj.prodDetail || ''),
		term = param_obj.term,
		rewardType = param_obj.rewardType,//奖励类型，1红包  3加息券
		amount = param_obj.amount || 0,
		tenderVersion = param_obj.tenderVersion,
		autoBuy = param_obj.autoBuy,
		prizeId = decodeURIComponent(param_obj.prizeId || ''),//红包ID
		LOCK = param_obj.LOCK,//1:红包锁定开关打开，用新的出借接口。0：红包锁定开关关闭
		balance = param_obj.balance;//奖励金额
	/*if(prizeId){//用户选择的红包ID
		prizeId = decodeURIComponent(prizeId);
	}
	*/
	var btn = j('#btn'),
		tenders = j('#tenders');
	tenders.delegate('.tenders_li','click',function(){//绑定跳转到详情页面
		var id = encodeURIComponent(j(this).attr('id'));
		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+"&tid="+id+"&v="+Math.random();
	});
	btn.bind('click',function(){//点击确认出借
		if(!j(this).hasClass('btn_active'))return;
		l.setOkAction(function(){
			var postUrl = 'FnpG0BZijqSU9h4Rq6j9oJqgDdBN1JHcaq6YPxmCRk0%3D'
			l.hideLayer();
			
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : postUrl,
					amount : amount,
					prodDetail : prodDetail,
					version : tenderVersion,
					autoBuy:autoBuy,
					prizeId : prizeId || 'Okr9LYr9qdI='//默认是0的秘传
				},
				content : "出借中...",
				success : function(data){
					tenders.undelegate('.tenders_li','click');
					if(data.code == "0000"){
						t.pauseCountDown();
						btn.removeClass('btn_active');
						var info = JSON.parse(data.data)||{};	
						r.setFlag(false);
						r.post({
							url : PUBLIC._COMMON,
							data : {
								requesturl : 'sU02HJpFAVxPrE6Ay7hpjtk8uaggKnzH'//活动支持弹窗接口
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
										window.location.href = "/static/mobileSite/html/success.html?platform="+platform;		
									}
								}
							}
						});
					}else if(data.code == '4516'){//投资失败，债权未解锁，用户可继续投资
						l.alert2(data.message);
					}/*else{
						l.alert2(data.message);
						l.setKnowRedirectUrl('/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html?platform=' + platform + '&prodDetail=' + encodeURIComponent(prodDetail) + '&v=' + Math.random());
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
			var data = {
				requesturl : url||'FnpG0BZijqSU9h4Rq6j9oJqgDdBN1JHcnPPVPX4btAI%3D',
				amount : amount,
				prodDetail : prodDetail
			};
			if(!url){
				data.change = '1';
			}
			r.postLayer({
				url : PUBLIC._COMMON,
				data : data,
				content : loadingText,
				success : function(data){
					if(data.code == "0000"){
						var info = data.data || {};
						if(info.strongTime == 0 || info.strongTime == '0'){
							btn.removeClass('btn_active').html('已结束');
							enddate.addClass('end').data('lasttime',0);
						}else{
							btn.addClass('btn_active')
							enddate.removeClass('end');
							t.pauseCountDown();
							enddate.data('lasttime',info.strongTime || 0);
							t.countDown(2,inActiveBtn);
						}
						
						tenderNumber.html(info.tenderCount || '-');
						tenders.html(tenderTemplate(info.tenderList || []));	
					}else {
						l.alert2(data.message);
						l.setKnowAction(function(){
							if(data.code == '4510' || data.code == '4511' || data.code == '4523'){//获取超时，或者没有可更换的债权
								if(enddate.hasClass('end')){
									w.location.href = '/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html?platform=' + platform + '&prodDetail=' + encodeURIComponent(prodDetail) + '&v=' + Math.random();
								} 
							}
						});
					}
				},
				callback:function(){
					//w.location.href = '/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html?platform=' + platform + '&prodDetail=' + encodeURIComponent(prodDetail) + '&v=' + Math.random();
				}
			});	
		}
		var getRedbag = function(){//获取最佳匹配红包
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : 'LIevx%2B1yqJ%2BdPH3cCouw9sh9Lys8Fdt6g0dXgzWM0wQ%3D',
					proType : '5',//翼农计划传1、芝麻开花传2、芝麻开花转让传3 ,翼农计划+ 5
					investMoney : amount,
					proDays : term,//天数
					types:'1,3'
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						if(data){
							var redbag = data.balance || 0;
							if(data.type =='3'){
								j("#bestRedbag").removeClass('dis_none').html(redbag+"%").attr('id',data.id);	
							}else{
								j("#bestRedbag").removeClass('dis_none').html(redbag+"元").attr('id',data.id);	
							}
							prizeId = data.id;
						}else{
							prizeId = 'Okr9LYr9qdI=';//0的秘串，请求最佳匹配红包失败   
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
				getTenders();//换一批
			},
			init : function(){
				getTenders('FnpG0BZijqSU9h4Rq6j9oJqgDdBN1JHcfZGUpa8Itzk%3D');//获取临时出借关系
				if(LOCK == '0'){
					j("#bestRedbag").addClass('dis_none');
					return false;//不会继续请求最佳匹配红包的接口
				}
				if(prizeId && prizeId != -1 && prizeId != 'LOogHV1WR7M=' && prizeId != 'Okr9LYr9qdI='){//prizeId:-1 -> 暂不使用红包   prizeId=具体值 -> 选中的红包   prizeId=undefined -> 从匹标页面过来获取最佳匹配红包
					if(rewardType =='3'){
						j("#bestRedbag").removeClass('dis_none').addClass('rewardJiaxi').html(balance+"%").attr('id',prizeId);	
					}else{
						j("#bestRedbag").removeClass('dis_none').removeClass('rewardJiaxi').html(balance+"元").attr('id',prizeId);	
					}
					// j("#bestRedbag").removeClass('dis_none').html(balance+"元").attr('id',prizeId);
				}else if(prizeId == -1 || prizeId == 'LOogHV1WR7M='){//暂不使用
					prizeId = 'LOogHV1WR7M=';// -1的秘串
					j("#noRedbag").removeClass('dis_none').html('暂不使用奖励');
				}else if(prizeId == 0 || prizeId == 'Okr9LYr9qdI='){//没有可用
					prizeId = 'Okr9LYr9qdI=';
					j("#bestRedbag").addClass('dis_none');
					j("#noRedbag").removeClass('dis_none').html('暂无可用奖励');
				}else{//获取最佳使用红包
					getRedbag();//获取最佳匹配红包	
				}
				return this;
			}
		};
	})().init();
	j('.march-change-btn').bind('click',tenderUtil.refreshTenders.bind(tenderUtil));	//换一批

	j('#investRedList').bind('click',function(){//可用红包入口
		if(!btn.hasClass('btn_active') && j("#enddate").html() == '00:00'){
			l.alertAuto('超时未支付，请重新出借');
			return false;
		}
		var paramStr = '';
		for(var i in param_obj){
			if(i == 'platform' || i == "addr") continue;
			else{
				paramStr += '&'+i+'='+param_obj[i];
			}
		}
		paramStr = '?platform='+platform+paramStr;
		console.log(paramStr);
		//w.location.href = '/static/mobileSite/html/tender/ableRedbag.html?platform='+platform+'&type=2&amount='+amount+'&term='+term+'&prodDetail='+encodeURIComponent(prodDetail);
		w.location.href = '/static/mobileSite/html/tender/ableRedbag.html'+paramStr+'&prizeId='+encodeURIComponent(prizeId);
	});
})(window,$,requestUtil,Handlebars,Tools,Layer);
