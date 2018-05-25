var COMMON_Login = (function(w,r,j,t,l){
	return {
		check_Log : function(sucFun,comFun){
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.NEW_CheckLoginStatus_URL
				},
				success : function(data,flag){
					var callback = sucFun;
					callback && callback(data);
				}
			});
		}
	}
})(window,requestUtil,$,Tools,Layer);