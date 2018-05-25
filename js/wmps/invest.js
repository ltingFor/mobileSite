(function(w,j,r,t,l,c,v){
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || ''),
		type = param_obj.type || '1',//1翼农  2芝麻  3私人订制
		balance = param_obj.balance || '',//奖励金额
		activateBalance = param_obj.activateBalance || '',
		rewardType = param_obj.rewardType || '',//1红包  3加息券
		prizeId = decodeURIComponent(param_obj.prizeId || ''),

		tmp = [],termValue=0;
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
			this.investFlag = false;
			if(this.maxAmount < 100){
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			}
			var numValue = +(this.num.val() || 0);
			if(numValue === 0){
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			}
			if(numValue > this.maxAmount){
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				pageUtilt.rewardSkipFlag = false;
				return;
			}
			var num_value = Math.floor(numValue / 100) * 100;
			if(numValue != num_value){
				pageUtilt.rewardSkipFlag = false;
				j(".reward").addClass('dis_none');
				j('.noreward').removeClass('dis_none');
				return;
			}
			// if(redbagUtil.balanceArr.length && !pageUtilt.LOCK){//此处是因为要做加息券，所以暂时屏蔽
				that.matchRedbeg(redbagUtil.balanceArr,numValue);
			// }

			this.investFlag = true;
			if(this._OBJ.type == '3'){
				this.caculateInterest(this._OBJ.balance);
			}else{
				this.caculateInterest();
			}
			if(j("#protocolCheck").attr('src') == '/static/mobileSite/images/checkyes.png'){
				this.investBtn.removeClass('dis_btn');
				this.investBtn.addClass('invest_btn_active'); //新增协议
			}
		},
		caculateInterest : function(addRate){//计算预计回报
			addRate = (+(addRate)/100)||'0';
			var numValue = +(this.num.val() || 0);
			var p1 = ((numValue * (parseFloat(this.interest)+parseFloat(addRate))) / 365).toFixed(2);
			var profit = (p1 * this.term).toFixed(2);
			this.expectInterest.removeClass('dis_none').html('预期回报:(不等同于实际回报)：' + profit + '元');
		},
		matchRedbeg : function(arr,money){//排序 匹配红包
			var sendData = JSON.stringify({money:money,rewardArr:arr});
			var _OBJStr = matchReward(sendData);
			if(_OBJStr){
				this._OBJ = JSON.parse(_OBJStr);
				j('.noreward').addClass('dis_none');
				if(this._OBJ.type == '3'){//加息券
					// this.caculateInterest(this._OBJ.balance);
					j('.reward').removeClass('dis_none').removeClass('redbagReward').html(this._OBJ.balance+"%");
				}else{//红包
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
			that.max.bind('click',function(){//全投
				PUBLIC.count('MTZ-YNJH-XQ-MSTZ-QT');
				var maxAmount = that.maxAmount;
				console.log(maxAmount)
				if(maxAmount == 0){
					that.num.val('');
					l.alertAuto('可用余额不足，请先充值');
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
					return;
				} else {
					var numValue = +(numStr || 0);
					if(numValue > that.maxAmount){
						that_num.val(that.maxAmount);
					}
				}
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
				PUBLIC.count('MTZ-YNJH-XQ-MSTZ-TYTZ');
				var btn = j(this);
				if(btn.hasClass('dis_btn')){
					return;
				}
				var numValue = +(that.num.val() || 0);
				/***是否支持实时匹标***/
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
							if(pageUtilt.LOCK){
								w.location.href = '/static/mobileSite/html/wmps/wmps_tender.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&type=' + type + '&amount=' + numValue + "&term=" + touziUtil.term +'&v=' + Math.random() + '&LOCK=1' + '&prizeId='+encodeURIComponent(prizeId) + '&balance='+balance+'&rewardType='+rewardType;
							}else{
								w.location.href = '/static/mobileSite/html/wmps/wmps_tender.html?platform=' + platform + '&pid=' + encodeURIComponent(pid) + '&type=' + type + '&amount=' + numValue + "&term=" + touziUtil.term +'&v=' + Math.random() + '&LOCK=0' + '&prizeId='+encodeURIComponent(prizeId) + '&balance='+balance+'&rewardType='+rewardType;
							}

						}
					}
				});
			});
		},
		init:function(){
			this.bindEvent();
		}
	};

	var pageUtilt = {
		protocolUrl : j("#protocolUrl"),
		recharge : j("#recharge"),
		rewardSkipFlag:false,
		LOCK : true,//红包锁定的开关
		bindEvent:function(){
			var that = this;
			that.recharge.bind('click',function(){
				PUBLIC.count('MTZ-YNJH-XQ-MSTZ-CZ');
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
					w.location.href = '/static/mobileSite/html/myaccount/myhd.html?&platform='+platform+'&v='+Math.random();
				}
			});

		},
		initPage : function(){
			var that = this;
			r.postLayer({url : PUBLIC._COMMON,//投资初始化
				data : {
					requesturl:CONFIG.WMPS_InvestInit_URL,
					pid:pid
				},
				success : function(data){
					if(data.code == "0000"){
						var info = data.data;
						termValue = info.strPhases || 0;//投资期限
						var	restAmountValue = (t.outputmoney((parseFloat(info.canBuyAmount)/10000)+""))|| 0;//剩余可投
							// restAmountValue = restAmountValue.toFixed(2);
							// restAmountValue = 10000;//@@@@测试数据用/
						var interest1 = info.strInterestrate.split('+');
						var ratioA = info.strInterestrate.split("+");
						touziUtil.interest = 0;
						for(var i = 0,L = ratioA.length; i < L; i++){
							touziUtil.interest += parseFloat(ratioA[i]);
						}
						touziUtil.interest = parseFloat(touziUtil.interest/100);
						var zhu = interest1[0],zhulilv = zhu.split('%')[0];
						j('#interest1').html(zhu.split('%')[0]+"<i id='interest2'>%</i>");//主利率
						if(interest1[1]){//加息
							j("#interest2").append("+"+interest1[1]);
						}
						var urlentry = info.urlentry || '';//协议
						if(urlentry && urlentry.code == '0'){
							j("#protocolUrlAdd").attr('href',urlentry.entryDesc);
							pageUtilt.protocolUrl.attr('href',urlentry.entryDesc).html(urlentry.entryName);
						}else{
							pageUtilt.protocolUrl.addClass('dis_none');
						}

						j('#term').html(termValue.split("天")[0]);
						j('#title').text(info.wholeTitle);
						j('#restAmount').html(restAmountValue);
						touziUtil.term = parseFloat(termValue.split("天")[0]);
						tmp = new Array();
						tmp.push(parseFloat(info.canBuyAmount));
						//开户的接口实现

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
									j("#userAmount").html(balanceValue);
									tmp.push(parseFloat(balanceValue));
									var min_tem = tmp[0];
									for(var i=1;i<tmp.length;i++){
										if(min_tem>tmp[i]){
											min_tem=tmp[i];
										}
									}
									touziUtil.maxAmount = Math.floor(min_tem / 100) * 100;
								}else{
									touziUtil.maxAmount = 0;
								}
								touziUtil.init();
							}
						});
						v.checkVip(function(data){//检测是否有vip利率
							if(data.code == '0000'){
								data = data.data;
								var vipRate = data.vipRate;
								if(vipRate && parseFloat(vipRate)>0){
									j('#interest2').append("+"+vipRate+"<img src='/static/mobileSite/images/v.png' style='width:0.55rem;height:0.40rem;''>");
								}
								if(vipRate){
									touziUtil.interest += parseFloat(vipRate)/100;
								}
							}
						});
						//红包锁定开关
						that.checkLock();
					}
				}
			});
		},
		//在匹标页返回时，清除匹配的债权,
		clearTenderMacth : function(){
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl:'Ls5SF9UahdriS%2BUs2aASAl3ewNhuCgnT',pid : pid},
				success : function(data){
					that.initPage();
				}
			})
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
							redbagUtil.init();//获取红包列表
							that.LOCK = false;
						}else if(data == '1'){ //红包锁定开启
							that.LOCK = true;
							redbagUtil.init();//获取红包列表
							//j(".invest-packet").addClass('dis_none');
						}
					}
				}
			})
		},
		init : function(){
			var that = this;
			j("#protocolCheck").attr('src','/static/mobileSite/images/checkno.png');
			if(balance && balance != '0'){//对于选择的奖励进行回显 balance奖励金额
				var balanceStr = rewardType == '1' ? balance+'元' : balance+'%';
				if(+(activateBalance) > +(param_obj.amount)){
					j('#num').val(activateBalance);
				}else{
					console.log(param_obj.amount);
					j('#num').val(param_obj.amount);
				}
				j('.invest-packet').removeClass('dis_none');
				// j('#invest_btn').removeClass('dis_btn');
				if(rewardType == '1'){
					j('.reward').addClass('redbagReward').removeClass('dis_none').html(balanceStr);
				}else{
					j('.reward').removeClass('dis_none').html(balanceStr);
				}
				prizeId = prizeId;
				touziUtil.investFlag=true;
			}else{
				j('#num').val(param_obj.amount||'');
				j('.reward').addClass('dis_none');
				if(param_obj.amount){
					// j("#invest_btn").removeClass('dis_btn');
				}
				prizeId = 'LOogHV1WR7M=';//暂不使用
			}
			that.clearTenderMacth();//刚进页面默认清除匹标绑定
			that.bindEvent();
		}
	};
	pageUtilt.init();


	//用户输入金额动态匹配红包
	var redbagUtil = {
		balanceArr : [],
		init : function(){
			var that = this;

			r.setFlag(false);
			r.post({ //红包列表
				url : PUBLIC._COMMON,
				data : {
					requesturl : "LIevx%2B1yqJ%2BdPH3cCouw9lVlpFlN9Y0ESq%2FeT2MgX9mBX56IW4eiYctwfym7FNnZ",
					types:'1,3',
					proType : 1,
					days : (((termValue||'').split('天')[0]) || '')
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
							if(data[i].type == '3'){
								str += '<li class="redbag" data-num="'+data[i].activateBalance+'"">'+data[i].balance+'%</li>';
							}else{
								str += '<li class="redbag" data-num="'+data[i].activateBalance+'"">'+data[i].balance+'元</li>';
							}

						}
						j('#redbagContent').html(str);*/
					}
				}
			});
		}
	};
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST);
