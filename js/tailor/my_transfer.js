(function(w,j,r,t,l,h,d){
	'use strict'
	var param_obj = t.getParams();
	var pid = decodeURIComponent(param_obj.pid || ''),platform = param_obj.platform;
	var type = 0, sort_cdate = 2, sort_amount = 2;
	var pageUtil= {
		hold_content:j('#holdList'),
		trans_content:j("#transferList"),
		end_content:j("#endList"),

		sec_hold_content:j('#sec_holdList'),
		sec_trans_content:j("#sec_transferList"),
		sec_end_content:j("#sec_endList"),

		holdTemplate:h.compile(j("#tpl_hold").html()),
		transTemplate:h.compile(j("#tpl_trans").html()),
		endTemplate:h.compile(j("#tpl_end").html()),

		sendData : {},
		secon_sendData:{
			'listenerName':'sec_holdTab',
			'sendData':{requesturl : "mBI9zdBAgnR0RONCptStQtq7eDI%2BAWPA",rangType: 0,filterType:1},
			'content':j('#sec_holdList'),
			'template':h.compile(j("#tpl_sec_hold").html()),
			callback:function(data){
				j('.mySesame-detail').click(function(){
					var type = j(this).parents('div').attr('data'),rangType = '';
					if(type == 'sec_holdTab'){rangType = '1'}
					else if(type == 'sec_transferTab'){rangType = '2'}
					else if(type == 'sec_endTab'){rangType = '3'}
            		var tid = j(this).attr('tid'),tenderPaymentExt = j(this).attr('tenderext'),proddetail=j(this).data('proddetail');
            		window.location.href = "/static/mobileSite/html/tender/tailor_trans_detail.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&transType=sec_hold&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random();
            		// window.location.href = "/static/mobileSite/html/tender/tender_detail_srdz.html?platform="+platform+"&tid="+encodeURIComponent(tid)+'&transType='+rangType+"&tenderPaymentExt="+tenderPaymentExt;
            		return false;
            	});
            	t.pauseCountDown();
            	t.refreshEnd();
        		t.countDown(1);
			}
		},
		first_sendData:{},
		orderObj:{key:'',value:'',first_sec_flag:'first',type_flag:'holdTab'},

		sec_holdTemplate:h.compile(j("#tpl_sec_hold").html()),
		sec_transTemplate:h.compile(j("#tpl_sec_trans").html()),
		sec_endTemplate:h.compile(j("#tpl_sec_end").html()),

		Tabs:j(".myper-statetab").find("li"),
		bigTabs:j('.myper-headertab').find('li'),
		sortCondition:j(".myper-ordertab").find("li"),
		bindEvent:function(){
			var that = this;
			//一手  二手
			that.bigTabs.bind('touchstart',function(){
				var o = j(this),f=o.attr('data');
				o.addClass('active');
				o.siblings('li').removeClass('active');
				that.orderObj.first_sec_flag = f;

				j(".myper-statetab").addClass('dis_none');
				j('#'+f+'Trans').removeClass('dis_none');

				j('.listConents').addClass('dis_none');
				j("."+f+'_contents').removeClass('dis_none');
				if(f == 'first'){
					j('ul.second').addClass('dis_none');
					j('ul.first').removeClass('dis_none');
				}else{
					j('ul.first').addClass('dis_none');
					j('ul.second').removeClass('dis_none');
				}
				f == 'first' ? j("li[data=holdTab]").trigger('touchstart') : j("li[data=sec_holdTab]").trigger('touchstart');
				that.orderObj.type_flag = f == 'first' ? 'holdTab' : 'sec_holdTab';
			});
			//排序
			that.sortCondition.bind('touchstart',function(){
				var o = j(this),type = o.data('name');
				o.addClass('active');
				if(o.hasClass('up_p')){
					o.addClass('down_p').removeClass('up_p');
				}else{
					o.addClass('up_p').removeClass('down_p');
				}
				o.siblings('li').removeClass('active up_p down_p'); 
				if(that.orderObj.first_sec_flag == 'first'){
					if(that.orderObj.type_flag == 'holdTab' || that.orderObj.type_flag == 'endTab'){
						if(type == 'time'){
							that.first_sendData.sendData.cdate = o.hasClass('up_p') ? 1 : 2;
							delete that.first_sendData.sendData.amount;
						}else{
							that.first_sendData.sendData.amount = o.hasClass('up_p') ? 1 : 2;
							delete that.first_sendData.sendData.cdate;
						}
					}else if(that.orderObj.type_flag == 'transferTab'){
						if(type == 'time'){
							that.first_sendData.sendData.sortName = 'buyTime';
							that.first_sendData.sendData.sortType = o.hasClass('up_p') ? 1 : 2;
						}else{
							that.first_sendData.sendData.sortName = 'amoutStr';
							that.first_sendData.sendData.sortType = o.hasClass('up_p') ? 1 : 2;
						}
					}
					
					switch(that.orderObj.type_flag){
						case 'holdTab':that.hold_content.empty();break;
						case 'transferTab': that.trans_content.empty();break;
						case 'endTab': that.end_content.empty();break;
					}
					that.get_list(that.first_sendData,1);
				}else if(that.orderObj.first_sec_flag == 'second'){
					
					if(type == 'time'){
						that.secon_sendData.sendData.sortName = 'buyTime';
					}else if(type == 'benjin'){
						that.secon_sendData.sendData.sortName = 'amoutStr';
					}else{
						that.secon_sendData.sendData.sortName = 'expireDateStr';
					}
					that.secon_sendData.sendData.sortType = o.hasClass('up_p') ? 1 : 2;
					switch(that.orderObj.type_flag){
						case 'sec_holdTab': that.sec_hold_content.empty();break;
						case 'sec_transferTab': that.sec_trans_content.empty();break;
						case 'sec_endTab': that.sec_end_content.empty();break;
					}
					that.get_list(that.secon_sendData,1);
				}
			});
			//持有中，转让中，已结清切换
			that.Tabs.bind("touchstart",function(){
				that.sortCondition.removeClass('active up_p down_p');
				j("li[data-name=time]").addClass('active down_p');
				var o = j(this),flag = o.attr("data"),firsTab_select_flag=j('li[data=first]').hasClass('active');
				o.addClass('active');
				o.siblings('li').removeClass("active");
				firsTab_select_flag ? j('.first_contents').find('.plan-handle').removeClass("plan-show") : j('.second_contents').find('.plan-handle').removeClass("plan-show");
				j("div[data="+flag+"]").addClass("plan-show");

				d.setListenerName(flag);
				d.refresh(flag);
				that.orderObj.type_flag = flag;
				switch(flag){
					case "holdTab":
						that.hold_content.empty();
						that.sendData = {
							listenerName:'holdTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQpE0tM%2BXNNDc",type: 0,cdate:2},
							content:that.hold_content,
							template:that.holdTemplate,
							callback:function(data){
								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=holdTab] .mySesame-detail .li-div2').click(function(){
				            		var id = j(this).attr('id'),accId = j(this).data('accid');
				            		window.location.href = "/static/mobileSite/html/tailor/my_tailor_tenderlist.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&type=0&accId="+accId;
				            		return false;
				            	});
							}
						};
						that.first_sendData = that.sendData;
						break;
					case "transferTab":
						that.trans_content.html('');
						that.sendData = {
							listenerName:'transferTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQnLkRktKMQgQ",rangType:7,sortName:'buyTime',sortType:2},
							content:that.trans_content,
							template:that.transTemplate,
							callback:function(data){
								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=transferTab] .li-div2').click(function(){
									var o = j(j(this).parents("li")[0]);
				            		var tid = o.attr('tid'),tenderPaymentExt=o.attr('tenderext'),proddetail = o.attr('proddetail'),xieyiUrl = encodeURIComponent(o.data('xieyiurl'));
				            		window.location.href = "/static/mobileSite/html/tender/tailor_trans_detail.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&tenderPaymentExt="+tenderPaymentExt+"&v="+Math.random()+"&proddetail="+encodeURIComponent(proddetail)+"&xieyiUrl="+xieyiUrl;
				            		return false;
				            	});
				            	j('li>.li-div5>.title').unbind('click').bind('click',function(){
				            		j(this).find('img').toggleClass('up_p');
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
															'<p>加息金额:&nbsp;<span>'+(t.outputmoney_n(data.amoutStr||''))+'元</span></p>'+
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
				            		}
				            	});
				            	t.pauseCountDown();
				            	t.refreshEnd();
			            		t.countDown();
							}
						};
						that.first_sendData = that.sendData;
						
						break;
					case "endTab":
						that.end_content.empty();
						that.end_content.html('');
						that.sendData = {
							listenerName:'endTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQpE0tM%2BXNNDc",type: 1,cdate:2},
							content:that.end_content,
							template:that.endTemplate,
							callback:function(data){
								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=endTab] .mySesame-detail .li-div2').click(function(){
				            		var id = j(this).attr('id'),accId = j(this).data('accid');
				            		window.location.href = "/static/mobileSite/html/tailor/my_tailor_tenderlist.html?platform="+platform+"&pid="+encodeURIComponent(id)+"&type=0&accId="+accId+"&comfrom=end";
				            		return false;
				            	});
							}
						};
						that.first_sendData = that.sendData;
						break;
					case "sec_holdTab":
						that.sec_hold_content.empty();
						that.sendData = {
							listenerName:'sec_holdTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQtq7eDI%2BAWPA",rangType: 0,filterType:1,sortName:'buyTime',sortType:2},
							content:that.sec_hold_content,
							template:that.sec_holdTemplate,
							callback:function(data){

								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=sec_holdTab] .mySesame-detail').click(function(){
									var tid = j(this).attr('tid'),tenderPaymentExt = j(this).attr('tenderext'),proddetail=j(this).data('proddetail'),xieyiUrl=encodeURIComponent(j(this).data('xieyiurl'));
				            		window.location.href = "/static/mobileSite/html/tender/tailor_trans_detail.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&transType=sec_hold&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random()+"&xieyiUrl="+xieyiUrl
				            		return false;
				            	});
				            	t.pauseCountDown();
				            	t.refreshEnd();
			            		t.countDown(1);

							}
						};
						that.secon_sendData = that.sendData;
						break;
					case "sec_transferTab":
						that.sec_trans_content.empty();
						that.sendData = {
							listenerName:'sec_transferTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQtq7eDI%2BAWPA",rangType:1,sortName:'buyTime',sortType:2},
							content:that.sec_trans_content,
							template:that.sec_transTemplate,
							callback:function(data){
								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=sec_transferTab] .mySesame-detail').click(function(){
				            		var tid = j(this).attr('tid'),tenderPaymentExt = j(this).attr('tenderext'),proddetail=j(this).data('proddetail'),xieyiUrl=encodeURIComponent(j(this).data('xieyiurl'));
				            		window.location.href = "/static/mobileSite/html/tender/tailor_trans_detail.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&transType=sec_hold&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random()+"&xieyiUrl="+xieyiUrl
				            		return false;
				            	});
								t.pauseCountDown();
				            	t.refreshEnd();
			            		t.countDown();
							}
						};
						that.secon_sendData = that.sendData;
						break;
					case 'sec_endTab':
						that.sec_end_content.empty();
						that.sendData = {
							listenerName:'sec-endTab',
							sendData:{requesturl : "mBI9zdBAgnR0RONCptStQtq7eDI%2BAWPA",rangType: 2,sortName:'buyTime',sortType:2},
							content:that.sec_end_content,
							template:that.sec_endTemplate,
							callback:function(data){
								if(data.code != '0000'){
									j(".myper-ordertab").hide();
								}else{
									j(".myper-ordertab").show();
								}
								j('div[data=sec_endTab] .mySesame-detail').click(function(){
				            		var tid = j(this).attr('tid'),tenderPaymentExt = j(this).attr('tenderext'),proddetail=j(this).data('proddetail'),xieyiUrl = encodeURIComponent(j(this).data('xieyiurl'));
				            		window.location.href = "/static/mobileSite/html/tender/tender_detail_srdz.html?platform="+platform+"&tid="+encodeURIComponent(tid)+"&transType=sec_hold&tenderPaymentExt="+tenderPaymentExt+"&proddetail="+encodeURIComponent(proddetail)+"&v="+Math.random()+"&wmpsAgreeMentHolding="+xieyiUrl;
				            		return false;
				            	});
							}
						};
						that.secon_sendData = that.sendData;
						break;
				}
				that.get_list(that.sendData,true);
			});
		},
		get_list:function(obj,flag){
			if(!d.getListener(obj.listenerName) || flag){
				d.addListener(obj.listenerName, {url:PUBLIC._COMMON,
		    		data : obj.sendData,
		            content: obj.content,
		            template: obj.template,
		            callback : obj.callback,
		            callback_err:function(){
		            	j(".myper-ordertab").hide();
		            }
		        });	
		        d.setListenerName(obj.listenerName);
		        d.getData();
			}
		},
		creatHelper:function(){
			h.registerHelper('format',function(num,type){
				if(type == 'no'){
					return t.outputmoney_n(num+"");
				}else{
					return t.outputmoney(num+"");
				}
			});
			h.registerHelper('checkTransNum',function(val){
				console.log(val);
				if(val && +(val)>0){
					return '(可转'+val+'个)';
				}
			});
			h.registerHelper('formatVip',function(allrate,vipRate){
				vipRate = +(vipRate);
				if(vipRate){
					return allrate+"<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>";
				}else{
					return allrate;
				}
			});
			h.registerHelper('checkJiaxiStatus',function(status,option){
				if(status){
					return option.fn(this);
				}else{
					return option.inverse(this);
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
			h.registerHelper('checkCloseTime',function(timeTamp,option){
				timeTamp = +(timeTamp);
				if(timeTamp){
					return option.fn(this);
				}else{
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
		},
		get_user_money:function(){
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.MyAvalabelMoney_URL,
					pid : pid
				},
				success : function(data){
					if(data.code == "0000"){
						data = data.data;
						var balanceValue = data.useableAmt || 0;
						touziUtil.balance = balanceValue;
						// balanceValue = 12034;///****测试用
						j("#userAmount").html(balanceValue);

						tmp.push(balanceValue);//账户余额

						var min_tem = tmp[0];
						for(var i=1;i<tmp.length;i++){
							if(min_tem>tmp[i]){
								min_tem=tmp[i];
							}
						}
						touziUtil.maxAmount = Math.floor(min_tem / 100) * 100;
					}else{

						touziUtil.maxAmount = 0;
						l.alert2(data.message);
					}
					touziUtil.init();
				}
			});
		},
		init:function(){
			var that = this;
			that.creatHelper();
			that.bindEvent();
			j("li[data=holdTab]").trigger('touchstart');
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Tools,Layer,Handlebars,dataPage);
