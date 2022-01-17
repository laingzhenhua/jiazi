import service from '../../service';

// 授权登录
export const authLogin = params => {
    return service.$get('auth/access_token_login', params, true)
};
