import service from "../../service";

// 团队管理
export const getTeamList = params => {
    return service.$post("/pm/team/mgnt/team/list", params, true);
};
// 人员管理
export const getDoctorList = params => {
    return service.$post("/pm/team/mgnt/doctor/list", params, true);
};
// 团队成员
export const getTeamMemberList = params => {
    return service.$get("/pm/team/mgnt/teamMember/list", params, true);
};
// 网格数据
export const getGridList = params => {
    return service.$post("/pm/team/mgnt/grid/list", params, true);
};
// 新增网格
export const addGrid = params => {
    return service.$post("/pm/team/mgnt/grid/add", params, true);
};
// 编辑网格
export const editGrid = params => {
    return service.$post("/pm/team/mgnt/grid/edit", params, true);
};
// 删除网格
export const deleteGrid = params => {
    return service.$get("/pm/team/mgnt/teamMember/delete", params, true);
};
// New Grid Data
export const getNewGridData = params => {
    return service.$post("/fdGridAddr/list", params, true);
};
//查询家医团队下的网格列表
export const getFDGridAddrList = params => {
    return service.$post("/fdGridAddr/listSelectable", params, true);
};
// 查询 街道（已过滤）
export const getStreetListByOrg = params => {
    return service.$get("/region/street/listByOrg", params, true);
};
// 查询 街道（已过滤）
export const getStreetListByOrg1 = params => {
    return service.$get("/region/street/list", params, true);
};
//  查询 社区
export const getCommunityList = params => {
    return service.$get("/region/community/list", params, true);
};
//  关联家医团队-网格
export const fdGridAddrAdd = params => {
    return service.$post("/fdGridAddr/add", params, true);
};
// 编辑家医团队-网格关联信息
export const fdGridAddrUpdate = params => {
    return service.$post("/fdGridAddr/update", params, true);
};
// 取消家医团队-网格关联
export const fdGridAddrDelete = params => {
    return service.$get("/fdGridAddr/delete", params, true);
};
