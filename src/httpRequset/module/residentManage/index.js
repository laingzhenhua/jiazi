import service from '../../service';

// 查询家医签约人群分类列表
export const getFdSignCrowd = params => {
    return service.$get('/pm/team/mgnt/fdSignCrowd/list', params, false)
};
// 获取字典
export const dictItems = params => {
    return service.$get('/dict/items', params, true)
};
//  网格签约管理统计列表
export const getList = params => {
    return service.$post('/stats/grid/mgnt/findList', params, false)
};
//  查询地址列表
export const addrList = params => {
    return service.$post('/team/grid/person/addr/repo', params, true)
};
//  标记地址
export const addrSign = params => {
    return service.$post('/team/grid/person/addr/sign', params, true)
};
//  待办事项/团队网格居民管理/查询未签约居民列表
export const getGridUnSign = params => {
    return service.$post('/team/grid/person/notSign', params, true)
};
//  待办事项/团队网格居民管理/查询未签约居民统计数据
export const getGridUnSignStat = params => {
    return service.$get('/team/grid/person/notSign/stat', params, true)
};
//  待办事项/团队网格居民管理/查询已签约居民列表
export const getGridSign = params => {
    return service.$post('/team/grid/person/sign', params, true)
};
//  待办事项/团队网格居民管理/查询未建档居民列表
export const getGridUnfiled = params => {
    return service.$post('/team/grid/person/notFiled', params, true)
};
//  待办事项/团队网格居民管理/查询已排除人群列表
export const getGridExcluded = params => {
    return service.$post('/team/grid/person/excluded', params, true)
};
//  待办事项/团队网格居民管理/查询已签约居民统计数据
export const getGridSignStat = params => {
    return service.$get('/team/grid/person/sign/stat', params, true)
};
//  待办事项/网格居民管理/未签约居民完善信息
export const editGridUnSign = params => {
    return service.$post('/team/grid/person/notSign/edit', params, true)
};
//  待办事项/网格居民管理/未签约居民完善信息
export const getGridUnSignDetail = params => {
    return service.$get('/team/grid/person/notSign/detail', params, true)
};
//  待办事项/网格居民管理/未签约居民完善信息
export const getGridUnSignSource = params => {
    return service.$get('/team/grid/person/source/list', params, false)
};
//  查询网格楼栋所属社区及团队
export const getBelong = params => {
    return service.$get('/gridBuilding/belong', params, false)
};
//  待办事项/签约到期预警/即将到期
export const getSoonExpireData = params => {
    return service.$post('/stats/pm/signAlmostExpire/warning', params, false)
};
//  待办事项/签约到期预警/即将到期编辑备注
export const editSoonExpireRemark = params => {
    return service.$post('/stats/pm/signAlmostExpire/edit/remark', params, false)
};
//  待办事项/签约到期预警/即将到期导出
export const exportSoonExpireData = params => {
    return service.$postDown('/stats/pm/export/signAlmostExpire/warning', params,true, false)
};
//  待办事项/签约到期预警/已到期
export const getExpiredData = params => {
    return service.$post('/stats/pm/unSignExpire/warning', params, false)
};
//  待办事项/签约到期预警/已到期编辑备注
export const editExpiredRemark = params => {
    return service.$post('/stats/pm/unSignExpire/edit/remark', params, false)
};
//  待办事项/签约到期预警/已到期导出
export const exportExpiredData = params => {
    return service.$postDown('/stats/pm/export/unSignExpire/warning', params,true, false)
};
//  签约到期预警
export const getSignWarningOnce = params => {
    return service.$post('/stats/pm/signExpire/warningMsgTip', params, false)
};
//  接诊业务提醒 - 列表
export const getReceiveTreatmentList = params => {
    return service.$post('/remind/person/list', params, false)
};
//   接诊业务提醒 - 提醒
export const getReceiveTreatmentRemind = params => {
    return service.$post('/remind/list', params, false)
};
//   接诊业务提醒 - 个人信息
export const getReceiveTreatmentInfo = params => {
    return service.$post('/remind/person/info', params, false)
};
//  接诊业务提醒 - 公卫项目类别
export const getTreatmentDict = params => {
    return service.$post('/remind/category/find', params, false)
};
//  工作交接提醒 - 列表
export const getWorkHandoverList = params => {
    return service.$post('/work/handover/list', params, false)
};
//   工作交接提醒 - 处理
export const editWorkHandoverState = params => {
    return service.$post('/work/handover/update/state', params, false)
};
/*------------- 近期问题 -------------- */
//   首页按医生统计
export const getProblemStats = params => {
    return service.$post('/stats/residentProblem/numByDoctor', params, false)
};
// 近期问题下钻分页详情
export const getProblemDetail = params => {
    return service.$post('/stats/residentProblem/list', params, false)
};
// 居民近期问题详情
export const getProblemByResident = params => {
    return service.$post('/stats/residentProblem/detail/list', params, false)
};
// 近期问题导出
export const exportProblemDetail = params => {
    return service.$postDown('/stats/residentProblem/export/list', params,true, false)
};
// 随访小结
export const addFollow = params => {
    return service.$post('/sfollowup/summary/add', params, false)
};
export const listFollow = params => {
    return service.$post('/followup/summary/list', params, false)
};
//查询未读数量
export const personUnReadAmount = params => {
    return service.$get(`/team/grid/person/unReadAmount`, true)
};
//标记已读/未读
export const personUpdateReadState = params => {
    return service.$post(`/team/grid/person/updateReadState?shouldManageId=${params.shouldManageId}&readState=${params.readState}`, params, true)
};
//审核未通过通知列表
export const personCheckFailedList = params => {
    return service.$post('/team/grid/person/checkFailedList', params, true)
};

// 获取地址
export const addrLog = params => {
    return service.$post('/team/grid/person/addr/log', params, true)
}
