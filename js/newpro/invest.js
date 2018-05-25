(function(w,j,r,t,l,c,v){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || ''),
		type = param_obj.type || '1',
		tmp = [];
	
	r.postLayer({url : PUBLIC._COMMON,//出借前详情
		data : {requesturl:CONFIG.WMPS_InvestInit_URL,pid:pid},
		success : function(data){
			if(data.code == "0000"){
				var info = data.data;
				var	termValue = info.strPhases || 0,//出借期限
					restAmountValue_1 = info.canBuyAmount,
					restAmountValue = (t.outputmoney((info.canBuyAmount/10000+'')||"0.0"))|| 0;//剩余可投
					// restAmountValue = 12000;/**@@@@测试数据用**/
				var interest1 = info.strInterestrate||0;
				var ratioA = info.strInterestrate.split("+");
				touziUtil.interest = 0;
				for(var i = 0,L = ratioA.length; i < L; i++){
					touziUtil.interest += parseFloat(ratioA[i]);
				}
				touziUtil.interest = (touziUtil.interest/100);
				
				j('#interest1').append(interest1);
				j('#term').html(termValue);
				j('#title').text(info.wholeTitle);
				j('#restAmount').html(restAmountValue + '万元');

				//协议
				var urlentry = info.urlentry || '';//协议
				if(urlentry && urlentry.code == '0'){
					j("#protocolUrlAdd").attr('href',urlentry.entryDesc);
					j('#xieyi').attr('href',urlentry.entryDesc).html(urlentry.entryName);
				}else{
					j('#xieyi').addClass('dis_none');
				}
				//用户可出借额度
				touziUtil.limitAmount=info.newUserUseableQuota;
				touziUtil.term = parseFloat(termValue.split("天")[0]);
				tmp = new Array(parseFloat(restAmountValue_1),parseFloat(touziUtil.limitAmount));

				//账户余额
				r.setLayerFlag(false);
				r.postLayer({
					url : PUBLIC._COMMON,
					data : {
						requesturl : CONFIG.MyAvalabelMoney_URL
					},
					success : function(data){
						if(data.code == "0000"){
							data = data.data;
							var balanceValue = data.useableAmt || 0;
							// balanceValue = 12034;///****测试用
							j("#userAmount").html(t.outputmoney((balanceValue+"")||"0.0"));
							tmp.push(parseFloat(balanceValue));
							var min_tem = tmp[0];
							for(var i=1;i<tmp.length;i++){ 
								if(min_tem>tmp[i]){
									min_tem=tmp[i];
								}
							}
							console.log('min_tem='+min_tem);
							touziUtil.maxAmount = Math.floor(min_tem / 100) * 100;
						}else{
							touziUtil.maxAmount = 0;
						}
						
						touziUtil.init();
					}
				});
				//检测是否有vip利率
				/*v.checkVip(function(data){//检测是否有vip利率
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						var vipRate = data.vipRate;
						if(vipRate && parseFloat(vipRate)>0){
							j('.vip-level').removeClass("dis_none").attr('src',data.vipImg);
							touziUtil.interest += parseFloat(vipRate);
						}
					}
				});*/
			}
		}
	});
	
	var touziUtil = {
		max:j('#max'),
		num:j('#num'),
		recharge : j("#recharge"),
		expectInterest:j('#expect_interest'),
		investBtn:j('#invest_btn'),
		limitAmount:20000,
		checkNum : function(){
			var that = this;
			this.expectInterest.removeClass('dis_none').html('出借本金必须为100的整数倍, 您还可出借'+touziUtil.limitAmount+'元');
			this.investBtn.removeClass('invest_btn_active').addClass('dis_btn');
			this.investFlag = false;
			if(this.maxAmount < 100){
				return;
			}

			var numValue = +(this.num.val() || 0);
			
			if(numValue === 0){
				return;
			}
			if(numValue > this.maxAmount){
				return;
			}
			var num_value = Math.floor(numValue / 100) * 100;
			if(numValue != num_value){
				return;
			}
			if(numValue > touziUtil.limitAmount){
				return;
			}
			this.investFlag = true;
			if(j("#protocolCheck").attr('src') == '/static/mobileSite/images/checkyes.png'){
			this.investBtn.removeClass('dis_btn').addClass('invest_btn_active');
			}
			this.caculateInterest();
		},
		caculateInterest : function(){//计算预计回报
			var numValue = +(this.num.val() || 0);
			var p1 = ((numValue * this.interest) / 365).toFixed(2);
			var profit = (p1 * this.term).toFixed(2);
			this.expectInterest.removeClass('dis_none').html('预期回报:(不等同于实际回报)：' + profit + '元');
		},
		bindEvent:function(){
			var that = this;
			that.recharge.bind('click',function(){
				PUBLIC.count('MSHOUYE-XQ-MSTZ-CZ');
				c.check_KH(function(data){
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

					w.location.href = '/static/mobileSite/html/myaccount/recharge.html?platform=' + platform + '&v=' + Math.random();		
				});
			});
			that.max.bind('click',function(){
				PUBLIC.count('MSHOUYE-XQ-MSTZ-QT');
				var maxAmount = that.maxAmount;
				if(maxAmount == 0){
					that.num.val('');
					if(touziUtil.limitAmount==0){
						l.alertAuto('已没有此产品出借额度，请出借其他产品');
					}else{
						l.alertAuto('可用余额不足，请先充值');
					}
										
				}else {
					that.num.val(maxAmount);
					that.checkNum();
				}
			});
			that.num.bind('touchstart',function(){
				j(".touzi_tip").hide();
			});
			
			that.num.bind('input propertychange',function(){
				var that_num = j(this);
				var numStr = that_num.val();
				console.log(numStr)
				if(!numStr){
					touziUtil.expectInterest.addClass('dis_none');
					return;
				}
				if(!t.isNumber(numStr)){
					that_num.val('');
				}else {
					var numValue = +(numStr || 0);
					if(numValue > that.maxAmount){
						console.log(numStr);
						that_num.val(that.maxAmount);
						if(that.maxAmount == '0'){
							touziUtil.expectInterest.addClass('dis_none');
						}
					}
					that.checkNum();
				}
				
			});
			that.num.bind('blur',function(){
				j(".touzi_tip").show();
				var that_num = j(this);
				var numStr = that_num.val();
				console.log(numStr)
				if(!numStr){
					touziUtil.expectInterest.addClass('dis_none');
					return;
				}
			});
			j("#protocolCheck").bind('click',function(){
				var i = j(this).attr('src');
				if(i == '/static/mobileSite/images/checkno.png'){
					j(this).attr('src','/static/mobileSite/images/checkyes.png');
					if(that.investFlag){
						that.investBtn.addClass('invest_btn_active').removeClass('dis_btn');
					}else{
						that.investBtn.addClass('dis_btn').removeClass('invest_btn_active');
					}
				}else{
					j(this).attr('src','/static/mobileSite/images/checkno.png');
					that.investBtn.addClass('dis_btn').removeClass('invest_btn_active');
				}
				return false;
			});
			that.investBtn.bind('click',function(){
				PUBLIC.count('MSHOUYE-XQ-MSTZ-TYTZ');
				var btn = j(this);
				if(btn.hasClass('dis_btn')){
					return;
				}
				var numValue = +(that.num.val() || 0);
				r.postLayer({//锁标
					url : PUBLIC._COMMON,
					data : {
						requesturl : CONFIG.WMPS_LockTender_URL,
						amount : numValue,
						pid : pid
					},
					content : '检测中...',
					success : function(data){
						if(data.code == "0000"){
							w.location.href = '/static/mobileSite/html/newpro/newpro_tender.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&type=' + type + '&amount=' + numValue + "&term=" + touziUtil.term +'&v=' + Math.random();
						} else {
							l.alert2(data.message);
						}
					}
				});
			});
		},
		init:function(){
			this.bindEvent();
			this.num.val('');
			// this.checkNum();
		}
	};
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST);
