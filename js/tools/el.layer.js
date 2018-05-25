/**
 * js layer 
 * author liting
 * **/
var Layer = (function(w,d,jq){
	var alert_layer = d.querySelector('.alert_layer'),
		alert_box_ok = d.querySelector('.alert_box_ok'),
		alert_box_yes = d.querySelector('.alert_box_yes'),
		alert_btn_ok = d.querySelector('.alert_btn_ok'),
		alert_btn_cancel = d.querySelector('.alert_btn_cancel'),
		alert_btn_know = d.querySelector('.alert_btn_know');
		alert_auto = d.querySelector('.alert_auto');
	var bind = function(node,event_type,fun){
		if(!node){return;}
		if(typeof node.addEventListener == 'function'){
			node.addEventListener(event_type,fun);
		} else if(typeof alert_btn_cancel.attachEvent == 'function'){
			node.attachEvent(event_type,fun);
		}
	};
	var setNodeContent = function(root_node,content,attention){
		var alert_content = root_node.firstChild.nextSibling.nextSibling.nextSibling;
		if(typeof alert_content.innerText == 'string'){
			alert_content.innerHTML = content;
		} else if(typeof alert_content.textContent == 'string'){
			alert_content.textContent.textContent = content;
		}
		if(attention){
			var alert_attention = alert_content.nextSibling.nextSibling;
			if(typeof alert_attention.innerText == 'string'){
				alert_attention.innerHTML = attention;
			} else if(typeof alert_attention.textContent == 'string'){
				alert_attention.textContent.textContent = attention;
			}
		}
	};
	var setAutoContent = function(content){
		if(typeof content == 'string'){
			alert_auto.firstChild.innerHTML = content;
		}
	}
	return {
		isNumber : function(str){
			return reg.test(str);
		},
		setOktext:function(text){
			jq(alert_btn_ok).text(text);
		},
		resetOktext:function(){
			jq(alert_btn_ok).text('确定');
		},
		getParams : function(href){
			var param_obj = {};
			href = href || w.location.href;
			var strs = href.split('?');
			if(strs.length > 1){
				var href_str = strs[1];
				var params = href_str.split('&');
				for(var i=0,len=params.length;i<len;i++){
					var ps = params[i].split('=');
					param_obj[ps[0]] = (ps[1] || '');
				}
			}
			param_obj.platform = param_obj.platform || '3';
			return param_obj;
		},
		refreshState : function(href){
			href = href || w.location.href;
			var strs = href.split('&v=');
			var new_href = strs[0] + '&v=' + Math.random();
			w.history.replaceState('',w.document.title,new_href);
		},
		hideLayer : function(){
			var auto = setInterval(function(){
				alert_layer.style.display = 'none';
				alert_box_yes.style.display = 'none';
				alert_box_ok.style.display = 'none';
				clearInterval(auto);
			},0);
		},
		showLayer : function(){
			var auto = setInterval(function(){
				alert_layer.style.display = 'block';
				clearInterval(auto);
			},0);	
		},
		setOkRedirectUrl : function(url){
			this._okRedirectURL = url;
			this._okFlag = 1;
		},
		setOkAction : function(fun){
			this._okAction = fun;
			this._okFlag = 2;
		},
		setCancelAction : function(fun){
			this._cancelAction = fun;
		},
		setKnowRedirectUrl : function(url){
			this._knowRedirectURL = url;
			this._knowFlag = 1;
		},
		setKnowAction : function(fun){
			this._knowAction = fun;
			this._knowFlag = 2;
		},
		setAlertContet : function(type,content,attention){
			if(type == 'ok'){
				setNodeContent(alert_box_ok,content,attention);
			} else if(type == 'yes'){
				setNodeContent(alert_box_yes,content,attention);
			}
		},
		bindEvent : function(){
			var that = this;
			bind(alert_btn_cancel,'click',function(e){
				var target = e.target || e.srcElement;
				var box = target.parentNode.parentNode;
				alert_layer.style.display = 'none';
				box.style.display = 'none';
				if(that._cancelAction){
					that._cancelAction();
				}
			});
			bind(alert_btn_ok,'click',function(e){
				var target = e.target || e.srcElement;
				var box = target.parentNode.parentNode;
				alert_layer.style.display = 'none';
				box.style.display = 'none';
				if(that._okRedirectURL && that._okFlag == 1){
					w.location.href = that._okRedirectURL;
				}
				if(that._okAction && that._okFlag == 2){
					that._okAction();
				}
			});
			bind(alert_btn_know,'click',function(e){
				var target = e.target || e.srcElement;
				var box = target.parentNode.parentNode;
				alert_layer.style.display = 'none';
				box.style.display = 'none';
				if(that._knowRedirectURL && that._knowFlag == 1){
					w.location.href = that._knowRedirectURL;
				}
				if(that._knowAction && that._knowFlag == 2){
					that._knowAction();
				}
			});
		},
		alert1 : function(content,attention,title,titleFlag){
			this.resetOktext();
			if(content || attention){
				setNodeContent(alert_box_ok,content,attention);
			}
			if(title){
				alert_box_ok.firstChild.nextSibling.textContent = title;
			}
			if(titleFlag == 'center'){
				$(alert_box_ok.firstChild.nextSibling).css({'text-align':"center","width":'100%',"padding-left":'0'});
			}
			var auto = setInterval(function(){
				alert_layer.style.display = 'block';
				alert_box_ok.style.display = 'block';
				clearInterval(auto);
			});
		},
		/*
		* content : 内容
		* attention ： 提示
		* title : 标题
		*/
		alert2 : function(content,attention,title,titleFlag){
			if(content || attention){
				setNodeContent(alert_box_yes,content,attention);
			}
			if(title){
				alert_box_yes.firstChild.nextSibling.textContent = title;
			}
			if(titleFlag == 'center'){
				$(alert_box_yes.firstChild.nextSibling).css({'text-align':"center","width":'100%',"padding-left":'0'});
			}
			var auto = setInterval(function(){
				alert_layer.style.display = 'block';
				alert_box_yes.style.display = 'block';
				clearInterval(auto);
			});
		},
		alertAuto : function(content,callback){
			if(content){
				setAutoContent(content);
			}
			alert_auto.style.display = 'block';	

			var timer = setTimeout(function(){
				alert_auto.style.display = 'none';
				clearTimeout(timer);
				callback && callback();
			},2000);
		},
		init : function(){
			this.bindEvent();
			return this;
		}
	};
})(window,document,$).init();