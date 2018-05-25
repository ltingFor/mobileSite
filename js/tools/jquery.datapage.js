/**
 * 基于iscroll的分页
 */
var dataPage = (function(w,j,r){
	return {
		addListener : function(listenerName,listener){//添加scroll监听
			this._listeners = this._listeners || {};
			listener = listener || {};
			listener.data = listener.data || {};
			listener.pageNo = listener.pageNo || 1;
			listener.pageSize = listener.pageSize || 10;
			listener.totalPage = listener.totalPage;
			listener.callback = listener.callback;
			this._listeners[listenerName] = listener;
		},
		setListenerName : function(listenerName){//设置当前scroll监听
			this.listenerName = listenerName;
		},
		getListener : function(listenerName){//获取scroll监听
			return (this._listeners || {})[listenerName];
		},
		getData : function(){//获取数据
			var that = this;
			var listener = that.getListener(that.listenerName);
			if(!listener){return;}
			listener.data.pageNo = listener.pageNo;
			listener.data.pageSize = listener.pageSize;
			if(listener.pageNo && listener.totalPage && (listener.pageNo>listener.totalPage)){//only new product has totalpage
				// listener.pullDown.text('已是全部数据啦~');
				return false;
			}
			r.setLayerFlag(false);
			r.postLayer({url:listener.url,data:listener.data,success:function(data){
					listener.isloading = false;
					listener.canloading = false;
					listener.pullDown.removeClass('loading');
					listener.pullDown.text('上拉加载更多');
					if(data.code == "0000" || data.code == "0" || data.code == '3000'){//新手中的债权列表是.私人订制相关，成功的空数组是3000
						var dataArr = data.data ? data.data : data.result;//data.data.data 是翼农计划列表，data.data.result是新手
						if(!dataArr && listener.data.pageNo == 1){
							listener.pullDown.remove();
							if(!listener.no_data){
								listener.content.parent().append('<div class="no_data">暂无数据</div>');
								listener.no_data =  listener.content.siblings('.no_data');
							}
							listener.loadingall = true;
							return false;
						}else if(!dataArr && listener.data.pageNo != 1){
							listener.pullDown.remove();
							listener.loadingall = true;
							return false;
						}
						if(that.listenerName == 'tzlb_wmps'){//此处这样处理，是因为在翼农计划详情页的购买列表，接口返回的是整个详情页的数据，数据结构不一致
							dataArr = dataArr.list
						}else{
//							dataArr = dataArr.data ? dataArr.data : (dataArr.result ? dataArr.result : dataArr);	
							dataArr = dataArr.data ? dataArr.data : (dataArr.result ? dataArr.result : (dataArr.list ? dataArr.list : dataArr));
						}
						
						if(dataArr && dataArr.length){//获取到数据
							if(listener.no_data){
								listener.no_data.remove();
								listener.no_data = null;
							}
							listener.pageNo++;
							listener.content.append(listener.template(dataArr));
							if(!that.iScroll){
								that.createIScroll();
							} else {
								that.iScroll.refresh();
							}
						} else {//没有获取到数据
							if(listener.pageNo == 1 && !listener.no_data){
								listener.content.parent().append('<div class="no_data">暂无数据</div>');
								listener.no_data =  listener.content.siblings('.no_data');
								
							}
							that.iScroll.refresh();
						}
						listener.loadingall = !(dataArr && dataArr.length) ? true : (dataArr.length < 10);//判断是否加载所有数据
						if(listener.loadingall){
							listener.pullDown.remove();
							// listener.content.parent().append('<div class="no_data">已是全部数据啦~</div>');
						}
						var callback = listener.callback;
						if(callback){
							callback();
						}
					} else {
						listener.pullDown.remove();
						if(!listener.no_data){
							listener.isloading = false;
							listener.content.parent().append('<div class="no_data">暂无数据</div>');
							listener.no_data =  listener.content.siblings('.no_data');
						}
					}
				}
			});
		},
		init : function(){
			var debounce = function(func,wait){
				var context,args,result;
				var later = function(){
					result = func.apply(context,args);
					context = args = null;
				}
				return function(){
					context = this;
					args = arguments;
					setTimeout(later,wait);
				}
				return result;
			}
			var that = this;
			var winHeight = $(window).height();
			that.iScroll = new IScroll("#wrapper",{mouseWheel: true,click: true,probeType: 2});
			that.iScroll.on('scrollStart',function(){
				window.pullDownStart = this.y;
			});
			that.iScroll.on('scroll',function(){//绑定滑动事件
				var listener = that.getListener(that.listenerName);
				if (listener && !listener.loadingall){
					this.scrollTo(0,this.maxScrollY,400);
					listener.pullDown.text('上拉加载更多');
					listener.canloading = true;//设置可刷新标志
				}
			});

			/**/
			that.iScroll.on('scrollEnd',function(){
				var listener = that.getListener(that.listenerName);
				if(Math.abs(this.y - window.pullDownStart) <= 5 && this.directionY >= 0){
					this.scrollTo(0,this.maxScrollY,400);
					if(listener && listener.canloading && !listener.isloading){
						listener.isloading = true;
						listener.pullDown.text('');
						listener.pullDown.addClass('loading');
						that.getData();	
					}
				}
				})
			
			return that;
		}
	};
})(window,$,requestUtil).init();
