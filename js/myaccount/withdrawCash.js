(function(w,j,r,l,t,c){
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		cardType = param_obj.cardType;
	/*
	* 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
	* @param fn {function}  需要调用的函数
	* @param delay  {number}    延迟时间，单位毫秒
	* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}实际调用函数
	*/
	var throttle = function (fn,delay, immediate, debounce) {
	   var curr = +new Date(),//当前事件
	       last_call = 0,
	       last_exec = 0,
	       timer = null,
	       diff, //时间差
	       context,//上下文
	       args,
	       exec = function () {
	           last_exec = curr;
	           fn.apply(context, args);
	       };
	   return function () {
	       curr= +new Date();
	       context = this,
	       args = arguments,
	       diff = curr - (debounce ? last_call : last_exec) - delay;
	       clearTimeout(timer);
	       if (debounce) {
	           if (immediate) {
	               timer = setTimeout(exec, delay);
	           } else if (diff >= 0) {
	               exec();
	           }
	       } else {
	           if (diff >= 0) {
	               exec();
	           } else if (immediate) {
	               timer = setTimeout(exec, -diff);
	           }
	       }
	       last_call = curr;
	   }
	};
	 
	/*
	* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
	* @param fn {function}  要调用的函数
	* @param delay   {number}    空闲时间
	* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
	* @return {function}实际调用函数
	*/
	 
	var debounce = function (fn, delay, immediate) {
	   return throttle(fn, delay, immediate, true);
	};
	var pageUtil = {
		showCard : j(".showCard"),
		addCard : j('.addCard'),
		bankDetail : j("#bankDetail"),
		tixianContain : j("#tixianContain"),
		bankName : j("#bankname"),//银行名字和code
		bankCode : j("#bankCode"),
		account : j("#account"),//尾号
		bankIconUrl : j("#bankIconUrl"),//银行图标
		userBalance : j("#userBalance"),//账户余额
		amount : j("#txje"),//提现金额
		userBalanceTo : j("#userBalanceTo"),//本卡可提金额
		quota : j("#quota"),//免费提现费用
		quota_val : 0,//免费提现费用
		countWithDrawFee : j("#countWithDrawFee"),//可免费提现次数
		tixian : j("#tixian"),//提现的btn
		unit : 0,//提现单位
		cost_rate : 0,//提现费率
		cost_min_unit : 0,//提现最小单位
		canWithDrawMoney : 0,//账户余额
		tx_tip : j("#tx_tip"),
		delBank : j("#delBank"),
		tnum:1,//默认t1提现方式
		t0MaxAmt:50000,//默认t0最大提现金额
		t0Min:2,//默认t0最小提现手续费
		t0Rate:0.0005,//默认t0提现费率
		fee:0,
		inWhite:false,
		
		
		help : j("#help"),
		// hideForm : j("#hideForm"),
		addCardBtn : j("#addCardBtn"),
		tixianmethod : j("#withdrawalmethod label"),
		bindEvent : function(){
			var that = this;
			//切换提现方式
			that.tixianmethod.bind('click',function(){
				
				j("#withdrawalmethod label").removeClass('checked');
				j("#withdrawalmethod label").next().hide();
				
				j(this).addClass('checked');
				j(this).next().show();
				
				if(j("#withdrawalmethod label").index(j(this))==0){
					that.tnum=1;
					
				}else{
					that.tnum=0;
				}
				var val = that.amount.val();
				debounce(valHandler.valAmount(val),1000,false);
				
				
			});
			
			that.tx_tip.bind('click',function(){
				l.alert2('因手机支付要求同卡进出，故要求用户使用网站绑定的银行卡提现时，要保留出手机充值金额，使手机绑定的卡可提走相应金额，即为该卡可提金额');
			});

			//提现帮助
			that.help.bind('click',function(){
				w.location.href = "/static/customer/questionPage.html?type=2";
			});
			
			//解绑银行卡
			that.delBank.bind('click',function(){
				var tip = '只有账户中无可用余额且未持有债权的情况下才能自行解绑。如果您无法自行解绑，请拨打客服电话400-080-5055申请人工解绑。';
				if(cardType != '1' && cardType != undefined && cardType != 'undefined'){//非身份证开户的用户
					tip = '只有账户中无可用余额且未持有债权的情况下才能自行解绑。如果您无法自行解绑，请拨打客服电话400-080-5055申请人工解绑。<br/><br/>您使用的开户证件不是身份证，解绑后无法在手机端绑定新卡，需要联系客服手动绑卡。'
				}
				l.alert1('',tip,'您确定要解绑银行卡吗？');

				l.setOkAction(function(){
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.WithDraw_delCard_URL,
							cardId : that.bankCode.text()
						},
						success : function(data){
							if(data.code == '0000'){
								l.alert2('解绑成功');
								l.setKnowAction(function(){
									that.showCard.addClass('dis_none');
									that.bankDetail.addClass('dis_none');
									that.tixianContain.addClass('dis_none');
									that.addCard.addClass('current-show').removeClass('dis_none');
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
			//提现
			that.tixian.click(function(){
				PUBLIC.count('LJTX');
				if(!that.tixian.hasClass('dis_btn')){//按钮有效，发送提现申请请求
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : CONFIG.WithDraw_Tixian_URL,
							tNum: that.tnum,
							amt : that.amount.val() || '0',
							fee : that.fee //提现费用
						},
						success : function(data){
							that.deleCardF = true;
							if(data.code == '0000'){
								data = data.data;
								//c.creatAndSubForm(data);
								//localStorage.setItem('formData',JSON.stringify(data));
                                var oA = j("<a href='"+data.loading+"'></a>").get(0);
								var oE = document.createEvent('MouseEvents');
									oE.initEvent( 'click', true, true );
									oA.dispatchEvent(oE);
							}
						}
					});
				}
			});
			
			//绑定银行卡
			that.addCardBtn.bind('click',function(){
				r.postLayer({
					url : PUBLIC._COMMON,
					data : {
						requesturl : CONFIG.WithDraw_AddCard_URL
					},
					success : function(data){
						if(data.code == '0000'){
							data = data.data;
							c.creatAndSubForm(data);
						}
					}
				});
			});
			//对输入的金额进行校验，以及计算手续费
			that.amount.bind('input propertychange',function(){
				j('#z-monClose').show()
				var val = that.amount.val();
				debounce(valHandler.valAmount(val),1000,false);
			});
			j('#z-monClose').on('click',function(){
				that.amount.val('');
				//valHandler.txTip.html('本次提现免费，当前免费提现额度'+pageUtil.quota_val+'元');
				valHandler.t1Desc.html('本次提现免费，限免额度'+pageUtil.quota_val+'元');
				valHandler.errorTip.hide();
				j(this).hide();
				pageUtil.tixian.addClass('dis_btn');
			});
			
			that.amount.bind('blur',function(){
				var val = that.amount.val();
				if(valHandler.valAmount(val)){
					that.tixian.removeClass('dis_btn');
				}else{
					that.tixian.addClass('dis_btn');
				}
			});
		},
		//获取账户信息
		getUserInfo : function(){
			var that = this;
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.WithDraw_AccountInfo_URL
				},
				success : function(data){
					/*cost_calculation_unit 提现费用计算单位  
					cost_min_unit 手续费最小单位  
					cost_rate 手续费率 
					countWithDrawFee  免提现手续费次数	
					withDrawQuota  提现额度 
					quota  免提现费用额度
					account 银行卡尾号	
					**/
					if(data.code == '0000'){
						data = data.data;
						that.userBalance.html(t.outputmoney(data.userBalance));  
						that.userBalanceTo.html(t.outputmoney(data.userBalance));
						that.canWithDrawMoney = data.userBalance;

						var bankO = data.personalAccount || {},fyO = data.withDrawQuota;
						if(!bankO.bankCode){//没有银行卡信息
							that.showCard.addClass('dis_none');
							that.bankDetail.addClass('dis_none');
							that.tixianContain.addClass('dis_none');
							that.addCard.addClass('current-show').removeClass('dis_none');
						}else{//有银行卡信息
							that.showCard.addClass('current-show').removeClass('dis_none');
							that.addCard.addClass('dis_none').removeClass('current-show');
							that.bankIconUrl.attr('src',bankO.bankIconUrl);
							that.bankName.html(bankO.bankname || '-');
							that.bankCode.html(bankO.id || '0');
							that.account.html(bankO.account || '-');
						}
						// that.countWithDrawFee.html(fyO.countWithDrawFee || '0');
						// that.quota.html(t.outputmoney(fyO.quota+""));
						pageUtil.quota_val = fyO.quota;
						pageUtil.inWhite = fyO.inWhite;//是否是白名单
						pageUtil.t0Min = Number(data.t0Min);
						pageUtil.t0MaxAmt = Number(data.t0MaxAmt);
						pageUtil.t0Rate = Number(data.t0Rate);

						//valHandler.txTip.html('本次提现免费，当前免费提现额度'+fyO.quota+'元');
						valHandler.t1Desc.html('本次提现免费，限免额度'+pageUtil.addCommas(fyO.quota)+'元');
						valHandler.t0Desc.html('本日剩余快速提现金额' + pageUtil.addCommas(pageUtil.t0MaxAmt) + '元');

						that.unit = data.cost_calculation_unit;
						that.cost_rate = data.cost_rate;
						that.cost_min_unit = data.cost_min_unit;

						valHandler.init();//
					}
					
				}
			});
		},
		addCommas:function(nStr){
						nStr += '';
						var x = nStr.split('.');
						var x1 = x[0];
						var x2 = x.length > 1 ? '.' + x[1] : '';
						var rgx = /(\d+)(\d{3})/;
						while (rgx.test(x1)) {
							x1 = x1.replace(rgx, '$1' + ',' + '$2');
						}
						return x1 + x2;
					},
		init : function(){
			var that = this;
			that.amount.val('');//解决从懒猫返回的页面  还有默认值的问题
			that.tixian.addClass('dis_btn');//解决从懒猫返回的页面  还有默认值的问题
			that.getUserInfo(),that.bindEvent();
		}
	}
	//验证
	var valHandler = {
		txTip : j('#txTip'),//提现说明
		t1Desc : j('#t1Desc'),//T1提现说明
		t0Desc : j('#t0Desc'),//T0提现说明
		feiy : j("#feiy"),//费用
		errorTip : j(".errorTip"),
		valAmount : function(val){
			var that = this;
			if(this._flag){//没有银行卡禁止提现
				return;
			}
			var amount_reg = /^[0-9]+(\.[0-9]{0,2})?$/,
			// var amount_reg = /^[0-9]+(\.[0-9])?$/,
				flag = false;
			this.errorTip.addClass('dis_none');
			if(!amount_reg.test(val)){//验证是否是数字
				pageUtil.amount.val('');
				flag = true;
			}
			if(val < 3 && !flag){//验证提现金额是否小于3
				this.errorTip.removeClass('dis_none').html('提现金额大于等于3元');
				flag = true;
			}
			if(val > this.canWithDrawMoney){
				flag = true;
			}
			
			if(pageUtil.tnum==1){//t+1提现
				if(!pageUtil.inWhite){//白名单之外
							
						if(val <= pageUtil.quota_val){
							//that.txTip.html('本次提现免费，当前免费提现额度'+pageUtil.quota_val+'元');
							that.t1Desc.html('本次提现免费，限免额度'+pageUtil.addCommas(pageUtil.quota_val)+'元');
						}else if(val > pageUtil.quota_val){
							pageUtil.fee=valHandler.calculateFeeNew(val)//保存费率
							//that.txTip.html('<span>提现金额超过免费提现额度，将收取提现手续费</span><span id="feiy"></span><span>元，当前免费提现额度'+pageUtil.quota_val+'元</span>');
							that.t1Desc.html('<span>提现金额超过限免额度，将收取提现手续费</span>'+pageUtil.addCommas(pageUtil.fee)+'元，限免额度'+pageUtil.addCommas(pageUtil.quota_val)+'元</span>');
							//that.feiy = j("#feiy");
							console.log(val)
							//that.feiy.text(pageUtil.fee);//计算手续费
							}		
				}
			}else{
				if(val>0){
									
				/*if(val > pageUtil.t0MaxAmt){	//验证快速提现金额是否大于最大单笔提现
					this.errorTip.removeClass('dis_none').html('快速提现单笔金额不能超过'+pageUtil.t0MaxAmt*10000/100000000+'万元');
					flag = true;
				}*/
				pageUtil.fee=valHandler.calculateFeeNew_t0(val)//保存费率
				that.t0Desc.html('本日剩余快速提现金额' + pageUtil.addCommas(pageUtil.t0MaxAmt) + '元。本次提现金额'+pageUtil.addCommas(val)+'元，提现手续费' + pageUtil.addCommas(pageUtil.fee) + '元');		
				}				
				
				
				
			}
			

			if(flag){//输入金额有问题
				pageUtil.amount.focus();
				pageUtil.tixian.addClass('dis_btn');
				return false;
			}
			if(val >= pageUtil.unit){
				this.errorTip.removeClass('dis_none').html('提现金额大于10万，银行可能会分批处理到账，请注意查收.')
			}
			this.errorTip.addClass('dis_none');
			pageUtil.tixian.removeClass('dis_btn');
			return true;
		},
		/*
		*json字符串
		{
			money : 0,//提现金额
			countWithDrawFee : 0,//免费提现次数
			quota : 0,//免费提现额度
			cost_calculation_unit : 0,//提现的单位
			cost_min_unit : 0,//最小提现单位
			cost_rate : 0,//提现费率
		}
		*/
		calculateFeeNew : function(val){
			// var times = pageUtil.countWithDrawFee.text();
			var json = {
				"money":val,
				// "countWithDrawFee":times,
				"quota":this.quota,
				"cost_calculation_unit":this.unit,
				"cost_min_unit":this.cost_min_unit,
				"cost_rate":this.cost_rate
			}
			jsonStr = JSON.stringify(json);
			return calculateFee(jsonStr);//调用和app公用的caculate.js文件
		},
		calculateFeeNew_t0 : function(val){
			// var times = pageUtil.countWithDrawFee.text();
			var json = {
				"money":val,
				// "countWithDrawFee":times,
				"quota":0,
				"cost_calculation_unit":this.unit,
				"cost_min_unit":this.t0Min,
				"cost_rate":this.t0Rate
			}
			jsonStr2 = JSON.stringify(json);
			return calculateFee(jsonStr2);//调用和app公用的caculate.js文件
			
			//return val*pageUtil.t0Rate>pageUtil.t0Min?val*pageUtil.t0Rate:pageUtil.t0Min;
		},
		init : function(){
			var addCard = pageUtil.addCard.hasClass('dis_none');
			if(!addCard){//如果没有银行卡
				this._flag = true;//禁止提现标志
			}
			//计算单位
			this.unit = pageUtil.unit;
			this.quota = Number(pageUtil.quota_val);
			this.cost_min_unit = pageUtil.cost_min_unit;
			this.cost_rate = pageUtil.cost_rate;
			this.t0Min = pageUtil.t0Min;
			this.t0Rate = pageUtil.t0Rate;
			this.canWithDrawMoney = Number(pageUtil.canWithDrawMoney);

		}
	}
	pageUtil.init();
	
}(window,$,requestUtil,Layer,Tools,COMMON_KH))
