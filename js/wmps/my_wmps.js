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
						tranType = 3;

						break;
					case "endTab":
						PUBLIC.count('MWD-YNJH-YJQ');
						content = end_content;
						pulldown = end_pulldown;
						template = endTemplate;
						tranType = 4;
						break;
				}
				d.refresh(name);
				// d.iScroll.refresh();
				if(!d.getListener(name)){//已结清
					d.addListener(name, {url:PUBLIC._COMMON,
		        		data : {requesturl : CONFIG.OverDeal_List_URL,status:tranType},
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
		    		data : {requesturl : CONFIG.HoldDeal_List_URL,status:3},//status :status 3 是持有中  4是已结清
		    		pageNo: 1,
		            pullDown: hold_content.siblings('.pulldown'),
		            content: hold_content,
		            template: holdTemplate,
		            dom : j('#holdList'),
		            callback : function(){
		            	j('#holdList').find('li').find('.detail').bind("click",function(){
		            		var o = j(this).parent('li'),
		            		id = o.attr('id'),
		            		wholeTitle = o.data("wholetitle"),
		            		effectiveamount = o.data("effectiveamount"),//出借本金
		            		strInterestrate = o.data("strinterestrate"),//预期利率
		            		realEarn = o.data("realearn"),//已获利息
		            		preEarn = o.data("preearn"),//到期利息
		            		strInterdate = o.data("strinterdate"),//到期时间
		            		strEnddate = o.data('strenddate'),//到期时间
		            		strinterestrate = o.data('strinterestrate').split('%')[0] || '',//全部利率
		            		strFirstInter = strinterestrate.split('+')[0],
		            		strSecInter = strinterestrate.split('+')[1] || '',
		            		strFirstInterdate = o.data('strfirstinterdate'),//首次付息时间
		            		vipFlag = o.data('vipflag'),
		            		addrateFlag = o.data('prizeid'),
		            		// protoUrl = encodeURIComponent(o.data('wmpsagreementholding')),
		            		status = o.data('status'),//新手标志  2：翼农计划   5：新手
		            		//协议
		            		code = o.data('code'),
		            		entryDesc = encodeURIComponent(o.data('entrydesc')),
		            		entryName = o.data('entryname'),
		            		rid=encodeURIComponent(o.data('rid')),
		            		protoUrl = '';


		            		if(code == '0'){//取不到或者 -1时隐藏
		            			protoUrl = "&protoUrl="+entryDesc;
		            		}

		            		if(vipFlag){
		            			w.location.href = '/static/mobileSite/html/wmps/myWmps_detail.html?platform='+platform+'&pid='+encodeURIComponent(id)+'&rid='+rid+"&effectiveamount="+effectiveamount+"&strInterestrate="+strInterestrate+"&realEarn="+realEarn+"&preEarn="+preEarn+"&strInterdate="+strInterdate+"&strEnddate="+strEnddate+"&strFirstInter="+strFirstInter+"&strSecInter="+strSecInter+"&vipFlag="+vipFlag+"&status="+status+"&strFirstInterdate="+strFirstInterdate+protoUrl+"&v="+Math.random()+'&addrateFlag='+addrateFlag;
		            		}else{
		            			w.location.href = '/static/mobileSite/html/wmps/myWmps_detail.html?platform='+platform+'&pid='+encodeURIComponent(id)+'&rid='+rid+"&v="+Math.random;
		            			/*+effectiveamount+"&strInterestrate="+strInterestrate
		            			+"&realEarn="+realEarn+"&preEarn="
		            			+preEarn+"&strInterdate="+strInterdate+"&strEnddate="+strEnddate+
		            			"&strFirstInter="+strFirstInter+"&strSecInter="+strSecInter+"&status="
		            			+status+"&strFirstInterdate="+strFirstInterdate+protoUrl+"&v="+Math.random()
		            			+"&addrateFlag="+addrateFlag;*/
		            		}
		            	});
		            	j('#holdList').find('li>.li-div5>.title').unbind('click').bind('click',function(){
		            		j(this).find('img').toggleClass('up');
		            		var curO = j(this).parent('.li-div5').find('.jiacontents');
		            		console.log(curO[0]);
		            		curO.toggleClass('dis_none');
		            		if($(this).hasClass('data')){
		            			$(this).removeClass('data');
		            			r.post({
		            				url:PUBLIC._COMMON,
		            				data:{requesturl:'Ls5SF9UahdpnCKMuzK0%2BxGLlQHSeMZ%2Fg',prizeIdStr:$(this).data('prizeid')},
		            				success:function(data){
		            					console.log(data);
		            					if(data.code == '0000'){
		            						data = data.data || '';
		            						curO.empty();
		            						for(var i=0,L=data.length;i<L;i++){
			            						curO.append('<div class="jiaContent">'+
													'<div>'+
														'<p>加息金额:&nbsp;<span>'+(data[i].amount||'')+'元</span></p>'+
														'<p>加息利率:&nbsp;<span>'+(data[i].couponRate||'')+'</span></p>'+
													'</div>'+
													'<div>'+
														'<p>加息天数:&nbsp;<span>'+(data[i].couponPhases||'')+'天</span></p>'+
														'<p>加息券回报:&nbsp;<span>'+(data[i].couponProearn||'')+'元</span></p>'+
													'</div>'+
													'<div>'+
														'<p>加息日期:&nbsp;<span>'+(data[i].couponCdate||'')+'</span></p>'+
														'<p>加息结束:&nbsp;<span>'+(data[i].couponEndDate||'')+'</span></p>'+
													'</div>'+
												'</div>');
		            						}
		            					}
		            				}
		            			});
		            		}else{
		            			$(this).addClass('data');
		            		}
		            	});
		            }
		        });
		        d.getData();
		        // d.iScroll.refresh();
			}
		},
		creatHelper : function(){
			var that = this;
			h.registerHelper('checkDown',function(status,option){
				var str = '';//0可转让 1封闭期  2转让中 3已转让 4已到期  5审核中  6、不可转让
				if(status == "1"){
					return option.fn(this);
				}
				else{
					return option.inverse(this);
				}
			});
			/*h.registerHelper('delPercent',function(rateStr){
				return rateStr.split('%')[0];
			});*/
			h.registerHelper('format',function(num,type){
				if(type == 'no'){
					return t.outputmoney_n(num+"");
				}else{
					return t.outputmoney(num+"");
				}
			});
			h.registerHelper('checkStatus',function(status,option){
				if(status == '3' || status == '4'){//计息中
					return option.fn(this);
				}else{//审核中
					return option.inverse(this);
				}
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
					return "+" + vip + "<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
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