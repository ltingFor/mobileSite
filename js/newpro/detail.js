window.status = 0;
var COUNT = 0;//记录出借记录只能显示一次的标识
(function(w,j,h,r,d,m,l,t,c,v,cl) {
	'use strict';
	function changeDate(dateTemp, days) {
	    var dateTemp = dateTemp.split("-");
	    var nDate = new Date(dateTemp[0],dateTemp[1],dateTemp[2])
	    nDate.setDate(nDate.getDate() + days);
	    nDate.setMonth(nDate.getMonth() - 1);
	    return nDate.Format('yyyy-MM-dd');
	}
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		pid = decodeURIComponent(param_obj.pid || '');
	var tzlbContent = j('#tzlb_content'),
		tzlbTemplate = h.compile(j("#tpl_tzlb").html()),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		tzlb = j('#tzlb'),
		zqlb = j('#zqlb');
	var pageUtil = {
		profit : j('.detail-inv-profit'),
		term : 0,
		profitamount : 20000,
		interest : 0,//当前的利率
		calIntrest : '',//要传给计算器的利率
		caculateInterest : function(numValue,interest,term){//计算预计回报  interest包括主利率 副利率 和vip利率
			// var numValue = +(this.num.val() || 0);
			var p1 = ((numValue * interest) / 365).toFixed(2);
			var profit = (p1 * term).toFixed(2);
			return t.outputmoney(profit || '');
		}
	}
	//"compareIndexEnd"
	h.registerHelper('compareIndexEnd',function(index,option){
		if(index == 0 && COUNT == 0){
			return option.fn(this);
		}
		else{
			COUNT = 1;
			return option.inverse(this);
		}
	});
	
	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height(),investH = invest_btn.height(),dH = $(this).height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()-invest_btn.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MSHOUYE-XQ-CKGD');
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

	r.postLayer({//详情信息
		url : PUBLIC._COMMON,
		data : {
			requesturl : CONFIG.NewUserDetail_URL,
			pid : pid
		},
		success : function(data){
			//var data={"message":"成功","data":{"usedTime":null,"investLimitQuotaDesc":"累计出借限额20000元","yuGouNum":"4","id":"of9FRwWQQu/LcH8puxTZ2Q==","amount":"51300.00","wholeTitle":"新手专享918646期","title":"新手专享918646期","firstInterdate":"2017-12-01","strInterdate":"2017-11-30","progressBar":"14","experience":"null","startInvestDesc":"100元，以整数倍递增","strDongTime":"6225","strFirstInter":"10","principalPaymentDesc":"D+1","icon":null,"repayWayDesc":"每日付息","status":"1","strInterestrate":"10%","strPhases":"30天","maxAmount":"360000.00","phasesType":"1","strSecInter":"","interdate":"2017-11-30","calHints":"出借20,000元","publicDate":"2017-11-29 15:36","slMaxAmount":null,"strEndDate":"2017-12-30","idNoDes":null,"proDesc":"新手专享是翼龙贷推出的面向新用户的专享产品。","yuGouNumDesc":"不限","strStatus":"成功","withdrawingDesc":"自动退出或系统自动债权转让"},"messageData":null,"code":"0000"};
			if(data.code == "0000"){
				var info = data.data;
				var title = j('#title');
				if(info.icon){
					title.append('<img src="' + info.icon + '" style="width:1.1rem;vertical-align:sub;">');
				}
				var invest = 0,rate = 0,Arr = info.strInterestrate,restAmount = (((info.maxAmount||"") - (info.amount||""))/10000) || 0;
				restAmount = restAmount.toFixed(2);
				invest = Arr[0]||0.0;
				rate = Arr[1]||0;
				var cur = info.amount,cur1 = info.maxAmount;
				if(cur){
					cur = cur/10000;
					info.amount = cur.toFixed(2);
				}
				if(cur1){
					cur1 = cur1/10000;
					info.maxAmount = cur1.toFixed(2);
				}
				title.append(info.wholeTitle);
				window.status = info.status;//是否显示倒计时
				var term = info.strPhases.split('天')[0];//合约期限
				j('#strPhases').html('<span>' + term + '</span>');/*合约期 30天*/
				j('#totalAmount').html('<span>' + info.maxAmount +'</span>');//总募集金额maxAmount，amount是已经募集的金额
				j('#restAmount').append('<span>'+ restAmount + '</span>');//剩余可投，自己计算
				j('#strInterdate').append(info.strInterdate);//计息时间
				j('#limitdaysamount').html("可出借3笔，累计限额"+info.newUserLimitQuota/10000+"万");//限额条件
				j('#firstInterDate').html(info.firstInterdate);//首次付息时间
				j('#outDate').append(info.strEndDate);//退出时间
				j('#publicDate').append(info.publicDate);//退出时间
				j("#recruitmentPeriod").html(info.recruitmentPeriod);
				if(window.status != 1){
					j('.enddate').hide();
				}else{
					j('.enddate').data('lasttime',info.strDongTime);
				}
				
				
				//j("#maxInvest").html(t.outputmoney_n(info.max_invent));
				t.countDown();


				var arr = info.strInterestrate.split("+") || 0,calIntrest = '',investor1,interest_area;
				if(arr.length) {
					for(var i=0,l=arr.length;i<l;i++){
						if(i == 0){
							investor1 = arr[0].split("%")[0];
							interest_area = '<span>' + investor1+ '</span>%';
							pageUtil.interest += parseFloat(investor1);
							calIntrest += investor1+"%";
						}else{
							interest_area += '<span>+' + arr[i] + '</span>';
							pageUtil.interest += parseFloat(arr[i]);
							calIntrest += arr[i];
						}
					}
				}
				pageUtil.calIntrest = calIntrest;
				pageUtil.term = term;//出借期限	
				
				//出借限额
				pageUtil.profitamount=info.newUserLimitQuota;
				//pageUtil.profitamount=50000
				
				
				j('.detail-inv-amount').text(pageUtil.profitamount);
				//获取出借人列表
				 
				
			
				j('#interests').html(interest_area);
				w.tenderDetailUrl = info.tenderDetailUrl || '';

				if(info.status != 1){//判断按钮状态
					window.status = 0;
					invest_btn.html('已结束').addClass('dis_btn');
				}else{
					window.status = 1;//判断结束与否的标志
					invest_btn.html('马上出借').removeClass('dis_btn');
				}

			}else{
				l.alert2(data.message);
				return;
			}
		},
		complete : function(){//vip 利率
				if(pageUtil.interest && pageUtil.term){
					pageUtil.interest = (pageUtil.interest/100);
					pageUtil.profit.html(pageUtil.caculateInterest(pageUtil.profitamount,pageUtil.interest,pageUtil.term));
					cal.initCal({'type':'wmps','amount':pageUtil.profitamount,'intrestStr':pageUtil.calIntrest,'intrest':pageUtil.interest,'calDays':pageUtil.term,'callback':pageUtil.caculateInterest});//初始化计算器
				}						
			invest_btn.bind('click',function(){						
						PUBLIC.count('MSHOUYE-XQ-MSTZ');
                       if(!invest_btn.hasClass('dis_btn')){
						 				
						//请求是否为新手的判断
						r.setFlag(false);
						r.post({
							url : PUBLIC._COMMON,
							data : {
								requesturl : 'Ls5SF9UahdpnCKMuzK0%2BxCqCFxy7cf0e',
								pid : pid
							},
							success : function(data){
								if(data.code == '0000'){									
									w.location.href = '/static/mobileSite/html/newpro/newpro_invest.html?pid=' + encodeURIComponent(pid) + '&platform=' + platform + '&v=' + Math.random();
						
								}else{
									//l.alertAuto(data.message);
								}
							}
						});
						
					   }	
						});
		}
	});

	d.iScroll.refresh();
    d.setListenerName('zqlb');
    if (!d.getListener('zqlb')) {
        var content = j('#zqlb_content'),
            pullDown = content.siblings('.pulldown');
        d.addListener('zqlb', {url:PUBLIC._COMMON,
        	data:{
        		requesturl : CONFIG.WMPS_Pro_TenderList_URL,
        		pid : pid
        	},
        	page: 1,
            pullDown: pullDown,
            content: content,
            template: zqlbTemplate,
            callback : function(){
            	j("#zqlb_content").find('li').bind('click',function(){
            		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(j(this).attr('id'))+'&v='+Math.random();
            	});
            }
        });
        d.getData();
        d.iScroll.refresh();
    }
	

    
		
		
	var tabs = j('.detail-tab-list').find("li"),
		tab_page = j('.detail-record');

	j('#zq').click(function(){
		PUBLIC.count("MSHOUYE-XQ-CKGD-ZQLB");
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_page.removeClass('detail-record-show');
		zqlb.addClass('detail-record-show');
		d.iScroll.refresh();
        d.setListenerName('zqlb');
	});
	j('#tz').click(function(){
		PUBLIC.count("MSHOUYE-XQ-CKGD-TZJL");
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
            			requesturl :'Ls5SF9UahdrYVIlsXgdZgmLlQHSeMZ%2Fg',
            			pid : pid,
            			platform : platform
            		},
            		pageNo: 1,
            		//totalPage:window.totlPage,
	                pullDown: tzlbContent.siblings('.pulldown'),
	                content: tzlbContent,
	                template: tzlbTemplate
            	}
            );
	    d.getData();
        d.iScroll.refresh();
        }
	});
	j("#investTip").bind('touchstart',function(){
		l.alert2('实际年化利率以交易为准');
	});
	j('.detail-record').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
})(window, $, Handlebars, requestUtil, dataPage,Math,Layer,Tools,COMMON_KH,COMMON_POST,COMMON_Login);
Date.prototype.Format = function(fmt){ //author: meizz
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
