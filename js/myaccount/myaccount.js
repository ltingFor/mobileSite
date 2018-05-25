(function(w,j,r,t,l,c,v){
	'use strict';
	var param_obj = t.getParams(),
		platform = param_obj.platform,
		_CODE = param_obj.code;
	
	var postData = {
		requesturl : CONFIG.Myaccount_URL
	}
	if(_CODE){
		postData.code = _CODE;
	}
	r.setLayerFlag(false);
	r.postLayer({
		url : PUBLIC._COMMON,
		data : postData,
		success : function(data){
			if(data.code == '0000'){
				var info = data.data;
				sessionStorage.setItem('mobile',info.mobile || '');//保存到session，红包兑换时会用到
				j('#userName').html((info.accName || '') + '&nbsp;' + (info.realname || ''));
				j('#yesterdayEarning').html(t.outputmoney(info.yesterdayEarning || '0.00'));//昨日回报
				j('#total_amount').html(t.outputmoney(info.totalAssets || '0.00'));//总资产
				j('#totalEarning').html(t.outputmoney(info.totalEarning || '0.00'));//累计回报
				j('#useableAmt').html(t.outputmoney(info.useableAmt || '0.00'));//可用余额
				j('#dongAmount').html(t.outputmoney(info.frozenAmt || '0.00'));//冻结金额
				
				j('.vip-head').attr("src",info.safePhoto || '');//

				r.setLayerFlag(false);
				r.postLayer({
					url : PUBLIC._COMMON,
					data : {
						requesturl : CONFIG.Myaccount_Status_URL,
					},
					success : function(data) {
						/**
						asset : 总资产
						fundsInfo:交易记录
						reward: 我的奖励
						sanbiao：散标
						sesame：芝麻开花
						tailor：私人订制
						win：翼农计划
						**/
						if(data.code == '0000'){
							var info = data.data;
							j('#z-win').html(info.win || '');
							j('#z-sesame').html(info.sesame || '');
							j('#z-funds').html(info.fundsInfo || '');
							if(info.reward){
								j('#z-reward').html(info.reward || '');	
								j("#z-reward-i").removeClass('dis_none');
							}
						}
						
						j("#totalEarningTip").bind("click",function(){
							//红包累计回报
							r.post({
								url : PUBLIC._COMMON,
								data : {
									requesturl : '0nzLDLIxtJtLituQt4PJq4iiSObWxUzo'
								},
								success : function(data){
									if(data.code == '0000'){
										data = data.data || 0;
										l.alert2('已加入你的累计红包变现总额'+data+'元');		
									}
								}
							});
							
						});


						v.checkVip(function(data){//检测是否有vip利率
							if(data.code == '0000'){
								data = data.data;
								var vipRate = data.vipRate;
								/*vipRate = "0.5";
								data.vipImg = 'http://mstatic.eloancn.com/mobile/images/vipimgs/ios_vip4.png';//测试用*/
								if(vipRate && parseFloat(vipRate)>0){
									j('.vip-level').removeClass("dis_none").attr('src',data.vipImg);
								}
							}
						});
						
					}
				});
				
			}
		}
	});
	
	/*j('#account_page').click(function(){
		w.location.href = '/static/mobileSite/html/myaccount/myaccount.html?platform=' + platform + '&v=' + Math.random();
	});*/
	j('#investList_page').click(function(){
		PUBLIC.count('MTZ');
		w.location.href = '/static/mobileSite/html/invest_list.html?platform=' + platform + '&v=' + Math.random();
	});
	j("#home_page").click(function(){
		PUBLIC.count('MSHOUYE');
		w.location.href = '/static/mobileSite/index.html?platform='+platform + "&v=" + Math.random();
	});
	j("#security").click(function(){
		PUBLIC.count('MWD-ZHAQ');
		w.location.href = '/static/mobileSite/html/myaccount/security.html?platform='+platform + "&v=" + Math.random();
	});
	j("#myWmps").click(function(){
		PUBLIC.count('MWD-YNJH');
		w.location.href = '/static/mobileSite/html/wmps/my_wmps.html?platform='+platform + '&v=' + Math.random();
	});
	j("#myWmpsplus").click(function(){
		w.location.href = '/static/mobileSite/html/wmpsPlus/my_wmpsPlus.html?platform='+platform + '&v=' + Math.random();
	});
	j("#mySesame").click(function(){
		PUBLIC.count('MWD-ZMKH');
		w.location.href = '/static/mobileSite/html/sesame/my_sesame.html?platform='+platform + "&v=" + Math.random();
	});
	j("#myTailor").click(function(){
		PUBLIC.count('MWD-SRDZ');
		w.location.href = '/static/mobileSite/html/tailor/my_transfer.html?platform='+platform + "&v=" + Math.random();
	});
	j("#myRewards").click(function(){
		PUBLIC.count('MWD-WDJL');
		w.location.href = 'myhd.html?platform='+platform + "&v=" + Math.random();
	});
	j("#transList_page").click(function(){
		w.location.href = '/static/mobileSite/html/transfer/transfer_list.html?platform='+platform+"&v="+Math.random();
	});
	//绑定眼睛
	var eye = j('#eye').find('img');
	window.eyeF = 1;
	eye.bind('click',function(){
		if(window.eyeF == 1){
			eye.attr('src','/static/mobileSite/images/account_open_eye.png');
			j('.closeEye').hide();
			j(".openEye").show();
			j('#yesterdayEarning').addClass('animated bounce');
			window.eyeF = 0;
		}else{
			eye.attr('src','/static/mobileSite/images/account_close_eye.png');
			j(".openEye").hide();
			j('#yesterdayEarning').removeClass('animated bounce');
			j('.closeEye').show();
			window.eyeF = 1;
		}
	});
	
	j("#recharge").click(function(){
		PUBLIC.count('MWD-CZ');
		c.check_KH(function(data){
			console.log(data);
			if(data.code == '0000'){
				/*
				cardType : 1->身份证 2->护照  3->外国人永久居留证   4->港澳台通行证
				userType : 1->个人  2->企业
				*/
				data = data.data || {};
				if(data.userType != '1'){
					l.alert2("企业用户暂时无法使用移动充值功能，请到网站充值");
					return false;
				}
				if(data.cardType != "1"){
					l.alert2("您使用的开户证件不是身份证，暂时无法使用快捷充值功能，请到翼龙贷网站充值");
					return false;	
				}

				w.location.href = 'recharge.html?platform=' + platform + '&v=' + Math.random();		
			}
		});
		//w.location.href = 'recharge.html?platform=' + platform + '&v=' + Math.random();
	});
	j("#withdrawCash").click(function(){//提现
		PUBLIC.count('MWD-TX');
		c.check_KH(function(data){
			console.log(data);
			if(data.code == '0000'){
				data = data.data || {};
				if(data.cardType != "1"){
					w.location.href = 'withdrawCash.html?platform=' + platform + '&v=' + Math.random() + '&cardType=' + data.cardType;	
				}else{
					w.location.href = 'withdrawCash.html?platform=' + platform + '&v=' + Math.random();
				}
			}
		});
		// w.location.href = 'withdrawCash.html?platform=' + platform + '&v=' + Math.random();
	});

	j("#transRecord").click(function(){//交易记录
		PUBLIC.count('MWD-JYJL');
		w.location.href = 'trans-record.html?platform='+platform + "&v=" + Math.random();
	});

	
	
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST);
