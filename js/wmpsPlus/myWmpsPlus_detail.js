window.status = 0;
(function(w,j,h,r,d,m,l,t,c,v) {
	'use strict';
	var param_obj = t.getParams();
	var platform = param_obj.platform || '',
		proDetailExt = decodeURIComponent(param_obj.proDetailExt || '');
	var tzlbContent = j('#zqlb_content'),
		zqlbTemplate = h.compile(j("#tpl_zqlb").html()),
		zqlb = j('#zqlb'),
		hkjlContent = j("#hkjl_content"),
		hkjlTemplate = h.compile(j("#tpl_hkjl").html()),
		hkjl = j('#hkjl');
	var tabs = j('.detail-tab-list').find("li"),
		tab_pages = j('.detail-record');
	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender"),upToViewDetail = j("#upToViewDetail");
	var wH = $(document).height(),headH = j("#tenderHeight").height();
	j("#wrapper").height(wH-headH-upToViewDetail.height()+'px');
	dwonToTender.bind('click',function(){
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
	var pageUtil={
		creatHelper:function(){
			h.registerHelper('checkStatus',function(status,now,future){
				if(status == '1'){
					return now;
				}else{
					return future;
					// return '待收<span style="position:absolute;right:0;top:-0.05rem;"><img src="/static/mobileSite/images/ic6.png" style="width:0.35rem;"/></span>';
				}
			});
			h.registerHelper('checkTenders',function(status){
				if(status == '0'){
					return true;
				}else{	
					return false;
				}
			});
		},
		bindEvent:function(){
			j('#urlentry').bind('click',function(){
				var src = j(this).data('xy');
				console.log(src);
				w.location.href = decodeURIComponent(src);
			});
		},
		init:function(){
			var that = this;
			r.postLayer({
				url:PUBLIC._COMMON,
				data:{
					requesturl:CONFIG.ynjhPlus_detail,
					proDetailExt:proDetailExt
				},
				success:function(data){
					data = data.data;
					for(var key in data){
						if(key == 'urlentry'){
							$("#"+key).html(data[key].entryName).attr('data-xy',encodeURIComponent(data[key].entryDesc));
							continue;
						}
						if(key == 'buyAmount'){
							j("#amount_same").html(data[key]);
						}
						if(key == 'rate'){
							j("#rate").html(data[key]+'<span>%</span>');
							continue;
						}
						/*if(key == 'title'){
							j("#title").html(data[key]+"<span style='border:1px solid #fff;margin-left:3px;'>"+data.payWay+"</span>");
							continue;
						}*/
						$("#"+key).html(data[key]);
						if(data.disPlayAutoButton == '1'){//展示
							$(".autoInvest").show();
							j("#autoSwitch").show();
						}else{//不展示
							$(".autoInvest").hide();
							j("#autoSwitch").hide();
						}
					}
					if(+(data.addRate)){
						j("#rate").append('<span>+'+data.addRate+'</span>');
					}
					if(+(data.vipRate)){
						j("#rate").append('<span>+'+data.vipRate+'</span>');
					}
					if(+(data.prizeRate)){
						j("#rate").append('<span>+'+data.prizeRate+'</span>');
					}
					if(+(data.vipRate)){
						j("#rate").append('<img src="/static/mobileSite/images/v.png" style="width:0.55rem;height:0.40rem;">')
					}
					if(+(data.prizeRate)){
						j("#rate").append('<img src="/static/mobileSite/images/add.png" style="width:0.55rem;height:0.40rem;">')
					}
				}
			});
			$("#zq").trigger('click');
			that.creatHelper();
			that.bindEvent();
		}
	}
	pageUtil.init();
	d.setListenerName('zqlb');
    if (!d.getListener('zqlb')) {//债权列表
        var content = j('#zqlb_content'),
            pullDown = content.siblings('.pulldown');
        d.addListener('zqlb', {url:PUBLIC._COMMON,
        	data:{
        		requesturl : 'FnpG0BZijqSU9h4Rq6j9oJW9UzOruRgPXefk5eThAqQ%3D',
        		proDetailExt : proDetailExt,
        		type:'0'
        	},
        	page: 1,
            pullDown: pullDown,
            content: content,
            template: zqlbTemplate,
            callback : function(){
            	j("#zqlb_content").find('li').bind("click",function(){
            		if(!j(this).data('skip')){
            			return false;
            		}else{
	            		var id = j(this).attr('id'),wmpsAgreeMentHolding = encodeURIComponent(j(this).attr('wmpsAgreeMentHolding'));
	            		w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(id)+'&wmpsAgreeMentHolding='+wmpsAgreeMentHolding+'&v='+Math.random();
            		}
            	});
            }
        });
        d.getData();
    }
	

	j('#zq').click(function(){
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_pages.removeClass('detail-record-show');
		zqlb.addClass('detail-record-show');
        d.iScroll.refresh();
	    
	});
	j('#hk').click(function(){
		tabs.removeClass('detail-tab-show');
		j(this).addClass('detail-tab-show');
		tab_pages.removeClass("detail-record-show");
		hkjl.addClass("detail-record-show");
		d.iScroll.refresh();
	    d.setListenerName('hkjl');
	    r.postLayer({
	    	url:PUBLIC._COMMON,
	    	data:{
	        		requesturl : 'FnpG0BZijqSU9h4Rq6j9oJW9UzOruRgPfZGUpa8Itzk%3D',
	        		proDetailExt : proDetailExt
	        	},
	        success:function(data){
	        	if(data.code == '0000'){
		        	data = data.data;
		        	j('#hkjl_content').html(hkjlTemplate(data));
		        	d.iScroll.refresh();
	        	}
	        }
	    });
	    d.iScroll.refresh();
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
