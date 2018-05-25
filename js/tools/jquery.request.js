/**
 * 请求工具类
 */
var requestUtil = (function(jq,t){
	var getParams = function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]);
			else if(name == "platform"){
				return "4";
			}else{
				return "3";
			}
		};
	var platform = getParams("platform") || '4';
	var _request_flag = false,
	_layer_request_flag = false,
	_layer_html1 = '<div id="post_layer" style="width:100%;height:100%;background:#ffffff;opacity:0;margin:0;padding:0;position:fixed;left:0;top:0;z-index:19998;"></div>'
					+ '<div id="post_loading" style="width:32%;padding-top:5%;left:34%;top:32%;position:fixed;z-index:19997;opacity:0.8;background:#333;border-radius:6px;text-align:center;color:#ffffff;">'
					+ '<img src="/static/mobileSite/images/loading.gif" style="width:26%;max-width:100%;display:inline;">'
					+ '<p style="text-align:center;width:100%;font-size:0.36rem;padding-top:6%;padding-bottom:8%;">',
	_layer_html2 = '</p></div>',
	_layer_html3 = '<div id="post_layer" style="width:100%;height:100%;background:#ffffff;opacity:0;margin:0;padding:0;position:fixed;left:0;top:0;z-index:19998;"></div>'
					+ '<div id="post_loading" style="width:32%;padding-top:5%;left:34%;top:32%;position:fixed;z-index:19997;border-radius:6px;text-align:center;color:#ffffff;">'
					+ '<img src="/static/mobileSite/images/loadingapp.gif" style="width:51%;max-width:100%;display:inline;">'
					+ '<p style="text-align:center;width:100%;font-size:0.36rem;padding-top:6%;padding-bottom:8%;">',
	_post_layer = 0,
	_post_loading = 0,
	_showLayer = function(content){
		if(_post_layer && _post_loading && !content){
			_post_layer.show();
			_post_loading.show();
		} else {
			if(_post_layer){
				_post_layer.remove();
			};
			if(_post_loading){
				_post_loading.remove();
			};
			content = content || '正在加载';
			jq('body').append(_layer_html1 + content + _layer_html2);
			_post_layer = jq('#post_layer');
			_post_loading = jq('#post_loading');
		}
	},
	_showLayer2 = function(content){
		if(_post_layer && _post_loading && !content){
			_post_layer.show();
			_post_loading.show();
		} else {
			if(_post_layer){
				_post_layer.remove();
			};
			if(_post_loading){
				_post_loading.remove();
			};
			content = content || '';
			jq('body').append(_layer_html3 + content + _layer_html2);
			_post_layer = jq('#post_layer');
			_post_loading = jq('#post_loading');
		}
	},
	_getLayerFlag = function(){
		return _layer_request_flag ;
	},
	_hideLayer = function(){
		if(_post_layer && _post_loading){
			_post_layer.hide();
			_post_loading.hide();
		}
	};
	return {
		setFlag : function(flag){
			_request_flag = flag;
		},
		setLayerFlag : function(flag){
			_layer_request_flag = flag;
		},
		post : function(options){
			if(_request_flag){
				return;
			} else {
				_request_flag = true;
			}
			if(options.data){
				options.data.platform = platform;
			}else{
				options.data = {};
				options.data.platform = platform;
			}
			//options.url += '?v='+Math.random();//此做法是防止post请求某些浏览器会缓存
			var complete = options.complete,success = options.success,callback = options.callback;//此处的callback的用意是为了，tender选红包时，点击换一批报错，setKnowAction时没有提示，缺购买成功了
			options.dataType = 'json';
			options.timeout = 15000;
			// options.success = options.success.bind(options);

			options.success = function(data){
				if(callback){
					PUBLIC.dealPostResult(data,callback);
				}else{
					PUBLIC.dealPostResult(data);
				}

				success && success(data);
			};
			options.complete = function(){
				_request_flag = false;
				complete && complete();
			}
			options.error = function(xhr, errorType, error){
				/*if(xhr.statusText =='timeout'){
					Layer.alert2('网络超时，请稍后再试');
				}else{
					Layer.alert2('出错了，小翼也不开心');
				}*/
				Layer.alertAuto('网络不给力，请稍后再试');
			}
			jq.ajax(options);
		},
		postFile : function(options,obj){
			//ajaxSubmit
			if(_layer_request_flag){
				return;
			} else {
				_layer_request_flag = true;
			}
			_showLayer(options.content);
			var complete = options.complete,
				success = options.success;
			options.dataType = 'json';
			options.type = options.type || "POST";
			options.timeout = 15000;
			// options.success = options.success.bind(options);
			options.success = function(data){
				PUBLIC.dealPostResult(data);
				success && success(data);
			};
			options.complete = function(){
				_request_flag = false;
				complete && complete();
			}
			
			options.error = function(xhr, errorType, error){
				/*if(xhr.statusText =='timeout'){
					Layer.alert2('网络超时，请稍后再试');
				}else{
					Layer.alert2('出错了，小翼也不开心');
				}*/
				Layer.alertAuto('网络不给力，请稍后再试');
			}
			obj.ajaxSubmit(options);
		},
		postLayer:function(options){
			if(_layer_request_flag){
				return;
			} else {
				_layer_request_flag = true;
			}
			_showLayer(options.content);
			if(options.data){
				options.data.platform = platform;
			}else{
				options.data = {};
				options.data.platform = platform;
			}
			// options.url += '?v='+Math.random();//此做法是防止post请求某些浏览器会缓存
			var complete = options.complete,
				success = options.success,
				callback = options.callback;
			options.dataType = 'json';
			options.type = options.type || "POST";
			options.timeout = 15000;
			// options.success = options.success.bind(options);
			options.success = function(data){
				if(callback){
					PUBLIC.dealPostResult(data,callback);
				}else{
					PUBLIC.dealPostResult(data);
				}

				success && success(data);
			};
			options.complete = function(){
				_layer_request_flag = false;
				_hideLayer();
				complete && complete();
			};
			options.error = function(xhr, errorType, error){
				Layer.alertAuto('网络不给力，请稍后再试');
				//alert("出错了，小翼也不开心");
			}
			jq.ajax(options);
		},
		postLayerApp:function(options){
			if(_layer_request_flag){
				return;
			} else {
				_layer_request_flag = true;
			}
			_showLayer2(options.content);
			if(options.data){
				options.data.platform = platform;
			}else{
				options.data = {};
				options.data.platform = platform;
			}
			// options.url += '?v='+Math.random();//此做法是防止post请求某些浏览器会缓存
			var complete = options.complete,
				success = options.success,
				callback = options.callback;
			options.dataType = 'json';
			options.type = options.type || "POST";
			options.timeout = 15000;
			// options.success = options.success.bind(options);
			options.success = function(data){
				if(callback){
					PUBLIC.dealPostResult(data,callback);
				}else{
					PUBLIC.dealPostResult(data);
				}

				success && success(data);
			};
			options.complete = function(){
				_layer_request_flag = false;
				_hideLayer();
				complete && complete();
			};
			options.error = function(xhr, errorType, error){
				Layer.alertAuto('网络不给力，请稍后再试');
				//alert("出错了，小翼也不开心");
			}
			jq.ajax(options);
		}
	}
}($));

