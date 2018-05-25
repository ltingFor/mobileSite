(function(w,j,r,t,l,c,v,cl){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || ''),
		type = param_obj.type || '2',//1翼农  2芝麻  3私人订制
		balance = param_obj.balance || '',//奖励金额
		activateBalance = param_obj.activateBalance || '',//激活奖励金额
		rewardType = param_obj.rewardType || '',//1红包  3加息券
		prizeId = decodeURIComponent(param_obj.prizeId || ''),
		tmp = [],restAmountValue=0;
	var touziUtil = {
		max:j('#max'),
		num:j('#num'),
		expectInterest:j('#expect_interest'),
		investBtn:j('#invest_btn'),
		_OBJ : {},
		investFlag:false,
		checkNum : function(){
			var that = this;
			this.expectInterest.removeClass('dis_none').html('出借本金必须为100的整数倍');
			this.investBtn.removeClass('invest_btn_active').addClass('dis_btn');
			that.investFlag = false;
			if(this.maxAmount < 100){

				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;

				if(this.restAmount == 0){
					this.expectInterest.removeClass('dis_none').html('本期出借上限已达到');
				};
				return;
			};
			var numValue = +(this.num.val() || 0);
			if(numValue>this.currInvestAmount){
				this.expectInterest.removeClass('dis_none').html('当期可投为：'+this.currInvestAmount+'元,您的出借本金超出当期可投');
				this.investBtn.removeClass('invest_btn_active').addClass('dis_btn');
				return;
			};
			if(numValue == 0){
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			};
			if(numValue > this.maxAmount){
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			}
			var num_value = Math.floor(numValue / 100) * 100;
			if(numValue != num_value){//判断是否是100的倍数
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			};

			//if(redbagUtil.balanceArr.length && !pageUtilt.LOCK){
				this.matchRedbeg(redbagUtil.balanceArr,numValue);
			//}
			that.investFlag = true;
			if(j("#protocolCheck").attr('src') == '/static/mobileSite/images/checkyes.png'){
			this.investBtn.removeClass('dis_btn').addClass('invest_btn_active');
			}
			this.caculateInterest();
		},
		caculateInterest : function(){
			var numValue = +(this.num.val() || 0);
			var earnMoney = getPaidIOS(numValue,JSON.stringify(this.calcExtend));
			this.expectInterest.removeClass('dis_none').html('预期回报:(不等同于实际回报)：' + JSON.parse(earnMoney).income + '元');
		},
		matchRedbeg : function(arr,money){//排序 匹配红包
			var sendData = JSON.stringify({money:money,rewardArr:arr});
			var _OBJStr = matchReward(sendData);
			if(_OBJStr){
				this._OBJ = JSON.parse(_OBJStr);
				j('.noreward').addClass('dis_none');
				if(this._OBJ.type == '3'){
					j('.reward').removeClass('dis_none').removeClass('redbagReward').html(this._OBJ.balance+"%");
				}else{
					j('.reward').removeClass('dis_none').addClass('redbagReward').html(this._OBJ.balance+"元");
				}

				prizeId = this._OBJ.id;
				balance = this._OBJ.balance;
				rewardType = this._OBJ.type;
				pageUtilt.rewardSkipFlag = true;

			}else{
				j('.noreward').removeClass('dis_none');
				j(".reward").addClass('dis_none');
				prizeId = 'Okr9LYr9qdI=';//无可用0 秘串
				pageUtilt.rewardSkipFlag = false;
			}
			/*j('li.redbag').removeClass('inv-p-show');
			var cur = 0;
			for(var i=0,L=arr.length;i<L;i++){
				if(money>=arr[i].balance){
					cur = arr[i].balance;
				}else{
					continue;
				}
			}
			if(cur){
				j('li[data-num='+cur+']').addClass('inv-p-show');
			}*/

		},
		bindEvent:function(){
			var that = this;
			that.max.bind('touchstart',function(){
				PUBLIC.count('MTZ-ZMKH-XQ-MATZ-QT');
				var maxAmount = that.maxAmount;
				if(maxAmount == 0){
					that.num.val('');
					if(that.restAmount == 0){
						l.alertAuto('本期出借上限已达到');
					}else{
						l.alertAuto('可用余额不足，请先充值');
					}
				} else {
					that.num.val(maxAmount);
					that.checkNum();
				}
			});
			/*that.num.bind('touchstart',function(){
				j(".touzi_tip").hide();
			});
			that.num.bind('blur',function(){
				j(".touzi_tip").show();
			});*/
			that.num.bind('input propertychange',function(){
				var that_num = j(this);
				var numStr = that_num.val();
				if(!t.isNumber(numStr)){
					that_num.val('');
					pageUtilt.rewardSkipFlag = false;
					j('.reward').addClass('dis_none');
				} else {
					var numValue = +(numStr || 0);
					if(numValue > that.maxAmount){
						that_num.val(that.maxAmount);
					};
				};
				that.checkNum();
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
				PUBLIC.count('MTZ-ZMKH-XQ-MATZ-TYTZ');
				var btn = j(this);
				if(btn.hasClass('dis_btn')){
					return;
				};
				that.investFun();
			});
		},
		init:function(){
			var amount = this.restAmount > this.balance ? this.balance : this.restAmount;
			this.maxAmount = Math.floor(amount / 100) * 100;
			this.bindEvent();
			if(this.maxAmount < 100){
				if(this.restAmount == 0){
					this.expectInterest.removeClass('dis_none').html('本期出借上限已达到');
				};
			};
			// redbagUtil.init();
			var that = this;
			// if(pageUtilt.isMatch){
				// var unmatch = this.match_back_tip ? 0 : 1;//是否解锁成功
				var unmatch = 0;//是否解锁成功
				//匹标
				this.investFun = function(){
					var numValue = +(this.num.val() || 0);
					r.postLayer({
						url : PUBLIC._COMMON ,
						data : {
							requesturl : "2xC2knBHKqVkN4Ek9tI0%2FYiiSObWxUzo",
							prodDetail : pid,
							amount : numValue,
							extend : that.extend||'1111'
						},
						content : '检测中...',
						success : function(data){
							if(data.code == 0){
								if(pageUtilt.LOCK){
									w.location.href = '/static/mobileSite/html/sesame/sesame_tender.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&type=' + type + '&amount=' + numValue + '&extend=' + that.extend + '&unmatch=' + unmatch +"&term=" + that.term + '&v=' + Math.random() + '&LOCK=1' + '&prizeId='+encodeURIComponent(prizeId) + '&balance='+balance+'&rewardType='+rewardType;
								}else{
									w.location.href = '/static/mobileSite/html/sesame/sesame_tender.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&type=' + type + '&amount=' + numValue + '&extend=' + that.extend + '&unmatch=' + unmatch +"&term=" + that.term + '&v=' + Math.random() + '&LOCK=0' + '&prizeId='+encodeURIComponent(prizeId) + '&balance='+balance+'&rewardType='+rewardType;
								}
								// w.location.href = '/static/mobileSite/html/sesame/sesame_tender.html?platform=' + platform + '&pid=' + pid + '&type=' + type + '&amount=' + numValue + "&term=" + touziUtil.term +'&v=' + Math.random();

							}else{
								l.alert2(data.message);
								return false;
							}
						}
					})
				}
		}
	};
	var pageUtilt = {
		protocolUrl : j("#protocolUrl"),
		recharge : j("#recharge"),
		rewardSkipFlag:false,
		LOCK : true,//红包锁定开关
		bindEvent:function(){
			var that = this;
			that.recharge.bind('click',function(){
				PUBLIC.count('MTZ-ZMKH-XQ-MATZ-CZ');
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
			// 可用奖励跳转的页面
			j('#rbText').bind('click',function(){
				if(that.rewardSkipFlag){
					w.location.href = '/static/mobileSite/html/tender/ableRedbag.html?pid='+encodeURIComponent(pid)+'&type='+type+'&amount='+(touziUtil.num.val() || 0)+'&term='+touziUtil.term+'&prizeId='+encodeURIComponent(prizeId)+'&source=invest'+'&platform='+platform+'&v='+Math.random();
				}else{
					w.location.href = '/static/mobileSite/html/myaccount/myhd.html?platform='+platform+'&v='+Math.random();
				}
			});
		},
		initPage : function(){
			var that = this;
			r.postLayer({url : PUBLIC._COMMON,
				data : {requesturl:'2xC2knBHKqUxYJ5AEYrvmoiiSObWxUzo',prodDetail:pid},
				success : function(data){
					if(data.code == "0000"){
						var info = data.data;
						var termValue = info.closed_period || 0;//合约期限 （封闭期）
						touziUtil.currInvestAmount=info.currPeriodCanInvest;//当期可投金额上限
						restAmountValue = (((info.max_amount||"") - (info.total_amount||""))/10000) || 0,//剩余可投
							restAmountValue = restAmountValue.toFixed(2);
						var accountBalance = info.accountBalance || '0';//账户余额
						// var supRate = ((info.addRate && ('+' + info.addRate)) || '') + ((info.vipRate && ('+' + info.vipRate + '<img src="/static/mobileSite/images/vip_03.png" style="max-width:100%;width:0.4rem;display:inline;">')) || '');
						var supRate = ((info.addRate && ('+' + info.addRate)) || '');
						touziUtil.interest = info.productRate;//利息
						touziUtil.interest = (touziUtil.interest/100).toFixed(2);

						j("#minRate").html(info.minRate);
						j("#maxRate").html(info.maxRate);
						j("#supRate").append(supRate);
						j('#term').html(termValue);//合约期限
						j('#title').text(info.title);
						j('#restAmount').html(restAmountValue);
						touziUtil.term = termValue;

						touziUtil.maxRate = (info.maxRate||0) / 100;
						touziUtil.restAmount = parseFloat(restAmountValue)*10000;//剩余可投
						touziUtil.isMatch = info.lock;
						touziUtil.addRate = info.addRate / 100;
						touziUtil.vipRate = info.vipRate / 100;
						touziUtil.calcExtend = info.calcExtend || {};
						touziUtil.extend = info.extend;

						var urlentry = info.urlentry || '';//协议
						if(urlentry && urlentry.code == '0'){
							j("#protocolUrlAdd").attr('href',urlentry.entryDesc);
							pageUtilt.protocolUrl.attr('href',urlentry.entryDesc).html(urlentry.entryName);
						}else{
							pageUtilt.protocolUrl.addClass('dis_none');
						}
						// that.match_back_tip = info.match_back_tip;
					}else{
						l.alert2(data.message);
						return;
					}
				},
				complete : function(){//账户余额
					//获取vip
					var vipStr = "";
					v.checkVip(function(data){
						if(data.code == '0000'){
							if(data.data.vipRate > 0){
								vipStr += '+' + data.data.vipRate + '<img class="vipImgClass" style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
							}
						}
						j('#supRate').append(vipStr);
					});
					//获取账户余额
					tmp.push(parseFloat(restAmountValue)*10000);
					r.setLayerFlag(false);
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.MyAvalabelMoney_URL,
							pid : pid
						},
						success : function(data){
							if(data.code == "0000"){
								data = data.data;
								var balanceValue = data.useableAmt || 0;
								touziUtil.balance = balanceValue;
								// balanceValue = 12034;///****测试用
								j("#userAmount").html(balanceValue);

								tmp.push(balanceValue);//账户余额

								var min_tem = tmp[0];
								for(var i=1;i<tmp.length;i++){
									if(min_tem>tmp[i]){
										min_tem=tmp[i];
									}
								}
								touziUtil.maxAmount = Math.floor(min_tem / 100) * 100;
							}else{

								touziUtil.maxAmount = 0;
								l.alert2(data.message);
							}
							touziUtil.init();
						},
						complete : function(){
							that.checkLock();//判断红包锁定打开与否
						}
					});
				}
			});
		},
		clearTenderLock : function(){//债权匹配解锁
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : '2xC2knBHKqVkN4Ek9tI0%2Fc3o%2FRsGi%2BfK',prodDetail : pid},
				success : function(data){
					if(data.code == '0000'){
						that.initPage();
					}
				}
			});
		},
		checkLock : function(){//红包锁定开关
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : CONFIG._REDBAGLOCK},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						if(data == '0'){ //红包锁定不开启
							j(".invest-packet").removeClass('dis_none');
							redbagUtil.init();
							that.LOCK = false;
						}else if(data == '1'){ //红包锁定开启
							that.LOCK = true;
							redbagUtil.init();//获取红包列表
							// j(".invest-packet").addClass('dis_none');
						}
					}
				}
			})
		},
		init : function(){
			var that = this;
			that.clearTenderLock();
			j("#protocolCheck").attr('src','/static/mobileSite/images/checkno.png');
			if(balance && balance != '0'){//对于选择的奖励进行回显
				var balanceStr = rewardType == '1' ? balance+'元' : balance+'%';
				if(+(activateBalance) > +(param_obj.amount)){
					j('#num').val(activateBalance);
				}else{
					j("#num").val(param_obj.amount);
				}
				j('.invest-packet').removeClass('dis_none');
				// j('#invest_btn').removeClass('dis_btn');
				if(rewardType == '1'){
					j('.reward').addClass('redbagReward').removeClass('dis_none').html(balanceStr);
				}else{
					j('.reward').removeClass('dis_none').html(balanceStr);
				}
				touziUtil.investFlag=true;

			}else{
				j('#num').val(param_obj.amount||'');
				j('.reward').addClass('dis_none');
				if(param_obj.amount){
					j('.reward').addClass('dis_none');
					$("#invest_btn").removeClass('dis_btn');
				}

				prizeId = 'LOogHV1WR7M=';//暂不使用
			}
			that.bindEvent();
		}
	};
	pageUtilt.init();


	var redbagUtil = {
		balanceArr : [],
		init : function(){
			var that = this;
			r.setFlag(false);
			r.post({ //红包列表
				url : PUBLIC._COMMON,
				data : {
					requesturl : "LIevx%2B1yqJ%2BdPH3cCouw9lVlpFlN9Y0ESq%2FeT2MgX9mBX56IW4eiYctwfym7FNnZ",
					proType : 3,
					days : touziUtil.term
				},
				success : function(data){
					var str = "";
					if(data.code == '0000'){
						data = data.data || [];
						var L=data.length;
						if(!L){
							j('.invest-packet').addClass('dis_none');
							// j('#rbText').html('目前您没有可使用的奖励');
							return ;
						}else{
							j('.rbTexttitle').html('可用奖励');
							if(activateBalance){//如果有可使用的奖励
								pageUtilt.rewardSkipFlag = true;
							}else{//暂不使用
								pageUtilt.rewardSkipFlag = false;
							}
						}
						if(data.length){
							that.balanceArr = data;
						}
						/*for(var i=0,L=data.length;i<L;i++){
							that.balanceArr.push({balance:data[i].activateBalance,redbag:data[i].balance});
							str += '<li class="redbag" data-num="'+data[i].activateBalance+'"">'+data[i].balance+'元</li>'
						}
						j('#redbagContent').html(str);*/
					}
				}
			});
		}
	};
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST,COMMON_Login);
