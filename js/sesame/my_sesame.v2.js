(function(w,j,r,t,l,h,d){
	'use strict'
	var param_obj = t.getParams();
	var pid = decodeURIComponent(param_obj.pid || ''),platform = param_obj.platform;
	var hold_sort = {sortName:1,sortType:2}, transfer_sort = {sortName:1,sortType:2},end_sort = {sortName:1,sortType:2};
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
	var pageUtil = {
		bindEvent:function(){
			var that = this;
			$(".sortLi").bind("click",function(){
				var o = j(this),flag = o.data("sorttype");
				var name = o.data('name'),content = hold_content,template = holdTemplate,sendData={};
				var imgDom = $(this).find('p');

				if(imgDom.hasClass('upArrow') && !imgDom.hasClass('downArrow')){
					$(this).find('p').removeClass('upArrow').addClass('downArrow');
				}else if(!imgDom.hasClass('upArrow') && imgDom.hasClass('downArrow')){
					$(this).find('p').removeClass('downArrow').addClass('upArrow');
				}else{
					$(this).find('p').addClass('upArrow');
				}
				$(this).find('p').addClass('active');
				$(this).siblings('li').find('p').removeClass('downArrow upArrow active');

				var sortName = $(this).data('sortname'),sortType = $(this).find('p').hasClass('upArrow') ? 1 : 2;
				switch(name){
					case 'holdTab':
						content = hold_content;
						template = holdTemplate;
						sendData = {requesturl : "2xC2knBHKqUg%2BrG%2FQvZPgIiiSObWxUzo",tranType:"0"};
						hold_sort.sortName = sortName;
						hold_sort.sortType = sortType;
						break;
					case 'transferTab':
						content = transfer_content;
						template = transferTemplate;
						sendData = {requesturl : "2xC2knBHKqUg%2BrG%2FQvZPgIiiSObWxUzo",tranType:"1"};
						transfer_sort.sortName = sortName;
						transfer_sort.sortType = sortType;
						break;
					case 'endTab':
						content = end_content;
						template = endTemplate;
						sendData = {requesturl : "2xC2knBHKqUg%2BrG%2FQvZPgIiiSObWxUzo",tranType:'2'};
						end_sort.sortName = sortName;
						end_sort.sortType = sortType;
						break;
				}
				sendData.sortName = sortName;
				sendData.sortType = sortType;
				content.empty();
				that.getList({name:name,sendData:sendData,content:content,template:template});
			});
			Tabs.bind("click",function(){
				$('.sortLi').find('p').removeClass('downArrow upArrow active');
				var o = j(this),flag = o.attr("id");
				Tabs.removeClass("tab-show");
				o.addClass("tab-show");
				contents.removeClass("plan-show");
				j("div[data="+flag+"]").addClass("plan-show");
				d.refresh(flag);
				var name = flag,content = '',template = '',pulldown = '',tranType = 0;
				$(".sortLi").data('name',flag);

				var initSendData = {requesturl : "2xC2knBHKqUg%2BrG%2FQvZPgIiiSObWxUzo"};
				switch(flag){
					case "holdTab":
						PUBLIC.count('MWD-ZMKH-CYZ');
						$(".sortLi").css('width','33.3%');
						$(".sortLi[data-sorttype=gmbj]").show();
						content = hold_content;
						template = holdTemplate;
						tranType = 0;
						if(hold_sort){
							initSendData.sortName = hold_sort.sortName;
							initSendData.sortType = hold_sort.sortType;
							var holdO = $('.sortLi[data-sortname='+hold_sort.sortName+']');
							holdO.find('p').addClass('active');
							hold_sort.sortType ==1  ? holdO.find('p').addClass('upArrow') : holdO.find('p').addClass('downArrow');
						}
						break;
					case "transferTab":
						PUBLIC.count('MWD-ZMKH-ZRZ');
						$(".sortLi").css('width','49%');
						$(".sortLi[data-sorttype=gmbj]").hide();
						content = transfer_content;
						template = transferTemplate;
						tranType = 1;
						if(transfer_sort){
							initSendData.sortName = transfer_sort.sortName;
							initSendData.sortType = transfer_sort.sortType;
							var transferO = $('.sortLi[data-sortname='+transfer_sort.sortName+']');
							transferO.find('p').addClass('active');
							transfer_sort.sortType ==1  ? transferO.find('p').addClass('upArrow') : transferO.find('p').addClass('downArrow');
						}
						break;
					case "endTab":
						PUBLIC.count('MWD-ZMKH-YJQ');
						$(".sortLi").css('width','33.3%');
						$(".sortLi[data-sorttype=gmbj]").show();
						content = end_content;
						template = endTemplate;
						tranType = 2;
						if(end_sort){
							initSendData.sortName = end_sort.sortName;
							initSendData.sortType = end_sort.sortType;
							var endO = $('.sortLi[data-sortname='+end_sort.sortName+']');
							endO.find('p').addClass('active');
							end_sort.sortType ==1  ? endO.find('p').addClass('upArrow') : endO.find('p').addClass('downArrow');
						}
						break;
				}
				initSendData.tranType = tranType;
				content.empty();
				that.getList({'name':name,'sendData':initSendData,'content':content,'template':template});
			});
		},
		creatHelper:function(){
			h.registerHelper('format',function(num,type){
				if(type == 'yes'){
					return t.outputmoney(num+"");
				}else{
					return t.outputmoney_n(num+"");
				}
			});
			/*h.registerHelper('formstatus',function(statusCNNew){
				if(statusCNNew) return '<strong class="strong1 strong-show">'+statusCNNew+'</strong>';
				else return '';
			});*/
			h.registerHelper('checkImg',function(amount,holdMoney){
				if(+(amount) != +(holdMoney)){
					return '<img src="/static/mobileSite/images/bule.png" style="width:0.2933333rem;height:0.29333333rem;">';
				}
			});
			h.registerHelper('checkDown',function(surplusSeconds,proStatus){
				if(proStatus == '7'){
					return '审核中';
				}else if(proStatus == '1' || proStatus == '2' || proStatus == '6'){
					surplusSeconds = +surplusSeconds;
					if(!surplusSeconds){
						return "";
					}
					else{
						return "封闭期：<span class='enddate' data-lasttime="+surplusSeconds+" style='color:#a6a6a6;'></span>";//显示倒计时
					}
				}else{
					return "";
				}
			});
			h.registerHelper('checkTransferDown',function(surplus24Hs,status,statusCN){ // 转让中倒计时
				if(status == '2'){
					surplus24Hs = +surplus24Hs;
					if(!surplus24Hs){
						return "";
					}
					else{
						return "转让中：<span class='enddate' data-lasttime="+surplus24Hs+" style='color:#a6a6a6;'></span>";//显示倒计时
					}
				}else if(status == '3'){ // 10分钟内
					return statusCN;
				}else{
					return "";
				}
			});
			h.registerHelper('checkSubRate',function(addRate,vipRate){
				var str = '',addRate = +addRate,vipRate = +vipRate;
				if(addRate && !vipRate){
					str = '%+'+addRate;
				}
				else if(!addRate && vipRate){
					str = '%+'+vipRate+"<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>";
				}
				else if(addRate && vipRate){
					str = '%+'+addRate+'+'+vipRate+"<img src='/static/mobileSite/images/v.png' style='width:0.29333333rem;height:0.2933333rem;'>";
				}else if(!addRate && !vipRate){
					str = "%";
				}
				return str;
			});
		},
		getList:function(obj){
			d.addListener(obj.name, {url:PUBLIC._COMMON,
	    		data : obj.sendData,
	            content: obj.content,
	            template: obj.template,
	            callback : function(data){
	            	if(data.code == '0000'){
	            		var list = data.data.list || [];
	            		if(list.length){
	            			$(".trans-order").show();
	            		}else{
	            			$(".trans-order").hide();
	            		}
	            	}

	        		t.pauseCountDown();
	            	t.refreshEnd();
	        		if(obj.name == 'holdTab'){
	        				t.countDown(1);
	        		} else{
	        			t.countDown();
	        		}
	            	j('.mySesame-detail').click(function(){
	            		var proDetailExt = encodeURIComponent(j(this).data('prodetailext')),skip = j(this).data('skip');
	            		window.location.href = "/static/mobileSite/html/sesame/mySesame_detail.html?platform="+platform+"&proDetailExt="+proDetailExt+"&skip="+skip+"&v="+Math.random();
	            		return false;
	            	});
	            }
	        });
	        d.setListenerName(obj.name);
	        d.getData();
		},
		init:function(){
			var that = this;
			that.bindEvent();
			that.creatHelper();
			that.getList({name:'holdTab',sendData:{requesturl : "2xC2knBHKqUg%2BrG%2FQvZPgIiiSObWxUzo",tranType:0,sortName:1,sortType:2},content:hold_content,template:holdTemplate});
		},
	};
	pageUtil.init();
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage);
