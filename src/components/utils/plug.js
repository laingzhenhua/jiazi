import store from "../../store/index";
export default {
    install: function(Vue, options) {
        // 公用pageSize
        Vue.prototype.pageSize = 14;

        Vue.prototype.$localstorage = {
            // 存储localStorage
            setStore: function(name, content) {
                if (!name) return;
                if (typeof content !== "string") {
                    content = JSON.stringify(content);
                }
                window.localStorage.setItem(name, content);
            },
            // 获取localStorage
            getStore: function(name) {
                if (!name) return;
                return window.localStorage.getItem(name);
            },
            // 删除localStorage
            removeStore: function(name) {
                if (!name) return;
                window.localStorage.removeItem(name);
            },
            // 删除所有localStorage
            clear: function() {
                window.localStorage.clear();
            },
        };
        Vue.prototype.$sessionStorage = {
            // 存储sessionStorage
            setStore: function(name, content) {
                if (!name) return;
                if (typeof content !== "string") {
                    content = JSON.stringify(content);
                }
                window.sessionStorage.setItem(name, content);
            },
            // 获取sessionStorage
            getStore: function(name) {
                if (!name) return;
                return window.sessionStorage.getItem(name);
            },
            // 删除sessionStorage
            removeStore: function(name) {
                if (!name) return;
                window.sessionStorage.removeItem(name);
            },
            // 删除所有sessionStorage
            clear: function() {
                window.sessionStorage.clear();
            },
        };
        Vue.prototype.$service = {
            isPhoneNum: function(tel) {
                return /^1[3456789]\d{9}$/.test(tel);
            },
            isFixedPhone: function(tel) {
                return /0[1-9]\d{1,2}-?[1-9]\d{6,7}/.test(tel);
            },
            isBankCardNo: function(cardNo) {
                return /^(\d{16}|\d{19})$/.test(cardNo);
            },
            isTradePwd: function(pwd) {
                return /^[\x21-\x7E]{6,20}$/.test(pwd) && !/^\d+$/.test(pwd);
            },
            isLoginPwd: function(pwd) {
                return pwd.length >= 6 && pwd.length <= 20;
            },
            isCode: function(code) {
                return code.length == 4;
            },
            isEmail: function(email) {
                return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
                    email,
                );
            },
            isMoney: function(money) {
                return /^([1-9][\d]{0,14}|0)(\.[\d]{1,2})?$/.test(money);
            },
            isPwd: function(pwd) {
                return /^[a-zA-Z0-9!"\#$%&'()*+,-./:;<=>?@\[\\\]^_`\{\|\}\~]{6,20}$/.test(pwd);
            },
            isId: function(id) {
                /*
        根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
            地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
            出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
            顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
            校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

        出生日期计算方法。
            15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
            2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
        下面是正则表达式:
         出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])
         身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
         15位校验规则 6位地址编码+6位出生日期+3位顺序号
         18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

         校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                        公式(1)中：
                        i----表示号码字符从由至左包括校验码在内的位置序号；
                        ai----表示第i位置上的号码字符值；
                        Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                        i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                        Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

        */
                //身份证号合法性验证
                //支持15位和18位身份证号
                //支持地址编码、出生日期、校验位验证
                let city = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外 ",
                };
                let tip = "";
                let pass = true;
                if (
                    !id ||
                    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
                        id,
                    )
                ) {
                    //月份把10加进去
                    tip = "身份证号格式错误";
                    pass = false;
                } else if (!city[id.substr(0, 2)]) {
                    tip = "地址编码错误";
                    pass = false;
                } else {
                    //18位身份证需要验证最后一位校验位
                    if (id.length == 18) {
                        id = id.split("");
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        //校验位
                        let parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
                        let sum = 0;
                        let ai = 0;
                        let wi = 0;
                        for (let i = 0; i < 17; i++) {
                            ai = id[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        let last = parity[sum % 11];
                        if (parity[sum % 11] != id[17]) {
                            tip = "校验位错误";
                            pass = false;
                        }
                    }
                }
                //if(!pass) alert(tip);
                return pass;
                //return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(id);
            },
        };
        /*获取URL参数*/
        Vue.prototype.$parameter = {
            getQueryString: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return r[2];
                }
                return null;
            },
        };
        Vue.prototype.toCustomString = (date, option = "time", divider = "T") => {
            if (!date) {
                return "";
            }
            console.log(typeof date, option);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            // 日期时间分隔符
            const DIVIDER = divider;

            month = month > 9 ? month : "0" + month;
            day = day > 9 ? day : "0" + day;
            hour = hour > 9 ? hour : "0" + hour;
            min = min > 9 ? min : "0" + min;
            sec = sec > 9 ? sec : "0" + sec;
            if (option === "date") {
                return year + "-" + month + "-" + day;
            } else if (option === "cTime") {
                // 中文时间
                return `${year}-${month}-${day}${DIVIDER}${hour}时${min}分${sec}秒`;
            } else if (option === "time") {
                return `${year}-${month}-${day}${DIVIDER}${hour}:${min}:${sec}`;
            }
        };

        Date.prototype.dateFormat = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "H+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                S: this.getMilliseconds(), //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length),
                );
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length),
                    );
            return fmt;
        };
        Vue.prototype.$dateFormat = function(date, option = "time") {
            if (!date) {
                return "";
            }
            console.log(typeof date, option);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            // 日期时间分隔符

            month = month > 9 ? month : "0" + month;
            day = day > 9 ? day : "0" + day;
            hour = hour > 9 ? hour : "0" + hour;
            min = min > 9 ? min : "0" + min;
            sec = sec > 9 ? sec : "0" + sec;
            if (option === "date") {
                return year + "-" + month + "-" + day;
            } else if (option === "time") {
                return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
            }
        };
        // 获取今日和三个月前的date对象
        Vue.prototype.getDefaultTime = function() {
            let endTime = new Date();
            let startTime = new Date();
            startTime.setMonth(startTime.getMonth() - 3);
            endTime.setDate(endTime.getDate() + 1);
            return {
                startTime,
                endTime,
            };
        };
        // 下载文件，不兼容ie9
        Vue.prototype.$download = function(fileName, blob) {
            // if (fileName) {
            //   let name = fileName.split('.');
            //   //fileName = name[0] + '(' + this.toCustomString(new Date(), 'time', ' ') + ').' + name[1];
            //   fileName = name[0] + '.' + name[1];
            // }
            if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                console.log(elink.href);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
            }
        };

        Vue.prototype.$merge = {
            addParams: function(params, source) {
                for (var attr in source) {
                    params[attr] = source[attr];
                }
            },
            setModelVal: function(model, data) {
                if (data !== undefined && data !== null) {
                    for (var attr in model) {
                        model[attr] = data[attr];
                    }
                }
            },
        };
        // 解析文档
        Vue.prototype.analysisFun = function(row) {
            if (row == null || row == undefined) {
                return;
            }
            let resStr = "";
            if (row.length == 0) {
                resStr = "—";
                return resStr;
            }
            if (row.length > 0) {
                for (let i = 0; i < row.length; i++) {
                    resStr += parseInt(i + 1) + "、" + row[i] + "<br/>";
                }
                return resStr;
            }
        };
        // 按一定长度分割成二维数组
        Vue.prototype.split_array = function(arr, len) {
            var arr_length = arr.length;
            var newArr = [];
            for (let i = 0; i < arr_length; i += len) {
                newArr.push(arr.slice(i, i + len));
            }
            return newArr;
        };
        // 处理考核表内单元格选中的多选框转为数字显示
        Vue.prototype.$showAsNum = function(arr1, arr2, attr) {
            if (!arr1 || !arr2) return;
            let resultString;

            function findElByValue(arr1, arr2, attr) {
                let res = [];
                for (var i = 0; i < arr2.length; i++) {
                    arr1.find((item, index) => {
                        if (item[attr] == arr2[i][attr]) {
                            res.push(index + 1);
                        }
                    });
                }
                return res;
            }
            resultString = findElByValue(arr1, arr2, attr).sort((a, b) => {
                return a - b;
            });
            return resultString.join(",");
        };
        //获取当前浏览器
        Vue.prototype.$getCurBrowser = () => {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                //判断是否Opera浏览器
                return "Opera";
            }
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                return "Firefox";
            }
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                //判断是否Safari浏览器
                return "Safari";
            }
            if (
                userAgent.indexOf("compatible") > -1 &&
                userAgent.indexOf("MSIE") > -1 &&
                !isOpera
            ) {
                //判断是否IE浏览器
                return "IE";
            }
        };
        //判断当前屏幕分辨率
        Vue.prototype.$getCurScreen = () => {
            let w = window.screen.width;
            if (w < 1600) {
                return "smallScreen";
            } else if (w >= 1600) {
                return "bigScreen";
            }
        };

        Vue.prototype.$emptyHandle = (obj, unhandleFieldArr) => {
            for (var key in obj) {
                if (Object.prototype.toString.call(obj[key]) == "[object Object]") {
                    Vue.prototype.$emptyHandle(obj[key], unhandleFieldArr);
                } else {
                    if (
                        (obj[key] === null || obj[key] === "") &&
                        unhandleFieldArr.indexOf(key) == -1
                    ) {
                        obj[key] = "—";
                    }
                }
            }
            return obj;
        };

        Vue.prototype.$deepClone = obj => {
            var o;
            // 如果  他是对象object的话  , 因为null,object,array  也是'object';
            if (typeof obj === "object") {
                // 如果  他是空的话
                if (obj === null) {
                    o = null;
                } else {
                    // 如果  他是数组arr的话
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(Vue.prototype.$deepClone(obj[i]));
                        }
                    }
                    // 如果  他是对象object的话
                    else {
                        o = {};
                        for (var j in obj) {
                            o[j] = Vue.prototype.$deepClone(obj[j]);
                        }
                    }
                }
            } else {
                o = obj;
            }
            return o;
        };
        //处理排序name
        Vue.prototype.$sliceOrderType = orderName => {
            if (orderName == "descending") {
                return orderName.slice(0, 4);
            } else if (orderName == "ascending") {
                return orderName.slice(0, 3);
            }
        };
        //获取当前样式
        Vue.prototype.$getStyle = (element, attr) => {
            if (element == null) {
                return;
            }
            //特性侦测
            if (window.getComputedStyle) {
                // console.log(window.getComputedStyle(element)[attr])
                //优先使用W3C规范
                return window.getComputedStyle(element)[attr];
            } else {
                //针对IE9以下兼容
                return element.currentStyle[attr];
            }
        };
        // 容器变化需要更新滚动条PerfectScrollbar
        Vue.prototype.$updatePerfectScrollbar = () => {
            let container1, container2;
            if (document.querySelector(".main-container")) {
                container1 = document.querySelector(".main-container");
            }
            if (document.querySelector(".mhi-zone-opt")) {
                container2 = document.querySelector(".mhi-zone-opt");
            }
            setTimeout(() => {
                container1 && (container1.scrollTop = 0);
                container2 && (container2.scrollTop = 0);
                container1 && container1._ps_ && container1._ps_.update();
                container2 && container2._ps_ && container2._ps_.update();
            });
        };
        // 文件拓展名匹配
        Vue.prototype.$ftypeFormat = filename => {
            const typeDict = [
                { reg: /(.jpg|.jpeg|.gif|.png)$/, value: "pic" },
                { reg: /(.rar|.zip)$/, value: "zip" },
                { reg: /(.doc|.docx)$/, value: "doc" },
                { reg: /(.xls|.xlsx)$/, value: "xls" },
                { reg: /(.pdf|.PDF)$/, value: "pdf" },
                { reg: /(.mp4|.rmvb|.3gp|.flv)$/, value: "video" },
            ];
            const type = typeDict.find(item => item.reg.test(filename));
            return type && type.value;
        };
        // 四舍五入保存n位小数（默认为2）
        Vue.prototype.$floatFormat = (num, n = 2) => {
            let f = parseFloat(num);
            if (isNaN(f)) return undefined;
            let p = Math.pow(10, n); // 幂
            f = Math.round(num * p) / p;
            let [int, dec] = f.toString().split(".");
            // 补零
            if (dec) {
                return f.toFixed(n);
            } else {
                return `${int}.${"0".repeat(n)}`;
            }
        };
        // 加法计算 （两位小数）
        Vue.prototype.$floatAdd = (num1, num2) => {
            let r1, r2, m;
            try {
                r1 = num1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = num2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (num1 * m + num2 * m) / m;
        };
        //扁平化数据处理
        Vue.prototype.$treeFormat = list => {
            let cloneList = JSON.parse(JSON.stringify(list));
            let cloneMap = cloneList.reduce(
                (map, li) => ((map[li.__rowid] = li), (li.children = []), map),
                {},
            );
            return cloneList.filter(li => {
                li.__pid && cloneMap[li.__pid].children.push(li);
                return !li.__pid;
            });
        };
    },
};
