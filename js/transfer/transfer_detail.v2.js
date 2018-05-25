(function(w,j,r,t,l,h,d,c,v,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		proDetailExt = decodeURIComponent(param_obj.serviceParam);
	var syll = j('#syll');//回报列表content
	var syTemplate = h.compile(j("#tpl_sylb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html());
	var tabs = j('.detail-tab').find("li"),
		tab_pages = j('.detail-record'),
		cpxq = j('#cpxq'),
		zqlb = j('#zqlb'),
		tzlb = j('#tzlb');


	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()-invest_btn.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MTZ-ZMZR-XQ-CKGD');
		j(".detail-main").animate({
            marginTop: -(j(".detail-main").outerHeight())
        }, 800);
		j('.detail-main1').show();
		j( ".detail-main1" ).animate({
            marginTop: 0
        }, 800, function() {});
        d.setListenerName('zqlb');
		d.iScroll.refresh();
	});
	upToViewDetail.bind('click',function(){
		j(".detail-main1").animate({
            marginTop: wH
        }, 800);
		j( ".detail-main").animate({
            marginTop: 0
        }, 800, function() {});
		j(".detail-main1").hide();
		d.setListenerName('zqlb');
		d.iScroll.refresh();
	});
	/*此处是添加继续查看详情的操作*/

	var pageUtil = {
		COUNT : 0,
		vipValue:0,
		bindEvent:function(){
			if (!d.getListener('zqlb')) {
				var content = j('#zqlb_content'),
		       	pullDown = content.siblings('.pulldown');
		        d.addListener('zqlb', {url:PUBLIC._COMMON,
		       	   data : {
		       	   	requesturl : "2xC2knBHKqXbrrvx60vmNIiiSObWxUzo",
		       	   	proDetailExt:proDetailExt
		       	   },
		           pullDown: pullDown,
		           content: content,
		           template: zqlbTemplate,
		           callback : function(){
		           		j("#zqlb_content").find('li').bind('click',function(){
		           			w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(j(this).attr('id'));
		           		});
		           }
		       });
		       d.setListenerName('zqlb');
		       d.getData();
		   };
		   j('li[data=#sylb]').click(function(){
				PUBLIC.count('MTZ-ZMZR-XQ-CKGD-SYLB');
				tabs.removeClass('detail-tab-show');
				j(this).addClass('detail-tab-show');
				tab_pages.removeClass("detail-record-show");
				cpxq.addClass("detail-record-show");
				d.iScroll.refresh();
				d.setListenerName('');
			});
			j('li[data=#zqlb]').click(function(){
				PUBLIC.count('MTZ-ZMZR-XQ-CKGD-ZQLB');
				tabs.removeClass('detail-tab-show');
				j(this).addClass('detail-tab-show');
				tab_pages.removeClass("detail-record-show");
				zqlb.addClass("detail-record-show");
				d.iScroll.refresh();
				d.setListenerName('zqlb');
			});

			j('#investTip').bind('touchstart',function(){
				l.alert2("实际年化利率以交易为准");
			});
			j("#sf_tip").bind('touchstart',function(){
				l.alert2("<label class='label'>实付金额=转让本金+浮动金额+垫付利息</label>"
					+"<br/>"
					+"<label class='label'>垫付利息:指转让人已计但未收的产品利息,需出借人先垫付</label>"
					+"<br/>"
					+"<label class='label'>垫付利息会在债权第一次付息日补给出借人</label>");
			});
			j('.tab_page').delegate('.pulldown','click',function(){
				var listenerName = j(this).data('listenername');
				d.setListenerName(listenerName);
				d.getData();
			});
		},
		initPage:function(){
			//判断用户vip状态
			v.checkVip(function(data){//检测是否有vip利率
				if(data.code == '0000'){
					data = data.data;
					var vipRate = data.vipRate;
					if(vipRate && parseFloat(vipRate)>0){
						pageUtil.vipValue = vipRate;
						// that.vipImg = data.vipImg;
						pageUtil.vipImg = "/static/mobileSite/images/v.png";
					}else{
						pageUtil.vipValue = "";
					}
					//页面初始化接口
					r.setLayerFlag(false);
					r.postLayer({
						url : PUBLIC._COMMON,
						data : {
							requesturl : "2xC2knBHKqVADnH5DKqj083o%2FRsGi%2BfK",
							proDetailExt:proDetailExt
						},
						success : function(data){
							if(data.code == "0000"){
								var info = data.data || {};
								var addRate = +(info.addRate),
									supRate = '';
								echo(info);//赋值
								h.registerHelper('checkvip',function(option){
									var supRate1 = '';
									if(info.status == '0' || info.status == '2'){//0马上出借  2取消转让
										if(pageUtil.vipValue){
											supRate1 = ((addRate && ('+' + addRate)) || '') + ((pageUtil.vipValue && ('+' + pageUtil.vipValue + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.32rem;display:inline;">')) || '');
										}
									} else {// 1已转出
										if(pageUtil.vipValue){
											supRate1 = ((addRate && ('+' + addRate)) || '') + ((pageUtil.vipValue && ('' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.32rem;display:inline;">')) || '');
										}
									};
									return supRate1
								});
								if(info.status == '0' || info.status == '2'){
									supRate = ((addRate && ('+' + addRate)) || '') + ((pageUtil.vipValue && ('+' + pageUtil.vipValue + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.32rem;display:inline;">')) || '');
								} else {
									supRate = ((addRate && ('+' + addRate)) || '') + ((pageUtil.vipValue && ('+' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.32rem;display:inline;">')) || '');
								};
								j('#interests').html(supRate);//副利率

								syll.html(syTemplate(info.incomeTable || []));
								if(info.surplusSeconds || info.status == '0' || info.status == '2'){
									j('.enddate').data('lasttime',info.surplusSeconds);
									t.countDown();
								}else{
									j('.enddate').hide();
								}

								if(info.status == "0"){
									j('.detail-inv-btn').html('马上出借');
									j('.detail-inv-btn').removeClass('dis_btn');
									j('.detail-inv-btn').click(function(){
										PUBLIC.count('MTZ-ZMZR-XQ-MSTZ');
										c.check_KH(function(data){
					            			if(data.code == '0000'){
					            				w.location.href = '/static/mobileSite/html/transfer/transfer_invest.html?platform='+platform+"&proDetailExt="+encodeURIComponent(proDetailExt)+'&v='+Math.random();
					            			}
					            		});
									});
								}
								else if(info.status == '2'){
									j('.detail-inv-btn').html('取消转让');
									j('.detail-inv-btn').removeClass('dis_btn');
									j('.detail-inv-btn').click(function(){
										PUBLIC.count('MTZ-ZMZR-XQ-MSTZ');
										c.check_KH(function(data){
					            			if(data.code == '0000'){
					            				l.alert1('您确定要取消转让吗？');
					            				l.setOkAction(function(){
					            					/*var send_cancel_data = [{prodStr:proDetailExt}];
					                				send_cancel_data = $.base64.encode(JSON.stringify(send_cancel_data));*/

													requestUtil.postLayer({
														url : PUBLIC._COMMON,
														data : {
															requesturl : '2xC2knBHKqXvmcqshETXA1ObH4ama9Ck',
															cancelApply : proDetailExt
														},
														success : function(data){
															if(data.code == '0000'){
																l.alert2("取消成功");
																l.setKnowRedirectUrl('/static/mobileSite/html/invest_list.html?platform='+platform+"&v="+Math.random());
															}

														},
														content : '取消转让中..'
													});
												});
					            			}
					            		});
									});

								}
								else{
									j('.detail-inv-btn').html('已转出').addClass('dis_btn');
								}
							    var amount = info.transferAmt,calculatorParams = info.calculatorParams;
							    calculatorParams.extendParams.vipRate = pageUtil.vipValue;
								var resu = getPaidIOS(amount,info.surplusDays,JSON.stringify(calculatorParams.payDates),calculatorParams.prodRate,calculatorParams.mgrRate,JSON.stringify(calculatorParams.transferRates),JSON.stringify(calculatorParams.extendParams)) || '-';
						  		var money = JSON.parse(resu) || '-';
						  		if(money.income && money.income != "NaN" && money.income != "undefined"){
							  		j('.detail-inv-profit').html(t.outputmoney(money.income));
						  		}else{
						  			j('.detail-inv-profit').html('-');
						  		}
							}
						}
					});
				}
			});
		},
		creatHelper:function(){
			h.registerHelper('format',function(num){
		   		return t.outputmoney_n(num);
		   	});
			h.registerHelper('compareIndexEnd',function(index,option){
				if(index == 0 && pageUtil.COUNT == 0){
					return option.fn(this);
				}
				else{
					pageUtil.COUNT = 1;
					return option.inverse(this);
				}
			});
			h.registerHelper('compareStatus',function(status,option){
				if(status == '2'){
					return option.fn(this);
				}else{
					return option.inverse(this);
				}
			});
		},
		init:function(){
			var that = this;
			that.bindEvent();
			that.creatHelper();
			that.initPage();
		}

	};
	pageUtil.init();

	/**
	 * 赋值操作
	 */
	function echo(data){
		for ( var i in data ){
			  if(typeof data[i] == 'string'){
			  	if(i == 'transferAmt'){
			  		$("#"+i).html(t.outputmoney_n(data[i]));
			  		$("#amount_same").html(t.outputmoney_n(data[i]));
			  		continue;
			  	}
				if(i == 'realpayAmt' || i == 'dfInterest'){
					$("#"+i).html(t.outputmoney(data[i]));
				  	continue;
				}
				if(i == 'rebateAmt'){
					if(!+(data[i])){$("#"+i).html('0.00');}
					else{
						+(data[i]) > 0 ? $("#"+i).html('+'+t.outputmoney_n(+(data[i]))) : $("#"+i).html(t.outputmoney_n(+(data[i])));
					}
					continue;
				}
				$('#'+i).html(data[i]);
			  }else{
				  echo(data[i])
			  }
		  }
	}

})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage,COMMON_KH,COMMON_POST,COMMON_Login);