import service from "../../service";

//分页查询目标签约人群复核任务
export const excludeTaskList = params => {
    return service.$post("/fdSignTask/excludeTask/list", params, true)
};
//编辑督导任务
export const excludeTaskEdit = params => {
    return service.$post("/fdSignTask/excludeTask/edit", params, true)
};
//查询督导任务详情
export const excludeTaskDetail = params => {
    return service.$get(`/fdSignTask/excludeTask/detail?flag=${params.flag}&taskId=${params.taskId}`,true)
};
//查询目标签约居民排除报告
export const reportList = params => {
    return service.$post("/fdSignTask/excludeTask/report/list", params, true)
};
//分页查询目标签约居民明细
export const residentList = params => {
    return service.$post("/fdSignTask/excludeTask/resident/List", params, true)
};
//目标签约排除复核抽样-样本列表
export const samplingDetailList = params => {
    return service.$post(`/fdSignTask/sampling/detail/list?orgCode=${params.orgCode}&taskId=${params.taskId}`, true)
};
//单个样本详情查看
export const samplingDetailGet = params => {
    return service.$post(`/fdSignTask/sampling/detail/get?detailId=${params.detailId}&taskType=${params.taskType}`, true)
};
//保存排除/解约人工复核
export const samplingDetailTruthSave = params => {
    return service.$post("/fdSignTask/sampling/detail/truth/save", params, true)
};
//删除任务
export const excludeTaskDelete = params => {
    return service.$post("/fdSignTask/excludeTask/del", params, true)
};
//新增目标签约人群复核任务
export const excludeTaskAdd = params => {
    return service.$post("/fdSignTask/excludeTask/add", params, true)
};
//社康列表
export const getOrgList = params => {
    return service.$post("/fdSignTask/sampling/org/list", params, true)
};
//签约排除抽样
export const signExcludeSampling = params => {
    return service.$post("/fdSignTask/exclude/sampling", params, true)
};

//签约排除抽样
export const changeSampling = params => {
    return service.$post("/fdSignTask/exclude/sampling/swap", params, true)
};
// 切换新生儿访视样本
export const changeChildVisitSample = params => {
    return service.$post("/sampling/change/one/child/visit", params, true)
}
// 切换儿童体检样本
export const changeChildExamSample = params =>{
    return service.$post("/sampling/change/one/child/exam", params, true)
}
//
export const personTotal = params =>{
    return service.$get(`/team/grid/person/total?taskId=${params.taskId}&orgCode=${params.orgCode}`, true)
}

