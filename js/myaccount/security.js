(function(w,r,j,t,l,c){
	var param_obj = t.getParams();
	var platform = param_obj.platform || '4';
	var logoutUtil = {
		logOut_btn : j("#logout-btn"), //退出按钮
		changePas_btn : j("#change-pas-btn"), //修改登录密码
		deitChargePsd : j("#deitChargePsd"),
		eitMobileNum : j("#eitMobileNum"),
		transPwdText : j("#transPwdText"),
		no_eitMobileNum : j("#no_eitMobileNum"),
		no_deitChargePsd : j("#no_deitChargePsd"),

		bindEvent : function(){
			var that = this;
			// 修改登录密码按钮
			that.changePas_btn.on('click',function(){
				w.location.href = "editPsd.html?platform="+platform
			});
			// 退出登录按钮
			that.logOut_btn.on('click',function(){ //退出按钮
				var logoutOptions = {
					url : PUBLIC.URL_FWD_LOG,
					data : {
						requesturl : CONFIG.NEW_LOGOUT_URL,
					},
					success : function(data){
						console.log(data);
						if(data.code == "0000"){
							//l.alert2(data.message);
							if(platform == '3'){
								var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL+'/static/mobileSite/login.html?platform=3&v='+Math.random());				
								window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+PUBLIC.APPID+'&redirect_uri=' +REPLACE_REDIRECT_URI+ '&response_type=code&scope=snsapi_base#wechat_redirect';	
							}else{
								window.location.href = '/static/mobileSite/login.html?platform=4&v='+Math.random();
							}
						}
					}
				}
				r.postLayer(logoutOptions);
			});
			//修改交易密码
			that.deitChargePsd.bind('click',function(){
				c.check_KH(function(data){
					if(data.code == '0000'){
						r.setLayerFlag(false);
						r.postLayer({
							url : PUBLIC._COMMON,
							data : {
								requesturl : CONFIG.Safe_EditTransPwd_URL
							},
							success : function(data){
								if(data.code == '0000'){
									data = data.data || '';
									c.creatAndSubForm(data);
								}
							}
						});
					}
				});
			});
			//修改银行预留手机号
			that.eitMobileNum.bind('click',function(){
				c.check_KH(function(data){
					if(data.code == '0000'){
						r.setLayerFlag(false);
						r.postLayer({
							url : PUBLIC._COMMON,
							data : {
								requesturl : CONFIG.Safe_EditBankMobile_URL,
							},
							success : function(data){
								if(data.code == '0000'){
									data = data.data || '';
									c.creatAndSubForm(data);
								}
							}
						})
					}
				});
			});	
			$('.al-toggle-button').bind('change',function(){
				console.log($(this).is(':checked'));
				var sendData = $(this).is(':checked') ? 0 : 1;
				r.post({
					url:'/mobilesite/app001/v1/02',
					data:{
						status:sendData
					},
					success:function(data){
						console.log(data);
					}
				})
			});
			//不可用的功能
			that.no_deitChargePsd.bind("click",function(){
				l.alertAuto('开通厦门银行存管账户后即可修改交易密码');
			});
			//企业用户，不可用的功能
			that.no_eitMobileNum.bind("click",function(){
				l.alertAuto('开通厦门银行存管账户后即可修改银行预留手机号');
			});
		},
		getUserInfo : function(){
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Myaccount_URL
				},
				success : function(data){
					if(data.code == '0000'){
						var o = data.data;
						j("#userImg").attr('src',o.safePhoto || '/static/mobileSite/images/head1.png');
						j("#mobilePhone").html(o.accName || '');
					}
				}
			})
		},
		init : function(){
			var that = this;
			r.post({
				url:PUBLIC._COMMON,
				data:{
					requesturl:'ELvOAP5boQ38JtQ9dk1qauyylTtf9fnQ'
				},
				success:function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						j("#goTest").bind('click',function(){
							window.location.href = PUBLIC.PHP_Domain+'/index.php?m=api&c=riskass&a=wxindex&uiddes='+data.encrptUid+'&from=account&platform='+platform;//预上线
						});
						$.ajax({
							type:'post',
							url:PUBLIC.PHP_Domain+'/index.php?m=api&c=Riskass&a=gettipres',
							data:{
								'uiddes':data.encrptUid
							},
							success:function(res){
								res = $.parseJSON(res);
								j("#typeText").html(res.rssmes);
							}
						});
					}
				}
			});
			//查看消息配置
			r.setFlag(false);
			r.post({
				url:'/mobilesite/app001/v1/01',
				success:function(data){
					console.log(data);
					if(data.code == '0000'){
						if (data.data.status == '1') {
							$('.al-toggle-button').prop("checked",false);
						}else{
							$('.al-toggle-button').prop("checked",true);
						}
					}
				}
			})
			j.ajax({
				url : PUBLIC._COMMON,
				data : {
					requesturl : '%2F8SPpeSkULTV1BOXV4BFMT85M1sP8%2BMT',
					platform:platform
				},
				dataType : 'json',
				timeout : 1500,
				success : function(data){
					if(data.code != '0000'){//未开户成功
						that.eitMobileNum.addClass('dis_none');
						that.deitChargePsd.addClass('dis_none');
						that.no_eitMobileNum.removeClass('dis_none');
						that.no_deitChargePsd.removeClass('dis_none');
					}
				}
			});
			that.bindEvent(),that.getUserInfo();
		}
	}
	logoutUtil.init();

})(window,requestUtil,$,Tools,Layer,COMMON_KH)