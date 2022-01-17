import service from '../../service';

export const gridPeopleList = params => {
    return service.$post('/grid/peopleInfo/list', params, true)
};
export const queryArea = params => {
    return service.$get('/region/top', params, true)
};
// 街道列表
export const queryStreet = params => {
    return service.$get('/region/street/list', params, true)
};
// 社区列表
export const queryCommunity = params => {
    return service.$get('/region/community/list', params,true)
};
// 网格列表
export const queryGrid = params => {
    return service.$get('/grid/listByRegionCode', params, true)
};
// zf网格列表
export const queryGovGrid = params => {
    return service.$post('/grid/listByRegionAndName', params, true)
};
// 楼栋列表
export const queryBuilding = params => {
    return service.$get('/gridBuildingRel/listByGridCode', params, true)
};
// 候选楼栋列表
export const queryMatchBuilding = params => {
    return service.$post('/gridBuilding/listByRegionAndName', params, true)
};
