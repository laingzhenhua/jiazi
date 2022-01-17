import axios from 'axios';
import qs from 'qs';
import {checkResponseStatus} from '@/components/utils/global';
import { getPageDetail } from '@/components/utils/index';

import store from './../store/index';

/**
 *  创建axios 实列
 * @type {AxiosInstance}
 */
const service = axios.create({
    timeout: 0,
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache'
    }

});

/**
 * 响应拦截
 */
service.interceptors.response.use(response => {
    return Promise.resolve(response)
}, err => {
    return Promise.reject(err);
});

/**
 * 请求拦截
 */
service.interceptors.request.use(config => {
    if (store.state.user.token) {
        config.headers.common['X-GRID-TOKEN'] = store.state.user.token;
        config.headers.common['SCREEN-RESOLUTION']=getPageDetail();

    }
    if(store.state.user.activeRoute.path){
        config.headers.common['PAGE-NAME']=store.state.user.activeRoute.path
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export const createRequestModule = (type = "get", isCheckCode = true, headers, responseType = false) => {
    return (url, params, IsFormData = true, isConcat = true, config, cancelToken) => {
        let obj;
        if (isConcat) {
            obj = {
                url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date().getTime()),
                headers,
                method: type,
                [['put', 'post', 'patch'].includes(type) ? 'data' : 'params']: IsFormData ? params : qs.stringify(params),
            }
        } else {
            obj = {
                url: url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + (+new Date().getTime()),
                headers,
                method: type,
                responseType: responseType ? 'blob' : "", //此处是设置请求的为流文件
                [['put', 'post', 'patch'].includes(type) ? 'data' : 'params']: IsFormData ? params : qs.stringify(params)
            }
        }
        return service(obj, config).then(
            res => {
                return checkResponseStatus(res, isCheckCode)
            }
        )
    }
};

service.$get = createRequestModule('get', true, {'content-type': 'application/x-www-form-urlencoded'});
service.$getFileStream = createRequestModule('get', false, {'content-type': 'application/x-www-form-urlencoded'}, true);
service.$post = createRequestModule('post', true, {'content-type': 'application/json'});
service.$postForm = createRequestModule('post', true, {'content-type': 'application/x-www-form-urlencoded'});
service.$postLogin = createRequestModule('post', true, {'Authorization': 'Basic d2ViQXBwOndlYkFwcA=='});
service.$delete = createRequestModule('delete', true, {'content-type': 'application/x-www-form-urlencoded'});
service.$getUpload = createRequestModule('get', true, {"content-type": "multipart/form-data"});
service.$postUpload = createRequestModule('post', true, {"content-type": "multipart/form-data"});
service.$getDown = createRequestModule('get', false, {"content-type": "application/octet-stream"}, true);
service.$postDown = createRequestModule('post', false, {
    "accept": "application/octet-stream",
    'content-type': 'application/json'
}, true);

export default service;
