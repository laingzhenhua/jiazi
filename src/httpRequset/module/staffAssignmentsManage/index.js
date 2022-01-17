import service from '../../service';

// 人群分类字典
export const queryCrowd = params => {
    return service.$get('/pm/team/mgnt/fdSignCrowd/list', params, true)
};
// 查询楼栋关联社康
export const queryOrgByBuilding = params => {
    return service.$get('/gridBuildingRel/orgByBuildingCode', params, true)
};
// 查询楼栋关联团队
export const queryTeamByBuilding = params => {
    return service.$get('/gridBuildingRel/listByBuildingCode', params, true)
};
// 查询社康关联团队
export const queryTeam = params => {
    return service.$get('fdShouldMgnt/find/teams', params, true)
};
// 查询社区管理楼栋
export const queryBuildingList = params => {
    return service.$post('/gridBuilding/buildList', params, true)
};
// 分配社康列表
export const getListByOrg = params => {
    return service.$post('/fdShouldMgnt/allotOrg/list', params, true)
};
// 分配社康
export const allotByOrg = params => {
    return service.$post('/fdShouldMgnt/allotOrg/edit', params, true)
};

// 分配团队列表
export const getListByTeam = params => {
    return service.$post('/fdShouldMgnt/allotTeam/list', params, true)
};

// 分配团队
export const allotByTeam = params => {
    return service.$post('/fdShouldMgnt/allotTeam/edit', params, true)
};
/* gridSource */
// 区域列表
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
// 关联网格
export const addGrid = params => {
    return service.$post('/grid/add', params, true)
};
// 删除网格
export const delGrid = params => {
    return service.$get('/grid/del', params, true)
};
// 关联楼栋
export const addBuilding = params => {
    return service.$post('/gridBuildingRel/add', params, true)
};
// 删除关联楼栋
export const delBuilding = params => {
    return service.$post('/gridBuildingRel/del', params, true)
};
// 未匹配楼栋
export const getUnmatchBuilding = params => {
    return service.$post('/gridBuilding/listUnmatch', params, true)
};



