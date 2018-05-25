(function(w,jq,h,r,t,l,gt){
	var param_obj = t.getParams();
	var tid = decodeURIComponent(param_obj.tid),//tenderid
		platform = param_obj.platform,
		myProExtend = param_obj.myProExtend,
		tenderPaymentExt = param_obj.tenderPaymentExt,
		proddetail = decodeURIComponent(param_obj.proddetail),
		transType=param_obj.transType;//1,
		xieyiUrl = param_obj.xieyiUrl;
		xieyiUrl = xieyiUrl ? decodeURIComponent(xieyiUrl) : '';


	h.registerHelper('isExists',function(status){
		if(status == '0' || !status){
			return '无';
		}else if(status == '1'){
			return '有';
		}else{
			return status;
		}
	});
	h.registerHelper('checkCompany',function(borrowerType,options){
		if(borrowerType == '2'){//企业用户
			return options.fn(this);
		}else{
			return options.inverse(this);
		}
	});
	h.registerHelper('limitText',function(des,options){
		if(!des || !des.length){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	h.registerHelper('isEmpty',function(arr,options){
		if(!arr || !arr.length){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	$(".items").find('li').on('click',function(){
		$(this).addClass('check');
		$(this).siblings('li').removeClass('check');
		var cur = $(this).data('name');
		$('.same').addClass('dis_none');
		$('.'+cur).removeClass('dis_none');
	});
	var	body = jq('body'),
		tenderTpl = h.compile(jq('#tender_tpl').html()),
		recordTpl = h.compile(jq('#recode_tpl').html());


	//按钮状态
	r.setLayerFlag(false);
	r.postLayer({
		url : PUBLIC._COMMON,
		data : {
			requesturl:'mBI9zdBAgnR0RONCptStQjNwPjTvlyNc',
			prodDetail: proddetail
			// prodList: $.base64.encode(JSON.stringify([{'prodStr':proddetail}]))
		},
		success:function(data){
			console.log(data);
			if(data.code == '0000'){
				data = data.data || {};
				var btn_o = data.button;
				if(btn_o.status == '7'){//10分钟内不可取消
					jq(".transBtn").addClass('dis_btn').html(btn_o.statusCN+"&nbsp;<span class='enddate' data-lasttime='"+data.surplusSecTEN+"' style='font-size:0.46rem;'></span>").unbind('click');
					t.pauseCountDown();
	            	t.refreshEnd();
	        		t.countDown(2,function(){
	        			window.location.reload();//刷新页面
	        		});
				}else{
					jq('.transBtn').html(btn_o.statusCN);
					if(btn_o.status == '0'){//0可转让
						jq('.transBtn').removeClass('dis_btn').bind('touchstart',function(){
							// if(transType == 'sec_hold'){//转让中
								window.location.href = '/static/mobileSite/html/tailor/batch_transfer.html?platform='+platform+'&v='+Math.random()+'&transType=sec_hold&proddetail='+encodeURIComponent(proddetail);
							// }else{
								// window.location.href = '/static/mobileSite/html/tailor/batch_transfer.html?platform='+platform+'&v='+Math.random()+'&myProExtend='+myProExtend;
							// }
						});
					}else if(btn_o.status == '3'){//取消转让
						jq('.transBtn').html('取消转让');
						jq('.transBtn').removeClass('dis_btn').bind('touchstart',function(){
							l.alert1('确定要取消转让吗？');
							l.setOkAction(function(){
								gt.get_token(function(res){
			    					if(res.code == '0000'){
			    						res = res.data.token;
			    						r.setLayerFlag(false);
										r.postLayer({
											url : PUBLIC._COMMON,
											data : {
												requesturl : 'mBI9zdBAgnR0RONCptStQpge3BZMfbgT',
												cancelApply : $.base64.encode(JSON.stringify([{prodStr:data.prodDetail}])),
												token:res
											},
											success : function(res){
												if(res.code == '0000'){
													l.alertAuto("取消成功",function(){
														window.location.href = '/static/mobileSite/html/tailor/my_transfer.html?platform='+platform;
													});
												}
											},
											content : '取消转让中..'
										});
			    					}
			    				});
							});
						});
					}else{
						jq('.transBtn').addClass('dis_btn');
					}
				}

			}
		}
	});
	var sendData = {
		requesturl : '0nzLDLIxtJvcigZxd5gYFauf4h2oSGSD',
		id : tid,
		url : xieyiUrl
	};
	r.setLayerFlag(false);
	r.postLayer({
		url : PUBLIC._COMMON,
		data : sendData,
		success : function(data){
			console.log(data);
			if(data.data){
				var response_data = data.data || {};
				var d = (response_data || {});
				var html = tenderTpl(d);
				$('#program').append(html);
				var xieyiO = response_data.urlentry || {};
				if(xieyiO.code == '0'){
					$(".foot").append('<label id="xieyi">'+xieyiO.entryName+'</label>');
					$('#xieyi').bind('click',function(){
						window.location.href = xieyiO.entryDesc;
					});
				}else{
					$(".foot").addClass('dis_none');
				}
				var addTpl = h.compile(jq('#tender_tpl_add').html());
         $.ajax({
             url : PUBLIC._COMMON,
             data : {
                 requesturl : '0nzLDLIxtJv1YPDcgQPyzauf4h2oSGSD',
                 prodDetail : tid,
                 platform : platform
             },
             success : function(data){
                 if(data.code == '0000'){
                 	if(data.data.prodPublishDate){
                     	 var response_data_add = data.data || {};
                     	var d = (response_data_add || {});
                     	var html_add = addTpl(d);
                     	var addcont = $('#add_cont')
                     	addcont.append(html_add);
                     } else{
                     	$('#add_cont').hide();
                     }
                  } else{
                  		$('#add_cont').hide();
                  }
             }
         });

			}else{
				//alert(1);
				body.html('<p style="text-align: center;margin-top: 150px;"><span class="no_data">暂无数据</span></p>')
			}
		}
	});
	/*回款记录*/
	r.post({
		url : PUBLIC._COMMON,
		data : {requesturl:'mBI9zdBAgnR0RONCptStQiwQhP30mdup',tenderPaymentExt:tenderPaymentExt,queryType:0},
		success : function(data){
			if(data.code == '0000'){
				$('#records').append(recordTpl(data.data));
			}else if(data.code == '3000'){
				$(".records_title").hide();
				$("#records").html('亲，没有更多啦').css({'text-align':'center','padding-top':'0.5rem'});
			}else{
				l.alert2(data.message);
			}
		}
	});
}(window,$,Handlebars,requestUtil,Tools,Layer,GET_Token));