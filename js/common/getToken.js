
var GET_Token = (function(w,r,j,t,l){
	return {
		get_token : function(sucFun,comFun){
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : 'mBI9zdBAgnR0RONCptStQjVop%2FK6yi3A'
				},
				success : function(data,flag){
					var callback = sucFun;
					callback && callback(data);
				}
			});
		}
	}
})(window,requestUtil,$,Tools,Layer);