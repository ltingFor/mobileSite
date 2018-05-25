/**
*参数为json字符串
{
	money : 0,//投资金额
	rewardArr : 0,//可用奖励的数组

	匹配规则：有红包优先匹配红包，没有红包匹配加息券
}('')
**/

function matchReward(objstr){
	var obj;
	try{
		objstr = objstr.replace(new RegExp(/(\r)/g),'');
		objstr = objstr.replace(new RegExp(/(\n)/g),'');
		obj = eval('(' + objstr + ')');
	}catch(err){
		console.log('eval json obj error!'+err);
	}

	var money = obj.money,
		rewardArr = obj.rewardArr,
	    resRedbag = null,//最优红包
		resCoupon = null;//最优加息券
	for (var i = rewardArr.length - 1; i >= 0; i--) {
		if(rewardArr[i].activateBalance <= money){
			if(rewardArr[i].type==1){
				resRedbag = compare_max(resRedbag,  rewardArr[i]);
			}else if(rewardArr[i].type==3){
				resCoupon = compare_max(resCoupon,  rewardArr[i]);
			}
		}
	}
	
	if(resRedbag!=null){
		//if(resRedbag.id!=lastId){
			//print_log(JSON.stringify(objstr)+"<<<<===<a>===>>>"+JSON.stringify(resRedbag));
		//	lastId = resRedbag.id;
		//}
		return JSON.stringify(resRedbag);
	}
	if(resCoupon!=null){
		//if(resCoupon.id!=lastId){
			//print_log(JSON.stringify(objstr)+"<<<<===<a>===>>>"+JSON.stringify(resCoupon));
		//	lastId = resCoupon.id;
		//}
		return JSON.stringify(resCoupon);
	}
	return '';
	//return resCoupon == null ? '' : JSON.stringify(resCoupon);
}

function print_log(param){
	try{
		var urli = "/act_web/";
		$.ajax({
			url:urli,
			type: "post",
			async: false,
			data:{a:param},
			dataType:"html",
			success:function(result){ }
		});
	}catch(e){ }
}

function get_max_Android(obj){//安卓要单独提供方法回传计算结果，return他们接收不到
	if(typeof obj == 'string'){
		jsObj.get_max(matchReward(obj));	
	}else{
		jsObj.get_max(matchReward(JSON.stringify(obj)));	
	}
	
}

function get_max_Ios(obj){
	return matchReward(obj);
}

function compare_max(obja, objb){
	if(obja==null){
		obja = objb;
	}else{
		if(obja.balance < objb.balance){
			obja = objb;
		}else if(obja.balance == objb.balance && obja.overduedate > objb.overduedate  ){
			obja = objb;
		}
	}
	return obja;
}



Number.prototype.tofixed = function(d) {
var s=this+"";if(!d)d=0;if(s.indexOf(".")==-1)s+=".";s+=new Array(d+1).join("0");if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+ (d+1) +"})?)\\d*$").test(s)){var s="0"+ RegExp.$2, pm=RegExp.$1, a=RegExp.$3.length,b=true;if (a==d+2){a=s.match(/\d/g); if (parseInt(a[a.length-1])>4){
for(var i=a.length-2; i>=0; i--) {a[i] = parseInt(a[i])+1;if(a[i]==10){a[i]=0; b=i!=1;} else break;}}s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");}if(b)s=s.substr(1);return (pm+s).replace(/\.$/, "");} return this+"";};
function js(){
	
	var prize_account = document.getElementById('prizem').value;
	var in_account = document.getElementById('inm').value;
	var days = document.getElementById('days').value;
	document.getElementById('res').value = prize_add_year_rate_decimals(prize_account, in_account, days,4);
	alert(prize_add_year_rate_decimals(prize_account, in_account, days,4));
	//¹«Ê½£º?%=±äÏÖºì°ü½ð¶î/µ±±ÊÍ¶×Ê½ð¶î*365/Í¶×ÊÌìÊý\
}

function prize_add_year_rate_decimals(prize_account, in_account, days, decimals){
	var res = 0;
	res = Number(Number(prize_account)/Number(in_account)*365/Number(days));
	res = Number(100 * (res * 100000) / 100000).toFixed(decimals);
	var resStr = String(res);
	if(resStr.indexOf('.')!=-1&&resStr.substring(resStr.indexOf('.')+1).length>decimals){
		res = Number(resStr.substring(0,resStr.indexOf('.')+1+decimals));
	}
	return String(res  + '%');
}

function prize_add_year_rate_android_decimals(prize_account, in_account, days, decimals){
	var res = 0;
	res = Number(prize_account)/Number(in_account)*365/Number(days);
	res = Number(100 * (res * 100000) / 100000).toFixed(decimals);
	var resStr = String(res);
	if(resStr.indexOf('.')!=-1&&resStr.substring(resStr.indexOf('.')+1).length>decimals){
		res = Number(resStr.substring(0,resStr.indexOf('.')+1+decimals));
	}
	//return res.toFixed(decimals);
	jsObj.setPaid(String(res + '%'));
}

function prize_add_year_rate(prize_account, in_account, days){
	var res = 0;
	res = Number(prize_account)/Number(in_account)*365/Number(days);
	res = Number(100 * (res * 100000) / 100000).toFixed(2);
	var resStr = String(res);
	if(resStr.indexOf('.')!=-1&&resStr.substring(resStr.indexOf('.')+1).length>2){
		res = Number(resStr.substring(0,resStr.indexOf('.')+1+2));
	}
	return String(res + '%');
}

function prize_add_year_rate_android(prize_account, in_account, days){
	var res = 0;
	res = Number(prize_account)/Number(in_account)*365/Number(days);
	res = Number(100 * (res * 100000) / 100000).toFixed(2);
	var resStr = String(res);
	if(resStr.indexOf('.')!=-1&&resStr.substring(resStr.indexOf('.')+1).length>2){
		res = Number(resStr.substring(0,resStr.indexOf('.')+1+2));
	}
	//return res.toFixed(decimals);
	jsObj.setPaid(String(res + '%'));
}
