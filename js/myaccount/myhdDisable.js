(function(w,j,r,t,e){
    var param_obj = t.getParams();
    var platform = param_obj.platform;
    droploadFn($('.pac-tab'));
    $('.pac-footer a').on('click',function() {
      w.location.href = 'myhd.html?platform='+platform + "&v=" + Math.random();
    })
    // dropload
    function droploadFn(obj,ticketType) {
      var counter = 0,
          num = 10,// 每页展示10个
          sRequesturl = "LIevx%2B1yqJ%2BdPH3cCouw9jBlVzcg9QlS4jxW37SBD3I%3D",
          contId = ".state-list";
      obj.dropload({
        scrollArea : window,
        
        domDown : {
          domClass   : 'dropload-down',
          domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
          domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
          domNoData  : ''
        },
        loadDownFn : function(me){
          counter++;
          r.postLayer({
            url : PUBLIC._COMMON,
            data : {
              requesturl : sRequesturl,
              page : counter,
            },
            success : function(data){

              var json = data.data.resList;
              
              var result = '';
              if(counter == 1 && json.length == 0) { //首次监测是否有数据

                  // 锁定
                  me.lock();
                  // 无数据 //新样式
                  me.noData();
                  obj.find('.dropload-down').remove();
                  obj.find('ul').empty();
                  j('.pac-footer span').show();

                  obj.find('ul').css({
                    'height': $(window).height() - $('.packet-head').height(),
                    'background': '#f6f6f6 url(../../images/pac-bg3u.png) no-repeat center 2.746667rem',
                    'background-size': '4.026667rem 3.746667rem'
                  });
                // 每次数据加载完，必须重置
                  me.resetload();
              }else{
                if(data.data && data.data.resList.length > 0 && data.data.resList.length == 10){
                    for(var i = 0; i < json.length; i++){
                      result += renderStr (json[i]);
                      if((i + 1) >= json.length){
                          // 锁定
                          me.lock();
                          // 无数据
                          me.noData();
                          // 解锁
                          me.unlock();

                          break;
                      }
                    }
                }else if(data.data && data.data.resList.length < 10 && data.data.resList.length > 0){
                  for(var i = 0; i < json.length; i++){
                      result += renderStr (json[i]);
                      if((i + 1) >= json.length){
                          // 锁定
                          me.lock();

                          // 无数据
                          me.noData();
                          break;
                      }
                    }
                }else{
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
              }
              // 为了测试，延迟1秒加载

                    $(contId).append(result);
                    // 每次数据加载完，必须重置
                    me.resetload();

            },
            error: function(xhr, type){
                  alert('Ajax error!');
                  // 即使加载出错，也得重置
                  me.resetload();
             }
          });
        },
        threshold : 50
      });
    }
    function renderStr (current){
      var str = '';
      switch(current.status){//2:可用 3:已使用 4:已过期
        case 3:
          str = '<li class="state-li state-used-li"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'</h3><div class="clearfix"><div class="state-li-l"><p><strong><span>'+
                (current.balance || '0') +'</span>元</strong>[满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule">使用规则</a></p></div></div></li>';
        break;
        case 3:
          str = '<li class="state-li state-over-li"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'</h3><div class="clearfix"><div class="state-li-l"><p><strong><span>'+
                (current.balance || '0') +'</span>元</strong>[满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule">使用规则</a></p></div></div></li>';
        break;
        default:
          str = '<li class="state-li state-over-li"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'</h3><div class="clearfix"><div class="state-li-l"><p><strong><span>'+
                (current.balance || '0') +'</span>元</strong>[满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule">使用规则</a></p></div></div></li>';

      }
      return str;
    }
})(window,$,requestUtil,Tools);