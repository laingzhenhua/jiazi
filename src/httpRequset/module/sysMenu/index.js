import service from '../../service';
/*
 * 菜单管理模块
 */
//导航栏菜单树
export const menuTree = params => {
    return service.$get('/auth/menu', params, true)
};
//获取菜单树
export const sysTree = params => {
    return service.$get('/sys/menu/tree', params, true)
};
// 查询菜单列表
export const menuList = params => {
    return service.$post('/sys/menu/list', params, true)
};
//编辑菜单状态
export const menuEditState = params => {
    return service.$post(`/sys/menu/edit_state?id=${params.id}&state=${params.state}`, true)
};