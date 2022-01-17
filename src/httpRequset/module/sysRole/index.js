import service from "../../service";
/*
 * 角色管理模块
 */
// 角色列表查询
export const roleList = params => {
    return service.$post("/sys/role/list", params, true)
};
//查询角色权限列表
export const rolePermissionList = params => {
    return service.$post(`/sys/menu/tree/by_role?id=${params.id}`, true)
};
//新增角色
export const roleAdd = params => {
    return service.$post("/sys/role/add", params, true)
};
//编辑角色
export const roleEdit = params => {
    return service.$post("/sys/role/edit", params, true)
};
//角色
export const roleUsed = params => {
    return service.$get("/sys/role/used_users", params, true)
};
//删除角色
export const roleDel = params => {
    return service.$post(`/sys/role/del?id=${params.id}`, true)
};
//保存角色权限列表
export const roleEditPermission = params => {
    return service.$post("/sys/role/edit_permission", params, true)
};
//查询用户的角色列表
export const roleListBy = params => {
    return service.$get("/sys/role/list_by_user", params, true)
};
// 权限码
export const permissions = params => {
    return service.$get("/auth/permissions", params, true)
};
