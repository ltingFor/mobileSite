(function(w,r,j,t,l){
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		openSkipUrl = param_obj.openSkipUrl;
	var pageUtil = {
		toIndex : j("#toIndex"),
		toKaihu : j("#toKaihu"),
		bindEvent : function(){
			var that = this;
			that.toIndex.bind('click',function(){
				w.location.href = "../index.html?platform="+platform;
			});
			that.toKaihu.bind('click',function(){
				w.location.href = decodeURIComponent(that.toKaihu.attr('data-url'));
			});
		},
		init : function(){
			var that = this;
			that.bindEvent();
			if(openSkipUrl){
				that.toKaihu.attr('data-url',openSkipUrl);
			}else{
				that.toKaihu.attr('data-url','../login.html?platform='+platform);
			}
		}
	};
	pageUtil.init();
})(window,requestUtil,$,Tools,Layer);