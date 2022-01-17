
/**
 * 下载流，不兼容ie9
 * @param {String} fileName 文件名
 * @param {blob} blob 字节流
 */
export const downloadFill = function (fileName, blob) {
    if (fileName) {
        let name = fileName.split('.');
        fileName = name[0] + `(${moment().format('YYYY-MM-DD')})` + name[1];
    }
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
    }
};
/**
 * 下载流，不兼容ie9
 * @param {String} fileName 文件名(不处理)
 * @param {blob} blob 字节流
 */

export const allNameDownFile = function (fileName,blob) {
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
    } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
    }
};

/**
 * 获取URL
 * @param name URL指定字段
 * @returns {string|null}
 */
export const getQueryString = (name) => {
    if(window.location.href.indexOf(name) === -1) {
        return null;
    }
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let params = window.location.href.split('?')[1];
    let r = params.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/**
 * 函数防抖，在第一次触发事件时，不立即执行函数，而是给出一个期限值。效果：如果短时间内大量触发同一事件，只会执行一次函数。
 * @param fn 执行函数
 * @param delay 延迟时间（单位：ms）
 * @returns {Function}
 */
export const debounce = function (fn,delay = 500) {
    let timer = null;
    return function () {
        if(timer) {
            clearTimeout(timer)
        };
        timer = setTimeout(function () {
            fn()
        },delay);
    }
};

/**
 * 函数节流，有些执行的函数会执行很多次，比如window.resize,scroll等，但是实际并不需要这么多的次数，所以需要节流执行；
 * @param fn 需要节流的函数
 * @param interval 需要延迟的时间（默认：延迟1s）
 * @returns {Function}
 */
export const throttle = function (fn,interval) {
    let __self = fn;
    let timer;
    let firstTime = true;
    return function () {
        let args = arguments;
        let __me = this;
        if (firstTime) {
            __self.apply(__me, args);
            return (firstTime = false);
        }
        if (timer) {
            return false;
        }
        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 1000);
    };
};

/**
 * 获取浏览器信息
 */
export const getBrowserInfo = () => {
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    let agent = navigator.userAgent.toLowerCase();
    let regStr_ff = /firefox\/[\d.]+/gi
    let regStr_chrome = /chrome\/[\d.]+/gi;
    let regStr_saf = /safari\/[\d.]+/gi;
    let isIE = agent.indexOf("compatible") > -1 && agent.indexOf("msie" > -1); //判断是否IE<11浏览器
    let isIE11 = agent.indexOf('trident') > -1 && agent.indexOf("rv:11.0") > -1;
    if (isIE) {
        let reIE = new RegExp("msie (\\d+\\.\\d+);");
        reIE.test(agent);
        let fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion === 7) {
            return "IE/7";
        } else if (fIEVersion === 8) {
            return "IE/8";
        } else if (fIEVersion === 9) {
            return "IE/9";
        } else if (fIEVersion === 10) {
            return "IE/10";
        }
    } //isIE end
    if (isIE11) {
        return "IE/11";
    }
    //firefox
    if (agent.indexOf("firefox") > 0) {
        return agent.match(regStr_ff);
    }
    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(regStr_saf);
    }
    //Chrome
    if (agent.indexOf("chrome") > 0) {
        return agent.match(regStr_chrome);
    }
};

/**
 *  版本检测
 * @returns {Promise<void>}
 */
export const testingVersion = async () => {
    if (process.env.NODE_ENV === 'production') {
        // 在 js 中请求首页地址不会更新页面
        const response = await axios.get(`${window.location.protocol}//${window.location.host}${window.location.pathname}?t=${new Date().getTime()}`);
        // 返回的是字符串，需要转换为 html
        let el = document.createElement('html')
        el.innerHTML = response.data;

        // 拿到 当前hash
        let new_scriptArr = el.getElementsByTagName('body')[0].getElementsByTagName('script');
        let new_mainSrc = Array.from(new_scriptArr).find( li => li.src.includes('main'))
        let new_indexSrc = new_mainSrc.src.split('/');
        let new_hash = new_indexSrc[new_indexSrc.length - 1].split('.')[1];
        console.log(new_hash)
        let cur_scriptArr = document.getElementsByTagName('body')[0].getElementsByTagName('script');
        let cur_mainSrc = Array.from(cur_scriptArr).find( li => li.src.includes('main'))
        let cur_indexSrc = cur_mainSrc.src.split('/');
        let cur_hash = cur_indexSrc[cur_indexSrc.length - 1].split('.')[1];
        console.log(cur_hash)
        if (cur_hash !== new_hash) {
            console.log('允许更新');
            /*Modal.destroyAll();
            Modal.warning({
                title: '系统通知',
                content: '系统版本已更新,请点击按钮刷新页面',
                centered: true,
                okText: '知道了',
                onOk() {
                    window.location.reload(true);
                },
            });*/
        }
    }
};

/**
 *  时分转时间戳
 * @param time 时分
 * @returns {number}
 */
export const countDown = (time) => {
    let s = 0;
    let hour = time && time.split(':')[0];
    let min = time && time.split(':')[1];
    s = Number(hour * 3600) + Number(min * 60) ;
    return s;
};

/**
 *  年月日转时间戳
 * @param YMD  年月日
 * @returns {number}
 */
export const timestamp = YMD => {
    let date = new Date(YMD);
    let time = Date.parse(date);
    return time;
};

/**
 * 标准时间格式转换 ex: 2014-12-03T03:01:00.000Z => 2014-12-03
 * @param date 时间参数
 * @param type 类型 date(默认)/month/year
 * @returns {string|number}
 */
export const formatDate = (date,type = 'date') => {
    if (!date) {
        return '';
    }
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    if (type === 'date') {
        return year + '-' + month + '-' + day;
    }
    if (type === 'month') {
        return year + '-' + month;
    }
    if (type === 'year') {
        return year;
    }
};

/**
 *  生成唯一的 UUID, 方便获取验证码
 * @constructor
 */
export const UUID = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
};

/**
 *  去除重复对象
 * @param arr 原数组
 * @param attribute 属性名
 * @returns [arr[i]]
 */
export const deleteObject = function (arr,attribute) {
  var new_arr=[];
  var json_arr=[];
  for(var i=0; i<arr.length; i++){
    // console.log(new_arr.indexOf(arr[i][attribute]));
    if(new_arr.indexOf(arr[i][attribute]) ==-1){    //  -1代表没有找到
      new_arr.push(arr[i][attribute]);   //如果没有找到就把这个name放到arr里面，以便下次循环时用
      json_arr.push(arr[i]);
    } /*else{
    }*/
  }
  return json_arr;
};
/**
 * @name: 获取页面分辨率
 * @msg: 
 * @param {*}
 * @return {*}
 */
export const getPageDetail=function(){
    return   `${window.screen.width}*${window.screen.height}`
  
   
}