import service from '../../service';

export const ownedCommunities1 = params => {
    return service.$get('/org/allServiceOrgs', params, true)
};
// 团队
export const getTeam = params => {
    return service.$get('/stats/doctor/service/team/list', params, true)
};
export const getTeam1 = params => {
    return service.$get('/stats/doctor/service/team/listByOrg', params, true)
};
// 家庭医生服务汇总统计列表接口1
export const getDoctorService = params => {
    return service.$post('/stats/doctor/service/summary/list', params, true)
};
// 家庭医生服务汇总统计列表接口2
export const getDoctorService2 = params => {
    return service.$post('/stats/doctor/service/summary/community/list', params, true)
}
// 导出
export const exportDoctorService = params => {
    return service.$postDown('/stats/doctor/service/summary/export', params,true, false)
}
// 导出2
export const exportDoctorService2 = params => {
    return service.$postDown('/stats/doctor/service/summary/community/export', params,true, false)
}
//table2==>相关接口
// 获取街道列表
export const getStreetList = params => {
    return service.$get('/region/owed_streets', params, true)
}
// 获取详情列表
export const getDataList = params => {
    return service.$get('/stats/doctor/service/list', params, true)
}
// 导出
export const dataListExport = params => {
    return service.$postDown('/stats/doctor/service/list/export', params,true, true)
}
// 查询 社区
export const getCommunityList = params => {
    return service.$get('/region/community/list', params, true)
}
