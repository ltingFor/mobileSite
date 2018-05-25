(function(w,j,r,t,l,c,v,cl,h){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		proDetailExt = decodeURIComponent(param_obj.proDetailExt),
		curPaidInRate = param_obj.curPaidInRate,
		expirePaidInRate = param_obj.expirePaidInRate,
		title = decodeURIComponent(param_obj.title),
		vipRate = param_obj.vipRate,
		addRate = param_obj.addRate,
		minRate = param_obj.minPercent,
		maxRate = param_obj.maxPercent,
		holdAmount = 0,
		loanURL = param_obj.loanURL;
	var pageUtil={
		totalRebateAmt:0,//总共的浮动金额
		totalDfInterest:0,//当期未收利息
		totalTenderNum:0,//转让后债权
		totalShishou:0,//转让后实收
		totalTransferMoney:0,//转让本金
		ecpectInterest:0,//预期回报
		slider_OBJ:{},
		bindEvent:function(){
			var that = this;
			$('.chzhi-arrow').on("click",function(){
				that.initTotalNum();
				var src = $(this).find('img').attr('src');
				if(src == '../../images/check_n.png'){
					$(this).find('img').attr('src','../../images/check_y.png');
					$(".choose").attr('src','../../images/checkyes.png');
				}else{
					$(this).find('img').attr('src','../../images/check_n.png');
					$(".choose").attr('src','../../images/checkno.png');
				}
				//$(".tenders").toggle();
				that.calcTender();
			});
			$(".buy-btn").bind('click',function(){//转让
				if($(this).hasClass('dis_btn')) return false;
				if(+(that.totalRebateAmt) >= +(that.ecpectInterest)){
					l.alert2('浮动金额不能超出受让人的预期回报，请降低浮动比例');
					return false;
				}
				l.alert1('是否确认转让');
				l.setOkAction(function(){
					var sendData = [];
					j("img[src='../../images/checkyes.png']").each(function(i,o){
						if(j(o).data('choosed')){
							sendData.push({'prodStr':j(o).data('prodstr'),'rebate':parseFloat(j(o).data('floatamount'))});
						}
					});
					var listStr = JSON.stringify(sendData);
					listStr=$.base64.encode(listStr);
					r.post({
						url:PUBLIC._COMMON,
						data:{requesturl:'2xC2knBHKqXvmcqshETXA4iiSObWxUzo',cessionApply:listStr},
						success:function(data){
							console.log(data);
							if(data.code == '0000'){
								window.location.href = '/static/mobileSite/html/success.html?platform='+platform+"&code=transfer_1";
							}
						}
					});
				});
			});
			$("#miji-btn").click(function(){ // 转让秘籍展示
				$(".alert_layer").show();
				$(".transfer_miji").show();
			});
		},
		createHelper:function(){
			Handlebars.registerHelper('checkshow',function(isCanTransfer,option){
				if(isCanTransfer == "0"){//可转让
					return option.fn(this);
				}
				else{//不可转让
					return option.inverse(this);
				}
			});
			Handlebars.registerHelper('format',function(num,type){
				if(type == 'yes'){
					return t.outputmoney(num+'');
				}else{
					return t.outputmoney_n(num+'');
				}
			});
		},
		//初始化 获取债权列表
		getTenderList:function(){
			var that = this;
			r.post({
				url:PUBLIC._COMMON,
				data:{
					requesturl:'2xC2knBHKqUg%2BrG%2FQvZPgFObH4ama9Ck',
					proDetailExt:proDetailExt,
					loanURL:loanURL
				},
				success:function(data){
					var tenderTpl = h.compile(j("#tpl_zqlb").html());
					if(data.code == '0000'){
						var List_ = data.data || '';
						$("#tpl_contents").html(tenderTpl(List_ || []));
						that.setTotal();
					}
					//给复选框绑定事件  每次操作时要动态计算
					$(".choose").on('click',function(){
						that.initTotalNum();
						var obj = $(this);
						if(obj.attr('src') == '../../images/checkyes.png'){
							obj.attr('src','../../images/checkno.png');
						}else{
							obj.attr('src','../../images/checkyes.png');
						}
						if($(".choose").length == $(".tenderTitle img[src='../../images/checkyes.png']").length){
							$(".chzhi-arrow img").attr('src','../../images/check_y.png');
						} else{
							$(".chzhi-arrow img").attr('src','../../images/check_n.png');
						}
						//修改各个数据
						that.calcTender();
					});
				}
			});
		},
		calcTender:function(){ //计算已选择的债权，相加后各参数值。
				var that = this;
				that.initTotalNum();
				var choosedObjA = $(".tenderTitle img[src='../../images/checkyes.png']"),AL=choosedObjA.length;
				if(AL){
					for(var a=0;a<AL;a++){
						that.totalRebateAmt += parseFloat($(choosedObjA[a]).data('floatamount'));
						that.totalDfInterest += parseFloat($(choosedObjA[a]).data('unpayinterest'));
						that.totalShishou += parseFloat($(choosedObjA[a]).data('transrealamount'));
						that.ecpectInterest += parseFloat($(choosedObjA[a]).data('ecpectinterest'));
						that.totalTransferMoney += parseFloat($(choosedObjA[a]).data('amount'));
					}
					//测试============
					console.log('before  that.totalShishou='+that.totalShishou);
					console.log(that.slider_OBJ.value);
					if(that.slider_OBJ.value != 0){
						that.totalShishou += that.totalRebateAmt;
					}
					console.log('after  that.totalShishou='+that.totalShishou);
					//测试============
					$(".buy-btn").removeClass('dis_btn');
				}else{
					$(".buy-btn").addClass('dis_btn');
				}
				that.totalTenderNum = AL;

				that.setTotal();
		},
		setTotal:function(){
			var that = this;
			$("#holdAmount").html(t.outputmoney_n(that.totalTransferMoney));//转让本金
			//总的浮动金额
			that.totalRebateAmt > 0 ? $("#rebateAmt").html('+'+t.outputmoney_n(that.totalRebateAmt)) : $("#rebateAmt").html(t.outputmoney_n(that.totalRebateAmt));
		
			$("#transferAmt").html(that.totalTenderNum);//债权个数
			$("#dfInterest").html(t.outputmoney(that.totalDfInterest));//当期未收利息
			$("#realpayAmt").html(t.outputmoney(that.totalShishou));//转让后总实收

			/*if(flag){
				$("#realpayAmt").html(t.outputmoney(that.totalShishou)).data('totalshishou',that.totalShishou);//转让后实收 //记录原始数据
			}else{*/
			// }
		},
		initTotalNum:function(){
			var that = this;
			that.totalRebateAmt=0;//浮动金额
			that.totalTenderNum=0;//债权个数
			that.totalDfInterest=0;//当期未收利息
			that.totalShishou=0;//转让后实收
			that.totalTransferMoney=0;//转让本金
			that.ecpectInterest = 0;//预期回报
		},
		creatRange:function(rangeObj,rangeTip,max,min,value,unitName,rangeName,step){
			var that = this;
            rangeObj.RangeSlider({ min: min,   max: max,  step: 0.1, value: value, name : rangeName, callback: function($input){
            	//滑动滑块时调用
            	that.slider_OBJ = $input;
            	var v_i = $input.value;
            	console.log(v_i);
            	//改变滑块的状态
            	if(+(v_i)<0){
            		$('.range').removeClass('start add').addClass('sub');
            		rangeTip.css({'background':'url(../../images/subTip.png) no-repeat center','background-size':'100%'});
            	}else if(+(v_i)>0){
            		$('.range').removeClass('start sub').addClass('add');
            		rangeTip.css({'background':'url(../../images/tip_03.png) no-repeat center','background-size':'100%'});
            	}else{
            		$('.range').removeClass('sub add').addClass('start');
            		rangeTip.css({'background':'url(../../images/startTip.png) no-repeat center','background-size':'100%'});
            	}
            	v_i = v_i>0 ? "+"+v_i : v_i;
            	//滑块上方的tip值
            	rangeTip.css('left',(($input.value-min)/(max-min)*100-5)+'%').html(v_i+unitName);
            	//计算各种数据
            	// that.totalShishou = parseFloat($("#realpayAmt").data('totalshishou'));//转让后总实收
            	// that.totalRebateAmt = 0;//转让后总的浮动金额
            	$("img.choose").each(function(i,o){
            		var curFloatamount = getFloatAmountIOS($(o).data('transamount'),($input.value)/100);
            		
            		// var curFloatamount = parseInt($(o).data('transamount'))*parseFloat($input.value)/100;
            		/*if($(o).attr('src') == '../../images/checkyes.png'){
            			that.totalRebateAmt += +curFloatamount;
            			that.totalShishou += +curFloatamount;
            		}*/
            		//修改当前标签的转让后实收
            		/*var cur_zrhss = +($(o).data('transrealamount'));
            		$(o).data('transrealamount',t.outputmoney_n(cur_zrhss+curFloatamount));*/
            		//当前标签的浮动金额
            		$(o).data('floatamount',t.outputmoney_n(curFloatamount+''));
            		var fd = curFloatamount > 0 ? "+"+t.outputmoney_n(curFloatamount||'0.00') : t.outputmoney_n(curFloatamount||'0.00');
            		$(o).parents('p').siblings('p').find('span.setfd').html(fd);
            	});
            	//改变总的浮动金额 和 总的转让后实收
            	that.calcTender();
            }});
		},
		configRange : function(){
			var that = this;
			$.fn.RangeSlider = function(cfg){
			    this.sliderCfg = {
			        name: cfg && cfg.name ? cfg.name : null,
			        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
			        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
			        value: cfg && !isNaN(parseFloat(cfg.value)) ? Number(cfg.value) : null,
			        step: cfg && Number(cfg.step) ? cfg.step : 0.1,
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
			    $input.bind("input propertychange", function(e){
			        $input.attr('value', this.value);
					var percent = ((this.value-min)/(max-min)*100).toFixed(0)+'%';
			        if ($.isFunction(callback)) {
			            callback(this);
			        }
			    });
			};
		},
		init:function(){
			var that = this;
			$("#minRate").html(curPaidInRate);
			$("#maxRate").html(expirePaidInRate);
			$("#holdAmount").html(holdAmount);
			$("#tenderName").html(title || '-');
			$("#floatMin").html(t.outputmoney_n(minRate)+'%');
			if(+(maxRate) && +(maxRate) > 0){
				$("#floatMax").html("+"+t.outputmoney_n(maxRate)+'%');
			}else{
				$("#floatMax").html(t.outputmoney_n(maxRate)+'%');
			}
			if(addRate == 0){
				addRate = '';
			}
			if(vipRate == 0){
				vipRate = '';
			}
			var supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style=";width:0.3rem;height:0.3rem;display:inline;">')) || '');
			$("#secRate").append(supRate);


			that.bindEvent();
			that.createHelper();
			that.getTenderList();
			that.configRange();
			that.creatRange($('.zqrange'),$(".zqtip"),+(maxRate),+(minRate),0,'%','zqrange');
		}
	}
	pageUtil.init();
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST,COMMON_Login,Handlebars);