/**
 * js AmountInput 
 * author leon
 * **/
var AmountInput = (function(w,d,jq){
	var html = '';
	var options = {
		url: '/static/mobileSite/js/tools/el.amountinput.html',
		async: false,
		success: function(data){
			html=data;
			jq('body').append(html);
		},
	};
	jq.ajax(options);
	var confirmBtn = $('.keybordwrap .confirm');
	return {
		getConfirmBtn: function() {
			return confirmBtn;
		},
		check: function(){
//			alert();
//			$('.je').text('');
//			$('.keybord').hide(100);
			var amount = AmountInput.getAmount();
			if (amount%100 != 0) {
				Layer.alertAuto('请输入100的整数倍哦');
				return false;
			}
			return true;
		},
		getAmount: function(){
			var amount = jq(".keybord .je").text();
			amount = parseInt(amount);
			return amount;
		}
	};
})(window,document,$);