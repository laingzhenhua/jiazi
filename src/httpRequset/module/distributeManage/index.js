import service from '../../service';

// 待分配网格列表
export const getGridList = params => {
    return service.$get('/gridAssign/notAssignGridList', params, true)
};
// 已分配网格列表
export const getAssignGridList = params => {
    return service.$get('/gridAssign/assignGridList', params, true)
};
// 删除已分配网格列
export const delAssignGridList = params => {
    return service.$post('/gridAssign/deleteGrid', params, true)
};
// 获取可分配的机构
export const getGridOrgList = params => {
    return service.$get('/gridAssign/getOrgList', params, false)
};
// 网格分配
export const gridDistribution = params => {
    return service.$post('/gridAssign/gridDistribution', params, true)
};
// 统计总数
export const getGridStatistics = params => {
    return service.$get('/gridAssign/statistics', params, false)
};
