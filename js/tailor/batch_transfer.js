(function(w,j,r,l,t,h,v,c,cl,gt){
	var param_obj = t.getParams();
	var platform = param_obj.platform,
		proddetail = decodeURIComponent(param_obj.proddetail),
		transType = param_obj.transType,
		myProExtend = param_obj.myProExtend;

	var pageUtil={
		btn:j(".btn"),
		tender_total_num:0,
		tender_total_num_const:0,
		tender_total_money:0,
		tender_money_o:j('#tender_money'),
		tender_num_o:j("#tender_num"),
		bindEvent:function(){
			var that = this;
			that.btn.bind('click',function(){
				if(j(this).hasClass('dis_btn')){return false;}
				// gt.get_token(function(res){
					// if(res.code == '0000'){
						// res = res.data.token;
						var sendData = [];
						j(".list").each(function(i,o){
							if(!j(o).hasClass('nocheck-list')){
								var f_j_money = +(j(j(o).find('input[type=tel]')[0]).val()),
									prodstr = j(o).data('prodstr'),
									transTo_o = j(j(this).find('span.transTo'));
								if(transTo_o.hasClass('dijia')){
									sendData.push({'prodStr':prodstr,'rebate':-f_j_money});
								}else if(transTo_o.hasClass('gaojia')){
									sendData.push({'prodStr':prodstr,'rebate':f_j_money});
								}else{
									sendData.push({'prodStr':prodstr,'rebate':0});
								}
							}
						});
						if(sendData.length){
							var listStr = JSON.stringify(sendData);
							listStr=$.base64.encode(listStr);
						}
						r.postLayer({
							url:PUBLIC._COMMON,
							data:{requesturl:'mBI9zdBAgnR0RONCptStQh95XTYTwFzt',cessionApply:listStr},
							success:function(bac){
								if(bac.code == '0000'){
									window.location.href = '/static/mobileSite/html/success.html?platform='+platform+'&code=transfer_1';
								}
							}
						})
					// }
				// });
			});
			$("#contents").delegate('.remd','click',function(){
				l.alert2(j(this).data('tip'));
				return false;
			});

		},
		creatHelper:function(){
			h.registerHelper('format',function(num,type){
				if(type == 'no'){
					return t.outputmoney_n(num+"");
				}else{
					return t.outputmoney(num+"");
				}
			});
		},
		change_input:function(){
			var that = this;
			j('.check').bind('click',function(){
				var parent = j(this).parents('li.list'),c_f = j(this).parents('li.list').hasClass('nocheck-list');

				var cur_ss = parseFloat(j(j(j(this).parents('li.list')[0]).find('label.shishou')[0]).text().replace(/,/g,''));
				if(c_f){
					parent.removeClass('nocheck-list');
					that.tender_total_num += 1;
					that.tender_total_money += cur_ss;
				}else{
					parent.addClass('nocheck-list');
					that.tender_total_num -= 1;
					that.tender_total_money -= cur_ss;
				}
				that.tender_num_o.text(that.tender_total_num);
				that.tender_money_o.text(t.outputmoney(that.tender_total_money||"0")).data('num',t.outputmoney(that.tender_total_money||"0"));

				j('li.nocheck-list').length != that.tender_total_num_const ? j('.btn').removeClass('dis_btn') : j('.btn').addClass('dis_btn');
			});

			j(".transTo").bind('touchstart',function(){//高价转  低价转
				var o = j(this),f = o.data('class');
				o.siblings('span').removeClass('gaojia dijia');
				f == 'add' ? o.addClass('gaojia') : o.addClass('dijia');
				o.parents('li').next('li').removeClass('add_flag sub_flag').addClass(f+'_flag');

				var add_obj = j(j(this).parents('li')[0]).siblings('li').find('span.add'),
					sub_obj = j(j(this).parents('li')[0]).siblings('li').find('span.sub'),
					input_obj = j(o.parents('li')[0]).siblings('li').find('input'),
					min = j(j(this).parents('ul')[0]).data('min'),
					max = j(j(this).parents('ul')[0]).data('max'),
					min = min>0 ? min : -min,
					max = max>0 ? max : -max,
					v = parseFloat(input_obj.val()) || 0,
					cur_shishou_o = j(o.parents('ul')[0]).find('label.shishou'),
					cur_shishou = parseFloat(j(o.parents('ul')[0]).find('label.shishou').text().replace(/,/g,''));

					input_obj.attr('disabled',false);
				if((v >= min && f == 'sub')){
					input_obj.val(min);
					add_obj.addClass('dis_add');
					add_obj.data('cf',false);

					sub_obj.removeClass('dis_sub');
					sub_obj.data('cf',true);
					//实收利息
					/*cur_shishou = cur_shishou-v-min;
					that.tender_total_money = that.tender_total_money-v-min;

					that.tender_money_o.text(t.outputmoney(that.tender_total_money)).data('num',t.outputmoney(that.tender_total_money));
					cur_shishou_o.text(t.outputmoney(cur_shishou));*/
				}
				else if((v >= max && f == 'add')){
					input_obj.val(max);
					add_obj.addClass('dis_add');
					add_obj.data('cf',false);

					sub_obj.removeClass('dis_sub');
					sub_obj.data('cf',true);
					//实收利息
					/*cur_shishou = cur_shishou+v+max;
					that.tender_total_money = that.tender_total_money+v+max;

					that.tender_money_o.text(t.outputmoney(that.tender_total_money)).data('num', t.outputmoney(that.tender_total_money));
					cur_shishou_o.text(t.outputmoney(cur_shishou));*/
				}
				else if(v <= 0){
					input_obj.val(0);
					sub_obj.addClass('dis_sub');
					sub_obj.data('cf',false);

					add_obj.removeClass('dis_add');
					add_obj.data('cf',true);
					//实收利息
					/*cur_shishou += 0;
					that.tender_total_money += 0;

					that.tender_money_o.text(t.outputmoney(that.tender_total_money)).data('num',t.outputmoney(that.tender_total_money));
					cur_shishou_o.text(t.outputmoney(cur_shishou));*/
				}else{
					add_obj.removeClass('dis_add');
					add_obj.data('cf',true);
					sub_obj.removeClass('dis_sub');
					sub_obj.data('cf',true);

					//实收利息
					/*if(f == 'add'){
						cur_shishou = cur_shishou+2*v;
						that.tender_total_money = that.tender_total_money+2*v;
					}else{
						cur_shishou = cur_shishou-2*v;
						that.tender_total_money = that.tender_total_money-2*v;
					}
					that.tender_money_o.text(t.outputmoney(that.tender_total_money)).data('num',t.outputmoney(that.tender_total_money));
					cur_shishou_o.text(t.outputmoney(cur_shishou));*/
				}
			});

			j('span.changeBtn').bind('touchstart',function(e){//+ -
				e.preventDefault();
				e.stopPropagation();
				var cur_O = j(this);
				if(!cur_O.data('cf')){return false;}
				var add_sub_type = cur_O.hasClass('sub'),//true -，false +
					o = cur_O.siblings('label').find('input'),
					v = +(o.val()),f = j(cur_O.parents('li')[0]).siblings('li').find('span.transTo'),
					span_O =  j(o.parents('li')[0]).siblings('li').find('span.transTo'),
					cur_shishou_o = j(cur_O.parents('ul')[0]).find('label.shishou'),
					cur_shishou = parseFloat(cur_shishou_o.text().replace(/,/g,''));//当前实收
				var max = parseInt(j(cur_O.parents('ul')[0]).data('max')),min = parseInt(j(o.parents('ul')[0]).data('min'));
				max = max>=0?max:-max;
				min = min >=0 ? min : -min;

				span_O.each(function(index, el) {
					if(j(el).hasClass('gaojia')){
						f = 'add';//高价转
					}else if(j(el).hasClass('dijia')){
						f = 'sub';//低价转
					}
				});

				var temp = add_sub_type ? --v : ++v;


				if((temp == min && f == 'sub') || (temp == max && f == 'add')){
					cur_O.addClass('dis_add');
					cur_O.data('cf',false);

					cur_O.siblings('span.sub').removeClass('dis_sub');
					cur_O.siblings('span.sub').data('cf',true);

					/*实收利息
					f == 'sub' ? that.tender_total_money -= 1,cur_shishou -= 1 : that.tender_total_money += 1,cur_shishou += 1;
					that.tender_money.text(t.outputmoney(that.tender_total_money));
					cur_shishou_o.text(t.outputmoney(cur_shishou));*/
				}
				else if(temp == 0 && add_sub_type){
					cur_O.addClass('dis_sub');
					cur_O.data('cf',false);

					cur_O.siblings('span.add').removeClass('dis_add');
					cur_O.siblings('span.add').data('cf',true);


				}
				else if((temp>max&&f=='add') || (temp>min && f == 'sub')){
					cur_O.addClass('dis_add');
					cur_O.data('cf',false);
					return false;
				}
				else if((temp < 0 && f == 'sub')){
					cur_O.addClass('dis_sub');
					cur_O.data('cf',false);
					return false;
				}else if((temp>0 && temp <max && f == 'add') || (temp >0 && temp<min && f == 'sub')){
					cur_O.siblings('span.sub').removeClass('dis_sub');
					cur_O.siblings('span.sub').data('cf',true);

					cur_O.siblings('span.add').removeClass('dis_add');
					cur_O.siblings('span.add').data('cf',true);
				}
				o.val(temp);
				//实收利息
				if(f == 'sub' && add_sub_type){
					cur_shishou += 1;
					that.tender_total_money += 1;
				}else if(f == 'sub' && !add_sub_type){
					cur_shishou -= 1;
					that.tender_total_money -= 1;
				}else if(f == 'add' && add_sub_type){
					cur_shishou -= 1;
					that.tender_total_money -= 1;
				}else if(f == 'add' && !add_sub_type){
					cur_shishou += 1;
					that.tender_total_money += 1;
				}
				that.tender_money_o.text(t.outputmoney(that.tender_total_money)).data('num',t.outputmoney(that.tender_total_money));
				cur_shishou_o.text(t.outputmoney(cur_shishou));
				return false;
			});
			j('.jine').blur(function(){
				var o = j(this);
				if(!o.val()){
					o.val(0);
					var cur_shishou_o = j(o.parents('ul')[0]).find('label.shishou');
					cur_shishou_o.text(cur_shishou_o.data('num'));
					that.tender_money_o.text(that.tender_money_o.data('num'));
				}
			});
			j('.jine').bind('input propertychange',function(e){//输入框
				var o = j(this),v=+(o.val()),max = parseInt(j(o.parents('ul')[0]).data('max')),min = parseInt(j(o.parents('ul')[0]).data('min'));
				var add_sub_type = j(o.parents('ul')[0]).find('span[data-class=sub]').hasClass('dijia');//true 低价，false 高价
				var add_obj =j(j(this).parents('label')[0]).siblings('span.add'),
					sub_obj = $(j(this).parents('label')[0]).siblings('span.sub');
				var span_O = j(o.parents('li')[0]).siblings('li').find('span.transTo');
					cur_shishou_o = j(o.parents('ul')[0]).find('label.shishou'),
					cur_shishou = parseFloat(cur_shishou_o.text().replace(/,/g,''));//当前实收
				min = min >=0 ? min : -min;
				max = max >=0 ? max : -max;
				if(!add_sub_type){//高价
					if(v == 0){
						sub_obj.addClass('dis_sub').data('cf',false);
						add_obj.removeClass('dis_add').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num').replace(/,/g,''))+0;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'));
					}else if(v>0 && v<max){
						add_obj.removeClass('dis_add').data('cf',true);
						sub_obj.removeClass('dis_sub').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num').replace(/,/g,''))+v;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))+v;
					}else if(v == max){
						add_obj.addClass('dis_add').data('cf',false);
						sub_obj.removeClass('dis_sub').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num').replace(/,/g,''))+max;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))+max;
					}else if(v>max){
						o.val(max);
						cur_shishou = parseFloat(cur_shishou_o.data('num').replace(/,/g,''))+max;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))+max;
						l.alertAuto('涨幅为出借本金的5%',function(){
							add_obj.addClass('dis_add').data('cf',false);
							sub_obj.removeClass('dis_sub').data('cf',true);
						});
					}
				}else if(add_sub_type){//低价
					if(v == 0){
						sub_obj.addClass('dis_sub').data('cf',false);
						add_obj.removeClass('dis_add').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num'));
						// that.tender_total_money = that.tender_money_o.data('num');
					}else if(v>0 && v<min){
						add_obj.removeClass('dis_add').data('cf',true);
						sub_obj.removeClass('dis_sub').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num')) - v;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))-v;
					}else if(v == min){
						add_obj.addClass('dis_add').data('cf',false);
						sub_obj.removeClass('dis_sub').data('cf',true);
						cur_shishou = parseFloat(cur_shishou_o.data('num')) - min;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))-min;
					}else if(v>min){
						o.val(min);
						cur_shishou = parseFloat(cur_shishou_o.data('num')) - min;
						// that.tender_total_money = parseFloat(that.tender_money_o.data('num'))-min;
						l.alertAuto('涨幅为出借本金的5%',function(){
							add_obj.addClass('dis_add').data('cf',false);
							sub_obj.removeClass('dis_sub').data('cf',true);
						});
					}
				}
				// that.tender_money_o.text(t.outputmoney(that.tender_total_money));
				cur_shishou_o.text(t.outputmoney(cur_shishou));
				var list_arr_o = j('li.list'),total_money = 0;
				for(var t1=0;t1<list_arr_o.length;t1++){
					if(!j(list_arr_o[t1]).hasClass('nocheck-list')){
						total_money += parseFloat(j(j(list_arr_o[t1]).find('label.shishou')[0]).text().replace(/,/g,'')||0);
					}
				}
				that.tender_total_money = total_money;
				that.tender_money_o.text(t.outputmoney(that.tender_total_money));
			});
			j(".inp-box").bind('click',function(e){
				e.preventDefault();
			});
		},
		get_trans_list:function(){
			var that = this;
			var btn_senddata={requesturl:'mBI9zdBAgnR0RONCptStQjNwPjTvlyNc',prodDetail:proddetail};
			if(transType == 'sec_hold'){//转让中
				btn_senddata={requesturl:'mBI9zdBAgnR0RONCptStQjNwPjTvlyNc',prodDetail:proddetail};
			}else{
				btn_senddata = {requesturl:'mBI9zdBAgnR0RONCptStQsoW%2Bl26HUmP',myProExtend:myProExtend};
			}
			r.postLayer({
				url:PUBLIC._COMMON,
				data:btn_senddata,
				success:function(data){
					if(data.code == '0000'){
						var hh = h.compile(j('#tpl_trans').html());
						if(transType != 'sec_hold'){
							data = data.data || {};
							data = data.tenderList || '';
							var L = data.length,m=0;

							that.tender_num_o.html(L || '-');
							for(var i=0;i<L;i++){
								m += parseFloat(data[i].realGetAmt.replace(/,/g,''));
							}
							j("#tender_money").html(t.outputmoney(m)).data('num',t.outputmoney(m));

							that.tender_total_num = L;
							that.tender_total_num_const = L;
							that.tender_total_money = m;

							var html = hh(data);
							j("#contents").append(html);
						}else{
							data = data.data || {};
							var list = [];
							list.push(data);

							that.tender_num_o.html('1');
							m = parseFloat(data.realGetAmt.replace(/,/g,''));
							j("#tender_money").html(t.outputmoney(m)).data('num',t.outputmoney(that.tender_total_money));

							that.tender_total_num = 1;
							that.tender_total_num_const = 1;
							that.tender_total_money = m;
							var html = hh(list);
							j("#contents").append(html);
						}
						that.change_input();
					}
				}
			});
		},
		init:function(){
			var that = this;
			that.creatHelper();
			that.get_trans_list();
			that.bindEvent();

			/*window.addEventListener('resize', function(){
				if(window.show_f){//foucus
					j('.zhai-btn').hide();
					window.show_f = false;
				}else{//关闭，，划屏
					j('.zhai-btn').show();
				}
			});*/
		}
	};
	pageUtil.init();
})(window,$,requestUtil,Layer,Tools,Handlebars,COMMON_POST,COMMON_KH,COMMON_Login,GET_Token);
window.show_f = false;