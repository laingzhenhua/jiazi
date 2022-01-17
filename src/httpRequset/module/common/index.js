import service from "../../service";

// 获取医院列表
export const getHospitalList = params => {
    return service.$get("/referralDown/hospital", params, false);
};
//
export const getDicConfig = params => {
    return service.$get("/dict/item/SYSTEM_CONFIG/CHRONIC_START_DATE", params, false);
};
// 获取医院列表
export const queryDoubleOrgTree = params => {
    return service.$post("/org/secondOrgList", params, false);
};
//高级查询==>通用接口
export const queryOrgs = params => {
    return service.$get("/org/owned_orgs", params, false);
};
//分页查询
export const getDataList = params => {
    return service.$post("/stats/lackCase/list", params, false);
};
//导出
export const dataListExport = params => {
    return service.$postDown("/stats/lackCase/list/export", params, true, false);
};
// 获取权限过滤后社康
export const queryOrg = params => {
    return service.$get("/org/owned_communities", params, true);
};
// 获取团队
export const queryTeam = params => {
    return service.$get("/org/owner/teams", params, true);
};
//家医团队
export const teamListByOrg = params => {
    return service.$get(`/stats/doctor/service/team/listByOrg?orgCode=${params}`, true);
};
//查询拥有的机构树
export const orgOwnedTree = params => {
    return service.$get("/org/owned_orgs/tree",params, true);
};
// 拨打电话
export const phoneCheck = params => {
    return service.$post("/phonecall/dail/outBound",params, true);
};
// 播放录音
export const phoneRecordingList = params => {
    return service.$get("/phonecall/recording/list",params, true);
};
export const getMfrs = params => {
    return service.$get("/phonecall/active/mfrs/get",params, true);
};
//获取权限过滤后医院
export const queryHospital = params => {
    return service.$post("/org/hospitalList",params, true);
};
//获取权限过滤后街道
export const queryStreet = params => {
    return service.$get("/region/street/listByOrg",params, true);
};


