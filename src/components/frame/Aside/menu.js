import * as routes from "@/router/routes";

const menuFormatter = routes =>
    routes.map(route => ({
        menuUrl: route.path,
        menuName: route.meta && route.meta.title,
        menuIcon: route.meta && route.meta.icon,
        children: route.children && menuFormatter(route.children),
        frame:1,
        authorized: "",
    }));

const menus = menuFormatter(Object.values(routes));
export default menus;
