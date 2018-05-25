var Tools = (function(w, d, jq) {
    function StringBuffer(str) {
        this.cache = [];
        if (str || str == 0) {
            this.cache.push(str);
        }
    };
    StringBuffer.prototype.append = function(str) {
        if (str || str == 0) {
            this.cache.push(str);
        }
        return this;
    };
    StringBuffer.prototype.toString = function() {
        return this.cache.join('');
    };
    var reg = /^[1-9]+[0-9]*$/,
        init_time = { day: 0, hour: 0, minute: 0, second: 0 };
    var getTime = function(ms, type) {
        if (!ms) return;
        var time = {};
        if (type) {
            time.day = Math.floor(ms / (60 * 60 * 24));
            time.hour = Math.floor((ms - time.day * 60 * 60 * 24) / (60 * 60));
            time.minute = Math.floor((ms - time.day * 60 * 60 * 24 - time.hour * 60 * 60) / 60);
            time.second = Math.floor(ms - time.day * 60 * 60 * 24 - time.hour * 60 * 60 - time.minute * 60);
        } else {
            time.hour = Math.floor(ms / (60 * 60));
            time.minute = Math.floor((ms - time.hour * 60 * 60) / 60);
            time.second = Math.floor(ms - time.hour * 60 * 60 - time.minute * 60);
        }
        return time;
    };
    var getTimeText = function(time, type) {
        var minute = time.minute,
            second = time.second,
            hour, day;
        sb = new StringBuffer();
        if (type == 1) {
            day = time.day;
            hour = time.hour;
            sb.append(day < 10 ? '0' : '');
            sb.append(day);
            sb.append('天 ');
            sb.append(hour < 10 ? '0' : '');
            sb.append(hour);
            sb.append('时 ');
            sb.append(minute < 10 ? '0' : '');
            sb.append(minute);
            sb.append('分 ');
            sb.append(second < 10 ? '0' : '');
            sb.append(second);
            sb.append('秒');
        } else if (type == 2) {
            sb.append(minute < 10 ? '0' : '');
            sb.append(minute);
            sb.append(':');
            sb.append(second < 10 ? '0' : '');
            sb.append(second);
        } else {
            hour = time.hour;
            sb.append(hour < 10 ? '0' : '');
            sb.append(hour);
            sb.append('时 ');
            sb.append(minute < 10 ? '0' : '');
            sb.append(minute);
            sb.append('分 ');
            sb.append(second < 10 ? '0' : '');
            sb.append(second);
            sb.append('秒');
        }
        return sb.toString();
    };
    return {
        debounce: function(func, wait, immediate) {
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
        },
        checkNum: function(str) {
            return /^[0-9]*$/.test(str);
        },
        checkEmpty: function(str) {
            if (str == "" || str == undefined || str == null) {
                return false
            } else {
                return true;
            }
        },
        checkLength: function(str) {
            if (str.length <= 50) {
                return true;
            } else {
                return false;
            }
        },
        checkPhone: function(number) {

            // return /^((13[0-9])|(15[0-9])|(18[0-9])|147|17[013678])[0-9]{8}$/.test(number);
            return /^((13[0-9])|(15[0-9])|(18[0-9])|147|17[013678]|166|19[89])[0-9]{8}$/.test(number);
        },
        checkPsd: function(number) {
            var f = ((number.length >= 6) && (number.length <= 16)) ? true : false;
            return f; //6-16位字母、数字、特殊符号组成
            // return /^[0-9a-zA-Z@#$!&*%^]{6,16}$/.test(number);//6-16位字母、数字、特殊符号组成
        },
        // 新密码校验规则
        newCheckPsd: function() {
            var data = {
                requesturl: '/appuser/app018/v1/01',
            };
            var returnValue = jq.ajax({
                url: PUBLIC.URL_FWD_COMMON,
                method: 'post',
                data: data
            });
            return returnValue;
        },
        newCheckPsdReg: function(str) {
            var checkReg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)(?![<>,._~@#/%:';=\\s\\-\\$\\^\\!\\*\\(\\)\\+\\|\\?\\[\\]\\{\\}\\\\]+$)[0-9a-zA-Z<>,._~@#/%:';=\\s\\-\\$\\^\\!\\*\\(\\)\\+\\|\\?\\[\\]\\{\\}\\\\]{6,16}$");

            return checkReg.test(str);
        },
        checkEmail: function(str) {
            return /^[a-z0-9]+([._-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(str);
        },
        formatPsd: function(psd) {
            return psd.substring(0, 3) + "****" + psd.substring(8, 11);
        },
        isNumber: function(str) {
            return reg.test(str);
        },
        getParams: function(href) {
            var param_obj = {};
            href = href || w.location.href;
            var strs = href.split('?');
            if (strs.length > 1) {
                var href_str = strs[1];
                var params = href_str.split('&');
                for (var i = 0, len = params.length; i < len; i++) {
                    var ps = params[i].split('=');
                    param_obj[ps[0]] = (ps[1] || '');
                }
            }
            param_obj.platform = param_obj.platform || '4';
            //param_obj.addr = strs[0];
            return param_obj;
        },
        getParamsByName: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            else if (!r && name == "platform") {
                return "4";
            }
        },
        refreshState: function(href) {
            href = href || w.location.href;
            var strs = href.split('&v=');
            var new_href = strs[0] + '&v=' + Math.random();
            console.log(w.document.title, new_href);
            w.history.replaceState('', w.document.title, new_href);
        },
        convertTime: function(timestamp) {
            var date = new Date(timestamp * 1000),
                month = date.getMonth() + 1,
                day = date.getDate();
            return date.getFullYear() + '-' + (month > 9 ? month : ('0' + month)) + '-' + (day > 9 ? day : ('0' + day)) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        },
        refreshEnd: function() {
            this.enddates = jq('.enddate:not(".end")');
        },
        pauseCountDown: function() {
            w.clearInterval(this.countDownAuto);
        },

        countDown: function(type, callback) {
            var that = this;
            if (!that.enddates) {
                that.refreshEnd();
            }
            that.countDownAuto = w.setInterval(function() {
                var len = that.enddates.size();
                for (var i = 0; i < len; i++) {
                    var enddate = jq(that.enddates[i]);
                    var ms = parseInt(enddate.data('lasttime'));
                    if (ms > 0 && !enddate.hasClass('end')) {
                        var time = getTime(ms, type);
                        if (time) {
                            enddate.text(getTimeText(time, type));
                            enddate.data('lasttime', --ms);
                        }
                    } else {
                        enddate.addClass('end');
                        enddate.html(getTimeText(init_time, type));
                        if (callback) {
                            callback.call(enddate);
                        }
                    }
                }
            }, 1000);
        },
        countDownNum: function(count_fun, end_fun, num) {
            this.count = num;
            var that = this;
            var auto = setInterval(function() {
                that.count--;
                if (that.count < 0) {
                    end_fun && end_fun.call(that);
                    clearInterval(auto);
                };
                count_fun && count_fun.call(that);
            }, 1000);
        },
        outputmoney: function(number) { //钱数单位格式化
            number = number + '';
            number = number.replace(/\,/g, "");
            if (isNaN(number) || number == "") return "";
            number = Math.round(number * 100) / 100;
            if (number < 0)
                return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
            else
                return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
        },
        outputmoney_n: function(number) { //钱数单位格式化 无小数点
            number = number + '';
            number = number.replace(/\,/g, "");
            if (isNaN(number) || number == "") return "";
            number = Math.round(number * 100) / 100;
            if (number < 0) {
                if ((this.outputcents(number - 0)) == '.00') {
                    return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '');
                } else {
                    return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
                }
            } else {
                if ((this.outputcents(number - 0)) == '.00') {
                    return this.outputdollars(Math.floor(number - 0) + '');
                } else {
                    return this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
                }
            }
        },
        outputdollars: function(number) {
            if (number.length <= 3)
                return (number == '' ? '0' : number);
            else {
                var mod = number.length % 3;
                var output = (mod == 0 ? '' : (number.substring(0, mod)));
                for (i = 0; i < Math.floor(number.length / 3); i++) {
                    if ((mod == 0) && (i == 0))
                        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                    else
                        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
                return (output);
            }
        },
        outputcents: function(amount) {
            amount = Math.round(((amount) - Math.floor(amount)) * 100);
            return amount == 0 ? ".00" : (amount < 10 ? '.0' + amount : '.' + amount);
        },
        init: function() {
            // this.bindEvent();
            return this;
        }
    }
})(window, document, $).init();