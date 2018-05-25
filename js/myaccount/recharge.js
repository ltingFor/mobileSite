			var that = this;
(function(w,j,r,l,t,c){
	var pageUtil = {
		bankHead : j(".bank-head"),
		hasCard : j(".no-card"),
		showCard : j(".showCard"),
		addCard : j('.addCard'),
		userBalance : j("#userBalance"),
		bankName : j("#bankname"),//银行名字和code
		bankCode : j("#bankCode"),
		bankId : j("#bankId"),
		account : j("#account"),//尾号
		accountHide : j("#accountHide"),
		bankIconUrl : j("#bankIconUrl"),//银行图标
		userBalance : j("#userBalance"),//账户余额
		amount : j("#czje"),//提现金额
		recharge : j("#recharge"),//提现的btn
		delBank : j("#delBank"),
		addCardBtn : j("#addCardBtn"),
		monClose : j('.z-monClose'),

		overRecharge : j(".overRecharge"),
		rechargeErrorTip : j("#rechargeErrorTip"),
		channelName : j("#channelName"),
		onceLimit : j("#onceLimit"),
		dayLimit : j("#dayLimit"),
		dayLimitMax : j("#dayLimitMax"),
		monthLimit : j("#monthLimit"),
		monthLimitMax : j("#monthLimitMax"),
		clikDelCardFlag : false,

		bindEvent : function(){
			var that = this;
			that.monClose.bind('click',function(){
				that.amount.val('');
				that.recharge.addClass('dis_btn');
			});
			//解绑银行卡
			that.delBank.bind('click',function(){
				that.clikDelCardFlag = true;
				l.alert1('',"只有账户中无可用余额且未持有债权的情况下才能自行解绑。如果您无法自行解绑，请拨打客服电话400-080-5055申请人工解绑。",'您确定要解绑银行卡吗？');
				l.setOkAction(function(){
					// l.hideLayer();
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.WithDraw_delCard_URL,
							cardId : that.bankId.text()
						},
						success : function(data){//无卡
							if(data.code == '0000'){
								l.alert2('解绑成功');
								l.setKnowAction(function(){
									that.bankHead.addClass('dis_none');
									that.hasCard.addClass('dis_none');
									j('#noCardZ').show();
									that.recharge.removeClass('dis_btn').removeClass('rechargeBtn').addClass("addCardBtn").html('添加充值银行卡');

								});
							}else{//此处是为了保证两端同时解绑卡，点击知道了的时候，重新刷新页面
								l.setKnowAction(function(){
									location.reload(true);//false:从客户端缓存里取当前页  true:则以 GET 方式，从服务端取最新的页面
								});
							}
						}
					})
				});
			});
			
			//充值  获取充值通道
			that.recharge.unbind().bind("click",function(){
				PUBLIC.count('LJCZ');
				if(!that.recharge.hasClass('dis_btn')){//按钮有效，发送提现申请请求
					//WithDraw_AddCard_URL
					if(that.recharge.hasClass('rechargeBtn')){
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.Recharge_GetPayWays_URL,
							bank : that.bankCode.text() || '0',
							bankAccount : that.accountHide.text(), //提现费用
							payMoney : that.amount.val()
						},
						success : function(data){
							console.log(data);
							if(data.code == '0000'){
								data = data.data;//此处的样式的class类在页面上，因为是特殊处理的
								l.alert1("<label class='tongdao'>当前支付通道："+data.channelName+"</label><br/>"
									+"<label class='tongdao'>单笔&nbsp;<font style='color:#f84d4d;'>"+t.outputmoney(data.onceLimit||"0.0")+"</font></label><br/>"
									+"<label class='tongdao'>单日&nbsp;<font style='color:#f84d4d;'>"+t.outputmoney(data.dayLimit || '0.0')+"</font>&nbsp;/&nbsp;"+t.outputmoney(data.dayLimitMax || '0.0')+"</label><br/>"
									+"<label class='tongdao'>单月&nbsp;<font style='color:#f84d4d;'>"+(data.monthLimit || '-')+"&nbsp;/&nbsp;"+(data.monthLimit || '-')+"</label>",
									"<span class='rechargeTip'>已为您自动选择最合适的支付通道进行充值</span>");
								l.setOkAction(function(){
									r.post({
										url : PUBLIC._COMMON,
										data : {
											requesturl : CONFIG.Recharge_URL,
										},
										success : function(data){
											if(data.code == '0000'){
												data = data.data;
												//c.creatAndSubFormContext(data);
												//localStorage.setItem('formData',JSON.stringify(data));
												var oA = j("<a href='"+data.loading+"'></a>").get(0);
												var oE = document.createEvent('MouseEvents');
													oE.initEvent( 'click', true, true );
													oA.dispatchEvent(oE);
											}
										}
									});
								});
							}else if(data.code == '6032'){//充值超限
								var res = data.data || {};
								that.overRecharge.removeClass('dis_none');
								that.channelName.html(res.channelName||'-');
								that.dayLimit.html(res.dayLimit||'-');
								that.dayLimitMax.html(res.dayLimitMax||'-');
								that.monthLimit.html(res.monthLimit||'-');
								that.monthLimitMax.html(res.monthLimitMax||'-');
								that.onceLimit.html(res.onceLimit||'-');
								that.rechargeErrorTip.html(data.message);
							}
						}
					});
					}else if(that.recharge.hasClass('addCardBtn')){//添加银行卡
						console.log(CONFIG.WithDraw_AddCard_URL);
						r.postLayer({//WithDraw_AddCard_URL
							url : PUBLIC._COMMON,
							data : {
								requesturl : CONFIG.WithDraw_AddCard_URL
							},
							success : function(data){
								console.log(data);
								if(data.code == '0000'){
									data = data.data;
									c.creatAndSubForm(data);
								}
							}
						});
					}
				} 
			});
			
			//对输入的金额进行校验，以及计算手续费
			that.amount.bind('input propertychange',function(){
				var val = that.amount.val();
				valHandler.valAmount(val);//判断输入金额是否正确
			});
			that.amount.bind('focus',function(){
				that.overRecharge.addClass('dis_none');
			});
		},
		//获取账户信息
		rechargeInit : function(){
			var that = this;
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Recharge_Init_URL
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						that.userBalance.html(t.outputmoney(data.balance+'' || '0.0'));  

						if(!data.bankCode){//没有银行卡信息
							that.bankHead.addClass('dis_none');
							that.hasCard.addClass('dis_none');
							j('#noCardZ').show();
							that.recharge.html('添加充值银行卡').removeClass("dis_btn").removeClass('rechargeBtn').addClass('addCardBtn');
						}else{//有银行卡信息
							
							that.recharge.addClass('rechargeBtn').removeClass('addCardBtn');
							that.showCard.addClass('current-show').removeClass('dis_none');
							that.addCard.addClass('dis_none').removeClass('current-show');
							j('#noCardZ').hide();
							that.bankIconUrl.attr('src',data.bankIconUrl);
							that.bankName.html(data.bankName || '-');
							that.bankId.html(data.id || '0');
							that.bankCode.html(data.bankCode);
							if(data.bankNotice.length){
								var str = '',strArr = data.bankNotice;
								for(var i=0,l=strArr.length;i<l;i++){
									str += strArr[i]+'<br/>';
								}
								j("#tipOther").html(str);
								// j("#tipRecharge").html(data.bankNotice);
								j('#tipRecharge').removeClass('dis_none');
							}
							var cardNum = data.bankAccount,
								subNum = cardNum.slice(-4);
							that.account.html(subNum || '-');
							that.accountHide.html(cardNum || '-');
						}
						//valHandler.init();//
					}
					
				}
			});
		},
		init : function(){
			var that = this;
			that.amount.val('');//解决从懒猫返回的页面  还有默认值的问题
			that.rechargeInit(),that.bindEvent();
		}
	}
	//验证
	var valHandler = {
		errorTip : j(".errorTip"),
		valAmount : function(val){
			var amount_reg = /^[0-9]+(\.[0-9]{0,2})?$/,
				flag = false;
			this.errorTip.addClass('dis_none');
			if(!amount_reg.test(val)){//验证是否是数字
				this.errorTip.html('请输入正确的充值金额');
				flag = true;
			}
			val = +(val);
			if(val < 3){
				this.errorTip.html('充值金额最少3元');
				flag = true;
			}
			if(flag){//输入金额有问题
				pageUtil.recharge.addClass('dis_btn');
				pageUtil.amount.focus();
				return;
			}
			if(val >= 100000){
				this.errorTip.removeClass('dis_none').html('充值金额大于10万，银行可能会分批处理到账，请注意查收.')
			}
			this.errorTip.addClass('dis_none');
			pageUtil.recharge.removeClass('dis_btn');
		}
	}
	pageUtil.init();
	
}(window,$,requestUtil,Layer,Tools,COMMON_KH))
