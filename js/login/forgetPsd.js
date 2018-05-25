(function(w, r, j, t, l) {

    var pageUtil = {
        step1: j("#step1"),
        account: j("#account"),
        imgCode: j("#imgCode"),
        imgCodeImg: j("#imgCodeImg"),
        nextBtn: j("#nextBtn"),
        closeImg: j("#zhcloseImg"),
        step2: j("#step2"),
        textCode: j("#textCode"),
        psd: j("#psd"),
        eyeImg: j("#eyeImg"),
        subBtn: j("#subBtn"),
        countDown: j("#countDown"),
        wait_code: j("#wait_code"),
        phoneNum: j("#phoneNum"),
        platform: t.getParams().platform,

        refreshImage: function() {
            var that = this,
                phone_val = that.account.val();
            if (!that.platform || !t.checkPhone(phone_val)) {
                return false;
            }
            that.imgCodeImg.attr('src', PUBLIC.URL_FWD_IMGCODE + '?requesturl=' + CONFIG.NEW_PicCode_URL + '&sendAddress=' + phone_val + '\&' + 'platform=' + that.platform + "&v=" + Math.random());
            // that.imgCodeImg.attr('src',PUBLIC.URL_IMGCODE+'?sendAddress=' + phone_val + '\&'+ 'platform='+that.platform);
        },
        bindEvent: function() {
            var that = this;
            that.account.bind("focus", function() {
                if (that.account.val()) {
                    that.closeImg.show();
                }
                return;
            });
            that.account.bind("input propertychange", function() {
                that.closeImg.show();
                return;
            });
            that.account.bind("blur", function() {
                // that.closeImg.hide();
                that.refreshImage();
                return;
            });
            that.closeImg.bind("click", function() {
                that.account.val("");
                j(this).hide()
                return;
            });
            that.imgCode.on('input propertychange', function() {
                j('#zimgClose').show()
            });
            j('#zimgClose').on('click', function() {
                that.imgCode.val('')
                j(this).hide()
            });
            that.imgCode.bind("keyup", function() {
                that.nextBtn.removeClass("dis_btn");
            });
            that.imgCodeImg.bind("click", function() {
                that.refreshImage();
            });
            that.psd.bind("keyup", function() {
                that.subBtn.removeClass("dis_btn");
            });
            that.eyeImg.bind("click", function() {
                var type = that.psd.attr("type");
                if (type == "text") {
                    that.eyeImg.find("img").attr("src", "../images/log3-1.png");
                    that.psd.attr("type", "password");

                } else {
                    that.eyeImg.find("img").attr("src", "../images/log3.png");
                    that.psd.attr("type", "text");
                }
            });
            that.wait_code.bind("click", function() {
                that.imgCode.val('');
                that.refreshImage();
                that.step1.show();
                that.step2.hide();
                that.textCode.val('');
                that.psd.val('');
            });
            that.nextBtn.bind("click", function() {
                if (j(this).hasClass("dis_btn")) {
                    return false;
                }
                var account = that.account.val();
                if (!t.checkPhone(account)) {
                    l.alert2("手机号不正确");
                    return false;
                }
                that.wait_code.addClass("dis_none");
                that.countDown.removeClass('dis_none');
                r.postLayer({ //获取短信验证码
                    url: PUBLIC.URL_FWD_LOG,
                    data: {
                        requesturl: CONFIG.NEW_TextCode_URL,
                        sendAddress: account,
                        verification_code: that.imgCode.val(),
                        sendCodeType: "1",
                        orderType: "4"
                    },
                    success: function(data) {
                        if (data.code != "0000") {
                            l.alert2(data.message);
                            l.setKnowAction(function() {
                                that.refreshImage();
                            })
                        } else {
                            data = data.data;
                            if (data && data.timeLimit) { //请求过于频繁
                                t.countDownNum.call(that, function() {
                                    if (this.count == -1) {
                                        this.countDown.addClass('dis_none');
                                        this.wait_code.removeClass("dis_none").show();
                                        this.countDown.html("重新发送0秒").addClass("dis_none").hide();
                                        return;
                                    }
                                    this.countDown.removeClass('dis_none').show().html("重新发送" + this.count + "秒");
                                }, function() {
                                    this.countDown.addClass('dis_none');
                                    this.wait_code.removeClass("dis_none").show();
                                }, data.timeLimit);
                            } else{ //正常获取到验证码
                                // alert(data.smsCode);
                                t.countDownNum.call(that, function() {
                                    if (this.count == -1) {
                                        this.countDown.addClass('dis_none');
                                        this.wait_code.removeClass("dis_none").show();
                                        this.countDown.html("重新发送0秒").addClass("dis_none").hide();
                                        return;
                                    }
                                    this.countDown.removeClass('dis_none').show().html("重新发送" + this.count + "秒");
                                }, function() {
                                    this.countDown.addClass('dis_none');
                                    this.wait_code.removeClass("dis_none").show();
                                    //this.countDown.html("重新发送0秒").addClass("dis_none").hide();
                                }, 60);
                            }

                            that.phoneNum.html(t.formatPsd(account));
                            that.step1.hide();
                            that.step2.removeClass("dis_none").show();
                        }
                    }
                });
            });
            that.subBtn.bind("click", function() {
                if (j(this).hasClass("dis_btn")) {
                    return false;
                }
                // 检验密码
                var psd = that.psd.val();
                t.newCheckPsd().done(function(data) {
                    if (data.code == "0000") {
                        var resData = data.data;
                        var checkPsdReg = new RegExp(resData.cipherPattern);
                        if (!checkPsdReg.test(psd)) {
                            l.alertAuto(resData.cipherPatternTip);
                            return false;
                        } else {
                            var account = that.account.val(),
                                postFlag = false;
                            r.postLayer({ //找回密码
                                url: PUBLIC._COMMON,
                                data: {
                                    requesturl: CONFIG.NEW_FindPwd_URL,
                                    mobile: account,
                                    newPwd: PUBLIC.encryptByDES(psd, PUBLIC.DESkey),
                                    confirmNewPwd: PUBLIC.encryptByDES(psd, PUBLIC.DESkey),
                                    mobileCode: that.textCode.val(),
                                    orderType: "4"
                                },
                                success: function(data) {
                                    if (data.code != "0000") {
                                        postFlag = false;
                                        l.alert2(data.message);
                                        return;
                                    } else {
                                        l.alert2('密码修改成功');
                                        l.setKnowAction(function() {
                                            // w.location.href = '/static/mobileSite/login.html?platform='+that.platform;
                                            if (PUBLIC.platform == '3') {
                                                var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                                                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect';
                                            } else {
                                                w.location.href = PUBLIC.URL + '/static/mobileSite/login.html?platform=4&v=' + Math.random();
                                            }
                                        });
                                        postFlag = true;
                                    }
                                }
                            });
                        }
                    } else {
                        var account = that.account.val(),
                            postFlag = false;
                        r.postLayer({ //找回密码
                            url: PUBLIC._COMMON,
                            data: {
                                requesturl: CONFIG.NEW_FindPwd_URL,
                                mobile: account,
                                newPwd: PUBLIC.encryptByDES(psd, PUBLIC.DESkey),
                                confirmNewPwd: PUBLIC.encryptByDES(psd, PUBLIC.DESkey),
                                mobileCode: that.textCode.val(),
                                orderType: "4"
                            },
                            success: function(data) {
                                if (data.code != "0000") {
                                    postFlag = false;
                                    l.alert2(data.message);
                                    return;
                                } else {
                                    l.alert2('密码修改成功');
                                    l.setKnowAction(function() {
                                        // w.location.href = '/static/mobileSite/login.html?platform='+that.platform;
                                        if (PUBLIC.platform == '3') {
                                            var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                                            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect';
                                        } else {
                                            w.location.href = PUBLIC.URL + '/static/mobileSite/login.html?platform=4&v=' + Math.random();
                                        }
                                    });
                                    postFlag = true;
                                }
                            }
                        });
                    }
                });
            })

            // 叉叉
            that.textCode.on('input propertychange', function() {
                j('#zMsgClose').show()
            })
            j('#zMsgClose').on('click', function() {
                that.textCode.val('')
                j(this).hide()
            })
            that.psd.on('input propertychange', function() {
                j('#zPasClose').show()
            })
            j('#zPasClose').on('click', function() {
                that.psd.val('')
                j(this).hide()
            })
        },
        init: function() {
            var that = this;
            that.refreshImage();
            that.bindEvent();
        }
    };
    pageUtil.init();
})(window, requestUtil, $, Tools, Layer)