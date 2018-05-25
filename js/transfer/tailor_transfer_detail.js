(function(w,j,r,t,l,c,v,cl,gt){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		transCreditId = decodeURIComponent(param_obj.transCreditId) || '',
		cancelProd = '';
	var pageUtil = {
		COUNT : 0
	};
	/*此处是添加继续查看详情的操作*/
	var invest_btn = j('.detail-inv-btn');
	var dwonToTender = j("#dwonToTender");
	
	/*此处是添加继续查看详情的操作*/


	/**
	 * 赋值操作
	 */
	function echo(data){
		for ( var i in data ){
			  if(typeof data[i] == 'string'){
				  if(i == 'amount'){
				  	$("#"+i).html(t.outputmoney_n(data[i]));
				  	continue;
				  }
				  if(i == 'preRate'){
				  	$('#'+i).html(data[i].split('%')[0]);	
				  	continue;
				  }
				  if('rebateAmt' == i){
				  	if(!+(data[i])) {
				  		$('#'+i).html('0.00');
				  	}else{
				  		+(data[i]) >0 ? $('#'+i).html("+"+t.outputmoney_n(+(data[i]))) : $('#'+i).html(t.outputmoney_n(+(data[i])));
				  	}
				  	continue;
				  }
				  $('#'+i).html(data[i] || '-');
			  }else{
				  echo(data[i]);
			  }
		  }
	}
	//页面初始化接口
	r.postLayer({
		url : PUBLIC._COMMON,
		data : {
			requesturl : "mBI9zdBAgnR0RONCptStQjvG%2BPvCT78e",
			transCreditId : transCreditId
		},
		success : function(data){
			if(data.code == "0000"){
				var info = data.data || {};
				var vipRate = info.vipRate,
					addRate = info.secRate,
					supRate = '';
				cancelProd = info.prodDetail;
				echo(info);//赋值
				if(addRate){
					j("#secRate").removeClass('dis_none').html('+'+addRate);
				}
				if(info.status == '0' || info.status == '2'){//0可出借 1已转让 2取消转让
					if(vipRate){
						j(".add").removeClass('dis_none').html('+'+vipRate)	
					}
					
					//supRate = ((addRate && ('+' + addRate)) || '') + ((vipRate && ('+' + vipRate + '<img src="/static/mobileSite/images/v.png" style="max-width:100%;width:0.5rem;display:inline;">')) || '');
				} else {
					if(vipRate){
						j(".add").removeClass('dis_none').html('');	
					}
				};
				j("#amount_same").html(info.transferAmt || '-');
				j("#futureEarn").html(info.futureEarn || '-');

				
				j('.enddate').data('lasttime',info.surplusSeconds);	
				t.countDown();
				if(info.status == "0"){
					j('.detail-inv-btn').removeClass('dis_btn');
					j('.detail-inv-btn').click(function(){
						c.check_KH(function(data){
	            			if(data.code == '0000'){
	            				w.location.href = '/static/mobileSite/html/transfer/tailor_transfer_invest.html?platform='+platform+'&transCreditId='+encodeURIComponent(transCreditId);
	            			}
	            		});
					});
				}
				else if(info.status == 2){
					j('.detail-inv-btn').html('取消转让').removeClass('dis_btn');
					j('.detail-inv-btn').click(function(){
						c.check_KH(function(data){
	            			if(data.code == '0000'){
	            				gt.get_token(function(res){
			    					if(res.code == '0000'){
			    						res = res.data.token;
			            				l.alert1('确定取消转让？');
			            				l.setOkAction(function(){
											requestUtil.postLayer({
												url : PUBLIC._COMMON,
												data : {
													requesturl : 'mBI9zdBAgnR0RONCptStQpge3BZMfbgT',
													cancelApply : $.base64.encode(JSON.stringify([{prodStr:cancelProd}])),
													token:res
												},
												success : function(data){
													if(data.code == '0000'){
														l.alert2("取消成功");
														l.setKnowRedirectUrl('/static/mobileSite/html/transfer/transfer_list.html?platform='+platform+"&v="+Math.random());
													}

												},
												content : '取消转让中..'
											});
										});
			    					}
			    				});
	            			}
	            		});
					});

				}
				else{
					// window.status = '0';
					j('.detail-inv-btn').html('已转出').addClass('dis_btn');
				}
				//check vip
				v.checkVip(function(res){//检测是否有vip利率
					if(res.code == '0000'){
						res = res.data;
						var vipRate = res.vipRate;
						if(vipRate && parseFloat(vipRate)>0){
							if(info.status == '0' || info.status == '2'){
								j('#preRate').parents('p').append('<em class="add">+'+vipRate+'</em>');	
							}else{
								j('#preRate').parents('p').append('<em class="add">+</em>');	
							}
						}
					}
				});

				dwonToTender.bind('click',function(){
					w.location.href = '/static/mobileSite/html/tender/tender_detail.html?platform='+platform+'&tid='+encodeURIComponent(info.tenderIdEpt);
				});
			}else{
				l.alert2(data.message);
			}
		}
	});
	

	j('.rem').bind('touchstart',function(){
		l.alert2(
			"<label class='label'>实付金额=转让本金+垫付利息+浮动金额。</label>"+
			"<br/>"+
			"<label class='label'>浮动金额：指转让人申请转让债权时，可上下浮动；+则代表高价转，—则代表低价转，0则不变。</label>"+
			"<br/>"+
			"<label class='label'>垫付利息：指转让人已计但未发的利息，需出借人先垫付；垫付利息会在债权第一次付息日补给出借人。</label>");
	});
	j("#investTip").bind('touchstart',function(){
		l.alert2("实际年化利率以交易为准");
	});
	j('.tab_page').delegate('.pulldown','click',function(){
		var listenerName = j(this).data('listenername');
		d.setListenerName(listenerName);
		d.getData();
	});
})(window,$,requestUtil,Tools,Layer,COMMON_KH,COMMON_POST,COMMON_Login,GET_Token);