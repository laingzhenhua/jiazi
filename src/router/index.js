import Vue from "vue";
import VueRouter from "vue-router";
import * as moduleRoutes from "./routes";
import { leftRightLayout,topLeftRightLayout } from "./layout";
const mainRoutes = Object.values(moduleRoutes);
// 路由重复 处理
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return VueRouterReplace.call(this, location).catch(err => err);
};
Vue.use(VueRouter);
// const { gridPreview, gridManage, gridApplication } = menus;
const routes = [
    {
        path: "/",
        name: "root",
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login/login.vue"),
    },
    {
        path: "/oauth",
        name: "oauth",
        component: () => import("../views/oauth/oauth.vue"),
    },
    {
        path: "/error",
        name: "error",
        component: topLeftRightLayout,
        children: [
            {
                path: "/404",
                name: "404",
                component: () => import("@/views/error/404.vue"),
            },
        ],
    },
    ...mainRoutes,
];

const router = new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
