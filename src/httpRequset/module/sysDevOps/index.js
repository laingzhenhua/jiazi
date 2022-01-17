import service from "../../service";
//根据创建时间或状态查询异步任务列表
export const getAsyncTaskList = params => {
    return service.$post("/asyncTask/list", params, true)
};
//
export const getAsyncTaskType = params => {
    return service.$get("/asyncTask/type/list", params, true)
};
//添加常态化当量任务
export const addDailyTask = params => {
    return service.$get("/pm/task/daily/add", params, true)
};
// 查询常态化当量任务
export const getDailyList = params => {
    return service.$post("/pm/task/daily/list", params, true)
};
// 删除常态化当量任务
export const delDailyTask = params => {
    return service.$post("/pm/task/daily/del", params, true)
};
// 查询常态化当量子任务
export const getAsyncTask = params => {
    return service.$get("/asyncTask/list/byServiceId", params, true)
};
// 重置常态化当量子任务
export const resetAsyncTask = params => {
    return service.$get("/asyncTask/state/reset", params, true)
};
/*
 定时任务
 */
//列表
export const getDataList = params => {
    return service.$post("/ops/regular/tasks/list", params, true)
};
//编辑
export const edit = params => {
    return service.$post("/ops/edit/schedule", params, true)
};
//执行定时任务
export const execTask = params => {
    return service.$post("ops/regular/tasks/exec", params, true)
};
