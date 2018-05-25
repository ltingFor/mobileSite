(function(w,j,r,l,t,h,d,v,c,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		wmps_template = h.compile(j("#tpl_wmps").html()),
		wmpsPlus_template = h.compile(j("#tpl_wmpsPlus").html()),
		tailor_template = h.compile(j("#tpl_tailor").html()),
		tailor_end_template = h.compile(j("#tpl_tailor_end").html()),
		sesame_template = h.compile(j("#tpl_sesame").html());
	var sortUtil = {
		trans_sort: j("#trans_sort"),
		orderBy : '',
		bindEvent : function(){
			var that = this;
			j(".sortLi").on('click',function(){
				var curObj = j(this),
					curType = j(this).data('sorttype');

				switch(curType){
					case 'normal': //不排序
						if(curObj.hasClass('sortimgnormal')){
							curObj.addClass('sortup');
							curObj.siblings('li').removeClass('sortup').removeClass('sortdown').addClass('sortimgnormal');
						}
						that.orderBy = '';
						break;
					case 'yqsy': //预期回报排序
						if(curObj.hasClass('sortdown')){
							curObj.removeClass('sortdown').addClass('sortup');
							that.orderBy = '10';//正序
						}else if(curObj.hasClass('sortimgnormal')){
							curObj.addClass('sortup').removeClass('sortimgnormal');
							curObj.siblings('li').removeClass('sortup').removeClass('sortdown').addClass('sortimgnormal');
							that.orderBy = '10';//正序
						}else if(curObj.hasClass('sortup')){
							curObj.removeClass('sortup').addClass('sortdown');
							that.orderBy = '11';//降序
						}
						break;
					case 'zrje':
						if(curObj.hasClass('sortdown')){
							curObj.removeClass('sortdown').addClass('sortup');
							that.orderBy = '20';//正序
						}else if(curObj.hasClass('sortimgnormal')){
							curObj.addClass('sortup').removeClass('sortimgnormal');
							curObj.siblings('li').removeClass('sortup').removeClass('sortdown').addClass('sortimgnormal');
							that.orderBy = '20';//正序
						}else if(curObj.hasClass('sortup')){
							curObj.removeClass('sortup').addClass('sortdown');
							that.orderBy = '21';//降序
						}
						break;
					case 'syts':
						if(curObj.hasClass('sortdown')){
							curObj.removeClass('sortdown').addClass('sortup').removeClass('sortimgnormal');
							that.orderBy = '30';//正序
						}else if(curObj.hasClass('sortimgnormal')){
							curObj.addClass('sortup').removeClass('sortimgnormal');
							curObj.siblings('li').removeClass('sortup').removeClass('sortdown').addClass('sortimgnormal');
							that.orderBy = '30';//正序
						}else if(curObj.hasClass('sortup')){
							curObj.removeClass('sortup').addClass('sortdown').removeClass('sortimgnormal');
							that.orderBy = '31';//降序
						}
						break;
				}
				var sendData = {
					requesturl : CONFIG.Transfer_InvestList_URL
				}
				if(that.orderBy){
					sendData.orderBy = that.orderBy;
				}
				pageUtil.getTransferList(sendData);
			});
		},
		/*getOrderLock : function(){//转让专区的开关
			var that = this;
			r.post({
				url : PUBLIC._COMMON,
				data: {
					requesturl : 'ok8XdMSuHBCoHXrZACvtgTFiHCxGwSf5'
				},
				success : function(data){
					if(data.code == '0000'){
						if(data.data.switch_zone_sort == '1'){
							pageUtil.marginTopValue = '2.2rem';
							that.trans_sort.removeClass('dis_none');
						}else{
							pageUtil.marginTopValue = '1.3rem';
							that.trans_sort.addClass('dis_none');
						}
					}else{
						pageUtil.marginTopValue = '1.3rem';
						that.trans_sort.addClass('dis_none');
					}
				}
			});
		},*/
		init : function(){
			var that = this;
			// that.getOrderLock();
			that.bindEvent();
		}
	};
	sortUtil.init();
	var pageUtil = {
		tabs : j(".mana-head>li"),
		wmps : j("li[data-tab=#wamps]"),
		wmpsPlus : j("li[data-tab=#wampsPlus]"),
		sesame : j("li[data-tab=#sesame]"),
		tailor : j("li[data-tab=#tailor]"),
		transfer : j("li[data-tab=#transfer]"),
		tabContent : j(".mana-detail"),
		wmpsWrap : j("#wamps"),
		wmpsPlusWrap : j("#wampsPlus"),
		sesameWrap : j("#sesame"),
		tailorWrap : j("#tailor"),
		transferWrap : j("#transfer"),
		wmpsContent : j("#wamps_content"),
		wmpsPlusContent : j("#wampsPlus_content"),
		sesameContent : j("#sesame_content"),
		tailorContent : j("#tailor_content"),
		transferContent : j("#transfer_content"),
		vipValue : 0,
		vipImg : '',
		marginTopValue:'1.3rem',
		transer_sort_flag:false,
		bindEvent : function(){
			var that = this;
			that.wmps.bind('click',function(){//获取s翼农计划投资列表
				j("#scroller").css({'margin-top':'1.3rem'});
				j('.sort').addClass('dis_none');//转让的排序
				PUBLIC.count('MTZ-YNJH');
				that.tabs.removeClass("mana-h-show");
				that.tabContent.removeClass("mana-show");
				that.wmps.addClass('mana-h-show');
				that.wmpsWrap.addClass('mana-show');
				sessionStorage.setItem('current', that.wmps.attr('data-tab'));
				d.setListenerName('wmps');
				d.refresh('wmps');
				that.getWmpsList();
			});
			that.wmpsPlus.bind('click',function(){
				j("#scroller").css({'margin-top':'1.3rem'});
				j('.sort').addClass('dis_none');//转让的排序
				that.tabs.removeClass("mana-h-show");
				that.tabContent.removeClass("mana-show");
				that.wmpsPlus.addClass('mana-h-show');
				that.wmpsPlusWrap.addClass('mana-show');
				sessionStorage.setItem('current', that.wmpsPlus.attr('data-tab'));
				d.setListenerName('wmpsPlus');
				d.refresh('wmpsPlus');
				that.getWmpsPlusList();
			});

			that.sesame.bind("click",function(){
				j("#scroller").css({'margin-top':'1.3rem'});
				j('.sort').addClass('dis_none');//转让的排序
                PUBLIC.count('MTZ-ZMKH');
				if(j(this).hasClass('mana-h-show')){
					return false;
				}
				that.tabs.removeClass("mana-h-show");
				that.tabContent.removeClass("mana-show");
				that.sesame.addClass('mana-h-show');
				that.sesameWrap.addClass('mana-show');

				d.setListenerName('sesame');
				d.refresh('sesame');
				if(!d.getListener('sesame')){//获取芝麻开花投资列表
		        	d.addListener('sesame',{
		        		url : PUBLIC._COMMON,
		        		data : {requesturl : CONFIG.Sesame_InvestList_URL},
		        		pullDown: that.sesameContent.siblings('.pulldown'),
		                content: that.sesameContent,
		                template: sesame_template,
		                callback : function(){
		                	j('.sesame-sub').click(function(){
                                PUBLIC.count('MTZ-ZMKH-TZ');
		                		var id = j(this).parents('li.mana-child-li').data('jump');
		                		c.check_KH(function(data){
		                			if(data.code == '0000'){
		                				window.location.href = PUBLIC.URL + "/static/mobileSite/html/sesame/sesame_invest.html?platform="+platform+"&pid="+encodeURIComponent(id);
		                			}
		                		});
		                		return false;
		                	});
                            j('#sesame_content li').bind("click",function(){
                                PUBLIC.count('MTZ-ZMKH-XQ');
                            });
		                }
		        	});
		        }
	        	d.setListenerName('sesame');
	        	d.getData();
	        	sessionStorage.setItem('current', that.sesame.attr('data-tab'));
			});
			that.tailor.bind("click",function(){
				j("#scroller").css({'margin-top':'1.3rem'});
				j('.sort').addClass('dis_none');//转让的排序
				PUBLIC.count('MTZ-TAILOR');
				that.tabs.removeClass("mana-h-show");
				that.tabContent.removeClass("mana-show");
				that.tailor.addClass('mana-h-show');
				that.tailorWrap.addClass('mana-show');
				sessionStorage.setItem('current', that.tailor.attr('data-tab'));
				d.setListenerName('tailor');
				d.refresh('tailor');
				that.getTailorList();
			});
		},
		//=============翼农计划+==============
		getWmpsPlusList:function(){//翼农计划+列表
			var that = this;
			if(!d.getListener('wmpsPlus')){
				d.addListener('wmpsPlus', {url:PUBLIC._COMMON,
            		data : {requesturl : CONFIG.InvestList_WmpsPlus_URL},
            		pageNo: 1,
            		pageSize:10,
	                content: this.wmpsPlusContent,
	                template: wmpsPlus_template,
	                callback : function(){
	                	j('.wmps-sub').click(function(){
	                		var prodDetail = j(this).parents('li.mana-child-li').data('jump');
	                		c.check_KH(function(data){
	                			if(data.code == '0000'){
	                				window.location.href = PUBLIC.URL + "/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html?platform="+platform+"&prodDetail="+encodeURIComponent(prodDetail)+"&v="+Math.random();
	                			}
	                		});
	                		return false;
	                	});
	                }
	            });
	            d.setListenerName('wmpsPlus');
	            d.getData();
			}
		},
		getWmpsList : function(){//翼农计划列表
			var that = this;
			if(!d.getListener('wmps')){
				d.addListener('wmps', {url:PUBLIC._COMMON,
            		data : {requesturl : CONFIG.InvestList_Wmps_URL},
            		pageNo: 1,
            		pageSize:10,
	                pullDown: this.wmpsContent.siblings('.pulldown'),
	                content: this.wmpsContent,
	                template: wmps_template,
	                callback : function(){
	                	j('.wmps-sub').click(function(){
                            PUBLIC.count('MTZ-YNJH-MSTZ');
	                		var id = j(this).parents('li.mana-child-li').data('jump');
	                		c.check_KH(function(data){
	                			if(data.code == '0000'){
	                				window.location.href = PUBLIC.URL + "/static/mobileSite/html/wmps/wmps_invest.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&v="+Math.random();
	                			}
	                		});
	                		return false;
	                	});
                        j('#wamps_content li').bind("click",function(){
                            PUBLIC.count('MTZ-YNJH-XQ');
                        });
	                }
	            });
	            d.setListenerName('wmps');
	            d.getData();
			}
		},
		getTailorList : function(){//私人定制列表
			var that = this;
			if(!d.getListener('tailor')){
				d.addListener('tailor', {url:PUBLIC._COMMON,
            		data : {requesturl : CONFIG.InvestList_Tailor_URL},
            		pageNo: 1,
            		pageSize:10,
	                pullDown: this.tailorContent.siblings('.pulldown'),
	                content: this.tailorContent,
	                template: tailor_template,
	                callback_err:function(data){
	                	var tailor = d.getListener('tailor');
	                	tailor.template = tailor_end_template;
	                	if (data.messageData && data.messageData.data) {
	                		tailor.content.empty().append(tailor.template(data.messageData.data.list));
	                	}else{
	                		tailor.content.empty().append(tailor.template([]));
	                	}

	                },
	                callback : function(data){
	                	if(data.code != '0000'){
	                		var tailor = d.getListener('tailor');
		                	tailor.template = tailor_end_template;
		                	tailor.content.empty().append(tailor.template(data.messageData.data.list));
	                	}
	                	j('.tailor-sub').click(function(){
                            PUBLIC.count('MTZ-TAILOR-MSTZ');
	                		var id = j(this).parents('li.mana-child-li').data('jump');

	                		c.check_KH(function(data){
	                			if(data.code == '0000'){
	                				window.location.href = PUBLIC.URL + "/static/mobileSite/html/tailor/tailor_invest.html?platform="+platform+"&pid="+encodeURIComponent(id);
	                			}
	                		});
	                		return false;
	                	});
                        j('.tailor').unbind('click').bind("click",function(){
                        	window.currentTailor = j(this).parents('li');
	                		j("#gwc .num").removeClass('bounce animated');
                        	j('.keybordwrap #targetObj').html(''+j(this).parents('li').prop('outerHTML')+'');
                        	j('.keybordwrapLayer').fadeIn('slow');
                        	$('.keybord .je').text('');
                        	$('.keybordwrap').animate({'bottom':'0'}, "slow" ,function(){});


                        });
	                }
	            });
	            d.setListenerName('tailor');
	            d.getData();
			}

		},
		creatHealper : function(){
			var that = this;
			Handlebars.registerHelper('restAmount',function(maxAmount,amount){
				var restAmount = (((+maxAmount) - (+amount))/10000) || 0;
				return t.outputmoney(restAmount.toFixed(2));
			});
			Handlebars.registerHelper('restAmount1',function(maxAmount,amount){
				var restAmount = ((+maxAmount) - (+amount)) || 0;
				return t.outputmoney(restAmount.toFixed(2));
			});
			h.registerHelper('format1',function(amount){
				return t.outputmoney_n(amount);
			});
			Handlebars.registerHelper('format',function(date){
				return date.split('天')[0] || '-';
			});
			Handlebars.registerHelper('checkStatus',function(status,flag,option){
				if((status == "1" && flag == "wmps") || (status == "pub" && flag == "sesame") || (status == "0" && flag == "transfer") || (status == "2" && flag == "transfer")){
					return option.fn(this);
				}
				else{
					return option.inverse(this);
				}
			});
			//判断是否有加息标
			Handlebars.registerHelper('checkAddRateImg',function(icon,option){
				if(icon){
					return option.fn(this);
				}else{
					return option.inverse(this);
				}
			});
			Handlebars.registerHelper('checkBtnStatus',function(status,option){
				if(status == "0"){
					return option.fn(this);
				}else{
					return option.inverse(this);
				}
			});

			Handlebars.registerHelper('jump',function(id,flag,recordId,accId,userId,prodDetail){
				if(flag == 'wmps'){
					return PUBLIC.URL + "/static/mobileSite/html/wmps/wmps_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform+"&v="+Math.random();
				}else if(flag == 'wmpsplus'){
					return PUBLIC.URL + "/static/mobileSite/html/wmpsPlus/wmpsPlus_detail.html?prodDetail="+encodeURIComponent(prodDetail)+"&platform="+platform+"&v="+Math.random();
				}else if(flag == "sesame"){
					return PUBLIC.URL + "/static/mobileSite/html/sesame/sesame_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform+"&v="+Math.random();
				}else if(flag == "zqxq"){
					return PUBLIC.URL + "/static/mobileSite/html/tender/tender_detail.html?tid="+encodeURIComponent(id)+"&platform="+platform+"&v="+Math.random();
				}else{
					return PUBLIC.URL + "/static/mobileSite/html/transfer/transfer_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform+"&recordId="+recordId+"&accId="+accId+"&userId="+userId+"&v="+Math.random();
				}
			});
			Handlebars.registerHelper('splitStr',function(str,flag){//此做法是针对 后台返回格式不统一的处理 返回字符串中没有付利率， 有副利率时 11+1.5,无副利率时 11%
				if(flag == 1){//主利率
					var arr = str.split('+');
					if(arr.length == 1){
						return arr[0].split('%')[0];
					}else{
						return arr[0];
					}
				} else if(flag == 5){ // 芝麻开花副利率
					if(str == 0){
						return '';
					}else{
						return "+"+str;
					}
				}
				else{//副利率
					var arr = str.split('+'),subStr = '';
					if(arr.length >=2){
						return "%+"+arr[1];
					}else{
						return '%';
					}
				}
			});
			Handlebars.registerHelper('checkAdd',function(rate){
				if(+(rate)){
					return '+'+rate;
				}else{
					return '';
				}
			});
			Handlebars.registerHelper('checkVipRate',function(status,flag,option){
				if(that.vipValue){
					if((status == "1" && flag == "wmps") || (status == "pub" && flag == "sesame") || (status == "0" && flag == "transfer") || (status == "2" && flag == "transfer") || (flag == "tailor")){
						return "+"+that.vipValue+"<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
					}
					else{
						return "+<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
					}
					//return "+"+that.vipValue+"<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
				}else{
					return "";
				}
			});
		},
		init : function(){
			var that = this;

			v.checkVip(function(data){//检测是否有vip利率
				if(data.code == '0000'){
					data = data.data;
					var vipRate = data.vipRate;
					if(vipRate && parseFloat(vipRate)>0){
						that.vipValue = vipRate;
						// that.vipImg = data.vipImg;
						that.vipImg = "/static/mobileSite/images/v.png";
					}else{
						that.vipValue = "";
					}
					//that.vipValue = "0.5";//测试用
					if(sessionStorage.getItem('current') == '#wmps' || sessionStorage.getItem('current') == 'null' || sessionStorage.getItem('current') == 'undefined' || !sessionStorage.getItem('current')) {
						that.getWmpsList();
					}
				}
			});
			j('#transList_page').bind('click',function(){
				window.location.href = '/static/mobileSite/html/transfer/transfer_list.html?platform='+platform+"&v="+Math.random();
			});
			j('#account_page').click(function(){
				PUBLIC.count('MWD');
				sessionStorage.removeItem('current');
				cl.check_Log(function(data){
					if(data.code == '0000'){
						w.location.href = '/static/mobileSite/html/myaccount/myaccount.html?platform=' + platform + '&v=' + Math.random();
					}
				});
			});

			j("#home_page").click(function(){
				PUBLIC.count('MSHOUYE');
				sessionStorage.removeItem('current');
				w.location.href = '/static/mobileSite/index.html?platform='+platform + "&v=" + Math.random();
			});
			that.creatHealper(),that.bindEvent();
			if(sessionStorage.getItem('current')){
				j('.mana-head li').each(function(i,e){
					if(j(e).attr('data-tab') == sessionStorage.getItem('current')){
						if(sessionStorage.getItem('current') == '#transfer'){
							j("#scroller").css({'margin-top':that.marginTopValue});
						}
						$(e).trigger('click');
					}
				})
			}
			//记录tab 选中状态结束
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,dataPage,COMMON_POST,COMMON_KH,COMMON_Login);
