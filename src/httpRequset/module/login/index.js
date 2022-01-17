import service from '../../service';

// 登陆
export const LoginRequest = params => {
    return service.$post("/auth/login", params, true)
};

// 获取用户菜单
export const queryMenuList = params => {
    return service.$get("/auth/menu", params ,false);
};

// 获取用户权限
export const queryAuthPermissions = params => {
    return service.$get('/auth/permissions', params, false);
};

// 退出登陆
export const loginOut = params => {
  return service.$get("/auth/logout",params, false);
};

// 校验session是否失效
export const checkSession = params => {
    return service.$get("/auth/check/session", params, false);
};

// 修改登陆秘密
export const updatePassword = params => {
  return service.$post("/sys/user/update_passwd", params, false);
};