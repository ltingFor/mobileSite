(function(w,r,j,t,l){
	var loginUtil = {
		account : j("#account"),//手机号或者邮箱
		psd : j("#password"),
		imgCode : j("#imgCode"),
		imgCodePop : j("#imgCodePop"),
		imgCodeImg : j("#imgCodeImg"),
		imgCodeImgPop : j("#imgCodeImgPop"),
		textCode : j("#textCode"),
		textCodeContent : j(".textCodeContent"),
		textCodeBtn : j("#textCodeBtn"),
		logSub_btn : j("#loginBtn"),
		imgContent : j(".imgContent"),
		errorTip : j("#errorTip"),
		closeImg_account : j(".clo-tel[data=#account]"),
		closeImg_password : j(".clo-tel[data=#password]"),
		closeImg_imgCode : j(".clo-tel[data=#imgCode]"),
		closeImg : j(".clo-tel"),
		eyeImg : j(".clo-pas"),
		forgetPass : j("#forgetPass"),
		regist : j("#regist"),
		meng : j('.meng'),
		cancel_Pop : j("#cancel_Pop"),
		textCodeBtn_Pop : j("#textCodeBtn_Pop"),
		voiceCode : j("#voiceCode"),
		mobileExg : {},
		emailExg : {},

		account_val : 0,
		password_val : 0,
		imgCode_val : 0,
		textCode_val : 0,
		platform : t.getParamsByName('platform'),
		refreshImage : function(){
			var that = this,phone_val = that.account.val(),password_val = that.psd.val();
			if(!phone_val || !password_val || ((!(that.mobileExg.test(phone_val))) && (!(that.emailExg.test(phone_val))))){
				that.imgContent.addClass("dis_none");
			}else{
				that.imgCodeImg.attr('src',PUBLIC.URL_FWD_IMGCODE+'?requesturl='+CONFIG.NEW_PicCode_URL+'&sendAddress=' + phone_val + '\&'+ 'platform='+that.platform+"&v="+Math.random());
				that.imgContent.removeClass("dis_none").show();
			}
		},
		refreshImagePop : function(){
			var that = this,phone_val = that.account.val(),password_val = that.psd.val();
			if(!t.checkPhone(phone_val)){
				that.meng.hide();
			}else{
				that.imgCodeImgPop.attr('src',PUBLIC.URL_FWD_IMGCODE+'?requesturl='+CONFIG.NEW_PicCode_URL+'&sendAddress=' + phone_val + '\&'+ 'platform='+that.platform+"&v="+Math.random());
				that.textCodeContent.removeClass("dis_none").show();
			}
		},
		bindEvent : function(){
			var that = this;
			that.psd.bind('input propertychange',function(){//提交按钮可用性
				var str = that.psd.val();
				if(that.account.val() && str){
					that.logSub_btn.removeClass("dis_btn");
				}
			});
			that.account.bind('input propertychange',function(){
				j('#z-accClose0').show()
				var str = that.account.val();
				var strPsd = that.psd.val();
				if(str){
					that.closeImg_account.show();
					if(strPsd){
						that.logSub_btn.removeClass("dis_btn");
					}
				} else{
					// that.closeImg_account.hide();
					that.logSub_btn.addClass('dis_btn');
				}
			});

			// 清空密码框
			j('#z-accClose0').on('click',function(){
				that.account.val('');
				j(this).hide();
				j(".imgContent").hide();
				that.logSub_btn.addClass('dis_btn');
			});
			that.psd.bind('input propertychange',function(){
				j('#z-pasClose1').show()
				if(j(this).val()){
					that.closeImg_password.show();
				}else{
					if(!that.account.val()){that.imgContent.addClass('dis_none');}
					that.logSub_btn.addClass('dis_btn');

				}
			});
			that.psd.bind('blur',function(){
				if(that.account.val()){
					that.logSub_btn.removeClass('dis_btn');
				}
			});

			that.psd.bind('blur',function(){
				if(that.account.val()){
					// j('#z-pasClose1').hide()
					that.logSub_btn.removeClass('dis_btn');
				}
			});
			// 清空密码框
			j('#z-pasClose1').on('click',function(){
				that.psd.val('');
				j(this).hide();
				that.logSub_btn.addClass('dis_btn');
			});
			that.imgCode.on('input propertychange',function(){
				j('#imgClose12').show()
			});
			j('#imgClose12').on('click',function(){
				that.imgCode.val('')
				// j(this).hide()
			});
			that.eyeImg.bind('click',function(){
				var type = that.psd.attr("type");
				if(type == "input"){
					that.eyeImg.find("img").attr("src","images/log3-1.png");
					that.psd.attr("type","password");

				}else{
					that.eyeImg.find("img").attr("src","images/log3.png");
					that.psd.attr("type","input");
				}
				return false;
			});
			that.imgCodeImgPop.bind('click',function(){
				that.refreshImagePop();
			});
			that.imgCodeImg.bind('click',function(){
				that.refreshImage();
			});
			that.cancel_Pop.bind('click',function(){
				that.meng.hide();
			});
			that.textCodeBtn.bind('click',function(){
				if(password_val && that.account.val()){
					that.meng.show();
					that.refreshImagePop();
				}
				else{
					l.alert2('账号信息不正确');
				}
			});
			that.textCodeBtn_Pop.bind("click",function(){
				that.codeType = "1";
				that.getTextCode();
			});

			that.voiceCode.bind("click",function(e){//语音验证码
				that.codeType = "2";
				that.getTextCode();
			});
			that.forgetPass.bind("click",function(){
				PUBLIC.count('MDL-WJMM');
				w.location.href = PUBLIC.URL+'/static/mobileSite/html/forgetPsd.html?platform=4&v='+Math.random();
			});
			that.regist.bind("click",function(){
				if(PUBLIC.platform == '3'){
					var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL+'/static/mobileSite/html/register.html?platform=3&v='+Math.random());
					window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+PUBLIC.APPID+'&redirect_uri=' +REPLACE_REDIRECT_URI+ '&response_type=code&scope=snsapi_base#wechat_redirect';
				}else{
					w.location.href = PUBLIC.URL+'/static/mobileSite/html/register.html?platform=4&v='+Math.random();
				}
			});
			that.logSub_btn.bind('click',function(){
				PUBLIC.count('MDL');
				if(that.logSub_btn.hasClass("dis_btn")){
					return false;
				}

				var phone_val = that.account.val();
				var password_val = that.psd.val();


				if(!t.checkPhone(phone_val) && !t.checkEmail(phone_val)){
					// that.refreshImage();
					l.alertAuto('用户名格式错误');
					return;
				}else if(!password_val || !t.checkPsd(password_val)){
					l.alertAuto('密码格式错误');
					return;
				}else{
					/**
					*	1044,1045,1046 --  三个code 为图片验证码错误
					*	1004,1006 -- 1004,1006两个code 为短信（邮件）验证码错误
					*	1027，1028 -- 1027,1028 两个 code 则证明需要短信（邮件）验证码进行验证，需要弹出验证码的输入框
					*   1063 -- 您是借款人，请到借款APP端操作/您是担保人，请到官网登录
					*/
					var loginOption = {//登陆接口
						url : PUBLIC.URL_FWD_LOG,
						data : {
							requesturl : CONFIG.NEW_LOG_URL,
							loginName : phone_val,
							password : PUBLIC.encryptByDES(password_val,PUBLIC.DESkey)
						},
						content : "登录中..",
						success : function(data){
							console.log(data);
							if(data.code == "1044" || data.code == "1045" || data.code == "1046" || data.code == '1023'){//1044,1045,1046 弹出图形验证码
								that.refreshImage();
								that.imgContent.show();
								l.alert2(data.message);
							}else if(data.code == '0000'){//成功
								data = data.data;
								if(data.openSkipUrl){//decodeURIComponent
									window.location.href = "index.html?platform="+that.platform+"&openSkipUrl="+encodeURIComponent(data.openSkipUrl)+"&userType="+data.userType;
								}else{
									window.location.href = "index.html?platform="+that.platform;
								}
							}else if(data.code == '1028' || data.code == '1027'){//弹出短信验证码
								l.alert2(data.message);
								l.setKnowAction(function(){
									that.textCodeContent.removeClass('dis_none');
									that.logSub_btn.addClass('dis_btn');
									if(!that.imgContent.hasClass('dis_none')){
										that.imgContent.addClass('dis_none');
									}
								});
							}else if(data.code == '1063'){//借款人app  只是提示  不需要弹框
								l.alert2(data.message);
							}else{
								l.alert2(data.message);
							}
						}
					};
					if(!that.imgContent.hasClass("dis_none")){
						loginOption.data.imageCode = that.imgCode.val();
					}
					if(t.getParamsByName('code')){
						loginOption.data.code = t.getParamsByName('code');
					}
					var checkCode = that.textCode.val();
					if(checkCode){
						loginOption.data.checkCode = checkCode;
					}
					r.postLayer(loginOption);
				}
			});
		},
		getTextCode : function(){//获取短信验证码
			var that = this;
			var textCodeOption = {
				url : PUBLIC._COMMON,
				data : {
					requesturl : "ELvOAP5boQ1eBBbEi7779EXEsV49x4OX",
					sendAddress : that.account.val(),
					verification_code : that.imgCodePop.val(),
					sendCodeType : that.codeType,
					orderType : "5"//1:注册 2:修改登录密码 3:修改支付密码 4:忘记登录密码 5：登陆接口预约的验证码 6：找回支付密码
				},
				success : function(data){
					console.log(data);
					if(data.code != "0000"){
						that.refreshImagePop();
						//that.errorTip.html('用户名或密码错误').addClass("dis_show");
						l.alert2(data.message);
					}else{
						console.log(data.data.smsCode);
						that.meng.hide();
						t.countDownNum(function(){
							console.log(t.getNum());
							that.textCodeBtn.html(t.getNum()+"'");
				  		},function(){},60);
					}
				}
			}
			r.postLayer(textCodeOption);
		},
		getExg : function(){//获取手机号和邮箱的正则表达式
			var that = this;
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.RegExp_Mobile_URL
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						that.mobileExg = eval('/'+data.iphonePattern+'/');
						that.emailExg = eval('/'+data.emailPattern+'/');
					}
				}
			});
		},
		init : function(){
			var param_obj = t.getParams();
			var that = this;
			that.getExg();
			//当点击返回的时候，跳转到index页面
			/*pushHistory();
			window.addEventListener("popstate", function(e) {
		       window.location.href = 'index.html?platform='+that.platform;
		    }, false); */
			that.bindEvent();

		}
	}
	loginUtil.init();
})(window,requestUtil,$,Tools,Layer)
/*function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}*/