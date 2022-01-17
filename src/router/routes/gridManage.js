import {emptyLayout, leftRightLayout, topDownLayout, topLeftRightLayout} from "../layout";

export const gridManage = {
    path: "/gridManage",
    name: "网格管理",
    meta: {
        title: "网格管理",
        icon: "icon-wanggeguanli1",
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/gridManage/residentQuantity",
            name: "网格居民数据",
            meta: {
                title: "网格居民数据",
                verify: "per_02_02_01_01",
            },
            redirect: "/gridManage/residentQuantity/index",
            component: emptyLayout,
            children: [
                {
                    path: "/gridManage/residentQuantity/index",
                    name: "网格居民数据",
                    meta: {
                        title: "网格居民数据",
                        verify: "per_02_02_01_01",
                    },
                    component: () => import("@/views/gridManage/residentQuantity"),
                },
            ],
        },
        {
            path: "/gridManage/addressDirectory",
            name: "网格源设置",
            meta: {
                inMenu: true,
                verify: "per_02_02_02_01",
            },
            redirect: "/gridManage/addressDirectory/index",
            component: emptyLayout,
            children: [
                {
                    path: "/gridManage/addressDirectory/index",
                    name: "网格源设置",
                    meta: {
                        title: "网格源设置",
                        verify: "per_02_02_02_01",
                    },
                    component: () => import("@/views/gridManage/addressDirectory"),
                },
            ],
        },
        {
            path: "/gridManage/distributeManage",
            name: "网格分配管理",
            meta: {
                inMenu: true,
                verify: "per_02_02_03_01",
            },
            redirect: "/gridManage/distributeManage/index",
            component: emptyLayout,
            children: [
                {
                    path: "/gridManage/distributeManage/index",
                    name: "网格分配管理",
                    meta: {
                        title: "网格分配管理",
                        verify: "per_02_02_03_01",
                    },
                    component: () => import("@/views/gridManage/distributeManage"),
                },
            ],
        },
    ],
};
