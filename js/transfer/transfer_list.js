
(function(w,j,r,l,t,h,v,c,cl,d,gt){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform;
	var sesame_template = h.compile(j("#tpl_sesame_transfer").html()),
		tailor_template = h.compile(j('#tpl_tailor_tansfer').html());
	var pageUtil = {
		sortObj:{sortName:'',sortType:''},
		toIndex:j("#home_page"),
		toInvestlist:j("#investList_page"),
		toHome:j("#account_page"),
		tailor_tansfer:j("#tailor_tansfer"),
		tailor_content:j("#tailor_content"),
		sesame_tansfer:j("#sesame_tansfer"),
		sesame_content:j("#sesame_content"),
		bindEvent:function(){
			var that = this;
			that.toInvestlist.bind('click',function(){
				w.location.href = '/static/mobileSite/html/invest_list.html?platform=' + platform + '&v=' + Math.random();
			});
			that.toHome.click(function(){
				cl.check_Log(function(data){
					if(data.code == '0000'){
						w.location.href = '/static/mobileSite/html/myaccount/myaccount.html?platform=' + platform + '&v=' + Math.random();
					}
				});
			});

			that.toIndex.click(function(){
				w.location.href = '/static/mobileSite/index.html?platform='+platform + "&v=" + Math.random();
			});
			j(".sortLi").on('click',function(){
				var curObj = j(this),
					curType = j(this).data('sorttype'),
					childP = curObj.find("p"),
					sortType = that.tailor_tansfer.hasClass('active') ? 'tailor' : 'sesFame',
					f = childP.hasClass('up');
					f ? childP.removeClass('up').addClass('active down') : childP.removeClass('down').addClass('active up');
					curObj.siblings('li').find('p').removeClass('active up down');
					
				switch(curType){
					case 'normal': //不排序
						that.orderBy = '';
						break;
					case 'yqsy': //预期回报排序
						if(sortType == 'tailor'){//私人定制
							that.sortObj.sortName = '1';
							that.sortObj.sortType = f ? '2' : '1';
						}else{
							that.sortObj.sortName = 'orderBy';
							that.sortObj.sortType = f ? '11' : '10';
						}
						break;
					case 'zrje':
						if(sortType == 'tailor'){
							that.sortObj.sortName = '5';
							that.sortObj.sortType = f ? '2' : '1';
						}else{
							that.sortObj.sortName = 'orderBy';
							that.sortObj.sortType = f ? '21' : '20';
						}
						break;
					case 'syts': 
						if(sortType == 'tailor'){
							that.sortObj.sortName = '2';
							that.sortObj.sortType = f ? '2' : '1';
						}else{
							that.sortObj.sortName = 'orderBy';
							that.sortObj.sortType = f ? '31' : '30';
						}
						break;
				}
				var sendData = sortType != 'tailor' ? {requesturl : CONFIG.Transfer_InvestList_URL} : {requesturl:'mBI9zdBAgnR0RONCptStQjH%2FAQa4SD%2B1'}
				if(that.sortObj.sortName && sortType == 'tailor'){
					sendData.sortName = that.sortObj.sortName;
					sendData.sortType = that.sortObj.sortType;
				}else{
					sendData[that.sortObj.sortName] = that.sortObj.sortType;
				}
				sortType == 'tailor' ? that.get_tailor_trans_list(sendData,true) : that.get_sesame_trans_list(sendData,true);
				
			});
			that.tailor_tansfer.bind('click',function(){
				if($(this).hasClass('active')) return;
				j(".sortLi").find('p').removeClass('active up down');
				that.tailor_tansfer.addClass('active');
				that.sesame_tansfer.removeClass('active');
				that.tailor_content.removeClass('dis_none');
				that.sesame_content.removeClass('mana-show');
				d.setListenerName('tailor_tansfer');
				d.refresh('tailor_tansfer');
				var sendData = {requesturl : 'mBI9zdBAgnR0RONCptStQjH%2FAQa4SD%2B1'};
				
				that.get_tailor_trans_list(sendData,true);
			});

			that.sesame_tansfer.bind('click',function(){
				if($(this).hasClass('active')) return;
				j(".sortLi").find('p').removeClass('active up down');
				that.tailor_tansfer.removeClass('active');
				that.sesame_tansfer.addClass('active');
				that.tailor_content.addClass('dis_none');
				that.sesame_content.addClass('mana-show');
				d.setListenerName('sesame_tansfer');
				d.refresh('sesame_tansfer');
				var sendData = {requesturl : CONFIG.Transfer_InvestList_URL};
				
				that.get_sesame_trans_list(sendData,true);
			});

		},
		get_tailor_trans_list:function(sendData,sortflag){			
			var that = this;
			d.setListenerName('tailor_tansfer');
			if(!d.getListener('tailor_tansfer') || sortflag){
				j("#tailor_ul").empty();
				d.addListener('tailor_tansfer',{
	        		url : PUBLIC._COMMON,
	        		data : sendData,
	                content: j("#tailor_ul"),
	                template: tailor_template,
	                callback : function(data){
	                	var data = data.data ? data.data.list : [];
	                	if(!data || !data.length){return false;}
	                	for(var i=0,L=data.length;i<L;i++){
	                		if(data[i].status == '0'){
	                			that.transer_sort_flag = true;
	                			continue;
	                		}
	                	}
	                	j('.buy-btn').unbind('click').bind("click",function(e){
	                		var o = j(this);
							if(o.hasClass('dis_btn')) return false;
	                		e.preventDefault();
	                		var status = o.data('status'),
	                			prodDetail = o.data('proddetail'),
	                			transcreditid = o.data('transcreditid');
	                		c.check_KH(function(data){
	                			if(data.code == '0000'){
	                				if(status == '0'){//出借
	                					window.location.href = '/static/mobileSite/html/transfer/tailor_transfer_invest.html?platform='+platform+'&transCreditId='+encodeURIComponent(transcreditid);
	                				}else if(status == '2'){//取消出借
	                					gt.get_token(function(res){
					    					if(res.code == '0000'){
					    						res = res.data.token;
			                					l.alert1('确定取消转让吗？');
			                					l.setOkAction(function(){
			                						var send_cancel_data = [{prodStr:prodDetail}];
			                						send_cancel_data = $.base64.encode(JSON.stringify(send_cancel_data));
			                						
			                						r.postLayer({
														url : PUBLIC._COMMON,
														data : {
															requesturl : 'mBI9zdBAgnR0RONCptStQpge3BZMfbgT',
															cancelApply : send_cancel_data,
															token:res
														},
														success : function(data){
															if(data.code == '0000'){
																l.alertAuto("取消成功",function(){
																	location.reload(true);
																});
																// l.setKnowRedirectUrl('/static/mobileSite/html/invest_list.html?platform='+platform+"&v="+Math.random());
															}

														},
														content : '取消转让中..'
													});
			                					});
					    					}
					    				});
	                				}else{
	                					return false;
	                				}

	                			}
	                		});
	                		return false;
	                	});
                       
	                }
	        	});
		        d.setListenerName('tailor_tansfer');
		        d.getData();
			}
		},
		get_sesame_trans_list : function(sendData,sortflag){//芝麻开花转让专区列表
			var that = this;
			
			d.setListenerName('sesame_tansfer');
			if(!d.getListener('sesame_tansfer') || sortflag){
				j("#sesame_ul").empty();
	        	d.addListener('sesame_tansfer',{
	        		url : PUBLIC._COMMON,
	        		data : sendData,
	                content: j("#sesame_ul"),
	                template: sesame_template,
	                // empty:true,
	                callback : function(data){
	                	var data = data.data ? data.data.result : [];
	                	for(var i=0,L=data.length;i<L;i++){
	                		if(data[i].status == '0'){
	                			that.transer_sort_flag = true;
	                			continue;
	                		}
	                	}
	                	
	                	j('.transfer-sub').bind("click",function(e){
	                		e.preventDefault();
	                		var o = j(this);
	                		var id = o.parents('li.mana-child-li').data('jump');
	                			status = o.data('status');
	                		var recordId = o.attr("data-recordId"),accId = o.attr("data-accId"),userId = o.attr("data-userId");
	                		c.check_KH(function(data){
	                			if(data.code == '0000'){
	                				if(status == '0'){//出借
	                					window.location.href = PUBLIC.URL + "/static/mobileSite/html/transfer/transfer_invest.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&recordId="+recordId+"&accId="+accId+"&userId="+userId;
	                				}else{//取消出借
	                					l.alert1('确定取消转让吗？');
	                					l.setOkAction(function(){

	                						requestUtil.postLayer({
												url : PUBLIC._COMMON,
												data : {
													requesturl : 'ok8XdMSuHBDXgDlyq889Qn2sbh9qhErs',
													productId : id,
													accId : accId//转让账号ID
												},
												success : function(data){
													if(data.code == '0000'){
														l.alertAuto("取消成功",function(){
															location.reload(true);
														});
														// l.setKnowRedirectUrl('/static/mobileSite/html/invest_list.html?platform='+platform+"&v="+Math.random());
													}

												},
												content : '取消转让中..'
											});
	                					});
	                				}

	                			}
	                		});
	                	});
	                }
	        	});
		        // }
		        d.setListenerName('sesame_tansfer');
		        d.getData();
		    }
		},
		creatHealper : function(){
			var that = this;
			Handlebars.registerHelper('restAmount',function(maxAmount,amount){
				var restAmount = (((maxAmount||"") - (amount||""))/10000) || 0;
				return t.outputmoney(restAmount.toFixed(2));
			});
			h.registerHelper('format1',function(amount,flag){
				if(!flag){
					return t.outputmoney_n(amount);
				}else{
					return t.outputmoney(amount);
				}
			});
			Handlebars.registerHelper('format',function(date){
				return date.split('天')[0] || '-';
			});
			Handlebars.registerHelper('checkStatus',function(status,flag,option){
				if(status != "1"){
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
				if(status == "0"){//可转让
					return '出借';
				}else if(status == '1'){//已转出
					return '已转出';
				}else if(status == '2'){//取消转让
					return '取消';
				}
			});

			Handlebars.registerHelper('jump',function(id,flag,transCreditId,accId,recordId,userId){
				if(flag == 'tailorTrans'){
					return PUBLIC.URL + "/static/mobileSite/html/transfer/tailor_transfer_detail.html?transCreditId="+encodeURIComponent(transCreditId)+"&platform="+platform;
				}else if(flag == "sesameTrans"){
					return PUBLIC.URL + "/static/mobileSite/html/transfer/transfer_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform+"&accId="+accId+"&recordId="+recordId+"&userId="+userId;
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
			Handlebars.registerHelper('checkAddRate',function(addRate,option){
				if(addRate){
					var addRate = +(addRate.split('+')[0]);
					if(addRate> 0){
						return option.fn(this);
					}else{
						return option.inverse(this);
					}	
				}else{
					return option.inverse(this);
				}
			});
			Handlebars.registerHelper('checkVipRate',function(status,flag,option){
				if(that.vipValue){
					if((status == "0" && flag == "transfer") || (status == "2" && flag == "transfer") || (flag == "tailor" && status == '0') || (flag == 'tailor' && status == '2')){
						return "+<em>"+that.vipValue+"</em><img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
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
		init:function(){
			var that = this;
			that.bindEvent();
			that.creatHealper();
			v.checkVip(function(data){//检测是否有vip利率
				if(data.code == '0000'){
					data = data.data;
					var vipRate = data.vipRate;
					if(vipRate && parseFloat(vipRate)>0){
						that.vipValue = vipRate;
						that.vipImg = "/static/mobileSite/images/v.png";
					}else{
						that.vipValue = "";
					}
					that.get_sesame_trans_list({requesturl : CONFIG.Transfer_InvestList_URL});
				}
			});
			
		}
	}
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,COMMON_POST,COMMON_KH,COMMON_Login,dataPage,GET_Token);
