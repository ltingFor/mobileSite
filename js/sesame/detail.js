(function(w,j,r,t,l,h,d,c,v,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		pid = decodeURIComponent(param_obj.pid || '');
	var syll = j('#syll');//回报列表content
	var syTemplate = h.compile(j("#tpl_sylb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		tzlbTemplate = h.compile(j("#tpl_tzlb").html());

	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()-invest_btn.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MTZ-ZMKH-XQ-CKGD');
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
		vipStr : '',
		sy_vipStr :'',
		sy_addRateStr :'',
		incomeTable : [],
		COUNT : 0,//判断出借记录表头出现的次数
		COUNT1 : 0,//判断回报列表表头出现的次数
		status : -1,//判断状态，标 是否已经结束
		supRate : '',
		initPage : function(){
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : "2xC2knBHKqXd6JBNPynIClObH4ama9Ck",
					prodDetail : pid
				},
				success : function(data){
					if(data.code == "0000"){
						var info = data.data || {};
						var totalAmount = info.totalAmount || 0,
							maxAmount = info.maxAmount || 0,
							vipRate = info.vipRate,
							addRate = info.addRate,
							supRate = '';
						var remain_amount = (parseFloat(maxAmount) - parseFloat(totalAmount))/10000 || '0.0';
						totalAmount = (totalAmount!='0' && totalAmount)? t.outputmoney(''+(totalAmount/10000) || '0.0') : '0.00';
						maxAmount = (maxAmount!='0' && maxAmount) ? t.outputmoney(''+(maxAmount/10000) || '0.0') : '0.00';
						j('#twoAmount').html("<span>"+t.outputmoney(remain_amount+'')+"</span>/&nbsp;<span>"+maxAmount+"</span>");//
						j('#title').html(info.title || '');//名称
						j('#closePeriod').html(info.closedPeriod || 0);//封闭期
						j('#chiyou_time').html(info.investPeriod || 0);//持有时间
						j("#startInvestAmountStr").html(info.startInvestAmountStr || '');//起投金额
						j("#everyAmountStr").html(info.everyAmountStr || '');//出借上限
						j('#transferRule').html(info.transferRule || '');
						j("#payMode").html(info.payMode || '');//付息方式
						j("#effectDate").html(info.effectDate || '');//付息方式
						j('#transferLimit').html(info.transferLimit || '');
						j('#exitTimeStr').html(info.exitTimeStr || '');
						j('#endCloseDateStr').html(info.endCloseDateStr || '');//封闭期结束时间
						j('#fxsj').html(info.payInterstTimeStr || '');
						j('#collectPeriod').html(info.collectPeriod || '');
						j('#interstTimeStr').html(info.interstTimeStr || '');

						if(info.productStatus == 'pub'){
							supRate = ((addRate && ('+' + addRate)) || '');
						} else {
							supRate = ((addRate && ('+' + addRate)) || '');
						};
						that.supRate = supRate;//给计算器使用的
						j('#interests').html('<span>' + info.minRate+'</span> ~ <span>' + info.maxRate + '</span>%<span id="vipDom">' + supRate + '</span>');


						that.incomeTable = info.incomeTable || [];//回报列表赋值
						d.iScroll.refresh();
						d.setListenerName('');
						if(!info.surplusSeconds || (info.productStatus != "pub")){
							j('.enddate').hide();
						}else{
							j('.enddate').data('lasttime',info.surplusSeconds);
						}
						t.countDown();
						if(info.productStatus == "pub"){
							that.stutas = '1';
							invest_btn.html('马上出借').removeClass('dis_btn');
							invest_btn.click(function(){
								PUBLIC.count('MTZ-ZMKH-XQ-MSTZ');
								cl.check_Log(function(res){
									if(res.code == '0000'){
										c.check_KH(function(data){
											if(data.code == '0000'){
												w.location.href = PUBLIC.URL + '/static/mobileSite/html/sesame/sesame_invest.html?platform='+platform+"&pid="+encodeURIComponent(pid);
												// window.location.href = PUBLIC.URL + "/static/mobileSite/html/wmps/wmps_invest.html?pid="+encodeURIComponent(pid)+"&platform="+platform;
											}
										});
									}
								});

							});
						}else{
							that.stutas = '0';
							invest_btn.html('已结束').addClass('dis_btn');
						}



				  		//判断VIP利率
				  		v.checkVip(function(res){
							if(res.code == '0000'){
								if(res.data.vipRate > 0 && that.stutas == '1'){
									that.vipStr += '+' + res.data.vipRate + '</span><img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
									that.sy_vipStr += '+' + res.data.vipRate + '%<img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
									// if(info.productStatus == "pub"){
										that.supRate += '+' + res.data.vipRate;//给计算器使用的
									// }else{
										

									// }
								}else if(res.data.vipRate > 0 && that.stutas == '0'){//结束的
									that.vipStr += '+<img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
									that.sy_vipStr += '%+<img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
									that.supRate += '+<img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';//给计算器使用的
								} else if(res.data.vipRate == 0 || res.data.vipRate == ''){
									that.sy_vipStr += '%';
								}
								/*
					  			amount  出借本金
								investment_period 产品的出借周期
								payDates 付息日列表
								productRate产品原始利息
								mgrRate 管理费率
								transferRate 转让利率表
								paidInExtend扩展参数
								(amount,investment_period,payDates,productRate,mgrRate ,transRateTbl,paidInExtend)
					  		 */
					  		var incomeTable = info.incomeTable;
    		    		var calcExt = info.calcExtend;
    		    				calcExt.vipRate= res.data.vipRate;	//前端指定VIP利率
    		    				incomeTable = JSON.stringify(incomeTable);
    		    				calcExt  = JSON.stringify(calcExt);

								var resu = getPaidIOS(10000,info.investPeriod,incomeTable,calcExt);
								var money = 0;
								if(resu){
									money = JSON.parse(resu);
				  					j('.detail-inv-profit').html(t.outputmoney(money.income||'0.0'));

								}
							}
							

							j('#vipDom').append(that.vipStr);
							h.registerHelper('checkVipStatus',function(){
								return that.sy_vipStr;
							});
							h.registerHelper('checkAddRateStatus',function(){
								if(info.addRate == 0 || info.addRate == ''){
											that.sy_addRateStr = '';
									} else{
										 that.sy_addRateStr = '+' + info.addRate;
									}
									return that.sy_addRateStr ;
							});

							syll.html(syTemplate(that.incomeTable));
							d.iScroll.refresh();

							cal.initCal({'type':'sesame','amount':'10000','intrestStr':money.curRate,'supRateStr':that.supRate,'intrest':parseFloat(money.curRate||'0.0')/100,'calDays':info.investPeriod,'callback':getPaidIOS,'sesameParam':{
				  					'incomeTable':incomeTable,
				  					'calcExt':calcExt}});//计算计算器
						});
					}
				}
			});
		},
		creatHelper :function(){
			h.registerHelper('compareIndexEnd',function(index,option){
				if(index == 0 && pageUtil.COUNT == 0){
					return option.fn(this);
				}
				else{
					pageUtil.COUNT = 1;
					return option.inverse(this);
				}
			});
			h.registerHelper('compareIndexEnd1',function(index,option){
				if(index == 0 && pageUtil.COUNT1 == 0){
					return option.fn(this);
				}
				else{
					pageUtil.COUNT1 = 1;
					return option.inverse(this);
				}
			});
			h.registerHelper('delPlus',function(rateStr){
				return rateStr.split('+')[0];
			});
		},
		bindEvent : function(){

			var tabs = j('.detail-tab').find("li"),
				tab_pages = j('.detail-record'),
				cpxq = j('#cpxq'),
				zqlb = j('#zqlb'),
				tzlb = j('#tzlb');
			j('li[data=#sylb]').click(function(){
				PUBLIC.count('MTZ-ZMKH-XQ-CKGD-SYLB');
				tabs.removeClass('detail-tab-show');
				j(this).addClass('detail-tab-show');
				tab_pages.removeClass("detail-record-show");
				cpxq.addClass("detail-record-show");
				d.iScroll.refresh();
				d.setListenerName('');
			});
			j('li[data=#zqlb]').click(function(){
				PUBLIC.count('MTZ-ZMKH-XQ-CKGD-ZQLB');
				tabs.removeClass('detail-tab-show');
				j(this).addClass('detail-tab-show');
				tab_pages.removeClass("detail-record-show");
				zqlb.addClass("detail-record-show");
				d.iScroll.refresh();
				d.setListenerName('zqlb');
				if (!d.getListener('zqlb')) {
					 var content = j('#zqlb_content'),
		           	 pullDown = content.siblings('.pulldown');
		           d.addListener('zqlb', {url:PUBLIC._COMMON,
		           	   data : {
		           	   	requesturl : "2xC2knBHKqUxYJ5AEYrvms3o%2FRsGi%2BfK", // 债权列表
		           	   	prodDetail : pid
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
		           d.getData();
		           d.iScroll.refresh();
		       };
			});
			j('li[data=#tzjl]').click(function(){
				PUBLIC.count('MTZ-ZMKH-XQ-CKGD-TZJL');
				tabs.removeClass('detail-tab-show');
				j(this).addClass('detail-tab-show');
				tab_pages.removeClass("detail-record-show");
				tzlb.addClass("detail-record-show");
				d.iScroll.refresh();
				d.setListenerName('sesame_tzlb');
				if (!d.getListener('sesame_tzlb')) {
					var content = j('#tzlb_content'),
		            pullDown = content.siblings('.pulldown');
		           	content.html('');
		            d.addListener('sesame_tzlb', {url:PUBLIC._COMMON,
		                data: {
		                	requesturl : "2xC2knBHKqUxYJ5AEYrvmlObH4ama9Ck", // 出借记录
		                	prodDetail : pid,
		                	transactionType : "0"
		                },
		                pullDown: pullDown,
		                content: content,
		                template: tzlbTemplate,
		                callback : function(){
		                	//d.iScroll.refresh();
		                }
		            });
		            d.getData();
		            d.iScroll.refresh();
		        };
			});
			j('#investTip').bind('touchstart',function(){
				l.alert2("实际年化利率以交易为准");
			});

			j('.tab_page').delegate('.pulldown','click',function(){
				var listenerName = j(this).data('listenername');
				d.setListenerName(listenerName);
				d.getData();
				d.iScroll.refresh();
			});
		},
		init : function(){
			var that = this;
			that.bindEvent();
			that.creatHelper();
			that.initPage();

		}
	};
	pageUtil.init();


})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage,COMMON_KH,COMMON_POST,COMMON_Login);
