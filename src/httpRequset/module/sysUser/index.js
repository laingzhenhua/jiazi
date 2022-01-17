import service from "../../service";
/*
 * 用户管理模块
 */
//分页查询用户列表
export const userList = params => {
    return service.$post("/sys/user/list", params, true)
};
//编辑用户
export const userEdit = params => {
    return service.$post("/sys/user/edit", params, true)
};
//新增用户
export const userAdd = params => {
    return service.$post("/sys/user/add", params, true)
}
//解锁用户
export const userUnlock = params => {
    return service.$get("/sys/user/lockSwitch", params, true)
};
//重置用户密码
export const userRestPwd = params => {
    return service.$post(`/sys/user/reset_passwd?id=${params.id}`, true)
}
//修改系统用户密码
export const userUpdatePwd = params => {
    return service.$post("/sys/user/update_passwd", params, true)
}
//修改用户状态
export const userUpdateState = params => {
    return service.$post(`/sys/user/update/state?id=${params.id}&state=${params.state}`, true)
}
