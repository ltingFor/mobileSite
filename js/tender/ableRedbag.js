(function(w,j,r,t,l,h){
  var param_obj = t.getParams();
  var platform = param_obj.platform || '',
      type = param_obj.type,//翼农计划传1、芝麻开花传2、芝麻开花转让传3、私人定制传4,翼农计划+ 5
      amount = param_obj.amount,//购买本金
      term = param_obj.term,//产品天数
      pid = decodeURIComponent(param_obj.pid),
      prodDetail = decodeURIComponent(param_obj.prodDetail),
      source = param_obj.source,
      redId = decodeURIComponent(param_obj.prizeId);//当前选中的红包的ID
  var enable_template = h.compile(j("#tpl_enable").html()),
      dis_template = h.compile(j('#tpl_dis').html());
  var pageUtil = {
    ableNum : j("#abelNum"),
    disNum : j("#disNum"),
    disContain : j("#disContain"),
    ableRedbagList : j("#ableRedbagList"),
    disableRedbagList : j("#disableRedbagList"),
    no_redbag : j("#no_redbag"),
    redbagArr : [],
    getTimetemp:function(){//此方法是为私人订制的购物车专属方法
      if(sessionStorage.getItem('lockTime')){
        var lockTimer = setInterval(function(){
          var curTime = parseInt(sessionStorage.getItem('lockTime'));
          curTime -= 1;
          if(curTime<=0){
            clearInterval(lockTimer);
          }
          sessionStorage.setItem('lockTime',curTime);
        },1000);

        t.pauseCountDown();
        $("#enddate").data('lasttime',sessionStorage.getItem('lockTime'));
        t.countDown(2,function(){
          sessionStorage.setItem('tailor_tender_num','0');
        });
      }else{
        sessionStorage.setItem('lockTime',300);
        var lockTimer = setInterval(function(){
          var curTime = parseInt(sessionStorage.getItem('lockTime'));
          curTime -= 1;
          if(curTime<=0){
            clearInterval(lockTimer);
          }
          sessionStorage.setItem('lockTime',curTime);
        },1000);
        t.pauseCountDown();
        $("#enddate").data('lasttime','300');
        t.countDown(2,function(){
          sessionStorage.setItem('tailor_tender_num','0');
        });
      }
    },
    getSouce:function(isornot,Dom){//跳转的路径以及参数
        var paramStr = '',paramStr_param = '';
        var balance = Dom.data('num'),rewardType=Dom.data('type'),activateBalance = Dom.data('activatebalance');
        if(source == 'invest'){//投资页
          if(type == '1') {//翼农计划
            paramStr = '/static/mobileSite/html/wmps/wmps_invest.html';
          }else if(type == '2'){//芝麻开花
            paramStr = '/static/mobileSite/html/sesame/sesame_invest.html';
          }else if(type == '3'){//芝麻开花转让
            //l.alert2('私人订制请到app');
          }else if(type == '4'){//私人订制
                paramStr = '/static/mobileSite/html/tailor/shoppingcart_list.html'+paramStr;
          }else if(type == '5'){//翼农计划+
            paramStr = '/static/mobileSite/html/wmpsPlus/wmpsPlus_invest.html';
          }
        }else{//匹标页
            //拼接URL
            if(type == '1'){//翼农计划
                paramStr = '/static/mobileSite/html/wmps/wmps_tender.html'+paramStr;
            }else if(type == '2'){//芝麻开花
                paramStr = '/static/mobileSite/html/sesame/sesame_tender.html'+paramStr;
            }else if(type == '3'){//芝麻开花转让
                // paramStr = '/static/mobileSite/html/tailor/shoppingcart_list.html'+paramStr;
            }else if(type == '4'){//私人订制
                paramStr = '/static/mobileSite/html/tailor/shoppingcart_list.html'+paramStr;
            }else if(type == '5'){
                paramStr = '/static/mobileSite/html/wmpsPlus/wmpsPlus_tender.html';
            }
        }
        for(var i in param_obj){
          if(i == 'platform' || i == "pid") continue;
            paramStr_param += '&'+i+'='+param_obj[i];
        }
        paramStr = paramStr+'?platform='+platform+paramStr_param+'&pid='+encodeURIComponent(pid);
        if(isornot == 1){//1正常使用，0暂不使用
          var prizeId = encodeURIComponent(Dom.attr('id'));
          paramStr += "&balance="+balance+'&rewardType='+rewardType+'&activateBalance='+activateBalance+'&prizeId='+prizeId;
        }else{//暂不使用
          paramStr += '&balance=0&rewardType='+rewardType+'&activateBalance=-1'+'&prizeId='+encodeURIComponent('LOogHV1WR7M=')+'&amount='+amount;
        }
        return paramStr;
    },
    creatHelper:function(){
        var that = this;
        //找到当前选中的红包
        h.registerHelper('checkStatus',function(id){
            if(redId == id){
                return 'canUseShow';
            }else{
              return '';
            }
        });
        h.registerHelper('checkType',function(type,option){
            if(type == 1){//红包
              return option.fn(this);
            }else if(type == 3){//加息券
              return option.inverse(this);
            }
        });
    },
    bindEvent : function(){
      var that = this;
      //暂不使用红包
      that.no_redbag.bind('click',function(){
         //拼接URL
          w.location.href = that.getSouce(0,that.no_redbag);;
          return false;
      });
    },
    initPage:function(){
        var that = this;
        var sendData = {
          requesturl : CONFIG.Sesame_Invest_RedbagList,
          proType : type,//翼农计划传1、芝麻开花传2、芝麻开花转让传3、私人定制传4
          types:'1,3',
          investMoney : amount || 0,
          proDays : term || 0
        }
        if(type == '1' || type == '4'){//翼农计划
          sendData.types = '1,3';
        }
        r.postLayer({
          url : PUBLIC._COMMON,
          data : sendData,
          success : function(data){
            if(data.code == '0000'){
              // enableListHandle
              data = data.data,L = data.enableList.length;
              that.ableNum.html(L);

              that.ableRedbagList.append(enable_template(data.enableList || []));//可用红包

              var disL = data.disableList.length;
              if(disL > 0){//失效红包
                that.disContain.removeClass('dis_none');
                that.disNum.html(disL);
                that.disableRedbagList.html(dis_template(data.disableList || []));  
              }
              //绑定使用规则窗口
              j(".pac-rule").bind('click',function(e){
                  e.preventDefault();
                  var h = j(this).parent().siblings('section').html();
                  l.alert2(h,'',"红包使用规则");
                  return false;
              });

              //绑定dom选中状态
              j('.state-li').bind('click',function(e){
                  e.preventDefault();
                  var Dom = j(this);
                  if(Dom.hasClass('state-over-li')){
                    return false;
                  }
                  j('.state-li').find('span.canUse').removeClass('canUseShow');
                  Dom.find('span.canUse').addClass('canUseShow');
                  w.location.href = that.getSouce(1,Dom);
                  return false;
              });
            }
          }
      });
    },
    init : function(){
      var that = this;
      that.initPage();
      that.bindEvent();
      that.creatHelper();
      that.getTimetemp();
    }
  }
  pageUtil.init();
})(window,$,requestUtil,Tools,Layer,Handlebars)