import { Message } from "element-ui";
import service from "../../httpRequset/service";
import { clearCache } from "./commonRequest";
import router from '../../router/index'
/**
 *  接口返回参数接口校验
 * @param response
 * @param isCheckCode
 * @returns {*}
 */
export const checkResponseStatus = (response, isCheckCode) => {
    const checkCode = response => {
        switch (response.data.code) {
            case 0:
                return response.data;
            case 10:
                Message.error({ message: response.data.msg, duration: 2000 });
                // window.location.href = './index.html';
                clearCache();
                router.push({ path: "/login" });
                return response.data;
            case 101203:
                Message.info({ message: response.data.msg, duration: 2000 });
                // window.location.href = './index.html';
                localStorage.clear();
                return response.data;
            default:
                Message.error({ message: `${response.data.msg}`, duration: 2000 });
                return response.data;
        }
    };
    // 如果服务状态码正常，则直接返回数据
    if (response && response.status < 500) {
        if (isCheckCode) {
            return checkCode(response);
        }
        return response.data;
    } else {
        // 异常状态
        Message.error({ message: `服务异常 ${response}`, duration: 2 });
    }
};

/**
 *  查询指定节点 并返回 父节点
 * @param list 数组
 * @param str 字段
 * @param id 匹配数据
 * @returns {*|T[]|string|T[]|*[]}
 */
export const getParentList = (list, str, id) => {
    for (let i in list) {
        if (list[i][str] === id) {
            //查询到就返回该数组对象
            return [list[i]];
        }
        if (list[i].children) {
            let node = getParentList(list[i].children, str, id);
            if (node !== undefined) {
                //查询到把父节点连起来
                return [list[i]].concat(node);
            }
        }
    }
};

/**
 * 文件上传 返回promise
 * @param url
 * @param params
 * @param config
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const fileUpload = (url, params, config = {}) => {
    function checkStatus(response) {
        // 如果http状态码正常，则直接返回数据
        if (
            response &&
            (response.status === 200 || response.status === 304 || response.status === 400)
        ) {
            return response;
        }
        // if(response && String(response.status).charAt(0) == '5'){
        //   //服务端异常
        //   utils.ssoLogout();
        //   return response;
        // }
        // 异常状态下，把错误信息返回去
        Message({
            type: "error",
            message: "网络异常 " + response.status,
            duration: 2000,
        });
        return {
            status: -404,
            msg: "网络异常",
        };
    }

    function checkCode(res) {
        switch (String(res.data.code)) {
            case "0":
                return res.data;
            case "1":
                Message({ message: "系统开小差了", duration: 2000 });
                return res.data;
            case "20":
                Message({ message: res.data.msg || "接口参数异常", duration: 2000 });
                return res.data;
            case "40":
                Message({ message: res.data.msg || "业务异常", duration: 2000 });
                return res.data;
            default:
                utils.ssoLogout();
                break;
        }
    }
    return service({
        method: "post",
        url: url,
        data: params,
        headers: {
            "content-type": "multipart/form-data",
        },
        ...config,
    })
        .then(response => {
            return checkStatus(response);
        })
        .then(res => {
            return checkCode(res);
        });
};
