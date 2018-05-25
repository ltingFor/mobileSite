(function(w, j, r, t, l, h, c, v, cl, d) {
    'use strict'
    var param_obj = t.getParams();
    var platform = param_obj.platform,
        skip = param_obj.skip,
        pid = decodeURIComponent(param_obj.pid || ''),
        accId = param_obj.accId,
        tranType = param_obj.tranType,
        curPaidinRate = '',
        proDetailExt = decodeURIComponent(param_obj.proDetailExt),
        COUNT = 0,
        COUNT1 = 0,
        vipRate = 0,
        addRate = 0,
        loanURL_tender = '0'; //获取债权列表必传的参数

    var invest_btn = j('.detail-inv-btn'); //提交按钮
    var invest_btn_status = j('#statusCn');
    /*此处是添加继续查看详情的操作*/
    var dwonToTender = j("#dwonToTender"),
        upToViewDetail = j("#upToViewDetail");
    var wH = $(document).height(),
        headH = j("#tenderHeight").height();
    // j("#wrapper").height(wH - headH - upToViewDetail.height() - invest_btn.height() - 10 + 'px');
    j("#wrapper").css('min-height',wH - headH - upToViewDetail.height() - invest_btn.height() - 100 + 'px');
    dwonToTender.bind('click', function() {
        PUBLIC.count('MWD-ZMKH-CYZ-CKGD');
        j(".detail-main").animate({
            marginTop: -(j(".detail-main").outerHeight())
        }, 800);
        j('.detail-main1').show();
        j(".detail-main1").animate({
            marginTop: 0
        }, 800, function() {});
        d.setListenerName('zqlb');
        d.iScroll.refresh();
    });
    upToViewDetail.bind('click', function() {
        j(".detail-main1").animate({
            marginTop: wH
        }, 800);
        j(".detail-main").animate({
            marginTop: 0
        }, 800, function() {});
        j(".detail-main1").hide();
        d.setListenerName('zqlb');
        d.iScroll.refresh();
    });
    /*此处是添加继续查看详情的操作*/

    var syll = j('#syll'), //回报列表
        fxlb_content = j("#fxlb_content");
    var syTemplate = h.compile(j("#tpl_sylb").html()),
        zqlbHoldTemplate = h.compile(j("#tpl_hold_zqlb").html()),
        zqlbTransferTemplate = h.compile(j("#tpl_transfer_zqlb").html()),
        zqlbEndTemplate = h.compile(j("#tpl_end_zqlb").html()),
        fxlbTemplate = h.compile(j("#tpl_fxlb").html());
    var tabs = j('.detail-tab').find("li"),
        tab_pages = j('.detail-record'),
        cpxq = j('#cpxq'),
        zqlb = j('#zqlb'),
        fxlb = j('#fxlb');
    var pageUtile = {
        bindEvent: function() {
            j('li[data=#sylb]').click(function() { //回报列表

                tabs.removeClass('detail-tab-show');
                j(this).addClass('detail-tab-show');
                tab_pages.removeClass("detail-record-show");
                cpxq.addClass("detail-record-show");
                d.iScroll.refresh();
            });

            j('li[data=#fxjl]').click(function() { //回款记录
                d.iScroll.refresh();
                tabs.removeClass('detail-tab-show');
                j(this).addClass('detail-tab-show');
                tab_pages.removeClass("detail-record-show");
                fxlb.addClass("detail-record-show");
                if (COUNT == 2) { //不重复请求
                    return false;
                }
                r.postLayer({
                    url: PUBLIC._COMMON,
                    data: {
                        requesturl: "2xC2knBHKqUg%2BrG%2FQvZPgPOBjtLVCu9v",
                        proDetailExt: proDetailExt
                    },
                    success: function(data) {
                        if (data.code == '0000') {
                            if (data.data && data.data.length) {
                                $(".no").hide();
                                fxlb_content.append(fxlbTemplate(data.data));
                            } else {
                                $(".no").show();
                            }
                            d.iScroll.refresh();
                            $(".investTip").bind('click', function() {
                                l.alert2('包括垫付利息：' + t.outputmoney_n($(this).data('tip')) + '元');
                            });
                            COUNT = 2;
                        }
                    }
                });
            });
            j("#investTip").bind('touchstart', function() {
                l.alert2('实际年化利率以交易为准');
            });
        },
        creatHelper: function() {
            h.registerHelper('formatNum', function(num, type) {
                if (type == 'yes') {
                    return t.outputmoney(num + '');
                } else if (type == 'no') {
                    return +(num) > 0 ? '+' + t.outputmoney_n(num + "") : t.outputmoney_n(num + "");
                } else {
                    return t.outputmoney_n(num + "");
                }
            });
            h.registerHelper('checkTenderStatus', function(status, surplusSeconds, isInTenMinTrans, cessionCancelValue) {
                if (skip == 'hold' || skip == 'end') {
                    var r = '';
                    switch (status) {
                        case '0':
                        case '5':
                            r = '持有中';
                            break; //持有中
                        case '1':
                            r = '流标';
                            break; //已流标
                        case '2':
                        case '3':
                            r = '已结清';
                            break; //已结清
                        case '4':
                            r = '已转让';
                            break; //已转让
                        case '10':
                        case '15':
                            r = '转让中';
                            break; //转让中
                    }
                    return r;
                } else if (skip == 'transfer') {
                    return '<img src="../../images/checkyes.png" class="choose" data-isInTenMinTrans=' + isInTenMinTrans + ' data-cessioncancel=' + cessionCancelValue + ' style="width: 10%;vertical-align: middle;">';

                }

            });
            h.registerHelper('checkProductRate', function(proRate) {
                if (proRate == '--' || proRate == '') {
                    return '--'
                } else {
                    return proRate;
                }
            });
            h.registerHelper('checkHoldVip', function(proRate,vipRate, addRate) {
                var returnStr = '';
                if (proRate == '--' || proRate == '') {
                    returnStr = '--';
                } else if (vipRate) {
                    returnStr = ((proRate)+(addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '%' + '<img src="/static/mobileSite/images/v.png" style=";width:0.29rem;height:0.29rem;display:inline;">')) || '');
                } else if (!vipRate && addRate) {
                    returnStr = ((proRate)+(addRate && ('+' + addRate + '%')) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style=";width:0.29rem;height:0.29rem;display:inline;">')) || '');
                } else if (!vipRate && !addRate) {
                    returnStr = proRate+'%';
                }
                return returnStr;
            });
            h.registerHelper('checkTransferShow', function(tenderStatus, option) {
                if (skip == 'transfer') {
                    if (tenderStatus == "10" || tenderStatus == '15') { //可取消转让显示
                        return option.fn(this);
                    } else { //不可转让
                        return option.inverse(this);
                    }
                } else {
                    return option.inverse(this);
                }
            });
            h.registerHelper('checkholdshow', function(status, option) {
                if (status == '1' || status == '2' || status == '3' || status == '4') {
                    return option.inverse(this);
                } else {
                    return option.fn(this);
                }
            });
            h.registerHelper('format', function(curRate) {
                curRate = curRate + '';
                return curRate.replace(/\W+/g, '');
            });

            h.registerHelper('compareIndexEnd1', function(index, option) {
                if (index == 0 && COUNT1 == 0) {
                    return option.fn(this);
                } else {
                    COUNT1 = 1;
                    return option.inverse(this);
                }
            });
            h.registerHelper('formatStatus', function(status) {
                var r = '';
                return status == '1' ? '已收' : '待收';
            });
            h.registerHelper('compareStatus', function(status) {
                if (status == '2') {
                    return "已结清";
                } else if (status == '1') {
                    return "已流标";
                } else {
                    return "";
                }
            });
            h.registerHelper('checkTipShow', function(intrest) {
                console.log(intrest);
                if (intrest) {
                    return '<a href="javascript:void(0);" class="investTip" data-tip=' + intrest + '></a>'
                }
            });
        },
        getTenderList: function(loanURL) {
            j('#zqlb').addClass("detail-record-show");
            d.iScroll.refresh();
            var zqlbTemplate = '';
            switch (skip) {
                case 'hold':
                    zqlbTemplate = zqlbHoldTemplate;
                    break;
                case 'transfer':
                    zqlbTemplate = zqlbTransferTemplate;
                    break;
                case 'end':
                    zqlbTemplate = zqlbEndTemplate;
                    break;
            }
            var content = j('#zqlb_content');
            r.setLayerFlag(false);
            r.postLayer({
                url: PUBLIC._COMMON,
                data: {
                    requesturl: "2xC2knBHKqUg%2BrG%2FQvZPgFObH4ama9Ck",
                    proDetailExt: proDetailExt,
                    loanURL: loanURL
                },
                success: function(data) {
                    if (data.code == '0000') {
                        content.html(zqlbTemplate(data.data));
                        d.iScroll.refresh();
                        j("#zqlb_content").find('li').bind("click", function() {
                            if(skip == 'end'){
                                return false;
                            }
                            var id = j(this).attr('id'),
                                protocolUrl = encodeURIComponent(j(this).attr('wmpsAgreeMentHolding'));
                            w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform=' + platform + "&tid=" + encodeURIComponent(id) + '&wmpsAgreeMentHolding=' + protocolUrl + '&v=' + Math.random();
                        });
                    }
                }
            });
        },
        initPage: function() {
            var that = this;
            //页面初始化
            r.postLayer({
                url: PUBLIC._COMMON,
                data: { //出借前获取详情
                    requesturl: "2xC2knBHKqUg%2BrG%2FQvZPgM3o%2FRsGi%2BfK",
                    proDetailExt: proDetailExt
                },
                success: function(data) {
                    if (data.code == "0000") {
                        var info = data.data || {};
                        vipRate = +(info.vipRate);
                        addRate = +(info.addRate);
                        h.registerHelper('checkvip', function(option) {
                            var percentage = '';
                            var supRate = '';
                            if (vipRate) {
                                percentage = '%';
                                supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + percentage + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
                            } else if (!vipRate && addRate) {
                                percentage = '%';
                                supRate = ((addRate && ('+' + addRate + percentage)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
                            } else if (!vipRate && !addRate) {
                                supRate = '%';
                            }
                            return supRate
                        });
                        var supRate = '',
                            curPaidinRate = info.curPaidinRate,
                            loanURL_tender = info.loanURL || '';
                        j('#title').html(info.title || '-'); //名称
                        j(".curPaidInRate").html(info.curPaidInRate || '-'); //当前利率
                        j(".expirePaidInRate").html(info.expirePaidInRate || '-'); //到期年化利率
                        if (+(info.vipRate)) {
                            j("#intrest").html(((addRate && ('+' + addRate)) || '') + '+' + info.vipRate).after("<img src='/static/mobileSite/images/v.png' style='width:0.2933333rem;height:0.29333333rem;'>");
                        } else{
                            j("#intrest").html((addRate && ('+' + addRate)) || '');
                        }
                        j("#transferAmt").html(t.outputmoney_n(info.transferAmt) || '-'); //转让本金
                        j('#amount').html(t.outputmoney_n(info.amount || '-')); //出借本金
                        $("#investAmount").html(t.outputmoney_n(info.amount) || '-'); //出借本金
                        j('#amount_same').html(t.outputmoney_n(info.amount || '-')); //出借本金
                        j('#holdAmount').html(t.outputmoney_n(info.holdAmount || '-')); //持有本金
                        j('.sslx').html(t.outputmoney(info.expirePaidInterest) || '-'); //到期实际利息
                        j('#closePeriod').html(info.closedPeriodDays || '0'); //封闭期
                        j('#hadHoldDays').html((info.hadHoldDays || '-')); //持有时间
                        j("#hadPaidInterest").html(t.outputmoney(info.curPaidInterest || '-')); //已收利息
                        j("#interestModeStr").html(info.payMode || '-'); //付息方式
                        j('#exitTimeStr').html(info.expireTime || '-'); //到期时间
                        j('#payInterstTimeStr').html(info.payInterstTimeStr || '-'); //付息时间
                        j("#interstTimeStr").html(info.startInterTime || '-'); //起息时间
                        j('.enddate').data('lasttime', info.surplusSeconds); //倒计时
                        j("#transRealAmount").html(t.outputmoney(info.transRealAmount) || '-'); //转让后实收
                        j("#unPayInterest").html(t.outputmoney(info.unPayInterest) || '-'); //当期未收利息
                        if(info.effectDate){
                            j("#effectDate").removeClass('dis_none');
                            j("#effectDate").find('label').html(info.effectDate);
                        }
                        if(info.collectPeriod){
                            j("#collectPeriod").removeClass('dis_none');
                            j("#collectPeriod").find('label').html(info.collectPeriod);
                        }
                        +(info.floatAmount) > 0 ? j("#floatAmount").html("+" + t.outputmoney_n(info.floatAmount) || '-') : j("#floatAmount").html(t.outputmoney_n(info.floatAmount) || '-'); //浮动金额
                        //判断转让按钮状态
                        if (skip == 'hold') {
                            if(info.holdAmount == info.amount){
                                j(".amountClass").removeClass('dis_none');
                            }else{
                                j(".holdAmountClass").removeClass('dis_none');
                            }
                            // invest_btn.html(info.canTransferValue);
                            // info.isCanTransfer == '0' ? invest_btn.removeClass('dis_btn').html(info.canTransferValue) : invest_btn.addClass('dis_btn').html(info.canTransferValue);
                             syll.html(syTemplate(info.incomeTable || []));
                            if(info.status == '0'){
                                invest_btn.removeClass('dis_btn');
                            } else if(info.status == '1'){
                                invest_btn.addClass('dis_btn');
                            }else{
                                invest_btn.addClass('dis_btn');
                            }
                            invest_btn_status.html(info.statusCN);
                        } else if (skip == 'transfer') {
                            if(info.status == '3'){ // 10分钟内不可取消转让
                                $(".enddate").data('lasttime',info.surplusTenMins);
                                invest_btn.addClass('dis_btn');
                                t.countDown(2,function(){
                                    $(".enddate").html('');
                                    invest_btn.removeClass('dis_btn');
                                });

                            } else{
                                invest_btn.removeClass('dis_btn');
                            }
                            invest_btn_status.html(info.statusCN);
                        } else if (skip == 'end') {
                            $("#getTip").bind('click', function() {
                                l.alert2(info.realInterestText);
                            });
                        }
                        //
                        if (skip != 'hold') {
                            that.getTenderList(loanURL_tender);
                        }
                        j('li[data=#zqlb]').click(function() {
                            d.iScroll.refresh();
                            PUBLIC.count('MWD-ZMKH-CYZ-CKGD-ZQLB');
                            tabs.removeClass('detail-tab-show');
                            j(this).addClass('detail-tab-show');
                            tab_pages.removeClass("detail-record-show");
                            that.getTenderList(loanURL_tender);
                        });
                        if (vipRate || addRate) {
                            var supRate = '<p style="position:absolute;top: 0;">'+((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '</p><img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
                            $('.vipDom').append(supRate);
                        }
                        //协议
                        var urlentry = info.urlentry || ''; //协议
                        if (urlentry && urlentry.code == '0') {
                            j('#desc').html(urlentry.entryName).bind('click', function() {
                                var protocolUrl = info.protocolUrl;
                                w.location.href = urlentry.entryDesc;
                            });
                        } else {
                            j('#desc').addClass('dis_none');
                        }
                        invest_btn.bind('click', function() {
                            PUBLIC.count('MWD-ZMKH-CYZ-ZR');
                            if (j(this).hasClass('dis_btn')) { return; }
                            if (skip == 'hold') {
                                window.location.href = '/static/mobileSite/html/transfer/sesame_transfer.html?platform=' + platform + "&proDetailExt=" + encodeURIComponent(proDetailExt) + "&curPaidInRate=" + info.curPaidInRate + "&expirePaidInRate=" + info.expirePaidInRate + "&holdAmount=" + info.holdAmount + "&vipRate=" + vipRate + "&addRate=" + addRate + "&title=" + encodeURIComponent(info.title) + "&maxPercent=" + info.maxPercent + "&minPercent=" + info.minPercent + "&loanURL=" + loanURL_tender + "&v=" + Math.random();
                            } else {

                                /*var arr = [];
                                $("img[src='../../images/checkyes.png']").each(function(i, o) {
                                    arr.push({ 'prodStr': $(o).data('cessioncancel') });
                                });
                                var L = arr.length;
                                l.alert1('确认取消' + L + '笔转让债权吗？');*/
                                l.alert1('确认取消本笔转让吗？');
                                l.setOkAction(function() {
                                    // var listStr = $.base64.encode(JSON.stringify(arr));
                                    r.postLayer({
                                        url: PUBLIC._COMMON,
                                        data: {
                                            requesturl: '2xC2knBHKqXvmcqshETXA1ObH4ama9Ck',
                                            cancelApply: proDetailExt
                                        },
                                        success: function(data) {
                                            if (data.code == '0000') {
                                                data = data.data;
                                                // l.alert2(data.countOK + '笔转让债权取消成功');
                                                l.alert2('转让取消成功');
                                                l.setKnowAction(function() {
                                                    window.location.href = '/static/mobileSite/html/success.html?code=transfer_2&platform=' + platform;
                                                });
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        invest_btn.addClass('dis_btn');
                        l.alert2(data.message);
                    }
                }
            });
        },
        init: function() {
            var that = this;
            that.initPage();
            that.creatHelper();
            that.bindEvent();
            $("." + skip).removeClass('dis_none');
            if (skip == 'hold') {
                invest_btn_status.html('转让');
            } else if (skip == 'transfer') {
                $(".detail-inv-end").addClass('dis_none').hide();
                $("li[data=#sylb]").addClass('dis_none');
                $("#cpxq").removeClass('detail-record-show');
                $("li[data=#fxjl]").addClass('dis_none');
                $("li[data=#zqlb]").css('width', "100%").addClass('detail-tab-show');
            } else if (skip == 'end') {
                invest_btn_status.html('已转让');
                invest_btn.addClass('dis_none');
                $(".detail-inv-end").addClass('dis_none').hide();
                $("li[data=#sylb]").addClass('dis_none');
                $("#cpxq").removeClass('detail-record-show');
                $("li[data=#fxjl]").css('width', "49%");
                $("li[data=#zqlb]").css('width', "49%").addClass('detail-tab-show');;
            }

            that.bindEvent();
            that.creatHelper();
        }
    }
    pageUtile.init();








})(window, $, requestUtil, Tools, Layer, Handlebars, COMMON_KH, COMMON_POST, COMMON_Login, dataPage);