import service from "../../service";
/*
 * 机构管理模块
 */
// 分页查询机构列表
export const orgList = params => {
    return service.$post("/org/list", params, true)
};
// 模糊匹配机构名称
export const orgSearch = params => {
    return service.$get("/org/search", params, true)
};
// 查询顶层机构列表
export const OrgtopList = params => {
    return service.$get("/org/top_list", params, true)
};
// 查询机构树
export const orgTree = params => {
    return service.$get("/org/tree", params, true)
};
// 查询下拉框列表 orgType: 20 举办医院  30-区域社康  40-一般社康
export const getSelectList = params => {
    return service.$get("/org/select", params, true)
};
// 查询拥有的机构树
export const orgOwnedTree = params => {
    return service.$get("/org/owned_orgs/tree", params, true)
};
// 编辑机构
export const orgEdit = params => {
    return service.$post("/org/edit", params, true)
};
// 删除机构
export const orgDel = params => {
    return service.$post("/org/del", params, true)
};
// 启用禁用机构
export const orgEnable = params => {
    return service.$get(`/org/enable?orgCode=${params.orgCode}&state=${params.state}`, true)
};
// 新增机构
export const orgAdd = params => {
    return service.$post("/org/add", params, true)
};
// 分页查询机构列表
export const regionStreetList = params => {
    return service.$get("/region/street/list", params, true)
};
