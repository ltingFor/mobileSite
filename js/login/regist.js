(function(w, r, j, t, l) {
    var param_obj = t.getParams(),
        platform = param_obj.platform,
        _CODE = param_obj.code;
    var loginUtil = {
        account: j("#account"),
        psd: j("#password"),
        imgCode: j("#imgCode"),
        imgCodeBtn: j("#imgCodeBtn"),
        imgCodeImg: j("#imgCodeImg"),
        textCode: j("#textCode"),
        textCodeBtn: j("#textCodeBtn"),
        textCodeBtn_Pop: j("#textCodeBtn_Pop"),
        voiceCode: j("#voiceCode"),
        reg_btn: j("#regBtn"),
        cancel_Pop: j("#cancel_Pop"),
        mengLayer: j(".meng"),
        yqCode: j("#yqCode"),
        yqCodeBtn: j("#yqCodeBtn"),
        hideYqCodeBtn: j("#hideYqCodeBtn"),
        goToLogin: j("#goToLogin"),
        checkBox: j("#checkBox"),
        close: j("#close"),
        yaoqingContent: j('.yaoqing'),
        codeType: 0,
        changePsd: j("#changePsd"),
        platform: t.getParamsByName('platform'),

        refreshImage: function() {
            var that = this,
                phone_val = that.account.val();
            that.imgCodeImg.attr('src', PUBLIC.URL_FWD_IMGCODE + '?requesturl=' + CONFIG.NEW_PicCode_URL + '&sendAddress=' + phone_val + '\&' + 'platform=' + that.platform + "&v=" + Math.random());
            // that.imgCodeImg.attr('src',PUBLIC.URL_IMGCODE+'?sendAddress=' + phone_val + '\&'+ 'platform=4' + '\&' + 'device_token=1'+ '\&' + 'appid=1');
        },
        alert_info: function() {
            var that = this;
            that.mengLayer.show();
            that.refreshImage();
        },
        getTextCode: function() { //获取短信验证码

            var that = this;
            var textCodeOption = {
                url: PUBLIC._COMMON,
                data: {
                    requesturl: CONFIG.NEW_TextCode_URL,
                    sendAddress: that.account.val(),
                    verification_code: that.imgCode.val(),
                    sendCodeType: that.codeType,
                    orderType: "1"
                },
                success: function(data) {
                    console.log(data);
                    if (data.code != "0000") {
                        that.refreshImage();
                        l.alert2(data.message);
                        l.setKnowAction(function() {
                            that.mengLayer.hide();
                        });
                    } else {
                        if (data.data && data.data.timeLimit) {
                            l.alert2('请求频繁，稍后重试');
                            that.mengLayer.hide();
                            t.countDownNum.call(that, function() {

                                if (this.count == -1) {
                                    that.textCodeBtn.removeClass('dis_span').html('获取验证码');
                                    return;
                                }
                                that.textCodeBtn.addClass('dis_span').html('重新发送' + this.count + "秒");
                            }, function() {}, data.data.timeLimit);

                        } else {
                            // alert(data.data.smsCode);
                            t.countDownNum.call(that, function() {

                                if (this.count == -1) {
                                    that.textCodeBtn.html('重新获取');
                                    that.textCodeBtn.removeClass('dis_span');
                                    return false;
                                }
                                that.textCodeBtn.addClass('dis_span').html('重新发送' + this.count + "秒");
                            }, function() {}, 60);
                            that.mengLayer.hide();
                        }

                    }
                }
            }
            r.postLayer(textCodeOption);
        },
        registSub: function() {
            var that = this,
                phone_val = that.account.val();
            password_val = that.psd.val();
            if (!t.checkPhone(phone_val) || !password_val || !t.checkPsd(password_val)) {
                that.refreshImage();
                //that.errorTip.html('用户名或密码错误').addClass("dis_show");
                l.alertAuto('用户名或密码错误');
                return;
            } else {
                var postData = {
                    requesturl: CONFIG.NEW_Regist_URL,
                    mobile: phone_val,
                    password: PUBLIC.encryptByDES(password_val, PUBLIC.DESkey),
                    orderType: "1",
                    mobileCode: that.textCode.val()
                };

                if (_CODE) {
                    postData.code = _CODE;
                }
                var regOption = { //注册
                    url: PUBLIC._COMMON,
                    data: postData,
                    content: "注册中..",
                    success: function(data) {
                        console.log(data);
                        if (data.code == "0000") {
                            var timer = setTimeout(function() {
                                var ttb = {
                                    requesturl: CONFIG.NEW_LOG_URL,
                                    loginName: that.account.val(),
                                    password: PUBLIC.encryptByDES(password_val, PUBLIC.DESkey)
                                };
                                // alert(JSON.stringify(ttb));
                                //注册成功后 默认登录
                                r.post({
                                    url: PUBLIC.URL_FWD_LOG,
                                    data: {
                                        requesturl: CONFIG.NEW_LOG_URL,
                                        loginName: that.account.val(),
                                        password: PUBLIC.encryptByDES(password_val, PUBLIC.DESkey)
                                    },
                                    content: "默认登录中..",
                                    success: function(data) {
                                        console.log(data);
                                        // alert(JSON.stringify(data));
                                        if (data.code == "0000") {
                                            data = data.data;
                                            if (data.openSkipUrl) { //decodeURIComponent
                                                window.location.href = "reg_success.html?platform=" + that.platform + "&openSkipUrl=" + encodeURIComponent(data.openSkipUrl);
                                            } else {
                                                window.location.href = "reg_success.html?platform=" + that.platform;
                                            }

                                        } else {
                                            //that.refreshImage();
                                            //默认登录失败，请到登录页重新登录;
                                            if (PUBLIC.platform == '3') {
                                                var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                                                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect';
                                            } else {
                                                w.location.href = PUBLIC.URL + '/static/mobileSite/login.html?platform=4&v=' + Math.random();
                                            }
                                        }
                                        clearTimeout(timer);
                                    }
                                });
                            }, 2000);
                        } else {
                            that.refreshImage();
                            l.alert2(data.message);
                        }
                    },
                    complete: function() {}
                };
                if (!that.yqCode.hasClass("dis_none")) {
                    regOption.data.registCode = that.yqCode.val();
                }
                r.postLayer(regOption);
            }
        },
        bindEvent: function() {
            var that = this;
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) { //此做法是为了解决ios下安装不同输入法，键盘遮盖问题
                that.imgCode.bind('focus', function() {
                    j('.msg-alert').css({ 'position': 'relative', 'top': '9%' });
                    $('html, body').animate({ scrollTop: 0 }, 'normal');
                });
                that.imgCode.bind('blur ', function() {
                    j('.msg-alert').css({ 'position': 'absolute', 'bottom': '0', 'top': '' });
                });
            }
            //点击刷新图形验证码
            that.imgCodeImg.bind('click', function() {
                that.refreshImage();
            });
            //切换密码是否明文
            that.changePsd.bind('click', function() {
                if (that.changePsd.hasClass('see')) {
                    that.psd.attr('type', 'password');
                    that.changePsd.removeClass('see');
                    that.changePsd.find('img').attr('src', '../images/log3-1.png');
                } else {
                    that.psd.attr('type', 'text');
                    that.changePsd.addClass('see');
                    that.changePsd.find('img').attr('src', '../images/log3.png');
                }
                return false;

            });
            that.textCodeBtn.bind('click', function() {
                if (that.textCodeBtn.hasClass('dis_span')) {
                    return false;
                }
                var phone_val = that.account.val();
                if (!t.checkPhone(phone_val)) {
                    l.alertAuto("手机号码不正确", function() {
                        that.account.focus();
                    });
                    return false;
                }
                that.imgCode.val('');
                that.alert_info(); //alert the img code pop
                return false;
            });
            that.goToLogin.bind("click", function() {
                if (PUBLIC.platform == '3') {
                    var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect';
                } else {
                    w.location.href = PUBLIC.URL + '/static/mobileSite/login.html?platform=4&v=' + Math.random();
                }
            });
            that.textCodeBtn_Pop.bind("click", function() {
                that.codeType = "1";
                that.getTextCode();
            });

            that.psd.bind('input propertychange', function() {
                j('#ZpasClose').show();
                if (that.account.val() && that.textCode.val() && that.psd.val()) {
                    that.reg_btn.removeClass('dis_btn');
                } else {
                    that.reg_btn.addClass('dis_btn');
                }
            });
            j('#ZpasClose').on('click', function() {
                that.psd.val('')
                j(this).hide()
            });
            that.textCode.bind('input propertychange', function() {
                j('#textCodeClose').show()
                if (that.account.val() && that.psd.val() && that.textCode.val()) {
                    that.reg_btn.removeClass('dis_btn');
                } else {
                    that.reg_btn.addClass('dis_btn');
                }
                return false;
            });
            j('#textCodeClose').on('click', function() {
                that.textCode.val('')
                j(this).hide()
            });
            that.account.bind('input propertychange', function() {
                if (that.psd.val() && that.textCode.val() && that.account.val()) {
                    that.reg_btn.removeClass('dis_btn');
                } else {
                    that.reg_btn.addClass('dis_btn');
                }
                if (that.account.val()) {
                    that.close.removeClass('dis_none');
                } else {
                    that.close.addClass('dis_none');
                }
            });
            that.close.bind('click', function() {
                that.account.val('');
                j(this).hide()
            });

            that.voiceCode.bind("click", function(e) { //语音验证码
                that.codeType = "2";
                that.getTextCode();
            });
            that.cancel_Pop.bind("click", function(e) {
                that.mengLayer.hide();
            });
            that.yqCode.on('input propertychange', function() {
                j('#zYaoqingClose').show();
            });
            j('#zYaoqingClose').on('click', function() {
                that.yqCode.val('');
                j(this).hide();
            });
            that.yqCodeBtn.bind("click", function(e) {
                that.yqCode.removeClass("dis_none");
                that.yqCodeBtn.addClass('dis_none');
                that.hideYqCodeBtn.removeClass('dis_none');
                // that.yaoqingContent.addClass('')
            });
            that.hideYqCodeBtn.bind('click', function() {
                that.yqCode.addClass('dis_none');
                that.yqCodeBtn.removeClass('dis_none');
                that.hideYqCodeBtn.addClass('dis_none');
                j('#zYaoqingClose').hide();
                that.yqCode.val('');
            });
            that.checkBox.bind('click', function() {
                if (that.checkBox.attr('src') == '../images/check_y.png') {
                    that.checkBox.attr('src', '../images/check_n.png');
                } else {
                    that.checkBox.attr('src', '../images/check_y.png');
                }
            });
            that.reg_btn.bind('click', function() {
                PUBLIC.count('MZC');
                if (that.reg_btn.hasClass("dis_btn")) {
                    return false;
                }
                // 检验密码
                var password_val = that.psd.val();
                t.newCheckPsd().done(function(data) {
                    if (data.code == "0000") {
                        var resData = data.data;
                        var checkPsdReg = new RegExp(resData.cipherPattern);
                        if (!checkPsdReg.test(password_val)) {
                            l.alertAuto(resData.cipherPatternTip);
                            return false;
                        } else {
                            // 勾选翼龙贷协议
                            if (that.checkBox.attr('src') == '../images/check_n.png') {
                                l.alertAuto('请勾选同意翼龙贷协议');
                                return false;
                            }
                            //如果用户输入 邀请码，那么校验邀请码，如果没有邀请码直接进行注册
                            var yqCode = that.yqCode.val();
                            if (yqCode) {
                                r.post({
                                    url: PUBLIC._COMMON,
                                    data: {
                                        requesturl: 'ELvOAP5boQ3WEzyBfoIaTUXEsV49x4OX',
                                        registCode: yqCode
                                    },
                                    success: function(data) {
                                        console.log(data);
                                        if (data.code == '0000') {
                                            that.registSub();
                                        }
                                    }
                                });
                            } else {
                                that.registSub();
                            }
                        }
                    } else {
                        // 勾选翼龙贷协议
                        if (that.checkBox.attr('src') == '../images/check_n.png') {
                            l.alertAuto('请勾选同意翼龙贷协议');
                            return false;
                        }
                        //如果用户输入 邀请码，那么校验邀请码，如果没有邀请码直接进行注册
                        var yqCode = that.yqCode.val();
                        if (yqCode) {
                            r.post({
                                url: PUBLIC._COMMON,
                                data: {
                                    requesturl: 'ELvOAP5boQ3WEzyBfoIaTUXEsV49x4OX',
                                    registCode: yqCode
                                },
                                success: function(data) {
                                    console.log(data);
                                    if (data.code == '0000') {
                                        that.registSub();
                                    }
                                }
                            });
                        } else {
                            that.registSub();
                        }
                    }
                });
            });
        },
        init: function() {
            var that = this;
            that.bindEvent();
        }
    }
    loginUtil.init();
})(window, requestUtil, $, Tools, Layer)