import router from "./index";
import store from "../store";
import {clearCache, isCheckLoginSession} from "../components/utils/commonRequest";

// 递归首次导航菜单
const redirectPath = item => {
    if (item.children && item.children.length) {
        return redirectPath(item.children[0]);
    } else {
        return item;
    }
};

router.beforeResolve(async (to, from, next) => {
    let token = store.state.user.token;
    let menu = store.state.user.switchMenuList;
    let permissions = store.state.user.permissions;

    if (!(permissions && permissions.length)) {
        token = false;
    }
    if (to.path === "/login") {
        if (token) {
            next("/");
        } else {
            await clearCache();
            next();
        }
    } else if (to.path === "/oauth") {
        await clearCache();
        next();
    } else {
        if (token) {
            let isSession = await isCheckLoginSession();
            if (!isSession) {
                await clearCache();
                next("/login");
            }
            switch (to.path) {
                case "/404":
                    next();
                    break;
                case "/": {
                    let redirect = redirectPath(menu[0]);
                    await store.dispatch("setAsideStatus", redirect.menuUrl);
                    next(redirect.menuUrl);
                    break;
                }
                default: {
                    let {path, query, params, name, meta} = to;
                    let {verify} = meta;
                    if (verify && permissions.includes(verify)) {
                        store.dispatch("setActiveRoute", {
                            path,
                            query,
                            params,
                            name,
                            meta,
                        });
                        let currentRouterInfo = to.matched.find(item => item.path === path);
                        currentRouterInfo.parent =
                            currentRouterInfo.parent.parent || currentRouterInfo.parent;
                        let breadList = store.state.user.breadList;
                        if (breadList.parentPath === currentRouterInfo.parent.path) {
                            if (meta.isChildRoute) {
                                let {childRoute} = breadList;
                                let isHave = childRoute.find(item => item.path === path);
                                if (!isHave) {
                                    breadList.childRoute.push({name, path, query, params});
                                }
                            } else {
                                breadList.childRoute = [{name, path, query, params}];
                            }
                        } else {
                            let {parent, name, path} = currentRouterInfo;
                            let routerInfo = {
                                parentName: parent.name,
                                parentPath: parent.path,
                                childRoute: [{name, path, query, params}],
                            };
                            breadList = routerInfo;
                        }
                        store.dispatch("setBreadList", breadList);
                        next();
                    } else {
                        next("/404");
                    }
                    break;
                }
            }
        } else {
            await clearCache();
            next("/login");
        }
    }
});
