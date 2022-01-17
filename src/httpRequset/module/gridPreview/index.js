import service from "../../service";

// 网格概览-人群分布
export const getCrowdList = params => {
    return service.$get("/grid/overview/crowd/ratio", params, true);
};

// 网格概览-重点人群管理情况
export const getCrowdMangement = params => {
    return service.$get("/grid/overview/focusGroup/management", params, true);
};

// 网格概览-统计数据
export const getStatistics = params => {
    return service.$get("/grid/overview/statistics", params, true);
};

// 网格概览-签约人员结构
export const getMeshSignCrowd = params => {
    return service.$get("/grid/overview/team/meshSignCrowd", params, true);
};
