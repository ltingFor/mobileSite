var timer = setTimeout(function(){
	var getParamsByName = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); 
		else if(!r && name == "platform"){
			return "4";	
		}
	};
	$.ajax({
		url : PUBLIC._COMMON,
		data : {
			requesturl : CONFIG.Activate_URL,
			platform:getParamsByName('platform')
		},
		success : function(data){
			console.log(data);
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
		}
	});
	clearTimeout(timer);
},2000);
