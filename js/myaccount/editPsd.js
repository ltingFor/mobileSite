(function(w, r, j, t, l) {
    var param_obj = t.getParams();
    var platform = param_obj.platform;
    var pageUtil = {
        oldPsd: j("#oldPsd"),
        newPsd: j("#newPsd"),
        newPsdAgin: j('#newPsdAgin'),
        subBtn: j("#subBtn"),

        bindEvent: function() {
            var that = this;
            that.subBtn.bind('click', function() {
                if (that.subBtn.hasClass('dis_btn')) {
                    return false;
                }

                var oldP = that.oldPsd.val(),
                    newP = that.newPsd.val(),
                    newPA = that.newPsdAgin.val();
                if (oldP && oldP && newPA) {
                    if (!t.checkPsd(oldP)) {
                        l.alertAuto('原始密码输入不正确');
                        return false
                    }
                    if (!t.newCheckPsdReg(newP)) {
                        l.alertAuto('格式有误,设置6~16位数字,字母或符号组合密码');
                        return false
                    }
                    if (newP != newPA) {
                        l.alertAuto('新密码和确认密码输入不一致');
                        return false;
                    }
                    r.postLayer({
                        url: PUBLIC._COMMON,
                        data: {
                            requesturl: CONFIG.NEW_EditPwd_URL,
                            oldPassword: PUBLIC.encryptByDES(oldP, PUBLIC.DESkey),
                            password: PUBLIC.encryptByDES(newP, PUBLIC.DESkey),
                            confirm_password: PUBLIC.encryptByDES(newPA, PUBLIC.DESkey)
                        },
                        success: function(data) {
                            if (data.code == '0000') {
                                l.alert2('修改成功');
                                l.setKnowAction(function() {
                                    w.location.href = '../../login.html?platform=' + platform;
                                });
                            } else {
                                l.alert2(data.message);
                            }
                        }
                    });
                }
            });
            that.oldPsd.bind('input propertychange', function() {
                j('#oldClose').show()
                if (that.newPsd.val() && that.newPsdAgin.val()) {
                    that.subBtn.removeClass('dis_btn');
                } else {
                    that.subBtn.addClass('dis_btn');
                }
            });
            j('#oldClose').on('click', function() {
                that.oldPsd.val('');
                j(this).hide();
                that.subBtn.addClass('dis_btn');
            });
            that.newPsdAgin.bind('input propertychange', function() {
                j('#newCloseAgain').show()
                if (that.oldPsd.val() && that.newPsd.val()) {
                    that.subBtn.removeClass('dis_btn');
                } else {
                    that.subBtn.addClass('dis_btn');
                }
            });
            j('#newCloseAgain').on('click', function() {
                that.newPsdAgin.val('')
                j(this).hide();
                that.subBtn.addClass('dis_btn');
            });
            that.newPsd.bind('input propertychange', function() {
                j('#newClose').show()
                if (that.oldPsd.val() && that.newPsdAgin.val()) {
                    that.subBtn.removeClass('dis_btn');
                } else {
                    that.subBtn.addClass('dis_btn');
                }
            });
            j('#newClose').on('click', function() {
                that.newPsd.val('');
                j(this).hide();
                that.subBtn.addClass('dis_btn');
            });

        },
        init: function() {
            var that = this;
            that.bindEvent();
        }
    }
    pageUtil.init();
})(window, requestUtil, $, Tools, Layer)