(function(w,j,r,l,t,h,d,v,c,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform;
	/**
	 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
	 *
	 * @param  {function} func        传入函数
	 * @param  {number}   wait        表示时间窗口的间隔
	 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
	 * @return {function}             返回客户调用函数
	 */
	var debounce = function(func, wait, immediate) {
	  var timeout, args, context, timestamp, result;
	  var later = function() {
	    // 据上一次触发时间间隔
	    var last = (new Date().getTime()) - timestamp;
	    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
	    if (last < wait && last > 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
	      if (!immediate) {
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      }
	    }
	  };

	  return function() {
	    context = this;
	    args = arguments;
	    timestamp = (new Date().getTime());
	    var callNow = immediate && !timeout;
	    // 如果延时不存在，重新设定延时
	    if (!timeout) timeout = setTimeout(later, wait);
	    if (callNow) {
	      result = func.apply(context, args);
	      context = args = null;
	    }
	    return result;
	  };
	};
	var pageUtil = {
		dzjhTip:'',
		userMoneyFlag:false,//用户余额的请求次数
		useableAmt : 0,//用户余额
		dzjhBtn : j(".fc #dzjh"),
		gwcBtn : j(".fc #gwc"),

		gwcNum: j(".fc .num"),
		gwcTimer: j(".fc .timer"),

		dzjhCloseBtn: j(".dzjhtj .btn.gb"),
		dzjhConfirmBtn: j(".dzjhtj .btn.qd"),

		dzjhAmount: j(".dzjhtj .ipt input"),
		
		dzjhtjlayer: j('.dzjhtjLayer'),
		dzjhtj: j('.dzjhtj'),
		
		investLimit:100000,

		djsTimer: j('.fc #gwc .timer'),
		getInvestLimit:function(){
			var _this = this;
			r.setFlag(false);
			r.post({
				url:PUBLIC._COMMON,
				data:{requesturl:'mBI9zdBAgnR0RONCptStQssIoSoUTExO'},
				success:function(data){
					if(data.code == '0000'){
						data = data.data;
						_this.investLimit = data.investLimit || 100000;
					}
				}
			})
		},
		bindEvent : function(){
			var that = this;
			that.dzjhtjlayer.on('click',function(){
				that.dzjhtj.removeClass('out').addClass('in');
				that.dzjhtjlayer.fadeOut();
			});
			/*校验输入的金额的大小等*/
			that.dzjhAmount.bind('input propertychange',debounce(function(){
				var investMoney = +(that.dzjhAmount.val()),invevstFlag = true;
				if(investMoney == '100'){
					that.reinitRange($(".zqrange"),$(".zqtip"),'个');
					that.dzjhTip = {tip:'每个债权出借不可低于100元',type:1};
		    		invevstFlag = true;
				}
				if(investMoney > that.investLimit){
					l.alertAuto('最多可出借'+((that.investLimit)/10000)+'万元');
					that.dzjhTip = {tip:'最多可出借'+((that.investLimit)/10000)+'万元',type:1};
					invevstFlag = false;
				}
				var investMoney_value = Math.floor(investMoney / 100) * 100;
				if((investMoney !=  investMoney_value) || investMoney < 100){
					l.alertAuto('出借本金为100的整数倍');
					that.dzjhTip = {tip:'出借本金为100的整数倍',type:1};
					invevstFlag = false;
				}

				if(that.useableAmt < investMoney){
					that.dzjhTip = {tip:'您的可用余额不足，无法按您的需求匹配债权，是否去充值？',type:2,url:'/static/mobileSite/html/myaccount/recharge.html?platform='+platform+'&v='+Math.random()};
					invevstFlag = false;
				}
				if(!invevstFlag){
					that.dzjhConfirmBtn.addClass('unactive');
					return false;
				}else{
					that.dzjhConfirmBtn.removeClass('unactive')
				}
			},800));
			AmountInput.getConfirmBtn().click(function(){
				if (!AmountInput.check()) {
					return;
				}
				var current = window.currentTailor;
				var lockExt = current.attr('data-lock');
				that.tenderLock(AmountInput.getAmount(), lockExt);
			});

			that.gwcBtn.click(function(){
				if(that.gwcNum.text() == '0'){
					l.alertAuto('您尚未选择债权，请先选择债权');
					return false;
				}
				sessionStorage.setItem('current', '#tailor');
				sessionStorage.setItem('shoppingcartType', 'gwc');
				window.location.href = "/static/mobileSite/html/tailor/shoppingcart_list.html?platform="+platform;
			});

			that.dzjhBtn.click(function(){
				sessionStorage.setItem('current', '#tailor');
				cl.check_Log(function(data){
					if(data.code == '0000'){
						if(!that.userMoneyFlag){//账号余额
							$.ajax({
								url:PUBLIC._COMMON,
								data:{requesturl:'0nzLDLIxtJvww6jupwp3bzbYu6lBv2Xm',platform:platform},
								success:function(data){
									if(data.code == '0000'){
										data = data.data;
										$("#userMoney").html(data.useableAmt);
										that.useableAmt = data.useableAmt;
										that.userMoneyFlag = true;
										sessionStorage.setItem('useableAmt', data.useableAmt);
									}else{
										$("#userMoney").html('--');
										that.userMoneyFlag = false;
									}										
								}	
							});
						}
						that.dzjhtjlayer.fadeIn();
						that.dzjhtj.removeClass('in').addClass('out');
						that.loadDzjh();
					}
				});
				
			});

			that.dzjhCloseBtn.click(function(){//重置
				that.dzjhAmount.val('');
				that.reinitRange($(".zqrange"),$(".zqtip"),'个');
				that.reinitRange($(".syrange"),$(".sytip"),'%');
				that.reinitRange($(".jkrange"),$(".jktip"),'月');

				var syfsA = $(".syfs");
				for(var i=0,L=syfsA.length;i<L;i++){
					$(syfsA[i]).removeClass('unchecked').addClass('checked');
				}
            	var data = {requesturl : 'mBI9zdBAgnR0RONCptStQgmvDZHVfd1P'};

				data.partNum = $(".zqrange").attr("min");//债权个数
				r.setFlag(false);
				r.postLayer({//重置定制计划
					url : PUBLIC._COMMON,
					data : data,
					success : function(data){
						if(data.code == '0000'){
							/*that.dzjhtjlayer.hide(0, function(){
								that.dzjhtj.hide();
			            	});*/
						}
					}
				});
			});

			that.dzjhConfirmBtn.click(function(){
				if(that.dzjhConfirmBtn.hasClass('unactive')){
					if(that.dzjhTip.type == 1){
						l.alertAuto(that.dzjhTip.tip)	
					}else{
						l.setOktext('充值');
						l.alert1(that.dzjhTip.tip);
						l.setOkRedirectUrl(that.dzjhTip.url);
					}
					return false;
				}
				that.saveDzjh();
			});
		},
		loadDzjh: function() {//初始化
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : 'mBI9zdBAgnR0RONCptStQtr1Os9wBzFj'},
				success : function(data){
					if(data.code == '0000'){
						console.log('锁定成功');
						that.dzjhCache = data.data;
						that.dzjhAmount.val(that.dzjhCache.investAmoutMap.desc);

			            var partNumMap = that.dzjhCache.partNumMap,
			            	tenderRateMap = that.dzjhCache.tenderRateMap,
			            	tenderPeriodMap = that.dzjhCache.tenderPeriodMap,
			            	repayModeMap = that.dzjhCache.repayModeMap.list;
						that.creatRange($('.zqrange'),$(".zqtip"),partNumMap.max,partNumMap.min,partNumMap.desc.split('_')[0]||partNumMap.min,'个','zqrange');
						that.creatRange( $('.syrange'),$(".sytip"),tenderRateMap.max,tenderRateMap.min,tenderRateMap.desc.split('_')[0]||tenderRateMap.min,'%','syrange');
						that.creatRange($('.jkrange'),$(".jktip"),tenderPeriodMap.max,tenderPeriodMap.min,tenderPeriodMap.desc.split('_')[0] || tenderPeriodMap.min,'月','jkrange');
						var syfsOBJ = $("#syfsContents");
						syfsOBJ.empty();//避免重复追加
						for(var i=0,L=repayModeMap.length;i<L;i++){
							if(repayModeMap[i].id == 'unlimited') continue;
							if(repayModeMap[i].check){
								syfsOBJ.append('<div class="syfs checked" data-v="1" data-id='+repayModeMap[i].id+'><div>'+repayModeMap[i].name+'</div><span></span></div>')	
							}else{
								syfsOBJ.append('<div class="syfs unchecked" data-v="0" data-id='+repayModeMap[i].id+'><div>'+repayModeMap[i].name+'</div><span></span></div>')
							}
						}
						that.syfsChecks = j('.dzjhtj li .syfs');
						that.syfsChecks.click(function(){
							var v = $(this).attr('data-v');
							if (v == '1') {
								j(this).removeClass('checked');
								j(this).addClass('unchecked');
								$(this).attr('data-v', 0);
							} else {
								j(this).removeClass('unchecked');
								j(this).addClass('checked');
								$(this).attr('data-v', 1);
							}
						});
					} else {
						l.alertAuto(data.message);
					}
				}
			});
		},
		saveDzjh: function() {
			var that = this;
			
			var data = {requesturl : 'mBI9zdBAgnR0RONCptStQgmvDZHVfd1P'};
			var syfsA = $(".syfs");
			data.amount = that.dzjhAmount.val();//投资金额
			if (data.amount<"100" && data.amount>"100000") {
				l.alertAuto(that.dzjhCache.investAmoutMap.title+that.dzjhCache.investAmoutMap.show);
				return;
			}

			data.repayMode = '';
			data.partNum = $(".zqrange").val();//债权个数
			data.tenderRate = $(".syrange").attr('value')+'_'+$(".syrange").attr('max');//债权利率
			data.tenderPeriod = $(".jkrange").attr('value')+'_'+$(".jkrange").attr('max');//还款期限
			for(var i=0,L=syfsA.length;i<L;i++){//还款方式
				if($(syfsA[i]).hasClass('checked')){
					data.repayMode += $(syfsA[i]).data('id')+'_';	
				}
				
			}
			if(!data.repayMode){
				l.alertAuto('请选择还款方式');
				return false;
			}
			data.repayMode = data.repayMode.substr(0,data.repayMode.length-1);
			r.setFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : data,
				success : function(data){
					if(data.code == '0000'){
//						l.alertAuto("定制计划保存成功");
//						that.matchDzjh();
						sessionStorage.setItem('current', '#tailor');
						sessionStorage.setItem('shoppingcartType', 'dzjh');

						window.location.href = "/static/mobileSite/html/tailor/shoppingcart_list.html?platform="+platform;
					} else {
					}
				}
			});
		},
		getTimetemp:function(dataTimetemp){//第一次进入时执行
			var timetemp = sessionStorage.getItem('lockTime');
			if(!timetemp || timetemp=='0' || timetemp == '-1' || timetemp == 'NaN' || timetemp == 'undefined' || timetemp == 'null'){
				sessionStorage.setItem('lockTime',dataTimetemp || '300');
				var lockTimer = setInterval(function(){
					var curTime = parseInt(sessionStorage.getItem('lockTime'));
					curTime -= 1;
					if(curTime<=0){
						clearInterval(lockTimer);
					}
					sessionStorage.setItem('lockTime',curTime);
				},1000);

				t.pauseCountDown();
				$("#enddate").data('lasttime',sessionStorage.getItem('lockTime'));
				t.countDown(2,function(){
					sessionStorage.setItem('tailor_tender_num','0');
				});
			}
		},
		tenderLock : function(amount, lockExt){//债权匹配
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {requesturl : 'mBI9zdBAgnR0RONCptStQp17kqoEs1p7', amount: amount, lockExt: lockExt},
				success : function(data){
					if(data.code == '0000'){
						console.log('锁定成功');
						$('.keybordwrap .qx').click();
						var num = that.gwcNum.text();
						num = parseInt(num);
						num += 1;
						that.gwcNum.text(num).addClass('bounce animated');
						sessionStorage.setItem('tailor_tender_num',num);

						that.getTimetemp(data.data.surplusSec);
						
						var current = window.currentTailor;
						current.remove();
//						that.djs();
					} else {
					}
				}
			});
		},
		reinitRange:function(rangeObj,rangeTip,unitName){
			var min = rangeObj.attr("min");
			var name = rangeObj.attr('data');
			rangeObj.val(0);//债权个数
			rangeTip.css('left','0%').html(min+unitName);
			if(name == 'zqrange'){
		        rangeObj.css({'background':'linear-gradient(#fd7b7b, #fd7b7b) no-repeat, #e2e2e2','background-size':'0% 100%'});
		    }else{
		    	rangeObj.css({'background':'linear-gradient(#e2e2e2, #e2e2e2) no-repeat, #fd7b7b','background-size':'0% 100%'});
		    }
		},
		creatRange:function(rangeObj,rangeTip,max,min,value,unitName,rangeName){
            rangeObj.parent('div').prev().html(min);
            rangeObj.parent('div').next().html(max);
            var percent = value == min ? 0 : ((value-min))/(max-min)*100;
            rangeTip.css('left',percent+'%').html(value+unitName);
            rangeObj.RangeSlider({ min: min,   max: max,  step: 1, value: value, name : rangeName, callback: function($input){
            	rangeTip.css('left',(($input.value-min)/(max-min)*100-5)+'%').html($input.value+unitName);
            }});
		},
//		djs: function() {
//			var that = this;
//			if (that.djsTimer.getText() != '05:00') {
//				return;
//			}
//			var runtimes = 0;
//			function GetRTime(){
//			    var nMS = ;
//			    var nH=Math.floor(nMS/(1000*60*60));
//			    var nM=Math.floor(nMS/(1000*60)) % 60;
//			    var nS=Math.floor(nMS/1000) % 60;
//			    var nD=Math.floor(<?php echo $lefttime;?> /3600/24) ;   //计算离结束还有多少天
//
//			    that.djsTimer.html(nD+" "+nH+":"+nM+":"+nS);
//
//			    runtimes++;
//			    if (nS == 00 && nM == 00) {
//			        alert('时间到了');
//			    }else {
//			    	setTimeout("GetRTime()",1000);
//			    }
//			}
//		},
		configRange : function(){
			var that = this;
			$.fn.RangeSlider = function(cfg){
			    this.sliderCfg = {
			        name: cfg && cfg.name ? cfg.name : null, 
			        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
			        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
			        value: cfg && !isNaN(parseFloat(cfg.value)) ? Number(cfg.value) : null,
			        step: cfg && Number(cfg.step) ? cfg.step : 1,
			        callback: cfg && cfg.callback ? cfg.callback : null
			    };

			    var $input = $(this);
			    var value = this.sliderCfg.value;
			    var name = this.sliderCfg.name;
			    var min = this.sliderCfg.min;
			    var max = this.sliderCfg.max;
			    var step = this.sliderCfg.step;
			    var callback = this.sliderCfg.callback;
			    var percent = ((value-min)/(max-min)*100).toFixed(0)+'%';
			    $input.attr('min', min)
			        .attr('max', max)
			        .attr('step', step)
			        .val(value)
			        .attr('data',name);
			    if(name == 'zqrange'){
			        $input.css({'background':'linear-gradient(#fd7b7b, #fd7b7b) no-repeat, #e2e2e2','background-size':percent+' 100%'});
			    }else{
			    	$input.css({'background':'linear-gradient(#e2e2e2, #e2e2e2) no-repeat, #fd7b7b','background-size':percent+' 100%'});
			    }

			    $input.bind("input propertychange", function(e){
			    	if($input.attr('data') == 'zqrange' & that.dzjhAmount.val() == '100'){
			    		that.reinitRange($(".zqrange"),$(".zqtip"),'个');
			    		l.alertAuto('每个债权出借不可低于100元');
			    		return false;
			    	}
			        $input.attr('value', this.value);
			        /*if(this.value == 0){
			        	$input.css('background','#e2e2e2' );
			        }else if(this.value == max){
			        	$input.css('background','#fd7b7b' );
			        }else{*/
 						// $input.css('background','-webkit-linear-gradient(left,#ddd '+($input.value-1)/max*100+'%, #fd7b7b 100%) no-repeat, #fd7b7b' )
 						var percent = ((this.value-min)/(max-min)*100).toFixed(0)+'%';
 						if(name == 'zqrange'){
 							$input.css({'background':'linear-gradient(#fd7b7b, #fd7b7b) no-repeat, #e2e2e2','background-size':percent+' 100%'});
 						}else{
	 						$input.css({'background':'linear-gradient(#e2e2e2, #e2e2e2) no-repeat, #fd7b7b','background-size':percent+' 100%'});
 						}
			        // }
			       

			        if ($.isFunction(callback)) {
			            callback(this);
			        }
			    });
			};
		},
		init_time_tendernum:function(){
			var that = this;
			sessionStorage.removeItem('lockTime');//进入此页面就清空lockTime
			sessionStorage.removeItem('tailor_tender_num');//
			that.gwcNum.text('0');
			t.pauseCountDown();
			$("#enddate").html('05:00');
		},
		init : function(){
			var that = this;
			that.getInvestLimit();
			that.bindEvent();
			that.configRange();
			that.init_time_tendernum();
			
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,dataPage,COMMON_POST,COMMON_KH,COMMON_Login);
