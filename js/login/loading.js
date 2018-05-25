window.onload = function(){
		function getParamsByName(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]); 
			else if(!r && name == "platform"){
				return "4";	
			}
		}
		_CODE = getParamsByName('code') || '';
		$.ajax({
			url : PUBLIC._COMMON,
			type : 'POST',
			data : {
				requesturl : CONFIG.NEW_CheckLoginStatus_URL,
				code : _CODE,
				platform : getParamsByName('platform')
			},
			success : function(data){
				PUBLIC.dealPostResult(data);
				if(data.code == '0000'){
					window.location.href = '/static/mobileSite/html/myaccount/myaccount.html?platform='+PUBLIC.platform+"&v="+Math.random();
				}
			}
		});
	}