// var DomainUrl=window.location.protocol+'//'+window.document.domain;var APPID='wx07626208c1cadc05';switch(window.document.domain){case"192.168.2.53":APPID='wx2630b82ac799ed87';break;case"192.168.0.123":APPID='wxb4c77ebe4885cd04';break;case"mobile1.yidongdai.com":APPID='wx2630b82ac799ed87';break;case"mobile2.yidongdai.com":APPID='wxba844b774a1d15f2';break;case"mobile.yidongdai.com":APPID='wx07626208c1cadc05';break;case"mobiletest.yidongdai.com":APPID='wx13d9b5b7f15568bf';break;default:APPID='wx07626208c1cadc05'};function getParamsByName(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null)return unescape(r[2]);else if(!r&&name=="platform"){return"4"}};var PUBLIC={platform:getParamsByName('platform'),URL:DomainUrl,URL_FWD_LOG:"/mobilesite/login/v1/01",URL_FWD_COMMON:"/mobilesite/forward/v1/01",URL_FWD_TICKT:"/mobilesite/wechat/v1/02",URL_IMGCODE:"/mobilesite/stream/v1/01",URL_FWD_IMGCODE:"/mobilesite/stream/v1/02",APPID:APPID,DESkey:'e9284d45-cf2a-4e46-9367-f122413ca6b0',encryptByDES:function(message,key){var keyHex=CryptoJS.enc.Utf8.parse(key);try{var encrypted=CryptoJS.DES.encrypt(String(message),keyHex,{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7})}catch(e){console.log(e)}return encrypted.toString()},dealPostResult:function(data,callback){var code=data.code;if(code=='1002'){var href=window.location.href;if(window.localStorage){window.localStorage.setItem("url",href)}if(PUBLIC.platform=='3'){var REPLACE_REDIRECT_URI=encodeURI(PUBLIC.URL+'/static/mobileSite/login.html?platform=3&v='+Math.random());window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+PUBLIC.APPID+'&redirect_uri='+REPLACE_REDIRECT_URI+'&response_type=code&scope=snsapi_base#wechat_redirect'}else{window.location.href='/static/mobileSite/login.html?platform=4&v='+Math.random()}}if(code=='1026'||code=='1001'){Layer.alert2(data.message);if(PUBLIC.platform=='3'){Layer.setKnowAction(function(){var REPLACE_REDIRECT_URI=encodeURI(PUBLIC.URL+'/static/mobileSite/login.html?platform=3&v='+Math.random());window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+PUBLIC.APPID+'&redirect_uri='+REPLACE_REDIRECT_URI+'&response_type=code&scope=snsapi_base#wechat_redirect'})}else{Layer.setKnowAction(function(){window.location.href='/static/mobileSite/login.html?platform=4&v='+Math.random()})}}else if(code=='6000'){if(PUBLIC.platform=='3'){var REPLACE_REDIRECT_URI=encodeURI(PUBLIC.URL+'/static/mobileSite/index.html?platform=3&v='+Math.random());window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+PUBLIC.APPID+'&redirect_uri='+REPLACE_REDIRECT_URI+'&response_type=code&scope=snsapi_base#wechat_redirect'}}else if(code=='1500'||code=='1501'||code=='1502'||code=='1503'){data=data.data;window.location.href=data.skipUrl}else if(code!='1002'&&code!='1026'&&code!='1001'&&code!='6000'&&code!='1500'&&code!='1501'&&code!='1502'&&code!='1503'&&code!='0000'&&code!='3000'){Layer.alert2(data.message);if(callback){Layer.setKnowAction(callback(data))}}},count:function(serviceId){$.ajax({url:'/mobilesite/log/v1/01',type:'POST',data:{service_id:serviceId},success:function(data){console.log(data)}})}};var CONFIG={NEW_LOG_URL:"/appuser/app001/v2/01",NEW_PicCode_URL:'/appuser/app016/v1/01',NEW_TextCode_URL:"/appuser/app007/v1/01",NEW_Regist_URL:"/appuser/app002/v2/01",NEW_FindPwd_URL:"/appuser/app011/v1/01",NEW_EditPwd_URL:"/appuser/app003/v1/01",NEW_LOGOUT_URL:"/appuser/app001/v1/02",NEW_CheckLoginStatus_URL:'/appuser/app001/v1/04',Announcement_URL:'/appcms/app003/v1/03',Best_Redbag_URL:'/prizes/v1/calculation',NewUserDetail_URL:"/appwmps/app002/v2/01",Banner_URL:'/appcms/app009/v1/01',NewUserStatus_URL:'/apptrade/app011/v2/06',CheckVip_URL:'/appuser/app023/v1/01',InvestList_Wmps_URL:'/appwmps/app004/v2/01',InvestList_Tailor_URL:'/apptailor/app002/v1/02',InvestList_Sesame_URL:'/sesame/v1/app001/a.do',InvestList_transfer_URL:'/sesame/v1/app007/a.do',Myaccount_URL:"/apptrade/app011/v2/01",Myaccount_Status_URL:"/apptrade/app009/v1/01",MyAvalabelMoney_URL:'/apptrade/app011/v2/05',Safe_EditBankMobile_URL:'/apppay/app001/v2/01',Safe_EditTransPwd_URL:'/appuser/app014/v2/01',WithDraw_AccountInfo_URL:'/apppay/app004/v2/01',WithDraw_delCard_URL:'/apppay/app008/v2/01',WithDraw_AddCard_URL:'/apppay/app006/v2/01',WithDraw_Tixian_URL:'/apppay/app004/v2/02',Recharge_Init_URL:"/apppay/app003/v2/01",Recharge_GetPayWays_URL:"/apppay/app002/v2/01",Recharge_URL:"/apppay/app002/v2/02",COMMON_TenderDetail_URL:'/apptrade/app013/v2/01',WMPS_UserUseabelAmount_URL:'/appwmps/app001/v2/01',REDBAGLOCK:'/appcms/app012/v1/01',WMPS_Pro_Detail_URL:'/appwmps/app005/v2/01',WMPS_Pro_TenderList_URL:'/appwmps/app009/v2/01',WMPS_Pro_InvestList_URL:"/appwmps/app005/v2/01",WMPS_InvestInit_URL:'/appwmps/app001/v2/09',WMPS_LockTender_URL:'/appwmps/app001/v2/02',WMPS_GetLockTender_URL:'/appwmps/app001/v2/04',WMPS_ChangeTender_URL:'/appwmps/app001/v2/03',WMPS_Invest_URL:'/appwmps/app001/v2/06',WMPS_Invest_URL_NEW:'/appwmps/app001/v2/10',Invest_SuccessPop_Act_URL:"/appcms/app006/v1/01",Newpro_Invest_URL_NEW:'/appwmps/app001/v2/11',Newpro_Invest_URL:'/appwmps/app001/v2/07',Best_AvalableRedbag_URL:'/act_web/prizes/v1/calculation',OverDeal_List_URL:'/appwmps/app003/v2/01',HoldDeal_List_URL:"/appwmps/app003/v2/01",KH_CredentialList_URL:'/appuser/app025/v2/01',KH_GetBankList_URL:'/apppay/app010/v2/01',KH_setInfo_URL:'/appuser/app025/v2/02',KH_CheckKh_URL:'/apppay/app009/v2/01',Activate_URL:'/appuser/app025/v2/04',RegExp_Mobile_URL:'/appuser/app018/v1/01',KH_INIT_URL:'/appuser/app025/v2/08',Sesame_InvestList_URL:"/sesame/v1/app001/a.do",Sesame_Detail_URL:'/sesame/v1/app001/b.do',Sesame_Pro_TenderList_URL:'/sesame/v1/app004/a.do',Sesame_Invest_RedbagList:'/act_web/prizes/v1/bagList',GetToken_URL:'/sesame/v2/app009/01',Transfer_InvestList_URL:"/sesame/v1/app007/a.do"};if(PUBLIC.platform=='3'){document.write('<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');document.write('<script src="/static/mobileSite/js/lib/share.js?v=0.1"></script>');document.write('<script src="/static/mobileSite/js/lib/wxshare.js?v=0.3"></script>');document.write('<script src="https://jic.talkingdata.com/app/h5/v1?appid=A839EF51B087434E8FF1BBBB80CF69CA&vn=翼龙钱包&vc=20170612"></script>');}else if(PUBLIC.platform=='4'){document.write('<script src="https://jic.talkingdata.com/app/h5/v1?appid=CB3479615B6442A0A2031457E61B2DFC&vn=翼龙贷WAP站&vc=20170612"></script>');};document.write('<script>'+'var _hmt = _hmt || [];'+'(function() {'+'var hm = document.createElement("script");'+'hm.src = "https://hm.baidu.com/hm.js?e461699ad98ce388b9ba98f42dfac626";'+'var s = document.getElementsByTagName("script")[0]; '+'s.parentNode.insertBefore(hm, s);'+'})();'+'</script>');
//
var DomainUrl = window.location.protocol + '//' + window.document.domain;
var APPID = 'wx07626208c1cadc05';
var domain = 'http://192.168.2.54:8082';
switch (window.document.domain) {
    case "192.168.2.53":
        APPID = 'wx2630b82ac799ed87';
        break;
    case "192.168.0.123":
        APPID = 'wx3fded54d0cd80383';
        domain = 'http://192.168.2.54:8082';
        break;
    case "mobile1.eloancn.com":
        APPID = 'wx2630b82ac799ed87';
        break;
    case "mobile2.eloancn.com":
        APPID = 'wxba844b774a1d15f2';
        break;
    case "mobile.eloancn.com":
        APPID = 'wx07626208c1cadc05';
        domain = 'https://tpapi2.eloancn.com';
        break;
    case "mobiletest.eloancn.com":
        APPID = 'wx13d9b5b7f15568bf';
        domain = 'https://tpapi.eloancn.com';
        break;
    case "mobile.yidongdai.com":
        APPID = 'wxa063652fcb0e0429';
        domain = 'https://tpapi.yidongdai.com';
        break;
    case "192.168.0.83":
        domain = 'https://192.168.2.54:8087';
        break;
    default:
        APPID = 'wx07626208c1cadc05'
};
window.onload=function () {
    document.addEventListener('touchstart',function (event) {
        if(event.touches.length>1){
            event.preventDefault();
        }
    })
    var lastTouchEnd=0;
    document.addEventListener('touchend',function (event) {
        var now=(new Date()).getTime();
        if(now-lastTouchEnd<=300){
            event.preventDefault();
        }
        lastTouchEnd=now;
    },false)
}


function getParamsByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    else if (!r && name == "platform") {
        return "4";
    }

};
var PUBLIC = {
    platform: getParamsByName('platform'),
    URL: DomainUrl,
    URL_FWD_LOG: "/mobilesite/login/v1/01",
    URL_FWD_COMMON: "/mobilesite/forward/v1/01",
    _COMMON: "/mobilesite/forward/v1/02",
    URL_FWD_TICKT: "/mobilesite/wechat/v1/02",
    URL_IMGCODE: "/mobilesite/stream/v1/01",
    URL_FWD_IMGCODE: "/mobilesite/stream/v1/02",
    APPID: APPID,
    DESkey: 'e9284d45-cf2a-4e46-9367-f122413ca6b0',
    PHP_Domain:domain,
    encryptByDES: function(message, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        try {
            var encrypted = CryptoJS.DES.encrypt(String(message), keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })
        } catch (e) {
            console.log(e)
        }
        return encrypted.toString()
    },
    dealPostResult: function(data, callback) {
        var code = data.code;
        if (code == '1002') {
            var href = window.location.href;
            if (window.localStorage) {
                window.localStorage.setItem("url", href)
            }
            if (PUBLIC.platform == '3') {
                var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect'
            } else {
                window.location.href = '/static/mobileSite/login.html?platform=4&v=' + Math.random()
            }
        }
        if (code == '1026' || code == '1001') {
            Layer.alert2(data.message);
            if (PUBLIC.platform == '3') {
                Layer.setKnowAction(function() {
                    var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/login.html?platform=3&v=' + Math.random());
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect'
                })
            } else {
                Layer.setKnowAction(function() {
                    window.location.href = '/static/mobileSite/login.html?platform=4&v=' + Math.random()
                })
            }
        } else if (code == '6000') {
            if (PUBLIC.platform == '3') {
                var REPLACE_REDIRECT_URI = encodeURI(PUBLIC.URL + '/static/mobileSite/index.html?platform=3&v=' + Math.random());
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + PUBLIC.APPID + '&redirect_uri=' + REPLACE_REDIRECT_URI + '&response_type=code&scope=snsapi_base#wechat_redirect'
            }
        } else if (code == '1500' || code == '1501' || code == '1502' || code == '1503') {
            data = data.data;
            window.location.href = data.skipUrl
        }else if(code == '1504' || code == '1505' || code == '1506'){
            Layer.alert1(data.message);
            if(code == '1506'){
                Layer.setOktext('重新测评');
            }else{
                Layer.setOktext('立即参与');
            }
            data = data.data;
            Layer.setOkRedirectUrl(data.riskEvaluateURL);
            /*Layer.setKnowAction(function(){
                window.location.href = data.riskEvaluateURL;
            });*/
        }else if (code != '1504' && code != '1505' && code != '1506' && code != '1002' && code != '1026' && code != '1001' && code != '6000' && code != '1500' && code != '1501' && code != '1502' && code != '1503' && code != '0000' && code != '3000') {
            Layer.alert2(data.message);
            if (callback) {
                Layer.setKnowAction(callback(data))
            }
        }
    },
    count: function(serviceId) {
        $.ajax({
            url: '/mobilesite/log/v1/01',
            type: 'POST',
            data: {
                service_id: serviceId,
                platform:getParamsByName('platform')
            },
            success: function(data) {
                console.log(data)
            }
        })
    }
};
var CONFIG = {
    NEW_LOG_URL: "ELvOAP5boQ3iS%2BUs2aASAmLlQHSeMZ%2Fg",
    NEW_PicCode_URL: 'ELvOAP5boQ1LyqzAmsC5hUXEsV49x4OX',
    NEW_TextCode_URL: "ELvOAP5boQ1eBBbEi7779EXEsV49x4OX",
    NEW_Regist_URL: "ELvOAP5boQ08KyyoiGnnHWLlQHSeMZ%2Fg",
    NEW_FindPwd_URL: "ELvOAP5boQ348WhYcMBEJkXEsV49x4OX",
    NEW_EditPwd_URL: "ELvOAP5boQ1bFzLjSs%2BTfEXEsV49x4OX",
    NEW_LOGOUT_URL:'ELvOAP5boQ3iS%2BUs2aASAnF0i2sJeCBv',
    NEW_CheckLoginStatus_URL: 'ELvOAP5boQ3iS%2BUs2aASArWMqF78FS1M',
    Announcement_URL: 'sU02HJpFAVwRjnExvLq9KIuMeLsFebNu',
    Best_Redbag_URL: 'nTx93AqLsPbIfS8rPBXbeoNHV4M1jNME',
    NewUserDetail_URL: "Ls5SF9UahdqMR4OPpVz0eyqCFxy7cf0e",
    Banner_URL: 'sU02HJpFAVzV1BOXV4BFMdk8uaggKnzH',
    NewUserStatus_URL: '/apptrade/app011/v2/06',
    CheckVip_URL: 'ELvOAP5boQ2Foqz8oulNNkXEsV49x4OX',
    InvestList_Wmps_URL: 'Ls5SF9UahdoreralDXhxsWLlQHSeMZ%2Fg',
    InvestList_WmpsPlus_URL: 'FnpG0BZijqSU9h4Rq6j9oHGTF6qr2jTuqXK2XaJYWkQ%3D',
    InvestList_Tailor_URL: 'mBI9zdBAgnR0RONCptStQuTJINYOLBgT',
    Myaccount_URL: "0nzLDLIxtJvww6jupwp3b6uf4h2oSGSD",
    Myaccount_Status_URL: "0nzLDLIxtJuxDxoKyaoaeYiiSObWxUzo",
    MyAvalabelMoney_URL: '0nzLDLIxtJvww6jupwp3bzbYu6lBv2Xm',
    Safe_EditBankMobile_URL: '%2F8SPpeSkULSsvjamU%2FqvwT85M1sP8%2BMT',
    Safe_EditTransPwd_URL: 'ELvOAP5boQ3YVIlsXgdZgmLlQHSeMZ%2Fg',
    WithDraw_AccountInfo_URL: '%2F8SPpeSkULQqgSbEkuQfiT85M1sP8%2BMT',
    WithDraw_delCard_URL: '%2F8SPpeSkULQTJQXFaC7uxT85M1sP8%2BMT',
    WithDraw_AddCard_URL: '%2F8SPpeSkULRPrE6Ay7hpjj85M1sP8%2BMT',
    WithDraw_Tixian_URL: '%2F8SPpeSkULQqgSbEkuQfifMaTQXWFxPs',
    Recharge_Init_URL: "%2F8SPpeSkULQRjnExvLq9KD85M1sP8%2BMT",
    Recharge_GetPayWays_URL: "%2F8SPpeSkULQceAmQz1IQND85M1sP8%2BMT",
    Recharge_URL: "%2F8SPpeSkULQceAmQz1IQNPMaTQXWFxPs",
    COMMON_TenderDetail_URL: '0nzLDLIxtJvcigZxd5gYFauf4h2oSGSD',
    WMPS_UserUseabelAmount_URL: '/appwmps/app001/v2/01',
    _REDBAGLOCK: 'sU02HJpFAVwLa6fmbAGmzdk8uaggKnzH',
    WMPS_Pro_TenderList_URL: 'Ls5SF9UahdoH1E5u8NAqHGLlQHSeMZ%2Fg',
    WMPS_InvestInit_URL: 'Ls5SF9UahdriS%2BUs2aASAhBuido3JocK',
    WMPS_LockTender_URL: 'Ls5SF9UahdriS%2BUs2aASAiqCFxy7cf0e',
    WMPS_GetLockTender_URL: 'Ls5SF9UahdriS%2BUs2aASAkCiH3Xldtgq',
    WMPS_ChangeTender_URL: 'Ls5SF9UahdriS%2BUs2aASAoAnezeDzAJo',
    WMPS_Invest_URL: 'Ls5SF9UahdriS%2BUs2aASAlwU2guqdc6t',
    WMPS_Invest_URL_NEW: 'Ls5SF9UahdriS%2BUs2aASAuyylTtf9fnQ',
    Invest_SuccessPop_Act_URL: "sU02HJpFAVxPrE6Ay7hpjtk8uaggKnzH",
    Newpro_Invest_URL_NEW: 'Ls5SF9UahdriS%2BUs2aASAlAtoMdMvDIf',
    Newpro_Invest_URL: 'Ls5SF9UahdriS%2BUs2aASAjtOfJXBidH%2F',
    Best_AvalableRedbag_URL: 'LIevx%2B1yqJ%2BdPH3cCouw9sh9Lys8Fdt6g0dXgzWM0wQ%3D',
    OverDeal_List_URL: 'Ls5SF9UahdpbFzLjSs%2BTfGLlQHSeMZ%2Fg',
    HoldDeal_List_URL: "Ls5SF9UahdpbFzLjSs%2BTfGLlQHSeMZ%2Fg",
    Hold_ynjhPlus_list:'FnpG0BZijqSU9h4Rq6j9oJW9UzOruRgPqXK2XaJYWkQ%3D', 
    ynjhPlus_detail:'FnpG0BZijqSU9h4Rq6j9oJW9UzOruRgPnPPVPX4btAI%3D',//翼农计划+ 购买后详情
    KH_CredentialList_URL: 'ELvOAP5boQ2Ym0G6ZdZmXWLlQHSeMZ%2Fg',
    KH_GetBankList_URL: '%2F8SPpeSkULT0I4JUUmR6TD85M1sP8%2BMT',
    KH_setInfo_URL: 'ELvOAP5boQ2Ym0G6ZdZmXSqCFxy7cf0e',
    KH_CheckKh_URL: '%2F8SPpeSkULTV1BOXV4BFMT85M1sP8%2BMT',
    Activate_URL: 'ELvOAP5boQ2Ym0G6ZdZmXUCiH3Xldtgq',
    RegExp_Mobile_URL: 'ELvOAP5boQ3n%2Bg7ycuzdH0XEsV49x4OX',
    KH_INIT_URL: 'ELvOAP5boQ2Ym0G6ZdZmXbIYUXTWyS9Y',
    Sesame_InvestList_URL: "2xC2knBHKqXd6JBNPynICs3o%2FRsGi%2BfK",
    Sesame_Invest_RedbagList: 'LIevx%2B1yqJ%2BdPH3cCouw9luUV9fszPvjmonmTRSuTtk%3D',
    GetToken_URL: 'ok8XdMSuHBDvJ5f0wWtJ44zcPU%2BbNfKN',
    Transfer_InvestList_URL: "ok8XdMSuHBDXgDlyq889Qryyr%2BZqO0R1",
    Tender_SRDZ:'mBI9zdBAgnR0RONCptStQiwQhP30mdup'
};
if (PUBLIC.platform == '3') {
    document.write('<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
    document.write('<script src="/static/mobileSite/js/lib/share.js?v=0.1"></script>');
    document.write('<script src="/static/mobileSite/js/lib/wxshare.js?v=0.3"></script>');
    document.write('<script src="https://jic.talkingdata.com/app/h5/v1?appid=A839EF51B087434E8FF1BBBB80CF69CA&vn=翼龙钱包&vc=20170612"></script>');
} else if (PUBLIC.platform == '4') {
    document.write('<script src="https://jic.talkingdata.com/app/h5/v1?appid=CB3479615B6442A0A2031457E61B2DFC&vn=翼龙贷WAP站&vc=20170612"></script>');
};
// document.write('<script>' + 'var _hmt = _hmt || [];' + '(function() {' + 'var hm = document.createElement("script");' + 'hm.src = "https://hm.baidu.com/hm.js?e461699ad98ce388b9ba98f42dfac626";' + 'var s = document.getElementsByTagName("script")[0]; ' + 's.parentNode.insertBefore(hm, s);' + '})();' + '</script>');
