(function(w,j,r,t,l){
  var request_url = PUBLIC.URL_FWD_COMMON+'/index/ajax/ hd_ajax',//体验金 和 抵扣券
    request_url_hg =  PUBLIC.URL_FWD_COMMON + '/act_web/mobile/redbag/current',//红包
    invested_url = '/wechat/html/index.html?id=${openId}&platform=3',
    counter = 1;
    $('.transtion-head').on('click',function(){
      $('.screen-box').show();
      $('.transtion-head>p .screen-btn').addClass('screen-upBtn');
    })
    $('.screen-box,.strong-cancle').on('click',function(){
      $('.screen-box').hide();
      $('.transtion-head>p .screen-btn').removeClass('screen-upBtn');
    })
    var tradeType,timeType;
    screenTab($('.screenList li'));
    screenTab($('.timeList li'));
    $('.strong-selected').on('click',function(){
      tradeType = $('.screenList li.trans-selected').attr('data-trade');
      timeType = $('.timeList li.trans-selected').attr('data-time');
      $('.trans-date').remove();
      $('.transtion-main').html('<div class="trans-date"><ul class="trans-date-list"></ul></div>');
      counter = 1;
      droploadFn($('.transtion-main').find('.trans-date'));
      $('.screen-box').hide();
      return false;
    });

    function screenTab(screenBtn) {
      screenBtn.on('click',function(){
        screenBtn.removeClass('trans-selected');
        $(this).addClass('trans-selected');
        return false;
      })
    }
    $('.strong-selected').trigger('click');
    //droploadFn($('.trans-date'));
    // dropload

    function droploadFn(obj) {
      var num = 10,// 每页展示10个
          sRequesturl = "",
          contId = "";
          sRequesturl = "0nzLDLIxtJvww6jupwp3bzwMqkcS5I9A";
          contId = ".trans-date-list";
      obj.dropload({
        scrollArea : window,
        // domUp : {
        //     domClass   : 'dropload-up',
        //     domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
        //     domUpdate  : '<div class="dropload-update">↑释放更新</div>',
        //     domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        // },
        domDown : {
          domClass   : 'dropload-down',
          domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
          domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
          domNoData  : ''
        },
        loadDownFn : function(me){

          r.postLayer({
            url : PUBLIC._COMMON,
            data : {
              requesturl : sRequesturl,
              pageNo : counter,
              tradeType: tradeType || '0',
              timeType : timeType || '0'
            },
            success : function(data){

              var json = null;
              var result = '',turnoverStr = '';
              if(data.data) {
                json = data.data.list || [];
                if(counter == 1 && json.length == 0) { //首次监测是否有数据
                  // 锁定
                      me.lock();
                      // 无数据
                      me.noData();
                      obj.find('.dropload-down').remove();
                      obj.find('ul').empty();
                      j('.pac-footer span').show();

                      obj.find('ul').css({
                        'height': $(window).height() - $('.packet-head').height(),
                      }).html('<li style="text-align:center;">暂无数据</li>');
                }else{
                  if(json.length > 0 && json.length < 10){
                    for(var i = 0; i < json.length; i++){
                      if(!json[i].outgo){
                        turnoverStr = '<p class="drawal-red">+'+ json[i].income +'</p>';
                      }else{
                        turnoverStr = '<p class="drawal-green">-'+ json[i].outgo +'</p>';
                      }
                      result += renderStr(json[i],turnoverStr);
                        if((i + 1) >= json.length){
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();

                            break;
                        }
                    }

                  }else if(json.length > 0 && json.length == 10){
                    for(var i = 0; i < json.length; i++){
                      if(!json[i].outgo){
                        turnoverStr = '<p class="drawal-red">+'+ json[i].income +'</p>';
                      }else{
                        turnoverStr = '<p class="drawal-green">-'+ json[i].outgo +'</p>';
                      }
                      result += renderStr(json[i],turnoverStr);
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
                  }else{

                      // 锁定
                      me.lock();
                      // 无数据
                      me.noData();
                  }
                }
              }else if(!data.data && counter == 1){

                obj.find('.dropload-down').remove();
                obj.find('ul').empty();
                j('.pac-footer span').show();

                obj.find('ul').css({
                  'height': $(window).height() - $('.packet-head').height(),
                }).html('<li style="text-align:center;">暂无数据</li>');
                // 锁定
                me.lock();
                // 无数据
                me.noData();
              }else{
                // 锁定
                me.lock();
                // 无数据
                me.noData();
              }
              // 为了测试，延迟1秒加载
              setTimeout(function(){
                    $(contId).append(result);
                    // 每次数据加载完，必须重置
                    $('.dropload-down').empty();
                    me.resetload();

              },800);

              counter++;
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
    function renderStr (current,turnoverStr){
      var str = '';

          str = '<li class="date-li"><div class="drawal-money clearfix"><p>'+
                      current.desc +'</p>'+
                      turnoverStr +'</div><div class="drawal-time clearfix"><p>'+
                      current.tradeDate +'</p><p>可用余额: <span>'+
                      current.useableAmt+'</span>元</p></div></li>';

      return str;
    }
})(window,$,requestUtil,Tools,Layer);