var desc = '翼龙贷-专业安全的p2p网贷平台';
var title = '翼龙贷- 联想控股成员企业';
// 分享的标题：翼龙公益行，感恩大回馈
// 分享的内容：参与翼龙贷公益活动，享红包+现金奖励！这个双11，让你过的更有意义！
var shareLink = PUBLIC.URL+"/static/mobileSite/index.html?platform=3";
	// alert(shareLink);
var shareImg = PUBLIC.URL+"/static/mobileSite/images/share.jpg";
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); 
     return null;
};
function StringBuffer(){
	this._strArr = [];
};
StringBuffer.prototype = {
	append : function(str){
		this._strArr.push(str);
		return this;
	},
	toString : function(){
		return this._strArr.join('');
	},
	clear : function(){
		this._strArr.length = 0;
	}
};

(function(wx , d , m ,w){
	var timestamp = m.round(new Date().getTime()/1000);
	noncestr = 'eloancn';
	var appId = PUBLIC.APPID;
	
	$.ajax({
		url : '/mobilesite/wechat/v1/02',
		type : 'POST',
		data : {isExpired:false},
		success : function(data){
			console.log(data);
			//alert('ticket=' + data.ticket);
			if(data.code == '0000'){
				data = data.data || {};
				var sign = new StringBuffer();
				sign.append('jsapi_ticket=')
					.append(data.ticket)
					.append('&noncestr=')
					.append(noncestr)
					.append('&timestamp=')
					.append(timestamp)
					.append('&url=')
					.append(w.location.href);
				console.log(sign);
				var configData = {
						debug: false,
						appId :appId,
						timestamp : timestamp,
						nonceStr : noncestr,
						signature : hex_sha1(sign.toString()),
						jsApiList : ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQZone','onMenuShareQQ','onMenuShareWeibo']
				}
				
				wx.config(configData);
				wx.ready(function(){
					wx.checkJsApi({
						jsApiList : ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQZone','onMenuShareQQ','onMenuShareWeibo'],
						success: function(res) {
							initShare();
					    }
					});
				});
				wx.error(function(res){
					console.log('error:' + res);
					// alert('error'+res);
				});
			}
			
		}
	});	
	// requestUtil.post('https://wap.eloancn.com/wechat/connector/jsticket',{isExpired:true},function(data){
		
	// });
})(wx , document , Math , window);

function initShare(){
	//shareLink = linkUrl+'wap/BillYear/share.html?uid=468510&platform=3';
	//if(isWeiXin()){
		wx.onMenuShareTimeline({
			title :title,
			desc : desc,
			link : shareLink,
			imgUrl: shareImg, // 分享图标
			 trigger: function (res) {
		      // alert('用户点击发送给朋友');
		    },
		    success: function (res) {
		    	// alert('分享成功');
		    },
		    cancel: function (res) {
		    	// alert('已取消');
		    },
		    fail: function (res) {
		    	// alert(JSON.stringify(res));
		    }
		});
		wx.onMenuShareAppMessage({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link : shareLink,
			imgUrl: shareImg, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	// alert('分享成功');
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	//alert('已取消');
		    }
		});
		wx.onMenuShareQZone({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link : shareLink,
			imgUrl: shareImg, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	// alert('分享成功');
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	//alert('已取消');
		    }
		});
		wx.onMenuShareQQ({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link : shareLink,
			imgUrl: shareImg, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	// alert('分享成功');
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	//alert('已取消');
		    }
		});
		wx.onMenuShareWeibo({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link : shareLink,
			imgUrl: shareImg, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	// alert('分享成功');
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	//alert('已取消');
		    }
		});
	//}
}
/**
 * 是否是微信
 */
function isWeiXin(){
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		return true;
	}else{
		return false;
	}
} 