import { emptyLayout, leftRightLayout, topDownLayout, topLeftRightLayout } from "../layout";

export const sys = {
    path: "/sys",
    name: "系统管理",
    meta: {
        icon: "icon-xitongguanli",
        inMenu: true,
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/dept",
            name: "机构管理",
            meta: {
                inMenu: true,
                verify: "per_01_01_01_01",
            },
            redirect: "/sys/dept",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/dept",
                    name: "机构管理",
                    meta: {
                        title: "机构管理",
                        verify: "per_01_01_01_01",
                    },
                    component: () => import("@/views/sys/dept"),
                },
            ],
        },
        {
            path: "/menu",
            name: "菜单管理",
            meta: {
                inMenu: true,
                verify: "per_01_01_04_01",
            },
            redirect: "/sys/menu",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/menu",
                    name: "菜单管理",
                    meta: {
                        title: "菜单管理",
                        verify: "per_01_01_04_01",
                    },
                    component: () => import("@/views/sys/menu"),
                },
            ],
        },
        {
            path: "/user",
            name: "用户管理",
            meta: {
                inMenu: true,
                verify: "per_01_01_03_01",
            },
            redirect: "/sys/user",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/user",
                    name: "用户管理",
                    meta: {
                        title: "用户管理",
                        verify: "per_01_01_03_01",
                    },
                    component: () => import("@/views/sys/user"),
                },
            ],
        },
        {
            path: "/role",
            name: "权限管理",
            meta: {
                inMenu: true,
                verify: "per_01_01_02_01",
            },
            redirect: "/sys/role",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/role",
                    name: "权限管理",
                    meta: {
                        title: "权限管理",
                        verify: "per_01_01_02_01",
                    },
                    component: () => import("@/views/sys/role"),
                },
            ],
        },
    ],
};
export const devOps = {
    path: "/devOps",
    name: "运维管理",
    meta: {
        icon: "icon-yunweiguanli",
        inMenu: true,
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/devOps/cron",
            name: "运维管理",
            meta: {
                inMenu: true,
                verify: "per_01_07_07_01",
            },
            redirect: "/sys/devOps/cron",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/devOps/cron",
                    name: "定时任务",
                    meta: {
                        title: "定时任务",
                        verify: "per_01_07_07_01",
                    },
                    component: () => import("@/views/sys/devOps/cron"),
                },
            ],
        },
    ],
};
export const dataReview = {
    path: "/dataReview",
    name: "数据审核",
    meta: {
        icon: "icon-shujushenhe",
        inMenu: true,
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/dataReview/targetSignExclusion",
            name: "目标签约排除人群审核",
            meta: {
                inMenu: true,
                verify: "per_02_03_01_01",
            },
            redirect: "/sys/dataReview/targetSignExclusion",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/dataReview/targetSignExclusion",
                    name: "目标签约排除人群审核",
                    meta: {
                        title: "目标签约排除人群审核",
                        verify: "per_02_03_01_01",
                    },
                    component: () => import("@/views/sys/dataReview/targetSignExclusion"),
                },
            ],
        },
        {
            path: "/dataReview/signCheckAgain",
            name: "目标签约排除人群复核",
            meta: {
                inMenu: true,
                verify: "per_01_03_06_01",
            },
            redirect: "/sys/dataReview/signCheckAgain",
            component: emptyLayout,
            children: [
                {
                    path: "/sys/dataReview/signCheckAgain",
                    name: "目标签约排除人群复核",
                    meta: {
                        title: "目标签约排除人群复核",
                        verify: "per_01_03_06_01",
                    },
                    component: () => import("@/views/sys/dataReview/signCheckAgain/index"),
                    children: [],
                },
                {
                    path: "/sys/dataReview/signCheckAgain/clickByView",
                    name: "复核详情",
                    meta: {
                        title: "复核详情",
                        verify: "per_01_03_06_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/sys/dataReview/signCheckAgain/clickByView"),
                    chiildren: [
                    ]
                },
                {
                    path: "/sys/dataReview/signCheckAgain/clickByViewDetail",
                    name: "详情列表",
                    meta: {
                        title: "详情列表",
                        verify: "per_01_03_06_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/sys/dataReview/signCheckAgain/clickByViewDetail"),
                },
                {
                    path: "/sys/dataReview/signCheckAgain/check",
                    name: "核查列表",
                    meta: {
                        title: "核查列表",
                        verify: "per_01_03_06_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/sys/dataReview/signCheckAgain/check"),
                },
            ],
        },
    ],
};


