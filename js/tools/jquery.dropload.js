/**
 * js layer 
 * author liting
 * **/
var dataPage = (function($,r){
    return {
        addListener : function(listenerName,listener){//添加dropload监听
            this._listeners = this._listeners || {};
            listener = listener || {};
            listener.data = listener.data || {};
            listener.empty = listener.empty || false;
            listener.pageNo = listener.pageNo || 1;
            listener.page = listener.page || 1;
            listener.pageSize = listener.pageSize || 10;
            listener.totalPage = listener.totalPage;
            listener.dom = listener.dom || $("#scroller");
            listener.callback = listener.callback;
            listener.callback_err = listener.callback_err;
            listener.tabLoadEnd = listener.tabLoadEnd || false;
            this._listeners[listenerName] = listener;
            // this.listener[listenerName] = listener;
        },
        setListenerName : function(listenerName){//设置当前dropload监听
            this.listenerName = listenerName;
        },
        getListener : function(listenerName){//获取dropload监听
            return (this._listeners || {})[listenerName];
        },
        refresh : function(name){
            var that = this;
            if(!that.getListener(name)){
                return false;
            }
            if(that.getListener(name)){
                if(!that.getListener(name).tabLoadEnd){
                    // 解锁
                    that.droploader.unlock();
                    that.droploader.noData(false);
                    that.droploader.resetload();
                }else{
                    // 锁定
                    that.droploader.lock('down');
                    that.droploader.noData();
                    that.droploader.resetload();
                }
            }
        },
        getData : function(){//获取数据
            var that = this;
            var listener = that.getListener(that.listenerName);
            if(!listener){return;}
            listener.data.pageNo = listener.pageNo;
            listener.data.page = listener.page;
            listener.data.pageSize = listener.pageSize;
            if((listener.pageNo || listener.page) && listener.totalPage && (listener.pageNo>listener.totalPage)){//only new product has totalpage
                // listener.pullDown.text('已是全部数据啦~');
                return false;
            }
            r.setLayerFlag(false);
            r.postLayer({url:listener.url+"?v="+Math.random(),data:listener.data,success:function(data){
                    if(data.code == "0000" || data.code == "0"){//新手中的债权列表是0,3000是私人订制产品列表暂无数据
                        if(data.code == '3000'){
                            var dataArr = data.messageData.data.list;
                        }else{
                            var dataArr = data.data ? data.data : data.result;//data.data.data 是翼农计划列表，data.data.result是新手
                        }
                        if(!dataArr && listener.data.pageNo == 1){//请求第一页出错
                            listener.tabLoadEnd = true;
                            that.droploader.lock('down');
                            that.droploader.noData();
                            that.droploader.resetload();
                            return;
                        }else if(!dataArr && listener.data.pageNo != 1){//请求第n页出错
                            that.droploader.lock('down');
                            that.droploader.noData();
                            that.droploader.resetload();
                            return;
                        }
                        if(that.listenerName == 'tzlb_wmps'){//此处这样处理，是因为在加息券，接口返回的是整个详情页的数据，数据结构不一致
                            dataArr = dataArr.pageinfoJSON.data
                        }else if(that.listenerName == 'jiaxiquan'){
                            dataArr = dataArr.resList;
                        }else{
//                            dataArr = dataArr.data ? dataArr.data : (dataArr.result ? dataArr.result : dataArr);   
                            dataArr = dataArr.data ? dataArr.data : (dataArr.result ? dataArr.result : (dataArr.list ? dataArr.list : (dataArr.tenderList ? dataArr.tenderList : dataArr)));     
                        }
                        
                        if(dataArr && dataArr.length){//获取到数据
                            //有数据
                            that.droploader.noData(false);
                            listener.pageNo++;
                            listener.page++;
                            
                            listener.empty ? listener.content.empty().append(listener.template(dataArr)) : listener.content.append(listener.template(dataArr));
                        } else {//没有获取到数据
                            listener.tabLoadEnd = true;
                            that.droploader.lock('down');
                            that.droploader.noData();
                        }
                        listener.loadingall = !(dataArr && dataArr.length) ? true : (dataArr.length < 10);//判断是否加载所有数据
                        if(listener.loadingall){
                            // 数据加载完
                            listener.tabLoadEnd = true;
                            // 锁定
                            that.droploader.lock();
                            // 无数据
                            that.droploader.noData();
                        }
                        var callback = listener.callback;
                        if(callback){
                            callback(data);
                        }
                         //重置
                        that.refresh(that.listenerName);
                    } else {
                        listener.tabLoadEnd = true;
                        that.droploader.lock('down');
                        that.droploader.noData();
                        if(listener.callback_err){
                            listener.callback_err(data);
                        }
                    }
                    that.droploader.resetload();
                },
                callback:listener.callback_err
            });
        },
        resetRenderFunc: function() {
            $('#scroller').empty();
        },
        init : function(){
            var that = this;
            that.droploader = $('#scroller').dropload({
                scrollArea : window,
                domDown : {
                    domClass   : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh">上拉加载更多</div>',
                    domLoad    : '<div class="dropload-load"><span class="droploading"></span>努力加载中...</div>',
                    domNoData  : '<div class="dropload-noData">亲，没有更多啦</div>'
                },
                /*loadUpFn: function(wo) { 
                    me.refreshFunc(wo);
                },*/
                loadDownFn: function(wo) {
                    console.log(wo);
                    that.getData(wo);
                }
            });
            /*that.droploader.prototype.setHasData = function(ishasData) {
                var me = this;
                if (ishasData) {
                  me.isData = true;
                  me.$domDown.html(me.opts.domDown.domRefresh);
                  fnRecoverContentHeight(me);
                } else {
                  me.isData = false;
                  me.$domDown.html(me.opts.domDown.domNoData);
                  fnRecoverContentHeight(me);
                }
              };*/
            /*that.droploader.prototype.resetload = function() {
                var me = this;
                if (me.direction == 'down' && me.upInsertDOM) {
                  me.$domUp.css({ 'height': '0' }).on('webkitTransitionEnd mozTransitionEnd transitionend', function() {
                    me.loading = false;
                    me.upInsertDOM = false;
                    $(this).remove();
                    fnRecoverContentHeight(me);
                  });
                } else if (me.direction == 'up') {
                  me.loading = false;
                  if (me.isData) {
                    me.$domDown.html(me.opts.domDown.domRefresh);
                    fnRecoverContentHeight(me);
                  } else {
                    me.$domDown.html(me.opts.domDown.domNoData);
                  }
                }
              }*/
            return that;
        }
    };
})($,requestUtil).init();
