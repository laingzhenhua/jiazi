const state = {
    token: "",
    userLoginInfo: {},
    activeAside: "", // 当前侧边栏(aside) 激活状态
    activeHeader: "", // 当前头部菜单(header) 激活状态
    menuList: [], // 用户菜单
    switchMenuList: [], // 字迹切换菜单
    permissions: [], // 权限列表
    activeRoute: {}, // 当前路由信息
    breadList: {} // 面包屑
};
const mutations = {
    SET_TOKEN(state, data = "") {
        state.token = data;
    },
    SET_USER_INFO(state, data = {}) {
        state.userLoginInfo = data;
    },
    SET_ASIDE_STATUS(state, data = "") {
        state.activeAside = data;
    },
    SET_MENU_LIST(state, data = []) {
        state.menuList = data;
    },
    SET_PERMISSIONS(state, data = []) {
        state.permissions = data;
    },
    SET_SWITCH_MENU_LIST(state, data = []) {
        state.switchMenuList = data;
    },

    SET_ACTIVE_HEADER(state, data = "") {
        state.activeHeader = data;
    },
    SET_ACTIVE_ROUTE(state, data = {}) {
        state.activeRoute = data;
    },
    SET_BREAD_LIST (state, data = {}) {
        state.breadList = data
    }
};

const actions = {
    // 设置token
    setToken(context, data) {
        context.commit("SET_TOKEN", data);
    },
    // 设置 用户信息
    setUserInfo(context, data) {
        context.commit("SET_USER_INFO", data);
    },
    // 设置 侧边栏状态
    setAsideStatus(context, data) {
        context.commit("SET_ASIDE_STATUS", data);
    },
    // 设置菜单
    setMenuList(context, data) {
        context.commit("SET_MENU_LIST", data);
    },
    // 设置权限菜单
    setPermissions(context, data) {
        context.commit("SET_PERMISSIONS", data);
    },
    // 设置 切换目录菜单
    setSwitchMenuList(context, data) {
        context.commit("SET_SWITCH_MENU_LIST", data);
    },

    // 设置头部状态
    setActiveHeader(context, data) {
        context.commit("SET_ACTIVE_HEADER", data);
    },
    // 保存当前路由
    setActiveRoute(context, data) {
        context.commit("SET_ACTIVE_ROUTE", data);
    },
    setBreadList (context, data) {
        context.commit("SET_BREAD_LIST", data)
    }
};

export default {
    state,
    mutations,
    actions,
};
