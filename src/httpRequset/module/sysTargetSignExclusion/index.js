import service from "../../service";
export const excludeExamList = params => {
    return service.$post("/fdSignTask/exclude/exam/list", params, true)
};
//查询角色权限列表
export const rolePermissionList = params => {
    return service.$post(`/sys/menu/tree/by_role?id=${params.id}`, true)
};
//目标签约排除人群审核
export const personUpdateCheckState = params => {
    return service.$post("/team/grid/person/updateCheckState", params, true)
};
//撤回审核
export const personRecallCheckState = params => {
    return service.$post("/team/grid/person/recallCheckState", params, true)
};
//家医团队
export const teamListByOrg = params => {
    return service.$get(`/stats/doctor/service/team/listIncludeDisableByOrg?orgCode=${params}`, true);
};
