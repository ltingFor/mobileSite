(function(w,j,r,t,l,h,d){
	'use strict'
	var param_obj = t.getParams();
	var pid = decodeURIComponent(param_obj.pid || ''),platform = param_obj.platform;
	var type = 0, sort_cdate = 2, sort_amount = 2;
	var hold_content = j('#holdList'),
		hold_pulldown = hold_content.siblings('.pulldown'),
		holdTemplate = h.compile(j("#tpl_hold").html()),

		end_content = j('#endList'),
		endTemplate = h.compile(j("#tpl_end").html()),
		Tabs = j("#tabs").find("li"),
		contents = j(".plan-handle"),
		SortCondition = j(".sort").find("span");

	if(!d.getListener('holdTab')){
		d.addListener('holdTab', {url:PUBLIC._COMMON,
    		data : {requesturl : "mBI9zdBAgnR0RONCptStQpE0tM%2BXNNDc",type: type},
    		pageNo: 1,
            content: hold_content,
            template: holdTemplate,
            callback : function(){
            	j('.mySesame-detail .li-div2').click(function(){
            		var id = j(this).attr('id'),accId = j(this).data('accid');
            		window.location.href = "/static/mobileSite/html/tailor/my_tailor_tenderlist.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&type=0&accId="+accId;
            		return false;
            	});
            }
        });	
        d.setListenerName('holdTab');
        d.getData();
//        d.iScroll.refresh();
	}
	h.registerHelper('format',function(num,type){
		if(type == 'no'){
			return t.outputmoney_n(num+"");
		}else{
			return t.outputmoney(num+"");
		}
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
			str = '%+'+addRate+"%";
		}
		else if(!addRate && vipRate){
			str = '%+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>";
		} 
		else if(addRate && vipRate){
			str = '%+'+addRate+'+'+vipRate+"%<img src='/static/mobileSite/images/v.png' style='width:0.29333333rem;height:0.2933333rem;'>";
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
//		d.iScroll.refresh();
		var name = flag,content = '',template = '',pulldown = '',type = 0;
		switch(flag){
			case "holdTab":
				// PUBLIC.count('MWD-ZMKH-CYZ');
				content = hold_content;
				template = holdTemplate;
				type = 0;
				break;
			case "endTab":
				// PUBLIC.count('MWD-ZMKH-YJQ');
				content = end_content;
				template = endTemplate;
				type = 1;
				break;
		}
		if(!d.getListener(name)){
			d.addListener(name, {url:PUBLIC._COMMON,
        		data : {requesturl : "mBI9zdBAgnR0RONCptStQpE0tM%2BXNNDc",type:type},
        		pageNo: 1,
                content: content,
                template: template,
	            callback : function(){
	            	// if(name == 'holdTab'){
	            		j('.mySesame-detail .li-div2').click(function(){
		            		var id = j(this).attr('id'),accId = j(this).data('accid');
		            		window.location.href = "/static/mobileSite/html/tailor/my_tailor_tenderlist.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&type=0&accId="+accId;
		            		return false;
		            	});
	            		// console.log('time='+j('.enddate').html());
	            	// }
	            }
            });	
            d.setListenerName(name);
            d.getData();
		}
	});

	SortCondition.bind("click",function(){
		var o = j(this),flag = o.attr("data-k"),v = o.attr("data-v");
		var name = "holdTab",content = hold_content,template = holdTemplate,sendData={requesturl : "mBI9zdBAgnR0RONCptStQpE0tM%2BXNNDc",type:0};
		var imgDom = $(this).find('img');
		if(imgDom.attr('src') == '../../images/sort_up.png'){
			imgDom.attr('src','../../images/sort_down.png');
		}else{
			imgDom.attr('src','../../images/sort_up.png');
		}
		$(this).addClass('orange');
		$(this).siblings('span').find('img').attr('src','../../images/sort.png');
		$(this).siblings('span').removeClass('orange');
		switch(flag){
			case "t":
				sort_cdate=sort_cdate==1?2:1;
				sendData.cdate = sort_cdate;
				break;
			case "a":
				sort_amount = sort_amount==1?2:1;
				sendData.amount = sort_amount;
				break;
		}
       d.setListenerName(name);
			d.addListener(name, {url:PUBLIC.URL_FWD_COMMON,
        		data : sendData,
        		pageNo: 1,
                content: content,
                template: template,
	            callback : function(){
	            	j('.mySesame-detail').click(function(){
	            		var id = j(this).attr('id'),accId = j(this).data('accid');
	            		window.location.href = "/static/mobileSite/html/tailor/my_tailor_tenderlist.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&type=0&accId="+accId;
	            		return false;
	            	});
	            }
            });	
            d.setListenerName(name);
            d.getData();
	});
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage);
