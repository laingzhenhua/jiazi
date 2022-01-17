const state = {
    fdManagementRow: {},
};
const mutations = {
    set_fdManagementRow(state, data = "") {
        state.fdManagementRow = data;
    },
};

const actions = {
    // 存储row
    setFdManagementRow(context, data) {
        context.commit("set_fdManagementRow", data);
    },

};

export default {
    state,
    mutations,
    actions,
};
