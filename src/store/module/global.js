const state = {
    globalLoading: false, // 全局loading
    globalLoadingText: "加载中....", // 全局loading 提示文字
    portionLoading: false, // 局部loading
    portionLoadingText: "加载中....", // 局部loading 提示文字
    isCollapse: false, //侧边栏 收缩展开
};

const mutations = {
    SET_GLOBAL_LOADING(state, data) {
        state.globalLoading = data;
    },
    SET_GLOBAL_LOADING_TEXT(state, data) {
        state.globalLoadingText = data;
    },
    SET_PORTION_LOADING(state, data) {
        state.portionLoading = data;
    },
    SET_PORTION_LOADING_TEXT(state, data) {
        state.portionLoadingText = data;
    },
    SET_IS_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
    }
};

const actions = {
    // 设置全局loading
    setGlobalLoading (context, data = false) {
        context.commit("SET_GLOBAL_LOADING", data);
    },
    // 设置全局loading 文字
    setGlobalLoadingText(context, data = "加载中...") {
        context.commit("SET_GLOBAL_LOADING_TEXT", data);
    },
    // 设置局部loading
    setPortionLoading(context, data = false) {
        context.commit("SET_PORTION_LOADING", data);
    },
    // 设置局部loading 文字
    setPortionLoadingText(context, data = "加载中...") {
        context.commit("SET_PORTION_LOADING_TEXT", data);
    },
    // 设置侧边栏收缩与展开状态
    setIsCollapse(context) {
        context.commit("SET_IS_COLLAPSE")
    }
};

export default {
    // namespaced: true,
    state,
    mutations,
    actions
};
