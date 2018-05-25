(function(w,r,j,t,l){
	var getUtilt = {
		userName : j('#userName'),
		cardType : j("#show_cer"),
		cardNo : j("#cardNo"),
		bankType : j(".bankType"),//银行类型
		bankNo : j("#bankNo"),
		mobile : j("#mobile"),
		nextBtn : j("#nextBtn"),
		hideForm : j("#hideForm"),
		context : j("input[type=hidden]"),
		Reg_mobile : 0,
		bankLen : 0,
		bankNotice : '',
		F_changeBtnStatus : function(obj){//判空方法
			var that = this;
			obj.bind('focus',function(){
				if(that.userName.val() && that.cardType.text() && that.cardNo.val() && that.trim(that.bankNo.val()) && that.mobile.val()){
					that.nextBtn.removeClass('dis_btn');
				}
			});
		},
		trim : function(str) { 
			var newStr = str.replace(/\s/g,"");
			return newStr; 
		},
		bandEvent : function(){
			var that = this;
			that.F_changeBtnStatus(that.userName);
			that.F_changeBtnStatus(that.cardNo);
			that.F_changeBtnStatus(that.bankNo);
			that.F_changeBtnStatus(that.mobile);

			that.userName.bind('input propertychange',function(){
				// 叉叉
				j('#useNameClose').show()
				if(that.cardType.text() && that.cardNo.val() && that.trim(that.bankNo.val()) && that.mobile.val()){
					that.nextBtn.removeClass('dis_btn');
				}else{
					that.nextBtn.addClass('dis_btn');
				}
			});
			// 姓名叉叉
			j('#useNameClose').on('click',function(){
				that.userName.val('')
				j(this).hide()
			});
			that.cardNo.bind('input propertychange',function(){
				// 叉叉
				j('#cardNoClose').show()
				if(that.userName.val() && that.cardType.text() && that.trim(that.bankNo.val()) && that.mobile.val()){
					that.nextBtn.removeClass('dis_btn');
				}else{
					that.nextBtn.addClass('dis_btn');
				}
			});
			// 证件号码叉叉
			j('#cardNoClose').on('click',function(){
				that.cardNo.val('')
				j(this).hide()
			});
			//银行卡输入
			that.bankNo.on('keyup', function(e) {
				// 银行卡号叉叉
				j('#bankNoClose').show()
				if(that.userName.val() && that.cardType.text() && that.cardNo.val() && that.mobile.val()){
					that.nextBtn.removeClass('dis_btn');
				}else{
					that.nextBtn.addClass('dis_btn');
				}
		       //格式化四位一空格  只对输入数字时进行处理
		        if((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105 )){
			        //获取当前光标的位置
			        var caret = this.selectionStart;
			        //获取当前的value
			        var value = this.value;
			        //从左边沿到坐标之间的空格数
			        var sp = (value.slice(0, caret).match(/\s/g) || []).length;
			        //去掉所有空格
			        var nospace = value.replace(/\s/g, '');
			        //重新插入空格
			        var curVal = this.value = nospace.replace(/(\d{4})/g, "$1 ").trim();
			        //从左边沿到原坐标之间的空格数
			        var curSp = (curVal.slice(0, caret).match(/\s/g) || []).length;
			        //修正光标位置
			        this.selectionEnd = this.selectionStart = caret + curSp - sp;
		        }
		      });
			//银行卡号失去焦点
			that.bankNo.bind('blur',function(){
				if(!that.trim(that.bankNo.val())){
					return false
				}
				if(that.trim(that.bankNo.val()).length<14){
					l.alertAuto('银行卡号格式不正确');
					return false;
				}
				r.setFlag(false);
				r.post({
					url : PUBLIC._COMMON,
					data : {
						requesturl : '%2F8SPpeSkULT9bRG3BN947T85M1sP8%2BMT',
						bankAccount : that.trim(that.bankNo.val())
					},
					success : function(data){
						console.log(data);
						if(data.code == '0000'){
							data = data.data;
							j('#errorContent').addClass('dis_none');
							j("#bankSelect").addClass('dis_none');
							j("#bankShow").removeClass('dis_none');
							j('.bankImg').attr('src',data.bankIcon);
							j('.bankName').html(data.bankName).attr('data-code',data.bankCode);
							j('#bankContent').removeClass('dis_none');
							j('#rechargeTip').html(data.limitMsg || '');
							var str = '',strArr = data.bankNotice;
							if(strArr){
								if(strArr.length){
									for(var i=0,l=strArr.length;i<l;i++){
										str += strArr[i]+'<br/>';
									}
								}
							}
							that.bankNotice = str;
						}else{//失败
							j("#bankShow").addClass('dis_none');
							j("#bankContent").addClass('dis_none');
							j("#bankSelect").removeClass('dis_none');
							j('#errorContent').removeClass('dis_none');
						}
					}
				});
			});
			j('#showBankSelect').bind('click',function(){//匹配有误，重新选择
				j("#bankShow").addClass('dis_none');
				j("#bankContent").addClass('dis_none');
				j("#bankSelect").removeClass('dis_none');
				j('#errorContent').removeClass('dis_none');
			});
			j('#errorContent').bind('click',function(){
				l.alert2('<p>厦门银行存管系统支持以下16家银行:<br/>中国农业银行、中国银行、中信银行、中国光大银行、兴业银行、广发银行、华夏银行、中国工商银行、中国民生银行、中国建设银行、中国邮政储蓄银行、平安银行、浦发银行、招商银行、交通银行、厦门银行</p>')
			});
			// 银行卡号叉叉
			j('#bankNoClose').on('click',function(){
				that.bankNo.val('');
				j(this).hide()
			})
			that.mobile.bind('input propertychange',function(){
				// 手机号叉叉
				j('#mobileClose').show()
				if(that.userName.val() && that.cardType.text() && that.cardNo.val() && that.trim(that.bankNo.val())){
					that.nextBtn.removeClass('dis_btn');
				}else{
					that.nextBtn.addClass('dis_btn');
				}
			});
			// 手机号叉叉
			j('#mobileClose').on('click',function(){
				that.mobile.val('')
				j(this).hide()
			})
			that.nextBtn.bind('click',function(){
				var clientName = that.userName.val(),
					idType = that.cardType.attr('data-code'),
					cardNo = that.cardNo.val(),
					bankCode = that.trim(that.bankNo.val()),
					mobile = that.mobile.val();
				if(that.nextBtn.hasClass('dis_btn')){
					return false;
				}

				if(!that.trim(clientName)){
					l.alertAuto('姓名不能为空',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				if(!t.checkLength(clientName)){
					l.alertAuto('姓名不超过50个字符',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				if(!that.cardType.attr('data-code')){
					l.alertAuto('证件类型不能为空',function(){
						//that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				if(!that.cardNo.val()){
					l.alertAuto('证件号码不能为空',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				if(!t.checkLength(that.cardNo.val())){
					l.alertAuto('证件号码不能超过50位',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				/*if(!that.bankType.attr('data-code')){
					l.alertAuto('开户银行不能为空',function(){
						//that.nextBtn.addClass('dis_btn');
					});
					return false;
				}*/
				if(!that.trim(that.bankNo.val())){
					l.alertAuto('银行卡号不能为空',function(){
						that.nextBtn.addClass('dis_btn');
					});;
					return false;
				}
				if(!t.checkNum(that.trim(that.bankNo.val())) || !t.checkLength(that.trim(that.bankNo.val()))){
					l.alertAuto('银行卡号格式不(正确',function(){
						that.nextBtn.addClass('dis_btn');
					});;
					return false;
				}
				if(!that.trim(that.mobile.val())){
					l.alertAuto('银行预留手机号不能为空',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				if(!t.checkPhone(that.mobile.val())){
					l.alertAuto('银行预留手机号格式不正确',function(){
						that.nextBtn.addClass('dis_btn');
					});
					return false;
				}
				console.log(that.bankNotice);
				if(that.bankNotice){
					$(".alert_btn_ok").text('我已知晓');
					$(".alert_btn_cancel").text('重新换卡');
					j('.alert_content_center').css('text-align',"left");
					l.alert1(that.bankNotice);
					
					l.setOkAction(function(){
						that.gotoNext();
						j('.alert_content_center').css('text-align',"center");
					});
					l.setCancelAction(function(){
						j('.alert_content_center').css('text-align',"center");
					});
					return false;
				}else{
					j('.alert_content_center').css('text-align',"center");
				}
				that.gotoNext();
			});
		},
		gotoNext : function(){
			var that = this;
			var clientName = that.userName.val(),
				idType = that.cardType.attr('data-code'),
				cardNo = that.cardNo.val(),
				bankCode = that.trim(that.bankNo.val()),
				mobile = that.mobile.val();
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.KH_setInfo_URL,
					clientName : clientName,
					idType : idType,//证件类型
					idCode : cardNo,//证件号码
					bankName : that.bankType.text() || j('.bankName').text(),//银行名称
					bankCode : bankCode,//银行卡号
					mobile : mobile,//预留手机号
					bankAlias : that.bankType.attr('data-code') || j('.bankName').attr('data-code')
				},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;

						that.hideForm.attr('action',data.url);
						for(var i in data){
							j("input[name="+i+"]").val(data[i]);
						}
						that.hideForm.submit();
					}
				}
			}); 
		},
		getCredentialList : function(){//证件类型
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.KH_CredentialList_URL
				},
				success : function(data){
					// this.bindAddress();
					if(data.code == '0000'){
						data = data.data || [];
						data = data.idTypes || [];
						var dataO = that.formatData(data,'C');
						that.bindAddress('select_cer','show_cer',dataO,'');	
						that.getUserInfo();
						// that.cardType.attr('data-code',dataO[0]['id']).html(dataO[0]['value']);
					}
				}
			});
		},

		getBankList : function(){
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.KH_GetBankList_URL
				},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						data = that.formatData(data,'B');
						that.bindAddress('select_bank','show_bank',data,'');
						
						// that.bankType.attr('data-code',data[0]['id']).html(data[0]['value']);
					}
				}
			});
		},
		formatData : function(arr,type){//格式化返回的数据
			arr = arr || [], L = arr.length,temp = [];
			if(arr && L && type == 'C'){//证件类型
				for(var i=0;i<L;i++){
					var a = arr[i];
					temp.push({'id':a['cardNo'],'value':a['cardName']});
				}
			}else if(arr && L && type == 'B'){//银行类型
				for(var i=0;i<L;i++){
					var a = arr[i];
					var strA = a['bankNotice'],str = '';
					if(strA.length){
						for(var b=0,l=strA.length;b<l;b++){
							str += strA[b]+'<br/>';
						}
						temp.push({'id':a['bankCode'],'value':a['bankName'],'notice':str});
					}else{
						temp.push({'id':a['bankCode'],'value':a['bankName'],'notice':''});	
					}
				}
			}
			return temp;
		},
		bindAddress : function(selectDom,showDom,arr,title){
			var that = this;
			var selectContactDom = j('#'+selectDom),
		    	showContactDom = j('#'+showDom);
		    selectContactDom.bind('click', function () {
		        var sccode = showContactDom.attr('data-code');
		        var scname = showContactDom.attr('data-name');
		
		        var oneLevelId = sccode;
		        var iosSelect = new IosSelect(1, 
		            [arr],
		            {
		                title: title,
		                headerHeight : 1.2,
		                itemHeight: 1.0,
		                cssUnit : 'rem',
		                oneLevelId: oneLevelId,
		                callback: function (selectOneObj) {
		                    showContactDom.attr('data-code', selectOneObj.id);
		                    showContactDom.html(selectOneObj.value);
		                    that.bankNotice = selectOneObj.notice || '';
		                }
		        });
 			});
		},
		getUserInfo : function(){
			var that = this;
			r.setLayerFlag(false);
			r.postLayer({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.KH_INIT_URL
				},
				success : function(data){
					if(data.code == '0000'){
						var data = data.data,flag = data.flag;
						switch(flag){
							case "1"://走正常开户流程
								break;
							case "2"://老用户未迁移数据，需要展示姓名、身份证类型、身份证号码信息，且不可修改
								that.userName.val(data.clientName||"").attr('readonly','readonly');
								that.cardType.attr('data-code',data.idType).html(data.idName).unbind('click');
								j("#select_cer").unbind('click');
								that.cardNo.val(data.idCode).attr('readonly','readonly');
								break;
							case "3"://老用户未迁移数据，需要展示姓名、身份证类型、身份证号码信息，且可修改
								that.userName.val(data.clientName||"");
								that.cardType.attr('data-code',data.idType).html(data.idName);
								that.cardNo.val(data.idCode);
								break;
						}
					}
				}
			});
		},
		getMobileReg : function(){
			var that = this;
			r.post({
				url : PUBLIC._COMMON,
				data : {
					requesturl : CONFIG.RegExp_Mobile_URL
				},
				success : function(data){
					if(data.code == '0000'){
						data = data.data;
						that.Reg_mobile = new RegExp(data.iphonePattern);
					}
				}
			});
		},
		init : function(){
			var that = this;
			that.bankNo.val('');
			if(that.cardType.text() && that.cardNo.val() && that.trim(that.bankNo.val()) && that.mobile.val() && that.userName.val()){
				that.nextBtn.removeClass('dis_btn');
			}
			that.getMobileReg(),that.getBankList(),that.getCredentialList(),that.bandEvent();
		}
	}
	getUtilt.init();
})(window,requestUtil,$,Tools,Layer)