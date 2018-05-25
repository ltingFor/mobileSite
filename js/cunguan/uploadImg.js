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
var lastImgUrl = '';//记录上次的文件
 function PreviewImage(imgFile,type){
	var pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.bmp$)|(\.*.JPG$)|(\.*.PNG$)|(\.*.JPEG$)/;
    if(!pattern.test(imgFile.value)){
        Layer.alert2('您要上传的图片不正确，请重新上传');
        Layer.setKnowAction(function(){
        	if(type == 'zImg'){
        		$('#'+type).attr('src','../../images/card2.png');	
        	}else{
        		$('#'+type).attr('src','../../images/card1.png');	
        	}
        	$("#subBtn").addClass('dis_btn');
        });

        imgFile.focus();
    }else{
        //图片路径
        var path;
        // $("#imgContent").html("<div id='1'><img src=''/></div>")
        if(document.all){
            imgFile.select();
            path = document.selection.createRange().text;
            lastImgUrl = path;
            document.getElementById(type).style.filter = "progrid:DXImageTransgerform.Microsoft.AlphaImageLoader(enabled=''true,sizingMethod='scale',src=\""+path+"\")";
        }else{
            path = URL.createObjectURL(imgFile.files[0]);
            $('#'+type).attr('src',path);
            lastImgUrl = path;
        }

        if($('#card2').hasClass('dis_none')){
            	$("#subBtn").removeClass('dis_btn');
		}else{
			if($("#zImg").attr('src') != '../../images/card2.png' && $("#fImg").attr('src') != '../../images/card1.png'){
            	$("#subBtn").removeClass('dis_btn');
            }else{
            	$("#subBtn").addClass('dis_btn');
            }
		}
    }
}
(function(w,r,j,t,l,wx){
	var imgUtil = {
		zImg : j("#zImg"),
		fImg : j("#fImg"),
		zFile : j("#zFile"),
		fFile : j("#fFile"),
		subBtn : j("#subBtn"),

		zfForm : j("#zfForm"),
		imgDiv2 : j(".cun-card2"),
		// imgLayer : j("#imgLayer"),
		// takePic : j("#takePic"),
		// imgFile : j("#imgFile"),
		// cancelBtn : j("#cancelBtn"),

		isWeixin : false,

		bindEvent : function(){
			var that = this;
			that.zImg.bind('click',function(){
				that.PreviewImage_w('z');
			});

			that.fImg.bind('click',function(){
				that.PreviewImage_w('f');
			});
			that.zFile.change(function(){
				console.log(that.zFile.value);
			});
			that.subBtn.bind('click',function(){
				if(that.subBtn.hasClass('dis_btn')){
					return false;
				}
				var zs = that.zImg.attr('src'),fs = that.fImg.attr('src');
				if(zs != '../../images/card2.png' && zs && fs != '../../images/card2.png' && fs){
					that.uploadImg();
				}else{
					l.alert2('请上传证件照片');
				}
			});	
		},
		PreviewImage_w : function(type){
			var that = this;
			if(that.isWeixin){
				wx.ready(function () {
				    wx.checkJsApi({
				      jsApiList : ['chooseImage','previewImage','uploadImage'],
				      success: function(res) {
				        // alert(1);
				      }
				    });
				    // 在这里调用 API
			        wx.chooseImage ({
			            success : function(res){
			                var localIds = res.localIds; 
			                if(localIds.length > 1){
			                	l.alert2('请选择一张证件照进行上传');
			                	return false;
			                }
			                alert(localIds);
			                if(type == 'z'){
				                that.zImg.attr("src",localIds);
				            }else if(type == 'f'){
				                that.fImg.attr("src",localIds);
				            }	

			            }
			        });
				  });
			}else{
				if(type == 'z'){
					that.zFile.click();
				}
				else if(type == 'f'){
					that.fFile.click();
				}
			}
			
		},
		/*configJDK : function(){
			r.post({//获取jsticket
				url : '/mobilesite/wechat/v1/02',
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						var timestamp = Math.round(new Date().getTime()/1000);
						var sign = new StringBuffer();
						    sign.append('jsapi_ticket=')
						      .append(data.ticket)
						      .append('&noncestr=')
						      .append('eloancn')
						      .append('&timestamp=')
						      .append(timestamp)
						      .append('&url=')
						      .append(window.location.href);
						  wx.config({
						    debug: false, //调试阶段建议开启
						    appId: PUBLIC.APPID,
						    timestamp: timestamp,
						    nonceStr: 'eloancn',
						    signature: hex_sha1(sign.toString()),
						    jsApiList: [
						          "chooseImage",
						          "previewImage",
						          "uploadImage"
						    ]
					    });
					}
				}
			});
			
		},*/
		uploadImg : function(){
			var that = this;
			r.setLayerFlag(false);
			var obj = that.zfForm;
			r.postFile({
				url:'/mobilesite/stream/v1/04',
				data:{
					requesturl:'/appuser/app020/v1/03',
					remoteFileName:'files'
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						window.location.href = data.data.url || '';
					}
				}
			},obj);
		},
		checkWeixin : function(){
			var ua = window.navigator.userAgent.toLowerCase(); 
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
				return true; 
			}else{ 
				return false; 
			} 
		},
		init : function(){
			var that = this,cardType = t.getParamsByName('cardType');
			if(cardType == '2'){
				that.imgDiv2.addClass('dis_none');
			}
			that.isWeixin = false;
			//that.isWeixin = that.checkWeixin();
			/*if(that.isWeixin){
				that.configJDK();
			}*/
			that.bindEvent();
		}
	};
	imgUtil.init();
})(window,requestUtil,$,Tools,Layer,wx)