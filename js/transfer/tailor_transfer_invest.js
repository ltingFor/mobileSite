(function(w,j,r,t,l,c,v,cl,gt){
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		transCreditId = decodeURIComponent(param_obj.transCreditId) || '';
	
	var pageUtil = {
		investBtn:j('.buy-btn'),
		amount:0,//出借本金
		balanceValue:0,//账户余额
		bindEvent:function(){
			var that = this;
			j('.remd').bind('click',function(){
				l.alert2('实付金额=转让本金+垫付利息+浮动金额');
				return false;
			});
			j(".chzhi-btn").bind('touchstart',function(){
				c.check_KH(function(data){
					/*
					cardType : 1->身份证 2->护照  3->外国人永久居留证   4->港澳台通行证
					userType : 1->个人  2->企业
					*/
					data = data.data || {};
					if(data.userType != '1'){
						l.alert2("企业用户暂时无法使用移动充值功能，请到网站充值");
						return false;
					}
					if(data.cardType != "1"){
						l.alert2("您使用的开户证件不是身份证，暂时无法使用快捷充值功能，请到翼龙贷网站充值");
						return false;	
					}

					w.location.href = '/static/mobileSite/html/myaccount/recharge.html?platform=' + platform + '&v=' + Math.random();		
				});
			});
			j("#protocolCheck").bind('click',function(){
				var i = j(this).attr('src');
				if(i == '/static/mobileSite/images/checkno.png'){
					j(this).attr('src','/static/mobileSite/images/checkyes.png');
					that.investBtn.removeClass('dis_btn');
				}else{
					j(this).attr('src','/static/mobileSite/images/checkno.png');
					that.investBtn.addClass('dis_btn');
				}
				return false;
			});
			that.investBtn.bind('touchstart',function(){
				if(that.investBtn.hasClass('dis_btn')){
					return;
				}
				else if((parseFloat(that.balanceValue)<100) || ((parseFloat(that.balanceValue) - parseFloat(that.amount))<0)){
					l.alertAuto('可用余额不足，请先充值');
					return false;
				}else{
					that.investFun();	
				}
			});
		},
		echo : function(data){
			var that = this;
			for ( var i in data ){
				  if(typeof data[i] == 'string'){
					  if(i == 'transferAmt'){
					  	$("#"+i).html(t.outputmoney(data[i]));
					  	that.amount = data[i];
					  	continue;
					  }
					  if(i == 'preRate'){
					  	$("#"+i).html(data[i].split('%')[0]);
					  	continue;
					  }
					  if (i == 'secRate') {
					  	$("#secRate").html('+'+data[i]).removeClass('dis_none');
					  }
					  if(i == 'surplusDays'){
					  	$("#"+i).html(data[i].split('天')[0]);	
					  	continue;
					  }
					  $('#'+i).html(data[i] || '-');
				  }else{
					  that.echo(data[i])
					 // console.log(typeof data[i] + "  " + i+'--'+data[i]);
				  }
			  }
		},
		investFun : function(){//出借
			var that = this;
			c.check_KH(function(data){
    			if(data.code == '0000'){
    				gt.get_token(function(res){
    					if(res.code == '0000'){
    						res = res.data.token;
		    				r.setFlag(false);
							r.postLayer({
								url : PUBLIC._COMMON ,
								data : {
									requesturl : "mBI9zdBAgnR0RONCptStQpGPFYNfkVcp",
									transCreditId:transCreditId,
									amount:that.amount||0,
									token:res
								},
								content : '出借中...',
								success : function(bac){
									console.log(bac);
									if(bac.code == 0){
										window.location.href = '/static/mobileSite/html/success.html?platform='+platform+'&v='+Math.random();		
									}
								}
							});
    					}
    				});
    			}
    		});
		},
		initPage:function(){
			var that = this;
			that.bindEvent();
			r.postLayer({
				url: PUBLIC._COMMON,
				data:{requesturl:'mBI9zdBAgnR0RONCptStQltYPdCfXGR9',transCreditId:transCreditId},
				success:function(data){
					if(data.code == '0000'){
						data = data.data || {};
						that.echo(data);
						var urlentry = data.urlentry;	
						if(urlentry.code == '0'){
							j(".xy").attr('href',urlentry.entryDesc);
							// j(".xy").html(urlentry.entryName).attr('href',urlentry.entryDesc);
						}else{
							j('.xy').addClass('dis_none');
						}
						// that.amount = data.realpayAmt;//实付金额  出借本金
						/*if(data.status == '0'){//0可出借 1已转让 2取消转让
							that.investBtn.removeClass('dis_btn');
						}else{//已转让
							that.investBtn.addClass('dis_btn');
						}*/
						that.getUserMoney();//用户余额和vip
					}
				}
			});
		},
		getUserMoney:function(){
			var that = this;
			//账户余额
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.MyAvalabelMoney_URL
				},
				success : function(data){
					if(data.code == "0000"){
						data = data.data;
						that.balanceValue = data.useableAmt || 0;
						j("#userBalance").html(that.balanceValue);
					}else{
						that.investBtn.addClass('dis_btn');
					}
				}
			});
			v.checkVip(function(data){//检测是否有vip利率
				if(data.code == '0000'){
					data = data.data;
					var vipRate = data.vipRate;
					if(vipRate && parseFloat(vipRate)>0){
						j('#preRate').parents('p').append('<em class="add">+'+vipRate+'</em>');
					}
				}
			});
		}
	}
	pageUtil.initPage();
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST,COMMON_Login,GET_Token);