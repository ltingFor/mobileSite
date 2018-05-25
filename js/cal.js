var cal = (function(w,d,j){
	/**
	 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
	 *
	 * @param  {function} func        传入函数
	 * @param  {number}   wait        表示时间窗口的间隔
	 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
	 * @return {function}             返回客户调用函数
	 */
	var debounce = function(func, wait, immediate) {
	  var timeout, args, context, timestamp, result;
	  var later = function() {
	    // 据上一次触发时间间隔
	    var last = (new Date().getTime()) - timestamp;
	    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
	    if (last < wait && last > 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
	      if (!immediate) {
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      }
	    }
	  };

	  return function() {
	    context = this;
	    args = arguments;
	    timestamp = (new Date().getTime());
	    var callNow = immediate && !timeout;
	    // 如果延时不存在，重新设定延时
	    if (!timeout) timeout = setTimeout(later, wait);
	    if (callNow) {
	      result = func.apply(context, args);
	      context = args = null;
	    }
	    return result;
	  };
	};
	var calUtilt = {
		cal : j(".cal"),
		key : j('.key'),
		del : j(".del"),
		output : j(".output"),
		cal_close : j(".cal_close"),
		calImg : j(".calImg"),
		intrest : j(".intrest"),
		supRateStr : j('#supRateStr'),
		amount : j(".amount"),
		calDay : j('.calDay'),
		clear : j('.dott'),
		sesame_money : j("#sesame_money"),
		sesame_holdDay : j("#sesame_holdDay"),
		bindEvent : function(){
			var that = this;
			that.sesame_money.on('touchstart',function(){
				that.sesame_money.find('span.cursor-blink').removeClass('dis_none');
				that.sesame_money.find('span').eq(0).addClass('val');
				that.sesame_holdDay.find('span.cursor-blink').addClass('dis_none');
				that.sesame_holdDay.find('span').eq(0).removeClass('val');
			});
			that.sesame_holdDay.on('touchstart',function(){
				that.sesame_holdDay.find('span.cursor-blink').removeClass('dis_none');
				that.sesame_holdDay.find('span').eq(0).addClass('val');
				that.sesame_money.find('span.cursor-blink').addClass('dis_none');
				that.sesame_money.find('span').eq(0).removeClass('val');
			});
			that.calImg.on('touchstart',function(){
				that.cal.animate({'bottom':"0"}, "slow" );
				Layer.showLayer();
			});
			that.cal_close.on('touchstart',function(){
				that.cal.animate({'bottom':'-20rem'}, "slow" );
				Layer.hideLayer();
			});
			that.key.on('touchstart',function(){
				var curValue = $(this).html(),
					amount = j('.val').html()+curValue,
					numValue = +(amount || 0),
					num_value = Math.floor(numValue / 100) * 100;
				if(!numValue) return;
				if(that._calObj.type == 'sesame' && j('.val').hasClass('calDay')){
					if(parseInt(j('.calDay').html()+curValue) > parseInt(that._calObj.calDays)){
						j('.calDay').empty().append(that._calObj.calDays);
			    		Layer.alertAuto('最长只能持有'+that._calObj.calDays+'天');
			    		return;
			    	}
				}
				if(j('.val').hasClass('amount')){
					if(num_value >= 100000000){
						return false;
					}
				}

				j('.val').append($(this).html());
			});
			that.clear.on('touchstart',function(){
				j('.val').html('');
				that.output.html('');
			});
			that.del.on('touchstart',function(){
				/*if(that._calObj.type == 'wmps'){
					that.output.removeClass('bigSize').html('正在计算...');
				}*/
				var temp = j('.val').text();
				var tempArr = temp.split('');
				tempArr.pop();
				var str = tempArr.join('');
				j('.val').text(str);
			});

			j('.amount').bind('DOMNodeInserted',debounce(function() {//芝麻开花 and 翼农计划
			    if(!j('.amount').text()){
			    	that.output.html('0.00');
			    }else{
			    	var amount = j('.val').html(),
						numValue = +(amount || 0),
						num_value = Math.floor(numValue / 100) * 100;
					if(num_value < 100000000){
						if(numValue != num_value){
							that.output.removeClass('bigSize').html('请输入100的整数倍');
							return;
						}
					}else{//最多一次投资一千万
						return ;
					}

			    	if(that._calObj.intrest && that._calObj.calDays){
			    		if(that._calObj.type == 'sesame'){
			    			// (amount,investment_period,payDates,productRate,mgrRate ,transRateTbl,paidInExtend)
			    			var sesameParam = that._calObj.sesameParam || '';
			    			if(!sesameParam) return;
							var resu = that._calObj.callback(j('.amount').html(),j('.calDay').html(),sesameParam.incomeTable,sesameParam.calcExt),//sesam,
								_val = JSON.parse(resu);
							that.output.addClass('bigSize').html(Tools.outputmoney(_val.income) || '');
							that.intrest.addClass('bigSize').html(_val.curRate || '');
			    		}else if(that._calObj.type == 'wmps'){
							var _val = that._calObj.callback(j('.val').html(),that._calObj.intrest,that._calObj.calDays);
			    			that.output.addClass('bigSize').html(_val);
			    		}else if(that._calObj.type == 'wmpsPlus'){
			    			var _val = that._calObj.callback(j('.val').html(),that._calObj.intrest,that._calObj.vipRate,that._calObj.addRate,that._calObj.otherRate,that._calObj.calDays,that._calObj.payWay);
			    			that.output.addClass('bigSize').html(_val);
			    		}
			    	}

			    }
			}, 800));
			j('.calDay').bind('DOMNodeInserted',debounce(function() {//芝麻开花
			    if(!j('.calDay').text()){
			    	that.output.html('0.00');
			    }else{
			    	if(that._calObj.intrest && that._calObj.calDays){
			    		if(that._calObj.type == 'sesame'){
			    			// (amount,investment_period,payDates,productRate,mgrRate ,transRateTbl,paidInExtend)
			    			var sesameParam = that._calObj.sesameParam || '';
			    			if(!sesameParam) return;
							var resu = that._calObj.callback(j('.amount').html(),j('.calDay').html(),sesameParam.incomeTable,sesameParam.calcExt),//sesam,
								_val = JSON.parse(resu);
							that.output.html(_val.income || '');
							that.intrest.html(_val.curRate || '');
			    		}
			    	}

			    }
			}, 800));
		},
		init : function(){
			var that = this;
			that.bindEvent();
		}
	}
	calUtilt.init();
	return {
		initCal : function(calObj){
			calUtilt._calObj = calObj;
			calUtilt.intrest.html(calObj.intrestStr || '');
			calUtilt.supRateStr.html(calObj.supRateStr || '');//芝麻开花的副利率
			calUtilt.calDay.html(calObj.calDays || '');
			calUtilt.amount.html(calObj.amount || '');
		}
	}
})(window,document,$)