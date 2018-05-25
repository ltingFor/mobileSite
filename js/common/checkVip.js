var COMMON_POST = (function(w,r,j,t,l){
	return {
		checkVip : function(sucFun,comFun){
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.CheckVip_URL
				},
				success : function(data){
					var callback = sucFun;
					callback && callback(data);
				}
			});
		}
	}
})(window,requestUtil,$,Tools,Layer);