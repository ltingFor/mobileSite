(function(w,j,r,t,l,h,d,v){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform;
	var hold_content = j('#holdList'),
		hold_pulldown = hold_content.siblings('.pulldown'),
		holdTemplate = h.compile(j("#tpl_hold").html()),

		end_content = j('#endList'),
		end_pulldown = end_content.siblings('.pulldown'),
		endTemplate = h.compile(j("#tpl_end").html()),
		contents = j(".plan-handle");
	var pageUtil = {
		vipValue : '',
		vipImg : "/static/mobileSite/images/v.png",
		addrateImg:"/static/mobileSite/images/add.png",
		Tabs : j("#tabs").find("li"),
		bindEvent : function(){
			var that = this;
			that.Tabs.bind("click",function(){
				var o = j(this),flag = o.attr("id");
				that.Tabs.removeClass("tab-show");
				o.addClass("tab-show");
				contents.removeClass("plan-show");
				j("div[data="+flag+"]").addClass("plan-show");
				// d.iScroll.refresh();
				var name = flag,content = '',template = '',pulldown = '',tranType = 0;
				switch(flag){
					case "holdTab":
						PUBLIC.count('MWD-YNJH-CYZ');
						content = hold_content;
						pulldown = hold_pulldown;
						template = holdTemplate;
						tranType = 0;

						break;
					case "endTab":
						PUBLIC.count('MWD-YNJH-YJQ');
						content = end_content;
						pulldown = end_pulldown;
						template = endTemplate;
						tranType = 1;
						break;
				}
				d.refresh(name);
				// d.iScroll.refresh();
				if(!d.getListener(name)){//已结清
					d.addListener(name, {url:PUBLIC._COMMON,
		        		data : {requesturl : CONFIG.Hold_ynjhPlus_list,type:tranType},
		        		pageNo: 1,
		                pullDown: pulldown,
		                content: content,
		                template: template,
			            callback : function(){
			            	j('.vipImg').html("")
			            }
		            });
		            d.setListenerName(name);
		            d.getData();
		            // d.iScroll.refresh();
				}
			});
		},
		getCY_List : function(){
			//获取持有中
			d.refresh('holdTab');
			// d.iScroll.refresh();
			d.setListenerName('holdTab');
			if(!d.getListener('holdTab')){
				d.addListener('holdTab', {url:PUBLIC._COMMON,
		    		data : {requesturl : CONFIG.Hold_ynjhPlus_list,type:0},//type
		    		pageNo: 1,
		            pullDown: hold_content.siblings('.pulldown'),
		            content: hold_content,
		            template: holdTemplate,
		            dom : j('#holdList'),
		            callback : function(){
		            	j('#holdList').find('li').find('.detail').bind("click",function(){
		            		var o = j(this).parent('li'),
		            		proDetailExt = o.data("prodetailext");
		            		w.location.href = '/static/mobileSite/html/wmpsPlus/myWmpsPlus_detail.html?proDetailExt='+encodeURIComponent(proDetailExt)+'&platform='+platform+'&v='+Math.random();
		            	});
		            }
		        });
		        d.getData();
		        // d.iScroll.refresh();
			}
		},
		creatHelper : function(){
			var that = this;
			h.registerHelper('checkIcon',function(holdAmount,buyAmout){
				if(+(holdAmount) != +(buyAmout)){
					return "<img src='/static/mobileSite/images/bule.png' style='width:0.40rem;'>";
				}
			});
			h.registerHelper('checkDown',function(status,option){
				var str = '';//0可转让 1封闭期  2转让中 3已转让 4已到期  5审核中  6、不可转让
				if(status == "1"){
					return option.fn(this);
				}
				else{
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
			h.registerHelper('checkbuyWay',function(status){
				if(status == '2'){
					return '自动续投';
				}else if(status == '3'){
					return '余额复投';
				}else{
					return '';
				}
			});
			h.registerHelper('checkStatus',function(status,option){
				if(status == '1' || status == '4'){
					return '<strong class="strong1 strong-show">审</strong>';
				}else if(status == '2' || status == '4'){
					return '<strong class="strong-show">自动续投已开启</strong>'
				}
				/*if(status == '3' || status == '4'){//计息中
					return option.fn(this);
				}else{//审核中
					return option.inverse(this);
				}*/
			});
			h.registerHelper('checkAddRate',function(strSecInter){ // 副利率
				if(strSecInter == 0 || strSecInter == ''){
					return "";
				}else{
					return "+" + strSecInter ;
				}
			});
			h.registerHelper('checkVipRate',function(vip){
				if( vip&& vip != 0){
					return "<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
				}else{
					return "";
				}
			});
			h.registerHelper('checkAddrate',function(addquan){//加息券
				if(addquan){
					return "<img src="+that.addrateImg+" style='width:0.40rem!important;height:0.25rem'>";
				}else{
					return '';
				}
			});
		},
		init : function(){
			var that = this;
			that.getCY_List();
			that.bindEvent(),that.creatHelper();
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage,COMMON_POST);