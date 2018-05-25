window.status = 0;
var COUNT = 0;//记录出借记录只能显示一次的标识
(function(w,j,h,r,d,m,l,t,c,v,cl) {
	'use strict';
	/*function changeDate(dateTemp, days) {
	    var dateTemp = dateTemp.split("-");
	    var nDate = new Date(dateTemp[0],dateTemp[1],dateTemp[2])
	    nDate.setDate(nDate.getDate() + days);
	    nDate.setMonth(nDate.getMonth() - 1);
	    return nDate.Format('yyyy-MM-dd');
	}*/
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		prodDetail = decodeURIComponent(param_obj.prodDetail || '');
	var tzlbContent = j('#tzlb_content'),
		zqlb_content = j("#zqlb_content"),
		tzlbTemplate = h.compile(j("#tpl_tzlb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		tzlb = j('#tzlb'),
		zqlb = j('#zqlb');
	var pageUtil = {
		profit : j('.detail-inv-profit'),
		term : 0,
		interest : 0,//当前的利率
		addRate:0,
		calIntrest : '',//要传给计算器的利率
		caculateInterest : function(numValue,interest,term){//计算预计回报  interest包括主利率 副利率 和vip利率
			// var numValue = +(this.num.val() || 0);
			var p1 = ((numValue * interest) / 365).toFixed(2);
			var profit = (p1 * term).toFixed(2);
			return t.outputmoney(profit || '');
		}
	}
	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()-invest_btn.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MTZ-YNJH-XQ-CKGD');
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
	h.registerHelper('compareIndexEnd',function(index,option){
		if(index == 0 && COUNT == 0){
			return option.fn(this);
		}
		else{
			COUNT = 1;
			return option.inverse(this);
		}
	});
	h.registerHelper('subTime',function(timestr){
		return timestr.substr(0,timestr.length-3);
	});

	r.postLayer({//翼农计划详情
		url : PUBLIC._COMMON,
		data : {
			requesturl : 'FnpG0BZijqSU9h4Rq6j9oHGTF6qr2jTunPPVPX4btAI%3D',
			prodDetail : prodDetail
		},
		success : function(data){
			if(data.code == "0000"){
				var info = data.data;
				var title = j('#title');
				if(info.icon){
					title.append('<img src="' + info.icon + '" style="width:0.5rem;vertical-align:sub;">');
				}
				var restAmount = info.surplusAmount || '--';
				
				var cur = info.amount,cur1 = info.maxAmount;
				pageUtil.payWay = info.payWay;
				title.append(info.title+"<span class='payway'>"+info.payWay+"</span>");
				window.status = info.status;//是否显示倒计时
				var term = info.phases.split('天')[0];
				var termType = info.phasesType;
				j('#strPhases').html('<span>' + term + '</span>');//合约期 30天
				j('#strPhasesType').html(termType);//合约期 类型，天，月
				j('#totalAmount').html('<span>' + t.outputmoney(info.maxAmount) +'</span>');//总募集金额maxAmount，amount是已经募集的金额
				j('#restAmount').append('<span>'+  t.outputmoney(restAmount) + '</span>');//剩余可投，自己计算
				j('#strInterdate').append(info.strInterdate);//计息时间
				j("#interdatePayDate").html(info.interdatePayDate);
				// j('#firstInterDate').append(changeDate(info.strInterdate,1));//首次付息时间
				j('#outDate').append(info.strEnddate);//退出时间
				j("#startInvestAmt").append(info.startInvestAmt);
				j("#interestPayWay").append(info.interestPayWay);
				j('#strPublisheddate').html(info.strPublisheddate);//发布时间
				j('#withdrawingDesc').html(info.withdrawingDesc);//退出方式
				j('#autoBuyDesc').html(info.autoBuyDesc);//自动续投
				j("#useNumDesc").html(info.useNumDesc);//出借人数
				j("#recruitmentPeriod").html(info.recruitmentPeriod);//
				if(info.autoBuySwitch == '0'){
					j(".autoBuySwitch").hide();
				}
				if(window.status != 1){
					j('.enddate').hide();
				}else{
					j('.enddate').data('lasttime',info.surplusSeconds);
				}

				//j("#maxInvest").html(info.max_invent);
				t.countDown();

				var calIntrest = '',investor1,interest_area;
				if(+(info.rate)){
					investor1 = info.rate;
					interest_area = info.rate;
					pageUtil.interest += parseFloat(investor1);
					calIntrest += investor1+"%";
				}
				if(+(info.addRate)){
					interest_area += '<span>%+' + info.addRate+ '</span>';
					pageUtil.addRate = info.addRate;
					// pageUtil.interest += parseFloat(info.addRate);
					calIntrest += '+'+parseFloat(info.addRate);
				}else{
					interest_area += '<span>%</span>';
				}
				pageUtil.calIntrest = calIntrest;
				pageUtil.term = term;//出借期限
				j('#interests').html(interest_area);

				if(window.status != 1){
					window.status = 0;
					invest_btn.html('已结束').addClass('dis_btn');
				}else{
					if(+(info.surplusSeconds)){
						window.status = 1;
						invest_btn.html('马上出借').removeClass('dis_btn');
					}else{
						window.status = 0;
						invest_btn.html('已结束').addClass('dis_btn');
					}
				}
			}
		},
		complete : function(){
			var vipStr = "";
			v.checkVip(function(data){
				if(data.code == '0000'){
					var vipRate = parseFloat(data.data.vipRate||'0.00');
					if(vipRate > 0 && window.status == '1'){

						vipStr += '<span>+' + vipRate + '</span><img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
					}else if(vipRate > 0 && window.status == '0'){//已结束的
						vipStr += '<span>+</span><img style="width:0.55rem;height:0.40rem;" src="/static/mobileSite/images/v.png" onerror="this.src=\'/static/mobileSite/images/vip_03.png\'"/>';
					}
					if(vipRate > 0){
						//pageUtil.interest += vipRate;//计算利率的vip利率
						pageUtil.calIntrest += '+'+vipRate;
					}
					if(pageUtil.interest && pageUtil.term){
						// pageUtil.interest = (pageUtil.interest/100);
						//公共的文件
						// m金额、v1-v4利率、q产品期限、c产品类型
						//function get_data(m, v1, v2, v3, v4, q, c) {
						pageUtil.profit.html(get_data('10000',pageUtil.interest,vipRate,pageUtil.addRate,'0',pageUtil.term,pageUtil.payWay));
						//pageUtil.profit.html(pageUtil.caculateInterest('10000',pageUtil.interest,pageUtil.term));
						cal.initCal({'type':'wmpsPlus',
						'amount':'10000',
						'intrestStr':pageUtil.calIntrest,
						'intrest':pageUtil.interest,
						'calDays':pageUtil.term,
						'payWay':pageUtil.payWay,
						'callback':get_data,
						'vipRate':vipRate,
						'addRate':pageUtil.addRate,
						'otherRate':0});//初始化计算器
					}
				}
				j('#interests').append(vipStr);
			});
		}
	});
	d.iScroll.refresh();
    d.setListenerName('zqlb');
    if (!d.getListener('zqlb')) {
        var pullDown = zqlb_content.siblings('.pulldown');
        d.addListener('zqlb', {url:PUBLIC._COMMON,
        	data:{
        		requesturl : 'FnpG0BZijqSU9h4Rq6j9oI6o%2BfvdDS%2BFqXK2XaJYWkQ%3D',
        		prodDetail : prodDetail
        	},
        	page: 1,
            pullDown: pullDown,
            content: zqlb_content,
            template: zqlbTemplate,
            callback : function(){
            	zqlb_content.find('li').bind('click',function(){
            		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(j(this).attr('id'));
            	});
            }
        });
        d.getData();
        d.iScroll.refresh();
    }
	var tabs = j('.detail-tab-list').find("li"),
		tab_page = j('.detail-record');

	j('#zq').click(function(){
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_page.removeClass('detail-record-show');
		zqlb.addClass('detail-record-show');
		d.iScroll.refresh();
        d.setListenerName('zqlb');
	});
	j('#tz').click(function(){//出借列表，当有第二页的时候会触发
		PUBLIC.count('MTZ-YNJH-XQ-CKGD-TZJL');
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_page.removeClass('detail-record-show');
		tzlb.addClass('detail-record-show');
		d.iScroll.refresh();
        d.setListenerName('tzlb_wmps');

        if (!d.getListener('tzlb_wmps')) {
            d.addListener('tzlb_wmps',
            	{
            		url:PUBLIC._COMMON,
            		data : {
            			requesturl :'FnpG0BZijqSU9h4Rq6j9oGOBdJ%2FhQ5T5qXK2XaJYWkQ%3D',
            			prodDetail : prodDetail,
            			platform : platform
            		},
            		pageNo: 1,
            		totalPage:window.totlPage,
	                pullDown: tzlbContent.siblings('.pulldown'),
	                content: tzlbContent,
	                template: tzlbTemplate
            	}
            );
	      	d.getData();
        	d.iScroll.refresh();
        }
	});
	/*@@@@@@@后期要改@@@@*/
	j('.detail-record').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
	j("#investTip").bind('click',function(){
		l.alert2('实际年化利率以交易为准');
	});
	invest_btn.bind('touchstart',function(){
		PUBLIC.count('MTZ-YNJH-XQ-MSTZ');
		if(j(this).hasClass('dis_btn')){
			return;
		}
		cl.check_Log(function(res){
			if(res.code == '0000'){
				c.check_KH(function(data){
					if(data.code == '0000'){
						window.location.href = PUBLIC.URL + "/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html?prodDetail="+encodeURIComponent(prodDetail)+"&platform="+platform;
					}
				});
			}
		});

	});

})(window, $, Handlebars, requestUtil, dataPage,Math,Layer,Tools,COMMON_KH,COMMON_POST,COMMON_Login);
Date.prototype.Format = function(fmt)
 { //author: meizz
   var o = {
     "M+" : this.getMonth()+1,                 //月份
     "d+" : this.getDate(),                    //日
     "h+" : this.getHours(),                   //小时
     "m+" : this.getMinutes(),                 //分
     "s+" : this.getSeconds(),                 //秒
     "q+" : Math.floor((this.getMonth()+3)/3), //季度
     "S"  : this.getMilliseconds()             //毫秒
   };
   if(/(y+)/.test(fmt))
     fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
   for(var k in o)
     if(new RegExp("("+ k +")").test(fmt))
   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
   return fmt;
 };