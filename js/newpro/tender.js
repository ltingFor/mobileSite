(function(w,j,r,h,t,l){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || ''),
		term = param_obj.term,
		amount = param_obj.amount || 0;

	var pageUtil = {
		btn : j('#btn'),
		tenders : j('#tenders'),
		LOCK : true,
		bindEvent : function(){
			var that = this;
			that.tenders.delegate('.tenders_li','click',function(){//绑定跳转到详情页面
				var id = encodeURIComponent(j(this).attr('id'));
				w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+"&tid="+id+"&v="+Math.random();
			});
			that.btn.bind('click',function(){
				if(!j(this).hasClass('btn_active'))return;
				l.setOkAction(function(){
					l.hideLayer();
					
					var postUrl = that.LOCK ? CONFIG.Newpro_Invest_URL_NEW : CONFIG.Newpro_Invest_URL;
				
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : postUrl,
							amount : amount,
							pid : pid,
							currVersion : param_obj.currVersion,
							prizeId : 'Okr9LYr9qdI='//红包ID：0的秘串
						},
						content : "出借中...",
						success : function(data){
							that.tenders.undelegate('.tenders_li','click');
							if(data.code == "0000"){
								t.pauseCountDown();
								pageUtil.btn.removeClass('btn_active');
								var info = data.data||{};	
								r.setFlag(false);
								r.post({
									url : PUBLIC._COMMON,
									data : {
										requesturl : CONFIG.Invest_SuccessPop_Act_URL//活动支持弹窗接口
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
												if(info.reminder){
												localStorage.setItem("reminder",info.reminder);
												}
											
												window.location.href = "/static/mobileSite/html/success.html?platform="+platform +'&v=' + Math.random() ;	
											
													
											}
										}
									}
								});
							}else if(data.code == '4516'){
								l.alert2(data.message);
							}/*else{
								l.alert2(data.message);
								l.setKnowRedirectUrl('/static/mobileSite/html/newpro/newpro_invest.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&v=' + Math.random());
							}*/
						}
					});	
				});
				l.alert1('您确定要出借' + amount + '元?');
			});
		},
		
		checkLock : function(){//红包锁定开关
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : CONFIG._REDBAGLOCK},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						if(data == '0'){ //红包锁定不开启
							that.LOCK = false;
						}else if(data == '1'){ //红包锁定开启
							that.LOCK = true;
						}
					}
				}
			});
		},
		init : function(){
			var that = this;
			that.checkLock();
			that.bindEvent();
			j('#invest_amount').html(amount);
		}
	}
	pageUtil.init();
	
	
	var tenderUtil = (function(){
		var tenderNumber = j('#tender_number'),
			tenders = j('#tenders'),
			enddate = j('#enddate'),
			tpl = j("#tender_tpl").html(),
			tenderTemplate = Handlebars.compile(tpl),
			loadingText;
		var inActiveBtn = function(){
			pageUtil.btn.removeClass('btn_active');
		}
		var getTenders = function(url){
			loadingText = url ? '获取中...' : '刷新中...';
			url = url || CONFIG.WMPS_ChangeTender_URL;
			// r.postLayer(url,param_obj,function(data){
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : url,
					amount : amount,
					pid : pid
				},
				content : loadingText,
				success : function(data){
					if(data.code == "0000"){
						var info = data.data || {};
						enddate.removeClass('end');
						t.pauseCountDown();
						enddate.data('lasttime',info.strongTime || 0);
						t.countDown(2,inActiveBtn);
						w.tenderDetailUrl = info.tenderDetailUrl;	
						tenderNumber.html(info.tenderCount || 0);
						tenders.html(tenderTemplate(info.TenderResult || []));	
						param_obj.currVersion = info.tenderVersion || param_obj.currVersion;
						pageUtil.btn.addClass('btn_active');
						/*l.alert2(data.message);
						l.setKnowAction(function(){
							w.location.href = '/static/mobileSite/html/success.html?platform='+ platform + '&v=' + Math.random();
						});*/
					} else {
						l.alert2(data.message);
						l.setKnowAction(function(){
							if(data.code == '4510' || data.code == '4511'){//获取超时，或者没有可更换的债权
								if(enddate.hasClass('end')){
									
									w.location.href = '/static/mobileSite/html/newpro/newpro_invest.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&v=' + Math.random();
								} else {
									w.location.href = '/static/mobileSite/html/success.html?platform='+ platform;
									//l.setKnowRedirectUrl('');
								}
							}
						});
					}
				}
			});	
		}
		
		return {
			refreshTenders : function(){
				getTenders();//换一批
			},
			init : function(){
				getTenders(CONFIG.WMPS_GetLockTender_URL);//获取临时出借关系
				return this;
			}
		};
	})().init();
	j('.march-change-btn').bind('click',tenderUtil.refreshTenders.bind(tenderUtil));	
})(window,$,requestUtil,Handlebars,Tools,Layer);
