import service from '../../service';

// 列表
export const getReferralList = params => {
    return service.$post('/referral_down', params, true)
};
// 标记已读
export const markReadSate = params => {
    return service.$post('/referralDownTrackResult/markReadSate', params, true)
};
// 追踪录入
export const trackResultInput = params => {
    return service.$post('/referralDownTrackResult/trackResultInput', params, true)
};
