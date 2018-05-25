var timer = setTimeout(function(){
	$.ajax({
		url : PUBLIC._COMMON,
		data : {
			requesturl : CONFIG.Activate_URL
		},
		success : function(data){
			console.log(data);
			if(data.code == '0000'){
				data = data.data || {};
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
			}else{
				PUBLIC.dealPostResult(data)
			}
		}
	});
	clearTimeout(timer);
},1000);
