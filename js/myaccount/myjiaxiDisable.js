(function(w,j,r,t,d,h){
    var param_obj = t.getParams();
    var platform = param_obj.platform;

    var jiaxi_template = h.compile($("#tpl_jiaxi").html());
    var pageUtil = {
      jiaxiContent:$('.state-list'),
      bindEvent:function(){
        $('.pac-footer a').on('click',function() {
          w.location.href = 'myhd.html?platform='+platform + "&v=" + Math.random();
        });
      },
      creatHelper:function(){
        h.registerHelper('checkstatus',function(status,option){//2:可用 3:已使用 4:已过期
          console.log(status);
          if(status == '3'){//已使用
            return option.fn(this);
          }else if(status == '4'){//已过期
            return option.inverse(this);
          }
        });
      },
      initPage:function(){
        var that = this;
        d.setListenerName('jiaxiquan');
        d.refresh('jiaxiquan');
        if(!d.getListener('jiaxiquan')){//获取芝麻开花投资列表
              d.addListener('jiaxiquan',{
                url : PUBLIC._COMMON,
                data : {requesturl : 'LIevx%2B1yqJ%2BdPH3cCouw9jBlVzcg9QlS4jxW37SBD3I%3D',type:'3'},
                content: that.jiaxiContent,
                template: jiaxi_template,
                callback : function(data){
                  if(data.code == '0000'){
                    if(data.data.resList.length == 0){
                      $('.state-list').css({
                        'height': $(window).height() - $('.packet-head').height()*2 ,
                        'background': '#f6f6f6 url(../../images/pac-bgjiaxi.png) no-repeat center 2.746667rem',
                        'background-size': '4.026667rem 3.746667rem'
                      });
                    }
                  }
                }
              });
            }
            d.setListenerName('jiaxiquan');
            d.getData();
      },
      init:function(){
        var that = this;
        that.bindEvent();
        that.creatHelper();
        that.initPage();
      }
    }
    pageUtil.init();
})(window,$,requestUtil,Tools,dataPage,Handlebars);