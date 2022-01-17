import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from "./user";
import global from "./module/global";
import fdManagement from "./module/fdManagement";
Vue.use(Vuex);


let store = new Vuex.Store({
    modules: {
        user,
        global,
        fdManagement
    },
    plugins: [
        createPersistedState({
            reducer(state, paths) {
                return {
                    user: state.user,
                    global: state.global,
                    fdManagement: state.fdManagement
                }
            }
        })
    ]
});
export default store;
