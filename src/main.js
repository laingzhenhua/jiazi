import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/guard";
import store from "./store";
// 字体文件
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "./icons/index.js"; // icons
// element 主题
import "./assets/theme/index.css";
// 重置css
import "./assets/css/index.less";
// element-ui 组件库引入
import ElementUI from "element-ui";
Vue.use(ElementUI);
//音频播放
import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
    defaultCover: 'https://github.com/u3u.png',
    productionTip: true,
});
const Message = ElementUI.Message;
Vue.prototype.$message = {
    success: message => {
        let options = {
            duration: 1500,
            message,
        };
        return Message.success(options);
    },
    warning: message => {
        let options = {
            duration: 1500,
            message,
        };
        return Message.warning(options);
    },
    info: message => {
        let options = {
            duration: 1500,
            message,
        };
        return Message.info(options);
    },
    error: message => {
        let options = {
            duration: 1500,
            message,
        };
        return Message.error(options);
    },
};
// http request
import service from "./httpRequset/index";
Vue.prototype.$http = service;
// 设置baseURL
import setURL from "./httpRequset/service";
// 获取 serviceJson 配置
import queryServiceJson from "./components/utils/queryServiceJson.js";
import plug from "./components/utils/plug";
Vue.use(plug);
// 获取公共请求
import {
    queryCommonMenuList,
    queryCommonPermissionsList,
    isSession,
} from "./components/utils/commonRequest";
// 引入自定义指令
import "./components/utils/dialogDrag";

Vue.config.productionTip = false;
let initApp = async () => {
    try {
        // 同步获取 全局配置
        await queryServiceJson.getConfigJson();
        // 获取公共的 baseURL
        Vue.prototype.baseURL =
            localStorage.getItem("Global") && JSON.parse(localStorage.getItem("Global")).baseURL;
        // 设置请求头
        setURL.defaults.baseURL =
            localStorage.getItem("Global") && JSON.parse(localStorage.getItem("Global")).baseURL;
        // 判断 session 是否已经过期
        // if (store.state.user.token !== "" && isSession) {
        // 获取用户菜单和权限码
        // await queryCommonMenuList();
        // }
        new Vue({
            router,
            store,
            // await queryCommonPermissionsList();
            render: h => h(App),
        }).$mount("#app");
    } catch (err) {
        console.log(err);
    }
};

initApp();
