//获取利息+本金的总额
//y是金额、l是利率、t是天数、xt加息券天数

function getAmountTotal(y, l, t, xt) {
    var yl = parseFloat(toDecimal2(y));
    var interestTotal = toDecimal2(yl * (l / 100) / 365);
    return jwjs(toDecimal2(interestTotal * t + parseFloat(toDecimal2(y))));
}


//IOS   获取利息总额
//y是金额、l是主利率、t是天数、xt加息券天数, xl加息券的利率、fl是副利率、vl是vip利率
function getInterestTotal(y, l, t, xt, xl, fl, vl) {
    var yl = parseFloat(toDecimal2(y)); //本金
    var interestTotal = toDecimal2(yl * (l / 100) / 365);
    var interestTotalF = toDecimal2(yl * (fl / 100) / 365);
    var interestTotalV = toDecimal2(yl * (vl / 100) / 365);
    var interestXTotal = 0;
    var lv1 = toDecimal2(interestTotal * t);
    var lv2 = 0;
    var lv3 = toDecimal2(interestTotalF * t); //副利率金额
    var lv4 = toDecimal2(interestTotalV * t); //vip利率金额
    var yl = parseFloat(toDecimal2(y)); //本金
    var dayTotal = jwjs(toDecimal2(yl * (parseFloat(l) / 100 + parseFloat(xl) / 100 + parseFloat(fl) / 100 + parseFloat(vl) / 100) / 365)); //翼农计划每日收益
    if (xt != undefined && xt != null && xt != '') {
        if (parseInt(t) > parseInt(xt)) {
            interestXTotal = toDecimal2(yl * (xl / 100) / 365);
            lv2 = toDecimal2(interestXTotal * xt);
        } else {
            interestXTotal = toDecimal2(yl * (xl / 100) / 365);
            lv2 = toDecimal2(interestXTotal * t);
        }
    }
    return String(jwjs(toDecimal2(parseFloat(lv1) + parseFloat(lv2) + parseFloat(lv3) + parseFloat(lv4))) + '_' + dayTotal);
}

//Android 获取利息总额
function getEarningTotal(y, l, t, xt, xl, fl, vl) {
    var yl = parseFloat(toDecimal2(y)); //本金
    var interestTotal = toDecimal2(yl * (l / 100) / 365);
    var interestTotalF = toDecimal2(yl * (fl / 100) / 365); //副利率收益
    var interestTotalV = toDecimal2(yl * (vl / 100) / 365); //vip利率收益
    var interestXTotal = 0;
    var lv1 = toDecimal2(interestTotal * t);
    var lv2 = 0;
    var lv3 = toDecimal2(interestTotalF * t); //副利率金额
    var lv4 = toDecimal2(interestTotalV * t); //vip利率金额
    var dayTotal = jwjs(toDecimal2(yl * (parseFloat(l) / 100 + parseFloat(xl) / 100 + parseFloat(fl) / 100 + parseFloat(vl) / 100) / 365)); //翼农计划每日收益
    if (xt != undefined && xt != null && xt != '') {
        if (parseInt(t) > parseInt(xt)) {
            interestXTotal = toDecimal2(yl * (xl / 100) / 365);
            lv2 = toDecimal2(interestXTotal * xt);
        } else {
            interestXTotal = toDecimal2(yl * (xl / 100) / 365);
            lv2 = toDecimal2(interestXTotal * t);
        }
    }

    jsObj.toEarning(jwjs(toDecimal2(parseFloat(lv1) + parseFloat(lv2) + parseFloat(lv3) + parseFloat(lv4))), dayTotal);
}


//保留两位小数
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var s = f.toFixed(4);
    s = parseFloat(s).toFixed(2);
    return s;
}

//金额分隔
function jwjs(num) {
    if (num != undefined) {
        if (num.toString().split('.')[0] != undefined && num.toString().split('.')[1] != undefined) {
            var nums = num.toString().split('.')[0];
            var numz = num.toString().split('.')[1];
            var numss = nums.split('').reverse();
            var renums = '';
            for (var i = 0; i < numss.length; i++) {
                renums += numss[i] + ((i + 1) % 3 == 0 && (i + 1) != numss.length ? "," : "");
            }
            return renums.split("").reverse().join("") + "." + numz;
        } else {
            var numss = num.toString().split('').reverse();
            var renums = '';
            for (var i = 0; i < numss.length; i++) {
                renums += numss[i] + ((i + 1) % 3 == 0 && (i + 1) != numss.length ? "," : "");
            }
            return renums.split("").reverse().join("") + ".00";
        }
    }
}


//Android
//还本付息
function getyt_hbfx(m, v1, v2, v3, v4, q) {
    var v1_v = v1 || 0;
    var v2_v = v2 || 0;
    var v3_v = v3 || 0;
    var v4_v = v4 || 0;
    var hbfx = parseInt(m) * ((parseFloat(v1) + parseFloat(v2) + parseFloat(v3) + parseFloat(v4)) / 100) / 12 * parseInt(q);
    jsObj.toEarning(jwjs(toDecimal2(hbfx)));
}

//等额本金
function getyt_debj(m, v1, v2, v3, v4, q) {
    var v1_v = parseFloat(v1) || 0;
    var v2_v = parseFloat(v2) || 0;
    var v3_v = parseFloat(v3) || 0;
    var v4_v = parseFloat(v4) || 0;
    var pj_m = (parseInt(m) / parseInt(q)).toFixed(2); //每月平均本金
    var sy_m = parseInt(m); //剩余本金
    var total_m = 0; //总额
    for (var i = 0; i < q; i++) {
        var total_m = (parseFloat(total_m) + parseFloat((sy_m * v1_v / 100).toFixed(2)) + parseFloat((sy_m * v2_v / 100).toFixed(2)) + parseFloat((sy_m * v3_v / 100).toFixed(2)) + parseFloat((sy_m * v4_v / 100).toFixed(2))).toFixed(2);
        sy_m = (sy_m - pj_m).toFixed(2);
    }
    jsObj.toEarning(jwjs(toDecimal2(total_m)));
}

//等额本息
function getyt_debx(m, v1, v2, v3, v4, q) {
    var v1_v = parseFloat(v1) || 0;
    var v2_v = parseFloat(v2) || 0;
    var v3_v = parseFloat(v3) || 0;
    var v4_v = parseFloat(v4) || 0;
    var v_v = v1_v + v2_v + v3_v + v4_v; // 总利息
    var total_m = parseInt(m); //总额
    var m_r = (v_v / 100) / 12; //月利率
    var i_e = 0; //月利息
    var re_m = 0; //收益总额
    var re_m_n = 0;
    var m_n = (total_m * m_r * Math.pow((1 + m_r), parseInt(q))) / (Math.pow((1 + m_r), parseInt(q)) - 1); //每月还款
    for (var i = 0; i < q; i++) {
        if (i == 0) {
            i_e = parseFloat(total_m * m_r);
            re_m_n = parseFloat(total_m) - (parseFloat(m_n) - parseFloat(i_e));
            re_m = parseFloat(re_m) + parseFloat(i_e);
        } else {
            i_e = parseFloat(re_m_n) * parseFloat(m_r);
            re_m_n = parseFloat(re_m_n) - (parseFloat(m_n) - parseFloat(i_e));
            re_m = parseFloat(re_m) + parseFloat(i_e);
        }
    }
    jsObj.toEarning(re_m.toFixed(2));
}



//IOS   
//还本付息
function getyt_ios_hbfx(m, v1, v2, v3, v4, q) {

    var v1_v = v1 || 0;
    var v2_v = v2 || 0;
    var v3_v = v3 || 0;
    var v4_v = v4 || 0;

    var hbfx = parseInt(m) * ((parseFloat(v1) + parseFloat(v2) + parseFloat(v3) + parseFloat(v4)) / 100) / 12 * parseInt(q);

    return String(parseFloat(hbfx).toFixed(2));
}

//等额本金
function getyt_ios_debj(m, v1, v2, v3, v4, q) {
    var v1_v = parseFloat(v1) || 0;
    var v2_v = parseFloat(v2) || 0;
    var v3_v = parseFloat(v3) || 0;
    var v4_v = parseFloat(v4) || 0;
    var pj_m = (parseInt(m) / parseInt(q)).toFixed(2); //每月平均本金
    var sy_m = parseInt(m); //剩余本金
    var total_m = 0; //总额
    for (var i = 0; i < q; i++) {
        var total_m = (parseFloat(total_m) + parseFloat((sy_m * v1_v / 100).toFixed(2)) + parseFloat((sy_m * v2_v / 100).toFixed(2)) + parseFloat((sy_m * v3_v / 100).toFixed(2)) + parseFloat((sy_m * v4_v / 100).toFixed(2))).toFixed(2);
        sy_m = (sy_m - pj_m).toFixed(2);
    }

    return String(jwjs(toDecimal2(total_m)));
}

//等额本息
function getyt_ios_debx(m, v1, v2, v3, v4, q) {
    var v1_v = parseFloat(v1) || 0;
    var v2_v = parseFloat(v2) || 0;
    var v3_v = parseFloat(v3) || 0;
    var v4_v = parseFloat(v4) || 0;
    var v_v = v1_v + v2_v + v3_v + v4_v; // 总利息
    var total_m = parseInt(m); //总额
    var m_r = (v_v / 100) / 12; //月利率
    var i_e = 0; //月利息
    var re_m = 0; //收益总额
    var re_m_n = 0;
    var m_n = (total_m * m_r * Math.pow((1 + m_r), parseInt(q))) / (Math.pow((1 + m_r), parseInt(q)) - 1); //每月还款
    for (var i = 0; i < q; i++) {
        if (i == 0) {
            i_e = parseFloat(total_m * m_r);
            re_m_n = parseFloat(total_m) - (parseFloat(m_n) - parseFloat(i_e));
            re_m = parseFloat(re_m) + parseFloat(i_e);
        } else {
            i_e = parseFloat(re_m_n) * parseFloat(m_r);
            re_m_n = parseFloat(re_m_n) - (parseFloat(m_n) - parseFloat(i_e));
            re_m = parseFloat(re_m) + parseFloat(i_e);
        }
    }
    return String(re_m.toFixed(2));
}

//IOS
// m金额、v1-v4利率、q产品期限、c产品类型
function get_data(m, v1, v2, v3, v4, q, c) {
    if (c == '还本付息') {
        return getyt_ios_hbfx(m, v1, v2, v3, v4, q);
    }
    if (c == '等额本金') {
        return getyt_ios_debj(m, v1, v2, v3, v4, q);
    }
    if (c == '等额本息') {
        return getyt_ios_debx(m, v1, v2, v3, v4, q);
    }
}

//Android
// m金额、v1-v4利率、q产品期限、c产品类型
function get_datas(m, v1, v2, v3, v4, q, c) {
    if (c == '还本付息') {
        getyt_hbfx(m, v1, v2, v3, v4, q);
    }
    if (c == '等额本金') {
        getyt_debj(m, v1, v2, v3, v4, q);
    }
    if (c == '等额本息') {
        getyt_debx(m, v1, v2, v3, v4, q);
    }
}

function getythbfxx() {


    return '111';
}
get_data('1000', '12', '0', '0.1', '0', '6', '还本付息');