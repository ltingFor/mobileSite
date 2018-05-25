(function(w,j,r,t,l,h,d,c,v,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		pid = param_obj.pid || '',
		recordId = param_obj.recordId || '',
		accId = param_obj.accId || '',
		userId = param_obj.userId || '',
		tenderDetailUrl = '';
	var syll = j('#syll');//回报列表content
	var syTemplate = h.compile(j("#tpl_sylb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html());
	var pageUtil = {
		COUNT : 0
	};
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


	/**
	 * 赋值操作
	 */
	function echo(data){
		for ( var i in data ){
			  if(typeof data[i] == 'string'){
				  if(i == 'amount'){
				  	$("#"+i).html(t.outputmoney_n(data[i]));
				  	continue;
				  }
				  $('#'+i).html(data[i]);
			  }else{
				  echo(data[i])
				 // console.log(typeof data[i] + "  " + i+'--'+data[i]);
			  }
		  }
	}
	//页面初始化接口
	r.postLayer({
		url : PUBLIC._COMMON,
		data : {
			requesturl : "ok8XdMSuHBDXgDlyq889Qqf%2FbHEopWAE",
			productId : pid,
			recordId : recordId,
			accId : accId,
			userId : userId
		},
		success : function(data){
			if(data.code == "0000"){
				var info = data.data || {};
				var vipRate = info.vipRate,
					addRate = info.addRate,
					supRate = '';
				echo(info);//赋值
				h.registerHelper('checkvip',function(option){
					var supRate1 = '';
					if(info.status == '0' || info.status == '2'){//0马上出借  2取消转让
						if(vipRate){
							supRate1 = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
						}						
					} else {// 1已转出
						if(vipRate){
							supRate1 = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
							// supRate1 = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
						}
					};
					return supRate1
				});
				if(info.status == '0' || info.status == '2'){
					supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
				} else {
					supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
				};
				j('#interests').html(supRate);//副利率

				syll.html(syTemplate(info.incomeTable || []));
				d.iScroll.refresh();
				d.setListenerName('');
				if(info.surplusSeconds || info.status == '0' || info.status == '2'){
					j('.enddate').data('lasttime',info.surplusSeconds);	
				}else{
					j('.enddate').hide();
				}
				
				t.countDown();
				if(info.status == "0"){
					j('.detail-inv-btn').html('马上出借').removeClass('dis_btn');
					j('.detail-inv-btn').click(function(){
						PUBLIC.count('MTZ-ZMZR-XQ-MSTZ');
						c.check_KH(function(data){
	            			if(data.code == '0000'){
	            				w.location.href = '/static/mobileSite/html/transfer/transfer_invest.html?platform='+platform+"&accId="+accId+"&recordId="+recordId+"&userId="+userId+"&pid="+pid;
	            			}
	            		});
					});
				}
				else if(info.status == 2){
					j('.detail-inv-btn').html('取消转让').removeClass('dis_btn');
					j('.detail-inv-btn').click(function(){
						PUBLIC.count('MTZ-ZMZR-XQ-MSTZ');
						c.check_KH(function(data){
	            			if(data.code == '0000'){
	            				l.alert1('您确定要取消转让吗？');
	            				l.setOkAction(function(){
									requestUtil.postLayer({
										url : PUBLIC._COMMON,
										data : {
											requesturl : 'ok8XdMSuHBDXgDlyq889Qn2sbh9qhEr',
											productId : pid,
											accId : accId
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
					// window.status = '0';
					j('.detail-inv-btn').html('已转出').addClass('dis_btn');
				}

				/*
			  	amount  出借本金
				investment_period 产品的出借周期（对于转让是剩余天数）
				payDates 付息日列表
				productRate产品原始利息
				mgrRate 管理费率
				transferRate 转让利率表
				paidInExtend扩展参数
				(amount,investment_period,payDates,productRate,mgrRate ,transRateTbl,paidInExtend)
			   */
			   console.log(info.surplusDays)
			   var amount = info.amount;
				var resu = getPaidIOS(amount,info.surplusDays,JSON.stringify(info.payDates),info.productRate,info.mgrRate,JSON.stringify(info.transferRate),JSON.stringify(info.paidInExtend)) || '-';
		  		var money = JSON.parse(resu) || '-';
		  		j("#amount_same").html(t.outputmoney_n(amount || '0.0'));
		  		if(money.income && money.income != "NaN" && money.income != "undefined"){
			  		j('.detail-inv-profit').html(money.income);
		  		}else{
		  			j('.detail-inv-profit').html('-');
		  		}
			}else{
				l.alert2(data.message);
			}
		}
	});
	if (!d.getListener('zqlb')) {
		 var content = j('#zqlb_content'),
       	 pullDown = content.siblings('.pulldown');
       d.addListener('zqlb', {url:PUBLIC._COMMON,
       	   data : {
       	   	requesturl : "ok8XdMSuHBDXgDlyq889Qn1Xbh58U3HX",
       	   	productId : pid,
       	   	accId : accId,//转让人用户ID
       	   	userId : userId
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
	var tabs = j('.detail-tab').find("li"),
		tab_pages = j('.detail-record'),
		cpxq = j('#cpxq'),
		zqlb = j('#zqlb'),
		tzlb = j('#tzlb');
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
	j('.tab_page').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage,COMMON_KH,COMMON_POST,COMMON_Login);