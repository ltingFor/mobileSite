(function(w,j,r,t,l,c,v,cl){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = param_obj.pid || '',
		recordId = param_obj.recordId || '',
		userId = param_obj.userId || '',
		accId = param_obj.accId || '',
		tmp = [],termValue = 0;
	var pageUtilt = {
		protocolUrl : j("#protocolUrl"),
		recharge : j("#recharge"),
		money_tip : j("#money_tip"),
		trans_amount : 0,//转让金额
		bindEvent:function(){
			var that = this;

			that.recharge.bind('click',function(){
				PUBLIC.count('MTZ-ZMZR-XQ-MSTZ-CZ');
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
		},
		getToken : function(){
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
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
		},
		getInfo : function(){//获取基本信息
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({url : PUBLIC._COMMON,
				data : {requesturl:'ok8XdMSuHBDXgDlyq889QsvPKeEIw3S4',productId:pid,accId : accId,recordId : recordId,userId : userId},
				success : function(data){
					console.log(data);
					if(data.code == "0000"){
						var info = data.data;
						termValue = info.closePeriod || 0;//合约期限 （封闭期）
						
						var supRate = ((info.addRate && ('+' + info.addRate)) || '') + ((info.vipRate && ('+' + info.vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.55rem;display:inline;">')) || '');
						touziUtil.interest = info.productRate;//利息
						touziUtil.interest = (touziUtil.interest/100).toFixed(2);
						
						j("#realPayAmount").html(t.outputmoney(info.realPayAmount||'0'));//实付金额
						j("#surplusDays").html(info.surplusDays+"天");//剩余天数
						j("#amount").html(t.outputmoney_n(info.amount||'0')+"元");//转让金额
						j("#amount_hide").html(info.realPayAmount || '0');
						j("#expirePayIn").html(t.outputmoney(info.expirePayIn));//到期预计回报
						j("#minRate").html(info.minRate);
						j("#maxRate").html(info.maxRate);
						j("#supRate").append(supRate);
						j('#term').html(termValue+"天");//合约期限
						j('#title').text(info.title);

						var urlentry = info.urlentry || '';//协议
						if(urlentry && urlentry.code == '0'){
							j("#protocolUrl").attr('href',urlentry.entryDesc).html(urlentry.entryName);
						}else{
							j("#protocolUrl").addClass('dis_none');
						}

						
						that.money_tip.bind('click',function(){
							l.alert2(info.realPayTip);
						});
						touziUtil.term = termValue;
						tmp.push(parseFloat(info.realPayAmount));//实付金额
						tmp.push(parseFloat(info.amount));//转让金额
						pageUtilt.trans_amount = info.amount;

						touziUtil.maxRate = (info.maxRate||0) / 100;
						touziUtil.isMatch = info.lock;
						touziUtil.addRate = info.addRate / 100;
						touziUtil.vipRate = info.vipRate / 100;
						touziUtil.calcExtend = info.calcExtend || {};
						touziUtil.extend = info.extend;

						if(info.status == 0){
							touziUtil.investBtn.removeClass('dis_btn');
						}else{
							touziUtil.investBtn.addClass('dis_btn');
						}
						// touziUtil.match_back_tip = info.match_back_tip;
					}else{
						l.alert2(data.message);
						return;
					}
				},
				complete : function(){//账户余额
					
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.MyAvalabelMoney_URL
						},
						success : function(data){
							if(data.code == "0000"){
								data = data.data;
								var balanceValue = data.useableAmt || 0;
								touziUtil.balance = balanceValue;
								j("#userAmount").html(t.outputmoney(balanceValue));
							
								tmp.push(balanceValue);//账户余额
								
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
									l.alert2(data.message);
							}
							
							touziUtil.init();	
						}
					});
				}
			});
		},
		init : function(){
			var that = this;
			that.getToken();
			that.getInfo();
			that.bindEvent();
		}
	};
	pageUtilt.init();
	
	var touziUtil = {
		num:j('#amount_hide'),
		investBtn:j('#invest_btn'),
		bindEvent:function(){
			var that = this;
			that.investBtn.bind('click',function(){
				PUBLIC.count('MTZ-ZMZR-XQ-MSTZ-TYTZ');
				var btn = j(this);
				if(btn.hasClass('dis_btn')){
					return;
				}
				else if((parseFloat(touziUtil.balance)<100) || ((parseFloat(touziUtil.balance) - parseFloat(pageUtilt.trans_amount))<0)){
					l.alertAuto('可用余额不足，请先充值');
					return false;
				}else{
					that.investFun();	
				}
			});
		},
		init:function(){
			var amount = this.restAmount > this.balance ? this.balance : this.restAmount;
			this.maxAmount = Math.floor(amount / 100) * 100;
			this.bindEvent();
			var that = this;
			// if(this.isMatch){
				// var unmatch = this.match_back_tip ? 0 : 1;//是否解锁成功
				var unmatch = 0;//是否解锁成功
				//匹标
				this.investFun = function(){
					var numValue = +(this.num.html() || 0);
					r.setFlag(false);
					r.postLayer({
						url : PUBLIC._COMMON ,
						data : {
							requesturl : "ok8XdMSuHBDXgDlyq889Qu2308pM5%2FWi",
							productId : pid,
							amount : numValue,//实付金额
							recordId : recordId,//转让产品记录ID
							accId : accId,
							token : param_obj.token
						},
						content : '出借中...',
						success : function(data){
							console.log();
							if(data.code == 0){
								window.location.href = '/static/mobileSite/html/success.html?platform='+platform+'&v='+Math.random();		
							}else{
								l.alert2(data.message);
								return false;
							}
						}
					})
				}
		}
	};
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST,COMMON_Login);
