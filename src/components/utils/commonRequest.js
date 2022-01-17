import store from "@/store/index";
import { Message } from "element-ui";
import {
    queryMenuList,
    queryAuthPermissions,
    loginOut,
    checkSession,
} from "@/httpRequset/module/login/index";

export let isSession = false;

// 获取公共菜单
export const queryCommonMenuList = async vm => {
    try {
        let res = await queryMenuList();
        if (res.code === 0 && res.data && res.data.length) {
            await store.dispatch("setMenuList", res.data);
            await store.dispatch("setSwitchMenuList", res.data[0].children);
            await store.dispatch("setActiveHeader", res.data[0].menuCode);
        } else {
            // 清空 缓存
            await clearCache();
            Message.error(res.code ? res.msg : "账号暂无菜单权限");
        }
    } catch (error) {
        console.log(error);
        Message.error("菜单获取失败!");
    }
};

// 获取公共权限
export const queryCommonPermissionsList = async () => {
    try {
        let res = await queryAuthPermissions();
        if (res.code === 0 && res.data && res.data.length) {
            await store.dispatch("setPermissions", res.data);
        } else {
            await clearCache();
            Message.error(res.code ? res.msg : "账号暂无权限");
        }
    } catch (error) {
        console.log(error);
        Message.error("权限获取失败!");
    }
};

// 退出登陆
export const outLogin = async () => {
    try {
        let res = await loginOut();
        if (res.code === 0) {
            Message.success("退出成功");
            // 清空 缓存
            await clearCache();
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 *   校验session是否过期
 * @params {boolean} isSession
 */

export const isCheckLoginSession = async () => {
    try {
        let res = await checkSession();
        if (res.code === 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
};

/**
 * 修改秘密
 * @returns {Promise<void>}
 */
export const midifyPassword = async ({ passwd, newPasswd, passwdValid }) => {
    let formData = {
        passwd: passwd,
        newPasswd: newPasswd,
        passwdValid: passwdValid,
    };
    try {
        let res = await updatePassword(formData);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const clearCache = async () => {
    await store.dispatch("setToken", "");
    await store.dispatch("setUserInfo", {});
    await store.dispatch("setAsideStatus", "");
    await store.dispatch("setMenuList", []);
    await store.dispatch("setSwitchMenuList", []);
    await store.dispatch("setPermissions", []);
    await store.dispatch("setActiveHeader", "");
    await store.dispatch("setActiveRoute", {});
    await store.dispatch("setBreadList", {});
};
