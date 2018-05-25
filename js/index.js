(function(w,j,r,l,t,h,c,k,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		_CODE = param_obj.code,//用于判断是否session失效 超时
		openSkipUrl = decodeURIComponent(param_obj.openSkipUrl),	
		userType = decodeURIComponent(param_obj.userType),
		banner_template = h.compile(j("#tpl_banner").html());
		if(openSkipUrl){
			openSkipUrl = decodeURIComponent(param_obj.openSkipUrl);
		}else{
			openSkipUrl = "";
		}
	var pageUtil = {
		account_page : j("#account_page"),
		investList_page : j("#investList_page"),
		transList_page:j("#transList_page"),
		subRate : j("#subRate"),
		vipRateImg : j("#vipRateImg"),
		investBtn : j(".investSub"),
		meng : j('.meng'),
		holdOn : j("#holdOn"),
		toKH : j("#toKH"),
		goHotBan:j("#bannerContent"),
		indexBg : j('.indexBg'),
		bottomtitle : j('.bot-title'),
		PC : j("#PC"),
		announce : j(".announce"),
		annouce_close : j(".annouce_close"),
		bindEvent : function(){
			var that = this;
			that.PC.bind('click',function(){
				window.location.href = 'http://www.eloancn.com?from=wap';
			});
			that.goHotBan.bind('click',function(){
				PUBLIC.count("MSHOUYE-RMTG");
			});
			that.annouce_close.on('click',function(){
				that.announce.hide();
				l.hideLayer();
			});
			that.transList_page.bind('click',function(){
				w.location.href = '/static/mobileSite/html/transfer/transfer_list.html?platform='+platform+'&v='+Math.random();
			});
			that.account_page.bind('click',function(){
				PUBLIC.count("MWD");
				cl.check_Log(function(data){
					if(data.code == '0000'){
						w.location.href = '/static/mobileSite/html/myaccount/myaccount.html?platform=' + platform + '&v=' + Math.random();
					}
				});
			});
			that.investList_page.bind('click',function(){
				PUBLIC.count("MTZ");
				w.location.href = '/static/mobileSite/html/invest_list.html?platform=' + platform + '&v=' + Math.random();
			});
			
			that.holdOn.bind('click',function(){
				that.meng.hide();
			});
			that.toKH.bind('click',function(){
				w.location.href = decodeURIComponent(that.toKH.attr('data-url'));
			});
		},
		creatHealper:function(){
			Handlebars.registerHelper("compare",function(v1,v2,v3,options){//是否为可投标
				if(v1==v2){
					//满足添加继续执行
					return options.fn(this);
				}else{
					//不满足条件执行{{else}}部分
					return options.inverse(this);
					//return options.fn(this);
				}
			});
			Handlebars.registerHelper('urltender',function(str){//将债权详情的加密tenderid编码
                return PUBLIC.URL+'/loandetail/loandetail.html?tenderid='+str;
            });
				Handlebars.registerHelper('splitStr',function(str,flag){//此做法是针对 后台返回格式不统一的处理 返回字符串中没有付利率， 有副利率时 11+1.5,无副利率时 11%
				var arr = str.split('+');
				if(flag == 1){//主利率
					if(arr.length == 1){
						return parseFloat(arr[0].split('%')[0]);
					}else{
						return parseFloat(arr[0]);
					}
				}
				else{//副利率
					if(arr.length >=2){
						return '+'+arr[1]+'%';
					}else{
						return '';
					}
				}
			});
			Handlebars.registerHelper('format',function(str){//此做法是针对去掉字符串中的文字，只保留数字
				return str.match(/\d+(\.\d+)?/)[0];
			});
		},
		getBanner : function(){
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({//获取banner
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Banner_URL
				},
				success : function(bannerArr){
					if(bannerArr.code == "0000"){
						j("#bannerContent").html(banner_template(bannerArr.data));
						that.indexBg.removeClass('dis_none');
						that.bottomtitle.removeClass('dis_none');
						$(".toActivePage").bind('click',function(){
							var str = $(this).data('href');
							var o = t.getParams(str);
							if(o.LoginRequired == '1'){
								cl.check_Log(function(data){
									if(data.code == '0000'){
										window.location.href = str;
									}
								});
							}else{
								window.location.href = str;
							}
						});
						
					}else{
						l.alert2(bannerArr.message);
						return false; 
					}
				}
			});
		},
		getNewDetail : function(){//获取新手列表
			var that = this;
			var newPostData = {
				requesturl : 'Ls5SF9Uahdo8KyyoiGnnHYAnezeDzAJo',
				pageNo:1
			};
			if(_CODE){
				newPostData.code = _CODE;
			}
			r.setLayerFlag(false);
			r.postLayer({//获取新手详情
				url : PUBLIC._COMMON,
				data : newPostData,
				success : function(data){
					if(data.code == "0000"){
						data = data.data;
						if(!data) return;
						
						var tpl_newuser = Handlebars.compile(j("#tpl_newuser").html());
						pageUtil.creatHealper();
						j('#newuserlist').html(tpl_newuser(data['data'].slice(0,2)));
					r.post({
						url:PUBLIC._COMMON,
						data : {requesturl : 'Ls5SF9UahdpnCKMuzK0%2BxIAnezeDzAJo'},
						type : 'POST',
						success : function(data){
							if(data.code=='0000'){
							var info=data.data;
						
							for(var i=0;i<info.length;i++){
								
								j('.phases'+info[i].phases).html(parseInt(info[i].limitAmount)/10000)
							}

							}

						}
					})
						
						j('.home-main').delegate('.toDetail','click',function(e){							
							PUBLIC.count("MSHOUYE-XQ");
							e.preventDefault();
							w.location.href = "/static/mobileSite/html/newpro/newpro_detail.html?platform="+platform+"&pid="+encodeURIComponent(j(this).attr("data-pid"));
							
						});
						
						var mySwiper = new Swiper ('.swiper-container', {
					 // 如果需要分页器
						pagination : '.swiper-pagination',
						paginationType : 'bullets',
						autoplay : 5000,
						loop: true
						
				
					  })     



					  j('.home-main').delegate('.investSub','click',function(e){				
							PUBLIC.count('MSHOUYE-MSTZ');
							var mypid=j(this).attr("data-pid");
															
						//请求是否为新手的判断
						r.post({
							url : PUBLIC._COMMON,
							data : {
								requesturl : 'Ls5SF9UahdpnCKMuzK0%2BxCqCFxy7cf0e',
								pid : mypid
							},
							success : function(data){
								if(data.code == '0000'){									
									w.location.href = '/static/mobileSite/html/newpro/newpro_invest.html?platform='+platform+'&pid='+encodeURIComponent(mypid);
						
								}else{
									//l.alertAuto(data.message);
								}
							}
						});
						});
					}
				}
			});
		},
		getAnnouncement:function(){
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Announcement_URL
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						var messageData = data.messageData || '';
						if(messageData){
							// messageData.type = 'text,2';
							var type = messageData.type,tArr = type.split(',');
							sessionStorage.setItem('showType', tArr[1]);
							if(tArr[1] == '0'){ return false;}
							if(tArr[0] == 'url'){
								window.location.href = messageData.url || '';
							}else if(tArr[0] == 'text'){
								l.showLayer();
								j('.annouce_title').find('p#ann_title').text(messageData.title || '');
								// j('.announce_content').append(messageData.value);
								j('.announce_content').append(messageData.value || '');
								that.announce.show();
							}
						}
					}
				}
			});
		},
		init : function(){
			var that = this;
			// 判断公告
			var announceTime = sessionStorage.getItem('showType');
			switch(announceTime){
				case '0':break;//为关闭状态，不展示任何内容
				case '1':;
				case '3':break;//只弹一次，用户关闭后在此次运行周期中再不显示
				case '2'://每次请求此接口的地方都展示
				default : that.getAnnouncement();break;
			}
			// 判断公告 end
			
			if(openSkipUrl && userType != '2' && openSkipUrl != "undefined"){//判断是否进入开户页
				that.meng.show();
				that.toKH.attr('data-url',openSkipUrl);
			}else if(openSkipUrl != '' && userType == '2'){//假如页面其他错误 可能会不报错
				l.alert2('企业用户请到翼龙贷网站开户，开户后即可在手机上出借');
			}
			
			that.bindEvent();
			that.getNewDetail();
			that.getBanner();
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,COMMON_POST,COMMON_KH,COMMON_Login);
