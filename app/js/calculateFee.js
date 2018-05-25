/**
*参数为json字符串
{
	money : 0,//提现金额
	quota : 0,//免费提现额度
	cost_calculation_unit : 0,//提现的单位
	cost_min_unit : 0,//最小提现单位
	cost_rate : 0,//提现费率
}
**/
function calculateFee(jsonStr){
	var Obj = eval('(' + jsonStr + ')');
	var val = +(Obj.money);
	var feiyValue = 0,//费用金额
		// countWithDrawFee = Obj.countWithDrawFee,//免费提现次数
		quota = Obj.quota,////免费提现额度
		cost_min_unit = Obj.cost_min_unit,//不足最小金额，按照最小金额处理
		cost_rate = Obj.cost_rate,
		unit = Obj.cost_calculation_unit;//提现单位

		if(val > quota){//提现金额超过免费提现额度
			feiyValue = (val - quota) * cost_rate;
		} else {
			feiyValue = 0;
		}
	// }

	if(feiyValue > 0 && feiyValue < cost_min_unit){
		feiyValue = cost_min_unit;
	}
	if(feiyValue){
		feiyValue = (+(feiyValue)).toFixed(2);
	}

	return feiyValue;
}

function calculateFeeAndroid(jsonStr){
	if(typeof jsonStr == 'string'){
		jsObj.setPaid(calculateFee(jsonStr));	
	}else{
		jsObj.setPaid(calculateFee(JSON.stringify(jsonStr)));
	}
	
	// jsObj.setPaid(calculateFee(jsonStr));	
}

function calculateFeeIOS(jsonStr){
	return calculateFee(jsonStr);
}


function calculateFeeTip(jsonStr){
	var Obj = eval('(' + jsonStr + ')');
	var val = +(Obj.money);
	var feiytip='';
	var feiyValue = 0,//费用金额
		quota = Obj.quota,////免费提现额度
		cost_min_unit = Obj.cost_min_unit,//不足最小金额，按照最小金额处理
		cost_rate = Obj.cost_rate,
		t0_maxamount = Obj.t0_maxamount,
		unit = Obj.cost_calculation_unit;//提现单位
		if((quota.toString()).indexOf(".")!= -1){
			if(quota.toString().split(".")[1].length>2){
			quota=(+(quota)).toFixed(2);		
		}
		}
				
		if(val > quota){//提现金额超过免费提现额度
			feiyValue = (val - quota) * cost_rate;
		} else {
			feiyValue = 0;
		}
	

			if(feiyValue > 0 && feiyValue < cost_min_unit){
				feiyValue = cost_min_unit;
			}
			if(feiyValue){
				feiyValue = (+(feiyValue)).toFixed(2);
			}
			
		if (Obj.tnum == 0) {
        if (val ==0) {
            feiytip = '本日剩余快速提现金额' + addCommas(t0_maxamount) + '元'
        } else {
            feiytip = '本日剩余快速提现金额' + addCommas(t0_maxamount) + '元。本次提现金额'+addCommas(val)+'元，提现手续费' + addCommas(feiyValue) + '元'
        }
		};
		if (Obj.tnum == 1) {
			if (val <= quota) {
				feiytip = '本次提现免费，限免额度' + addCommas(quota) + '元'
			} else {
				feiytip = '限免额度' + addCommas(quota) + '元，提现金额已超出，手续费' + addCommas(feiyValue) + '元'
			}
			
		}
		return feiytip;
}

function calculateFeeTipAndroid(jsonStr){
	if(typeof jsonStr == 'string'){
		jsObj.setPaidTip(calculateFeeTip(jsonStr));	
	}else{
		jsObj.setPaidTip(calculateFeeTip(JSON.stringify(jsonStr)));
	}
	
}

function calculateFeeTipIOS(jsonStr){
	return calculateFeeTip(jsonStr);
}


function addCommas(nStr)
	{
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}