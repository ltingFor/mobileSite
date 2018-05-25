window.status = 0;
(function(w,j,h,r,d,m,l,t,c,v) {
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		vipFlag = param_obj.vipFlag,
		pid = decodeURIComponent(param_obj.pid || '');
	var pageUtil={
		init:function(){
			r.postLayer({
				url:PUBLIC._COMMON,
				data:{
					requesturl:'Ls5SF9UahdpbFzLjSs%2BTfIAnezeDzAJo',
					pid:pid,
					rid:decodeURIComponent(param_obj.rid)||'11'
				},
				success:function(data){
					if(data.code=='0000'){
						var res_data = data.data;
						for(var i in res_data){
							if(i == 'urlentry'){
								if(res_data[i].code == '0'){
									j('#protoUrl').html(res_data[i].entryName).data('xy',encodeURIComponent(res_data[i].entryDesc));
								}else{
									j('#protoUrl').addClass('dis_none');
								}
								continue;
							}
							if(i == 'status' && res_data[i] == '5'){//新手标识
								j('title').html('我的新手专享详情');
								continue;
							}
							if(i == 'strFirstInter'){
								continue;
							}
							j("#"+i).html(res_data[i]);
						}
						
						//if(i == 'strFirstInter'){//主利率
						var addRateStr = '<i id="addRate">%</i>';
						j("#strFirstInter").html(res_data[i]+addRateStr);
						//}
						if(+(res_data['strSecInter'])){//副利率
							j("#addRate").append('+'+res_data['strSecInter']);
						}
						if(+(res_data.vipRate)){//vip
							j("#addRate").append("+"+res_data['vipRate']);
						}
						if(+(res_data['strSecInter'])){//加息券
							j("#addRate").append("+"+res_data['strSecInter']);
						}
						if(+(res_data.vipRate)){
							j("#addRate").append("<img src='/static/mobileSite/images/v.png' style='width:0.40rem;height:0.25rem'>");
						}
						if(+(res_data.strSecInter)){
							j("#addRate").append("<img src='/static/mobileSite/images/add.png' style='width:0.45rem!important;'>");
						}
						j("#amount_same").html(res_data.amount);
					}
				}
			})
		}
	}
	pageUtil.init();
	j('#protoUrl').bind('click',function(){
		var src = j(this).data('xy');
		w.location.href = decodeURIComponent(src);
	});
	var tzlbContent = j('#tzlb_content'),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		zqlb = j('#zqlb');
	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()+'px');
	dwonToTender.bind('click',function(){
		PUBLIC.count('MWD-YNJH-CYZ-CKGD');
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
	d.iScroll.refresh();
    d.setListenerName('zqlb');
    if (!d.getListener('zqlb')) {//债权列表
        var content = j('#zqlb_content'),
            pullDown = content.siblings('.pulldown');
        d.addListener('zqlb', {url:PUBLIC._COMMON,
        	data:{
        		requesturl : 'Ls5SF9UahdpeBBbEi7779GLlQHSeMZ%2Fg',
        		pid : pid
        	},
        	page: 1,
            pullDown: pullDown,
            content: content,
            template: zqlbTemplate,
            callback : function(){
            	j("#zqlb_content").find('li').bind("click",function(){
            		var id = j(this).attr('id'),wmpsAgreeMentHolding = encodeURIComponent(j(this).attr('wmpsAgreeMentHolding'));
            		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(id)+'&wmpsAgreeMentHolding='+wmpsAgreeMentHolding+'&v='+Math.random();
            	});
            }
        });
        d.getData();
    }
	var tabs = j('.detail-tab-list').find("li"),
		tab_page = j('.detail-record');

	j('#zq').click(function(){
		PUBLIC.count('MWD-YNJH-CYZ-CKGD-ZQLB');
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_page.removeClass('detail-record-show');
		zqlb.addClass('detail-record-show');
		d.iScroll.refresh();
        d.setListenerName('zqlb');
	});
	j("#investTip").bind('touchstart',function(){
		l.alert2('实际年化利率以交易为准');
	});
	j('.detail-record').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
})(window, $, Handlebars, requestUtil, dataPage,Math,Layer,Tools);
