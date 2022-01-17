import {emptyLayout, leftRightLayout, topDownLayout, topLeftRightLayout} from "../layout";

export const gridApplication = {
    path: "/gridApplication",
    name: "网格应用",
    meta: {
        icon: "icon-wanggeyingyong1",
        inMenu: true,
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/staffAssignmentsManage",
            name: "未纳入管理人员分配",
            meta: {
                inMenu: true,
                verify: "per_02_03_01_01",
            },
            redirect: "/gridApplication/staffAssignmentsManage",
            component: emptyLayout,
            children: [
                {
                    path: "/gridApplication/staffAssignmentsManage",
                    name: "未纳入管理人员分配",
                    meta: {
                        title: "未纳入管理人员分配",
                        verify: "per_02_03_01_01",
                    },
                    component: () => import("@/views/gridApplication/staffAssignmentsManage"),
                },
            ],
        },
        {
            path: "/residentManage",
            name: "网格居民管理",
            meta: {
                inMenu: true,
                verify: "per_02_03_02_01",
            },
            redirect: "/gridApplication/residentManage",
            component: emptyLayout,
            children: [
                {
                    path: "/gridApplication/residentManage",
                    name: "网格居民管理",
                    meta: {
                        title: "网格居民管理",
                        verify: "per_02_03_02_01",
                    },
                    component: () => import("@/views/gridApplication/residentManage"),
                },
            ],
        },
        {
            path: "/residentSearch",
            name: "居民下转查询",
            meta: {
                inMenu: true,
                verify: "per_02_03_03_01",
            },
            redirect: "/gridApplication/residentSearch",
            component: emptyLayout,
            children: [
                {
                    path: "/gridApplication/residentSearch",
                    name: "居民下转查询",
                    meta: {
                        title: "居民下转查询",
                        verify: "per_02_03_03_01",
                    },
                    component: () => import("@/views/gridApplication/residentSearch"),
                },
            ],
        },
        {
            path: "/residentManageStatistics",
            name: "网格居民管理统计",
            meta: {
                inMenu: true,
                verify: "per_02_03_05_01",
            },
            redirect: "/gridApplication/residentManageStatistics",
            component: emptyLayout,
            children: [
                {
                    path: "/gridApplication/residentManageStatistics",
                    name: "网格居民管理统计",
                    meta: {
                        title: "网格居民管理统计",
                        verify: "per_02_03_05_01",
                    },
                    component: () => import("@/views/gridApplication/residentManageStatistics"),
                },
            ],
        },
        {
            path: "/fdManagement",
            name: "家医团队管理",
            meta: {
                inMenu: true,
                verify: "per_01_03_05_02",
            },
            redirect: "/gridApplication/fdManagement",
            component: emptyLayout,
            children: [
                {
                    path: "/gridApplication/fdManagement",
                    name: "家医团队管理",
                    meta: {
                        title: "家医团队管理",
                        verify: "per_01_03_05_02",
                    },
                    component: () => import("@/views/gridApplication/fdManagement"),
                    children: [

                    ]
                },
                {
                    path: "/gridApplication/fdManagement/teamDetail",
                    name: "家医团队管理详情",
                    meta: {
                        title: "家医团队管理详情",
                        verify: "per_01_03_05_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/gridApplication/fdManagement/teamDetail"),
                },
                {
                    path: "/gridApplication/fdManagement/newGridDetail",
                    name: "网格管理详情",
                    meta: {
                        title: "网格管理详情",
                        verify: "per_01_03_05_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/gridApplication/fdManagement/newGridDetail"),
                    children: [
                    ]
                },
                {
                    path: "/gridApplication/fdManagement/newGridSet",
                    name: "添加网络管理",
                    meta: {
                        title: "添加网络管理",
                        verify: "per_01_03_05_02",
                        isChildRoute: 1, // 下钻路由标识
                    },
                    component: () => import("@/views/gridApplication/fdManagement/newGridSet"),
                    children: [

                    ]
                },
            ],
        },
    ],
};
