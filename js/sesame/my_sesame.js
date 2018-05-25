(function(w,j,r,t,l,h,d){
	'use strict'
	var param_obj = t.getParams();
	var pid = decodeURIComponent(param_obj.pid || ''),platform = param_obj.platform;
	var hold_content = j('#holdList'),
		hold_pulldown = hold_content.siblings('.pulldown'),
		holdTemplate = h.compile(j("#tpl_hold").html()),

		transfer_content = j('#transferList'),
		transfer_pulldown = transfer_content.siblings('.pulldown'),
		transferTemplate = h.compile(j("#tpl_transfer").html()),
		
		end_content = j('#endList'),
		end_pulldown = end_content.siblings('.pulldown'),
		endTemplate = h.compile(j("#tpl_end").html()),
		Tabs = j("#tabs").find("li"),
		contents = j(".plan-handle");

	if(!d.getListener('holdTab')){
		d.addListener('holdTab', {url:PUBLIC._COMMON,
    		data : {requesturl : "ok8XdMSuHBDXgDlyq889Qg1M1Ht5PYuw",tranType:0},
    		pageNo: 1,
            pullDown: hold_content.siblings('.pulldown'),
            content: hold_content,
            template: holdTemplate,
            callback : function(){
            		t.pauseCountDown();
	            	t.refreshEnd();
            		t.countDown(1);

            	j('.mySesame-detail').click(function(){
            		var id = j(this).attr('id'),accId = j(this).data('accid'),skip = j(this).data('skip');
            		window.location.href = "/static/mobileSite/html/sesame/mySesame_detail.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&tranType=1&accId="+accId+"&skip="+skip;
            		// window.location.href = "/static/mobileSite/html/sesame/mySesame_detail.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&tranType=0&accId="+accId;
            		return false;
            	});
            }
        });	
        d.setListenerName('holdTab');
        d.getData();
        d.iScroll.refresh();
	}
	h.registerHelper('checkImg',function(holdMoney,amount){
		if(+(amount) != +(holdMoney)){
			return "<img src='/static/mobileSite/images/blue.png' style='width:0.2933333rem;height:0.29333333rem;'>";
		}
	});
	h.registerHelper('format',function(num,type){
		if(type == 'no'){
			return t.outputmoney_n(num+"");
		}else{
			return t.outputmoney(num+"");
		}
	});
	h.registerHelper('formstatus',function(statusCNNew){
		if(statusCNNew) return '<strong class="strong1 strong-show">'+statusCNNew+'</strong>';
		else return '';
	});
	h.registerHelper('checkDown',function(status,surplusSeconds,statusCNNew){
		var str = '';//0可转让 1封闭期  2转让中 3已转让 4已到期  5审核中  6、不可转让
		if(status == "0"){
			return "";
		}
		else if(status == '1'){
			return "封闭期：<span class='enddate' data-lasttime="+surplusSeconds+" ></span>";//显示倒计时
		}
		else if(status == '5'){
			return '审核中';
		}
		else if(status == '6'){
			return statusCNNew;
		}
	});
	h.registerHelper('checkSubRate',function(addRate,vipRate){
		var str = '';
		if(addRate && !vipRate){
			str = '+'+addRate+"%";
		}
		else if(!addRate && vipRate){
			str = '+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>";
		} 
		else if(addRate && vipRate){
			str = '+'+addRate+'+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.29333333rem;height:0.2933333rem;'>";
		}else if(!addRate && !vipRate){
			str = "%";
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
	Tabs.bind("click",function(){
		var o = j(this),flag = o.attr("id");
		Tabs.removeClass("tab-show");
		o.addClass("tab-show");
		contents.removeClass("plan-show");
		j("div[data="+flag+"]").addClass("plan-show");
		d.iScroll.refresh();
		var name = flag,content = '',template = '',pulldown = '',tranType = 0;
		switch(flag){
			case "holdTab":
				PUBLIC.count('MWD-ZMKH-CYZ');
				content = hold_content;
				pulldown = hold_pulldown;
				template = holdTemplate;
				tranType = 0;
				break;
			case "transferTab":
				PUBLIC.count('MWD-ZMKH-ZRZ');
				content = transfer_content;
				pulldown = transfer_pulldown;
				template = transferTemplate;
				tranType = 1;
				break;
			case "endTab":
				PUBLIC.count('MWD-ZMKH-YJQ');
				content = end_content;
				pulldown = end_pulldown;
				template = endTemplate;
				tranType = 2;
				break;
		}
		if(!d.getListener(name)){
			d.addListener(name, {url:PUBLIC._COMMON,
        		data : {requesturl : "ok8XdMSuHBDXgDlyq889Qg1M1Ht5PYuw",tranType:tranType},
        		pageNo: 1,
                pullDown: pulldown,
                content: content,
                template: template,
	            callback : function(){
	            	if(name == 'endTab' || name == 'transferTab'){
	            		// console.log('time='+j('.enddate').html());
	            	}
	            	t.pauseCountDown();
            		t.refreshEnd();
            		t.countDown(1);
	            	j('.mySesame-detail').click(function(){
	            		var id = j(this).attr('id'),accId = j(this).data('accid'),skip = j(this).data('skip');
	            		// if(skip == 'end'){
	            			window.location.href = "/static/mobileSite/html/sesame/mySesame_detail.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&tranType=1&accId="+accId+"&skip="+skip;
	            		// }else{
	            			// window.location.href = "/static/mobileSite/html/sesame/mySesame_detail.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&tranType=1&accId="+accId;
	            		// }
	            		return false;
	            	});
	            }
            });	
            d.setListenerName(name);
            d.getData();
            d.iScroll.refresh();
		}
	});
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage);
