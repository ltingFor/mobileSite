(function(w,j,r,l,t,h,d,v,c,cl){
	'use strict'
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		type = param_obj.t,//判断是定制计划进来还是
		prizeId = param_obj.prizeId,
		rewardType = param_obj.rewardType,
		balance = param_obj.balance,//奖励金额
		tailor_template = h.compile(j("#tpl_tailor").html());
		if(prizeId){
			prizeId = decodeURIComponent(prizeId);
		}
	var initUrl  = type=='dzjh'?'mBI9zdBAgnR0RONCptStQh4OtagfIumn':'mBI9zdBAgnR0RONCptStQsZ2v9dYwgyv';
	var htmlTitle  = type=='dzjh'?'定制债权':'出借债权';
	$('title').html(htmlTitle);
	var pageUtil = {
		tabs : j(".mana-head>li"),
		tailor : j("li[data-tab=#tailor]"),
		tabContent : j(".mana-detail"),
		tailorWrap : j("#tailor"),
		tailorContent : j("#tailor_content"),
		investBtn : j('.dibu .btn'),
		totalAmount:j(j('.totalhead li')[1]).children('.i1'),
		skipRewardList:j(".jl"),
		vipValue : 0,
		vipImg : '',
		marginTopValue:'1.3rem',
		loadList: function(){
			var that = this;
			j("#scroller").css({'margin-top':'1.3rem'});
			j('.sort').addClass('dis_none');//转让的排序
			PUBLIC.count('MTZ-TAILOR');
			that.tabs.removeClass("mana-h-show");
			that.tabContent.removeClass("mana-show");
			that.tailor.addClass('mana-h-show');
			that.tailorWrap.addClass('mana-show');
			// sessionStorage.setItem('current', that.tailor.attr('data-tab'));
			d.setListenerName('tailor');
			that.loadXyUrl();
			that.matchDzjh();

			if(prizeId && prizeId != -1 && prizeId != 'LOogHV1WR7M=' && prizeId != 'Okr9LYr9qdI='){//prizeId:-1 -> 暂不使用红包   prizeId=具体值 -> 选中的红包   prizeId=undefined -> 从匹标页面过来获取最佳匹配红包
				if(rewardType =='3'){
					j("#reward").addClass('reward_jiaxi').html(balance+"%").attr('id',prizeId);
				}else{
					j("#reward").addClass('reward_hb').html(balance+"元").attr('id',prizeId);
				}
				// j("#bestRedbag").removeClass('dis_none').html(balance+"元").attr('id',prizeId);
			}else if(prizeId == -1 || prizeId == 'LOogHV1WR7M='){//暂不使用
				prizeId = 'LOogHV1WR7M=';// -1的秘串
				j("#reward").removeClass('reward_jiaxi').removeClass('reward_hb').html('暂不使用');
			}else if(prizeId == 0 || prizeId == 'Okr9LYr9qdI='){//没有可用
				prizeId = 'Okr9LYr9qdI=';
				j("#reward").removeClass('reward_jiaxi').removeClass('reward_hb').html('暂无可用奖励')
			}else{//获取最佳使用红包
				that.getRedbag();//获取最佳匹配红包	
			}
		},
		bindEvent : function(){
			var that = this;
			
			AmountInput.getConfirmBtn().click(function(){
				if (!AmountInput.check()) {
					return;
				}
				var current = window.currentTailor;
				var lockExt = current.attr('data-lock');
				that.tenderLock(AmountInput.getAmount(), lockExt);
			});
			
			that.investBtn.click(function(){
				that.invest(that.totalAmount.attr('data-v'));
			});

			that.skipRewardList.on('click',function(){
				if(j("#enddate").html() == '00:00'){
					l.alertAuto('超时未支付，请重新选择债权');
					return false;
				}
				if(that.investBtn.hasClass('dis_btn')){
					return false;
				}
				var paramStr = '';
				for(var i in param_obj){
					if(i == 'platform' || i == "addr") continue;
					else{
						paramStr += '&'+i+'='+param_obj[i];
					}
				}
				paramStr = '?platform='+platform+paramStr;
				w.location.href = '/static/mobileSite/html/tender/ableRedbag.html'+paramStr+'&prizeId='+encodeURIComponent(prizeId)+'&type=4';

			});
		},
		loadXyUrl: function(){
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : 'mBI9zdBAgnR0RONCptStQssIoSoUTExO'},
				success : function(data){
					if(data.code == '0000'){
						j('.dibu .xy').attr('href', data.data.urlentry.entryDesc);
					} else {
					}
				}
			});
		},
		matchDzjh : function(){//私人定制列表
			var that = this;
			if(!d.getListener('tailor')){
				d.addListener('tailor', {url:PUBLIC._COMMON,
            		data : {requesturl : initUrl},
            		pageNo: 1,
            		pageSize:10,
	                pullDown: this.tailorContent.siblings('.pulldown'),
	                content: this.tailorContent,
	                template: tailor_template,
	                callback : function(d){
	                	j(j('.totalhead li')[0]).children('.i1').text(d.data.matchNum);
	                	that.totalAmount.text(t.outputmoney_n(d.data.configAmount));
	                	j(j('.totalhead li')[2]).children('.i1').text(t.outputmoney(d.data.restAmount));
	                	that.totalAmount.attr('data-v', d.data.configAmount);
	                	j(j('.totalhead li')[2]).children('.i1').attr('data-v', d.data.restAmount);
	                	var list = d.data.tenderList;
	                	
	                	if (list && list.length>0) {
	                		j('#tailor_content li').bind("click",function(){//调出修改浮层
	                			window.currentTailor = j(this);
	                			j('.keybordwrap #targetObj').html(''+j(this).prop('outerHTML')+'');
	                			j('.keybordwrap #targetObj').find('.mana-over-d').addClass('dis_none');

	                			$('.keybord.je').text(j('.keybordwrap #targetObj').find('.mana-over-d').find('.i1').attr('data-v'));
	                			j('.keybordwrapLayer').fadeIn('slow');
	                        	$('.keybordwrap').animate({'bottom':'0'}, "slow" );
	                		});
	                	} else {
	                		t.pauseCountDown();
	                		that.investBtn.addClass('dis_btn');
	                		that.skipRewardList.addClass('dis_none');
	                		sessionStorage.setItem('tailor_tender_num','0');
	                		j('.mana-detail.mana-sesame-detail').html('<div style="padding-top: 3rem;text-align: center;">暂未找到符合条件的债权</div>');
	                	}
                        
	                }
	            });
	            d.setListenerName('tailor');
	            d.getData();
			}

		},
		tenderLock : function(amount, lockExt){//债权匹配
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : 'mBI9zdBAgnR0RONCptStQp17kqoEs1p7', amount: amount, lockExt: lockExt},
				success : function(data){
					if(data.code == '0000'){
						$('.keybordwrap .qx').click();
						var current = window.currentTailor;
//						current.remove();
						var amtObj = j(current.find('.i1'));
						var ov = parseInt(amtObj.attr('data-v'));
						var nv = parseInt(data.data.lockAmount);
						var ov1 = parseInt(that.totalAmount.attr('data-v'));
						var ov2 = parseInt(j(j('.totalhead li')[2]).children('.i1').attr('data-v'));
						amtObj.text('出借金额：'+nv+'元');
						amtObj.attr('data-v', nv);
	                	that.totalAmount.text(t.outputmoney_n(new String(ov1+nv-ov)));
	                	j(j('.totalhead li')[2]).children('.i1').text(t.outputmoney(new String(ov2+nv-ov)));
	                	j(j('.totalhead li')[1]).children('.i1').attr('data-v', ov1+nv-ov);
	                	j(j('.totalhead li')[2]).children('.i1').attr('data-v', ov2	+nv-ov);
					} else {
					}
				}
			});
		},
		invest : function(amount){//债权匹配
			var that = this;
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {requesturl : 'mBI9zdBAgnR0RONCptStQjVop%2FK6yi3A'},
				success : function(data){
					if(data.code == '0000'){
						r.setFlag(false);
						r.post({
							url : PUBLIC._COMMON,
							data : {
								requesturl : 'mBI9zdBAgnR0RONCptStQtioWgr2Bt0l', 
								amount: amount, 
								token: data.data.token,
								prizeId : prizeId || 'Okr9LYr9qdI='//默认是0的秘传
							},
							success : function(data){
								if(data.code == '0000'){
									window.location.href = '/static/mobileSite/html/success.html?platform='+param_obj.platform
								}
							}
						});
					}
				}
			});
		},
		creatHealper : function(){
			var that = this;
			Handlebars.registerHelper('restAmount',function(maxAmount,amount){
				var restAmount = (((maxAmount||"") - (amount||""))/10000) || 0;
				return t.outputmoney(restAmount.toFixed(2));
			});
			h.registerHelper('format1',function(amount){
				return t.outputmoney_n(amount);
			});
			Handlebars.registerHelper('format',function(date){
				return date.split('天')[0] || '-';
			});
			Handlebars.registerHelper('checkStatus',function(status,flag,option){
				if((status == "1" && flag == "wmps") || (status == "pub" && flag == "sesame") || (status == "0" && flag == "transfer") || (status == "2" && flag == "transfer")){
					return option.fn(this);
				}
				else{
					return option.inverse(this);
				}
			});
			//判断是否有加息标
			Handlebars.registerHelper('checkAddRateImg',function(icon,option){
				if(icon){
					return option.fn(this);
				}else{
					return option.inverse(this);
				}
			});
			Handlebars.registerHelper('checkBtnStatus',function(status,option){
				if(status == "0"){
					return option.fn(this);
				}else{
					return option.inverse(this);
				}
			});

			Handlebars.registerHelper('jump',function(id,flag,recordId,accId,userId){
				if(flag == 'wmps'){
					return PUBLIC.URL + "/static/mobileSite/html/wmps/wmps_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform;
				}else if(flag == "sesame"){
					return PUBLIC.URL + "/static/mobileSite/html/sesame/sesame_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform;
				}else if(flag == "zqxq"){
					return PUBLIC.URL + "/static/mobileSite/html/tender/tender_detail.html?tid="+encodeURIComponent(id)+"&platform="+platform;
				}else{
					return PUBLIC.URL + "/static/mobileSite/html/transfer/transfer_detail.html?pid="+encodeURIComponent(id)+"&platform="+platform+"&recordId="+recordId+"&accId="+accId+"&userId="+userId;
				}
			});
			Handlebars.registerHelper('splitStr',function(str,flag){//此做法是针对 后台返回格式不统一的处理 返回字符串中没有付利率， 有副利率时 11+1.5,无副利率时 11%
				if(flag == 1){//主利率
					var arr = str.split('+');
					if(arr.length == 1){
						return arr[0].split('%')[0];
					}else{
						return arr[0];
					}
				}
				else{//副利率
					var arr = str.split('+'),subStr = '';
					if(arr.length >=2){
						return "%+"+arr[1];
					}else{
						return '%';
					}
				}
			});
			Handlebars.registerHelper('checkVipRate',function(status,flag,option){
				if(that.vipValue){
					if((status == "1" && flag == "wmps") || (status == "pub" && flag == "sesame") || (status == "0" && flag == "transfer") || (status == "2" && flag == "transfer")){
						return "+"+that.vipValue+"<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
					}
					else{
						return "+<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
					}
					//return "+"+that.vipValue+"<img src="+that.vipImg+" style='width:0.40rem;height:0.25rem'>";
				}else{
					return "";
				}
			});
		},
		getRedbag : function(){//获取最佳匹配红包
			var that= this;
			var amount_ = that.totalAmount.attr('data-v');
			
			r.setFlag(false);
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.Best_AvalableRedbag_URL,
					proType : '4',//翼农计划传1、芝麻开花传2、芝麻开花转让传3
					investMoney : '100',
					proDays : '1'//天数
				},
				success : function(data){
					console.log(data);
					if(data.code == '0000'){
						data = data.data;
						if(data){
							var redbag = data.balance || 0;
							if(data.type =='3'){
								// j("#bestRedbag").removeClass('dis_none').html(redbag+"%").attr('id',data.id);	
								j("#reward").addClass('reward_jiaxi').html(data.balance+"%").attr('id',data.id);
							}else{
								j("#reward").addClass('reward_hb').html(data.balance+"元").attr('id',data.id);
							}
							
							prizeId = data.id;
						}else{
							prizeId = 'Okr9LYr9qdI=';//0的秘串，请求最佳匹配红包失败   
						}
					}
				}
			});
		},
		getTimetemp:function(){
			var that = this;
			var timetemp = sessionStorage.getItem('lockTime');
			if(timetemp && timetemp != '0' && timetemp != '-1' && timetemp != 'NaN' && timetemp != 'undefined' && timetemp != 'null'){
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
					that.investBtn.addClass('dis_btn');
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
					that.investBtn.addClass('dis_btn');
					sessionStorage.setItem('tailor_tender_num','0');
				});
			}
		},
		init : function(){
			var that = this;

			v.checkVip(function(data){//检测是否有vip利率
				if(data.code == '0000'){
					data = data.data;
					var vipRate = data.vipRate;
					if(vipRate && parseFloat(vipRate)>0){
						that.vipValue = vipRate;
						// that.vipImg = data.vipImg;
						that.vipImg = "/static/mobileSite/images/v.png";
					}else{
						that.vipValue = "";
					}
					
				}
			});
			
			that.loadList(),that.creatHealper(),that.bindEvent(),that.getTimetemp();

			
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,dataPage,COMMON_POST,COMMON_KH,COMMON_Login);
