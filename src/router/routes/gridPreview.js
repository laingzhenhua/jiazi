import { emptyLayout, leftRightLayout, topDownLayout, topLeftRightLayout } from "../layout";

export const gridPreview = {
    path: "/gridPreview",
    name: "网格预览",
    meta: {
        icon: "icon-wanggegailan2",
        inMenu: true,
    },
    component: topLeftRightLayout,
    children: [
        {
            path: "/gridPreview/gridPreview",
            name: "网格预览",
            meta: {
                inMenu: true,
                title: "网格预览",
                verify: "per_02_01_01_01",
            },
            component: () => import("@/views/gridPreview/gridPreview"),
        },
    ],
};
