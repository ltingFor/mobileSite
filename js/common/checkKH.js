var COMMON_KH = (function(w,r,j,t,l){
	return {
		check_KH : function(sucFun,comFun){
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.KH_CheckKh_URL
				},
				success : function(data,flag){
					var callback = sucFun;
					callback && callback(data);
				}
			});
		},
		creatAndSubForm : function(data){
			var str = '<form style="display: none;" action="" method="post" id="hideForm">'
			for(var i in data){
				if(i != "url"){
					str += '<input type="hidden" name='+i+' value='+data[i]+'>';
				}
			}
			str += '</form>';
			$("body").append(str);
			$("#hideForm").attr('action',data.url);
			$("#hideForm").submit();
			$("#hideForm").remove();
		},
		creatAndSubFormContext : function(data){
			var str = '<form style="display: none;" action="" method="post" id="hideForm">'
			/*for(var i in data){
				if(i != "url"){
					str += '<input type="hidden" name='+i+' value='+data[i]+'>';
				}
			}*/
			str += '</form>';
			$("body").append(str);
			$("#hideForm").attr('action',data.url+"?"+data.context);
			$("#hideForm").submit();
			$("#hideForm").remove();
		}
	}
})(window,requestUtil,$,Tools,Layer);