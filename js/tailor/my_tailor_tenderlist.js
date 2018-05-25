(function(w,j,r,t,l,h,d){
	'use strict'
	var param_obj = t.getParams();
	var pid = decodeURIComponent(param_obj.pid || ''),platform = param_obj.platform,comfrom=param_obj.comfrom;

	var trans_btn = j(".transBtn");
	if(comfrom == 'end'){
		trans_btn.addClass('dis_none');
	}
	var type = 0, sort_cdate = 2, sort_amount = 1;
	var hold_content = j('#holdList'),
		hold_pulldown = hold_content.siblings('.pulldown'),
		holdTemplate = h.compile(j("#tpl_hold").html());
	trans_btn.bind('click',function(){
		if(j(this).hasClass('disable')){
			return false;
		};
		w.location.href = '/static/mobileSite/html/tailor/batch_transfer.html?platform='+platform+'&v='+Math.random()+'&myProExtend='+(pid);			
	});
$.ajax({
	url:PUBLIC._COMMON,
	data:{requesturl:'mBI9zdBAgnR0RONCptStQsoW%2Bl26HUmP',myProExtend:pid,platform:platform},
	success:function(data){
		if(data.code != '0000'){
			trans_btn.css('color','#dcdcdc').addClass('disable');
		}
	}
});
	if(!d.getListener('holdTab')){
		d.addListener('holdTab', {url:PUBLIC._COMMON,
    		data : {requesturl : "mBI9zdBAgnR0RONCptStQtCzd21Dbw2%2F",myProExtend: pid},
    		pageNo: 1,
            pullDown: hold_content.siblings('.pulldown'),
            content: hold_content,
            template: holdTemplate,
            callback : function(){
            	t.refreshEnd();
			    t.countDown(1);
			    if(comfrom != 'end'){
            	j('li.mySesame-detail').click(function(){
            		var o = j(this),btnflag = o.find('div.showBtn').data('btnflag'),
            			tid = o.data('tid'),tenderPaymentExt = o.data('ext'),proddetail = o.data('proddetail'),xieyiUrl=encodeURIComponent(o.data('xieyiurl'));
            		if(btnflag){
	            		window.location.href = "/static/mobileSite/html/tender/tailor_trans_detail.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random()+"&myProExtend="+pid+"&xieyiUrl="+xieyiUrl;
            		}else{
	            		window.location.href = "/static/mobileSite/html/tender/tender_detail_srdz.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random()+"&myProExtend="+pid+"&wmpsAgreeMentHolding="+xieyiUrl;
            		}
            		return false;
            	});
	            }

            	j('li>.li-div5>.title').unbind('click').bind('click',function(){
            		j(this).find('img').toggleClass('up');
            		var curO = j(this).parent('.li-div5').find('.jiacontents');
            		curO.toggleClass('dis_none');
            		if(!$(this).hasClass('data')){
            			$(this).addClass('data');
            			r.post({
            				url:PUBLIC._COMMON,
            				data:{requesturl:'mBI9zdBAgnR0RONCptStQpncLamFrYjD',tenderPrizeExt:$(this).data('tenderprizeext')},
            				success:function(data){
            					console.log(data);
            					if(data.code == '0000'){
            						data = data.data || '';
            						curO.empty();
            						curO.append('<div class="jiaContent">'+
										'<div>'+
											'<p>加息金额:&nbsp;<span>'+t.outputmoney_n(data.amoutStr||'')+'元</span></p>'+
											'<p>加息利率:&nbsp;<span>'+(data.prizeRate||'')+'</span></p>'+
										'</div>'+
										'<div>'+
											'<p>加息天数:&nbsp;<span>'+(data.prizeDays||'')+'天</span></p>'+
											'<p>加息券回报:&nbsp;<span>'+(data.prizeProceeds||'')+'元</span></p>'+
										'</div>'+
										'<div>'+
											'<p>加息日期:&nbsp;<span>'+(data.qiXiDateStr||'')+'</span></p>'+
											'<p>加息结束:&nbsp;<span>'+(data.endDateStr||'')+'</span></p>'+
										'</div>'+
									'</div>');
            					}
            				}
            			});
            		}else{
            			// $(this).removeClass('data');
            		}
            		return false;
            	});
            }
        });	
        d.setListenerName('holdTab');
        d.getData();
//        d.iScroll.refresh();
	}
	h.registerHelper('checkJiaxiStatus',function(status,option){
		if(status){
			return option.fn(this);
		}else{
			return option.inverse(this);
		}
	});
	h.registerHelper('format',function(num,type){
		if(type == 'no'){
			return t.outputmoney_n(num+"");
		}else{
			return t.outputmoney(num+"");
		}
	});
	h.registerHelper('checkDown',function(status,closePeriod,name){
		closePeriod = +(closePeriod);
		var str = '';//
		if(status == "2" || status == '4'){//已结束
			if(comfrom == 'end'){
				return '<div class="li-div1 clearfix"><h4>'+name+'</h4></div>';
			}else{
				return '<div class="li-div1 clearfix jieqing"><h4>'+name+'</h4><span>已结清</span></div>';
			}
		}else if(status == '0'){//审核中
			return '<div class="li-div1 clearfix zhuanrang"><h4>'+name+'</h4><span>审核中</span></div>';
		}else if(status == '3'){//流标
			return '<div class="li-div1 clearfix liubiao"><h4>'+name+'</h4><span>流标</span></div>';
		}else if(status == '9'){//已转让
			return '<div class="li-div1 clearfix zhuanrang"><h4>'+name+'</h4><span>已转让</span></div>';
		}else if(status == '8'){
			return '<div class="li-div1 clearfix liubiao"><h4>'+name+'</h4><span>撤销中</span></div>';
		}else if(status != '2' && status != '4' && status != '3' && status != '9' && status != '8' &&status != '0' && closePeriod){
			return '<div class="li-div1 clearfix"><h4>'+name+'</h4><div class="countDown">封闭期：<label data-lasttime='+closePeriod+' class="enddate" style="color:#333;">'+closePeriod+'</label></div></div>';
		}else{
			return '<div class="li-div1 clearfix"><h4>'+name+'</h4></div>';
		}
	});
	h.registerHelper('checkShow',function(status,closePeriod,option){
		closePeriod = +(closePeriod);
		var str = '';//
		if(status == "2" || status == '4' || status == '3'){//已结 流标
			return option.fn(this);
		}else{
			return option.inverse(this);
		}
	});
	h.registerHelper('checkShow_yz',function(status,closePeriod,option){
		closePeriod = +(closePeriod);
		if(status == '9'){//已转
			return option.fn(this);
		}else{
			return option.inverse(this);
		}
	});
	
	h.registerHelper('checkSubRate',function(addRate,vipRate,rateStr){
		var str = '';
		rateStr = rateStr.split('%')[0];
		if(addRate && !vipRate){
			str = rateStr+'+'+addRate+"%";
		}
		else if(!addRate && vipRate){
			str = rateStr+'+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>";
		} 
		else if(addRate && vipRate){
			str = rateStr+'+'+addRate+'+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.29333333rem;height:0.2933333rem;'>";
		}else if(!addRate && !vipRate){
			str = rateStr+"%";
		}
		return str;
	});
	h.registerHelper('checkEndStatus',function(status,option){
		if(status == '3'){
			return option.fn(this);
		}else if(status == '4'){
			return option.inverse(this);
		}
	});
	h.registerHelper('checkAddrate',function(addquan){//加息券
		if(addquan){
			return "<img src='/static/mobileSite/images/add.png' style='width:0.40rem!important;height:0.25rem'>";
		}else{
			return '';
		}
	});

})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage);
