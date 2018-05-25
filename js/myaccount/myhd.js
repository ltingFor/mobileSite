(function(w,j,r,t,l){
    var param_obj = t.getParams();
    var platform = param_obj.platform;
    //兑换红包
    $("#wrap_close").hide();
    $(".duihuan").bind('click',function(){
      l.showLayer();
      $("#getRedbag").removeClass('dis_none');
    });
    $('.input_').bind('input propertychange',function(){
      $("#wrap_close").show();
    });
    $("#wrap_close").bind('click',function(){
      $('.input_').val('');
      $(this).hide();
    });
    $('.btn_cancel').bind('click',function(){
      l.hideLayer();
      $('#getRedbag').addClass('dis_none');
      $('#duiTip').addClass('dis_none');
      $(".input_").val('');
    });
    $("#ok").bind('click',function(){
      var val = $.trim($('.input_').val());
      if(!val){
        return false;
      }
      else{
        $.ajax({
          url : PUBLIC._COMMON,
          data : {
            requesturl : 'LIevx%2B1yqJ%2BdPH3cCouw9v8TJalSNLwhq186LXRNQ54%3D',
            exchangeCode : val,
            mobile : sessionStorage.getItem('mobile'),
            platform:platform
          },
          success : function(data){
            console.log(data);
            if(data.code == '0000'){
              $("#getRedbag").hide();
              $("#success").removeClass('dis_none');
            }else{
              $("#duiTip").removeClass('dis_none');
              $("#errorTip").html(data.message);
            }
          }
        });
      }
    });
    $("#iKnow").bind('click',function(){
      var url_ = location.href;
      window.location.href = url_;
    });

    //兑换红包结束

    tab($('.pac-h-list li'),$('.packet-state'));
    $('.packet-state').on('click','.pac-rule',function(){
      var sText = '<p>有效期止：<strong>'+$(this).attr('data-overduedateStr')+'</strong></p>'+
                  '<p>适用平台：<strong>'+$(this).attr('data-realizationChannelStr')+'</strong></p>'+
                  '<p>适用金额条件：<strong>'+$(this).attr('data-activateBalance')+'元</strong></p>'+
                  '<p>适用说明：<strong>'+$(this).attr('data-description')+'</strong></p>'+
                  '<p>备注：<strong>'+$(this).attr('data-realizationProStr')+'</strong></p>';
      l.alert2(sText,'','使用规则');
    })
    droploadFn($('.pac-tab'),'redBag');
    $('#pac-footer a').on('click',function() {
      w.location.href = 'myhdDisable.html?platform='+platform + "&v=" + Math.random();
    });
    $("#jiaxi-footer a").on('click',function(){
      w.location.href = 'myjiaxiDisable.html?platform='+platform+'&v='+Math.random();
    });
    // dropload
    function droploadFn(obj,ticketType) {
      var counter = 0,
          num = 10,// 每页展示10个
          sRequesturl = "",
          contId = "",
          sendData={platform:platform};
      if(ticketType == 'redBag') {
        // sRequesturl = "/act_web/mobile/redbag/current";
        sRequesturl = "LIevx%2B1yqJ%2BdPH3cCouw9jCW4VruHDXA0x7VxO18Jzc%3D";
        contId = "#redBag";
      }else if (ticketType == 'tasteMoney') {
        //体验金
        sRequesturl = "LIevx%2B1yqJ%2BdPH3cCouw9sVOdcXGt%2FMmnakYf%2FRWs5CaieZNFK5O2Q%3D%3D";
        contId = "#tasteMoney";
      }/*else{
        //抵扣券
        sRequesturl = "LIevx%2B1yqJ%2BdPH3cCouw9mNe6fs26PN%2Fva453%2BtBx2noycLrz1XBmA%3D%3D";
        contId = "#deductionTicket";
      }*/else{
        sRequesturl = 'LIevx%2B1yqJ%2BdPH3cCouw9jCW4VruHDXA0x7VxO18Jzc%3D';
        sendData.type = 3;//3是加息券，1是红包
        contId = "#deductionTicket";
      }
      sendData.requesturl = sRequesturl;

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
          domLoad    : '<div class="dropload-load"><span class="droploading"></span>加载中...</div>',
          domNoData  : ''
        },
        loadDownFn : function(me){
          counter++;
          sendData.page = counter;
          r.postLayer({
            url : PUBLIC._COMMON,
            /*data : {
              requesturl : sRequesturl,
              page : counter,
            },*/
            data : sendData,
            success : function(data){
              var json = null;
              if(data.data) {
                // if(ticketType == 'redBag') {
                  json = data.data;
                // }else{
                  json = data.data.resList;
                // }
                //console.log(counter)
                var result = '';
                if(counter == 1 && json.length == 0) { //首次监测是否有数据

                    noDateShow(obj,ticketType);//没有数据的展示
                    // 锁定
                    me.lock();
                      // 无数据 //新样式
                    me.noData();
                    obj.find('.dropload-down').remove();
                    obj.find('ul').empty();
                    // 每次数据加载完，必须重置
                    me.resetload();
                }else{
                  if(json.length > 0 && json.length == 10){
                    for(var i = 0; i < json.length; i++){
                      result += renderStr(json[i],ticketType);
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
                  }else if(json.length < 10 && json.length > 0){
                    for(var i = 0; i < json.length; i++){
                      result += renderStr(json[i],ticketType);
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

              }else{
                noDateShow(obj,ticketType);//没有数据的展示
                    // 锁定
                    me.lock();
                      // 无数据 //新样式
                    me.noData();
                    obj.find('.dropload-down').remove();
                    obj.find('ul').empty();
                    // 每次数据加载完，必须重置
                    me.resetload();
              }
              setTimeout(function(){
                $(contId).append(result);
                 $('#pac-footer').removeClass('dis_none');//等加载完成在显示出查看失效红包的入口
                // 每次数据加载完，必须重置
                me.resetload();
              },800);
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

  function noDateShow(obj,ticketType) { //无数据展示方法
    var bgType = '';
    switch(ticketType){
      case 'redBag':
        bgType = '3';
        break;
      case 'tasteMoney':
        bgType = '5';
        break;
      default:
        bgType = 'jiaxi';
    }
    obj.find('ul').css({
      'height': $(window).height() - $('.packet-head').height()*2 ,
      'background': '#f6f6f6 url(../../images/pac-bg'+bgType+'.png) no-repeat center 2.746667rem',
      'background-size': '4.026667rem 3.746667rem'
    });
  }
  function renderStr (current,ticketType) { //需要渲染的dom
    var str = '',oldStatus = '';
    switch(ticketType){
      case 'redBag'://红包
        str = '<li class="state-li"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'</h3><div class="clearfix"><div class="state-li-l"><p><strong><span>'+
                (current.balance || '0')+'</span>元</strong>[单笔满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule" data-overduedateStr="'+
                current.overduedateStr +'" data-realizationChannelStr="'+
                current.realizationChannelStr +'" data-activateBalance="'+
                current.activateBalance +'" data-description="'+
                current.description +'" data-realizationProStr="'+
                current.realizationProStr +'">使用规则</a></p></div></div></li>';
        break;
      case 'tasteMoney'://体验金
        if(current.statusStr == '未使用') {
          oldStatus = 'tiyan-state';
        }else if(current.statusStr == '已使用') {
          oldStatus = 'tiyan-used';
        }else{
          oldStatus = 'tiyan-over';
        }
        str = '<li class="state-li '+
                oldStatus +'"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'</h3><div class="clearfix"><div class="state-li-l tiyan-color"><p><strong class="tiyan-strong"><span>'+
                (current.balance || '0') +'</span>元</strong>[单笔满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule" data-overduedateStr="'+
                current.overduedateStr +'" data-realizationChannelStr="'+
                current.realizationChannelStr +'" data-activateBalance="'+
                current.activateBalance +'" data-description="'+
                current.description +'" data-realizationProStr="'+
                current.realizationProStr +'">使用规则</a></p></div></div></li>';
        break;
      default://加息券
        current.status == 2? oldStatus = 'dikou-state' : oldStatus = 'dikou-over';
        str = '<li class="state-li '+
                oldStatus +'"><h3 class="pac-list-t">'+
                (current.rewardTitle || '- -') +'<label class="orange" style="font-size:0.293333rem;">(加息天数：'+current.experienceDaysStr+')</label></h3><div class="clearfix"><div class="state-li-l tiyan-color"><p><strong class="tiyan-strong orange"><span>'+
                (current.balance || '0') +'</span>%</strong>[单笔满<i>'+(current.activateBalance|| '0')+'</i>元可用]</p><p>有限期至：<time>'+
                (current.overduedateStr|| '-- --') +'</time><a href="javascript:;" class="pac-rule orange" data-overduedateStr="'+
                current.overduedateStr +'" data-realizationChannelStr="'+
                current.realizationChannelStr +'" data-activateBalance="'+
                current.activateBalance +'" data-description="'+
                current.description +'" data-realizationProStr="'+
                current.realizationProStr +'">使用规则</a></p></div></div></li>';
      }
    return str;
  }
  //tab切换
  function tab (oBtns,oCont) {
    var ticketTypeArr = ['redBag','deductionTicket','tasteMoney'];
    oBtns.on('click',function(){
      var _index = $(this).index();
        oBtns.removeClass('pacli-active');
        $(this).addClass('pacli-active');
        oCont.removeClass('pac-tab');
        oCont.eq(_index).addClass('pac-tab');
        oCont.eq(_index).find('.dropload-down').remove();
        oCont.eq(_index).find('.dropload-up').remove();
        //oCont.eq(_index).find('ul').empty();
        if(_index == 0) {
          $('#pac-footer').show();
        }else{
          $('#pac-footer').hide();
        }
        if(_index == 1){
          $('#jiaxi-footer').removeClass('dis_none').show();
        }else{
          $('#jiaxi-footer').addClass('dis_none').hide();
        }
        if(oCont.eq(_index).attr('data-lock') != 'false'){
          droploadFn($('.pac-tab'),ticketTypeArr[_index]);
          $('.pac-tab').attr('data-lock','false');
        }
    });
  }
})(window,$,requestUtil,Tools,Layer);