(function(w,j,r,t,l,h,d,c,v,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		skip = param_obj.skip,
		pid = decodeURIComponent(param_obj.pid || ''),
		accId = param_obj.accId,
		tranType = param_obj.tranType,
		curPaidinRate = '',
		COUNT = 0,
		COUNT1 = 0;
	var subBtn = j('.detail-inv-btn');//提交按钮
	var syll = j('#syll'),//回报列表content
		fxlb_content = j("#fxlb_content");
	var syTemplate = h.compile(j("#tpl_sylb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		fxlbTemplate = h.compile(j("#tpl_fxlb").html());
	//根据不同的详情页显示不同的头部
	
	$("."+skip).removeClass('dis_none');
	if(skip != 'hold'){
		$(".detail-inv-end").addClass('dis_none').hide();
	}
	/*此处是添加继续查看详情的操作*/
	var pageUtil = {loanURL : ''};
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()-invest_btn.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MWD-ZMKH-CYZ-CKGD');
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

	//获取token  避免重复提交
	var getToken = function(){
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
	}
	getToken();
	//获取token  避免重复提交

	//页面初始化
	r.postLayer({
		url : PUBLIC._COMMON,
		data : {//出借前获取详情
			requesturl : "ok8XdMSuHBDXgDlyq889QjQ%2BccZ956Cx",
			productId : pid,
			accId : accId,
			tranType : tranType
		},
		success : function(data){
			if(data.code == "0000"){
				var info = data.data || {};
				var vipRate = info.vipRate,
					addRate = info.addRate,
					supRate = '',
					curPaidinRate = info.curPaidinRate;
				pageUtil.loanURL = info.loanURL || '';
				j('#title').html(info.title || '');//名称
				j("#curPaidinRate").html(info.curPaidinRate);//当前利率
				j('#amount').html(t.outputmoney_n(info.amount || ''));//出借总额
				j('#amount_same').html(t.outputmoney_n(info.amount || ''));//出借总额
				j('.detail-inv-profit').html(t.outputmoney(info.expirePaidInterest));//到期已收利息

				j('#closePeriod').html(info.closedPeriod || '0');//封闭期
				if(info.status == '5'){
					j('#hadHoldDays').html('审核中');//持有时间
				}else {
					j('#hadHoldDays').html((info.hadHoldDays || '')+"天");//持有时间	
				}
				
				j("#hadPaidInterest").html(t.outputmoney(info.hadPaidInterestNEW || ''));//已收利息

				j("#interestModeStr").html(info.payMode || '');//付息方式
				j('#exitTimeStr').html(info.exitTimeStr || '');//到期时间
				j('#payInterstTimeStr').html(info.payInterstTimeStr || '');//付息时间
				j("#interstTimeStr").html(info.interstTimeStr);//起息时间
				j('.enddate').data('lasttime',info.surplusSeconds);//倒计时
				t.countDown();
				//协议
				var urlentry = info.urlentry || '';//协议
				if(urlentry && urlentry.code == '0'){
					j('#desc').html(urlentry.entryName).bind('click',function(){
						var protocolUrl = info.protocolUrl;
						w.location.href = urlentry.entryDesc;
					});
				}else{
					j('#desc').addClass('dis_none');
				}
				
				h.registerHelper('format',function(curRate){
					curRate = curRate + '';
					return curRate.replace(/\W+/g,'');
				});
				h.registerHelper('checkvip',function(option){
					var percentage='';
					if(vipRate||addRate){
						percentage='%'
					};
					//if(info.status == '0'){
						supRate = percentage+((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
					//} else {
					//	supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
					//};
					return supRate
				});
				//if(info.status == '0'){
					supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
				//} else {
				//	supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('' + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
				//};
				j('#interests').html('<span>' + supRate + '</span>');

				h.registerHelper('addHeightLight',function(current,option){
				//this.curRate = this.curRate + supRate;
					if(parseFloat(current) == parseFloat(curPaidinRate)){
						return option.fn(this);
					}
					else{
						return option.inverse(this);
					}
				});

				syll.html(syTemplate(info.incomeTable || []));
				fxlb_content.html(fxlbTemplate(info.paidTable || []));
				d.iScroll.refresh();
				d.setListenerName('');

				//info.status 标识状态 0可转让 1封闭期  2转让中 3已转让 4已到期  5审核中  6、不可转让
				var status = info.status;
				var postUrl = '';
				subBtn.html(info.statusCNNew).removeClass('dis_btn');
				if(status == "1" || status == "5" || status == "6" || status == '3' || status == '4'){//封闭期
					subBtn.addClass("dis_btn").unbind("click");
					return;
				}
				else{//
					if(status == '0'){//可以转让
						// postUrl = '/sesame/v1/app006/c.do';//转让 需要字符密码
						postUrl = '/sesame/v2/app006/01';//转让 不需要支付密码
						
					}else if(status == '2'){//转让中
						postUrl = '/sesame/v1/app006/d.do';//取消转让
						// j('#calProfit').removeClass('dis_none');
						// j('#limitTime').addClass('dis_none');
						j('#calProfit').addClass('dis_none');
						j('#limitTime').removeClass('dis_none');
					}
				}
				subBtn.bind('click',function(){
					PUBLIC.count('MWD-ZMKH-CYZ-ZR');
					if(j(this).hasClass('dis_btn')){return;}
					window.location.href = '/static/mobileSite/html/transfer/sesame_transfer.html';
				});
			}else{
				l.alert2(data.message);
			}
		}
	});
	h.registerHelper('compareIndexEnd',function(index,option){
		if(index == 0 && COUNT == 0){
			return option.fn(this);
		}
		else{
			COUNT = 1;
			return option.inverse(this);
		}
	});
	h.registerHelper('compareIndexEnd1',function(index,option){
		if(index == 0 && COUNT1 == 0){
			return option.fn(this);
		}
		else{
			COUNT1 = 1;
			return option.inverse(this);
		}
	});
	h.registerHelper('compareStatus',function(status){
		if(status == '2'){
			return "已结清";
		}else if(status == '1'){
			return "已流标";
		}else{
			return "";
		}
	});
	var tabs = j('.detail-tab').find("li"),
		tab_pages = j('.detail-record'),
		cpxq = j('#cpxq'),
		zqlb = j('#zqlb'),
		fxlb = j('#fxlb');
	j('li[data=#sylb]').click(function(){
		PUBLIC.count('MWD-ZMKH-CYZ-CKGD-SYLB');
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_pages.removeClass("detail-record-show");
		cpxq.addClass("detail-record-show");
		d.iScroll.refresh();
		d.setListenerName('');
	});
	j('li[data=#zqlb]').click(function(){

		PUBLIC.count('MWD-ZMKH-CYZ-CKGD-ZQLB');
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
           	   	requesturl : "ok8XdMSuHBDXgDlyq889QiYN%2FZEvP07f",
           	   	productId : pid,
           	   	accId :accId,
           	   	loanURL : pageUtil.loanURL
           	   },
               pullDown: pullDown,
               content: content,
               template: zqlbTemplate,
               callback : function(){
	            	j("#zqlb_content").find('li').bind("click",function(){
	            		var id = j(this).attr('id'),protocolUrl = encodeURIComponent(j(this).attr('wmpsAgreeMentHolding'));
	            		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+"&tid="+encodeURIComponent(id)+'&wmpsAgreeMentHolding='+protocolUrl+'&v='+Math.random();
	            	});
	            }
           });
           d.getData();
       };
	});
	j('li[data=#fxjl]').click(function(){
		PUBLIC.count('MWD-ZMKH-CYZ-CKGD-SXJL');
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_pages.removeClass("detail-record-show");
		fxlb.addClass("detail-record-show");
		d.iScroll.refresh();
		d.setListenerName('');
	});
	j("#investTip").bind('touchstart',function(){
		l.alert2('实际年化利率以交易为准');
	});
	j('.tab_page').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage,COMMON_KH,COMMON_POST,COMMON_Login);