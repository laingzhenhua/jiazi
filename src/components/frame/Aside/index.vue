<template>
    <el-aside class="ui-sidebar_container" :class="{'collapse-width': isCollapse}">
        <div class="logo" :class="[{'collapse-logo': isCollapse}, {'is-logo-hide': !isLogo}]">
            LOGO
        </div>
        <el-menu
            :class="['el-menu-vertical', {'is-logo-hide': !isLogo}]"
            mode="vertical"
            :collapse="isCollapse"
            :default-active="activeAside"
            v-if="isRefresh"
        >
            <div v-for="(item, index) in menuList" :key="index">
                <el-submenu v-if="item.children.length > 0" :index="item.menuCode">
                    <template slot="title">
                        <i class="iconfont" :class="item.icon"></i>
                        <span v-show="!isCollapse">{{ item.menuName }}</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item   v-for="(it, idx) in item.children"  :key="idx" :index="it.menuUrl" @click="handleRouterLink(it)">
                            {{ it.menuName }}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item
                    v-else-if="item.children.length === 0"
                    :index="item.menuUrl"
                    @click="handleRouterLink(item)"
                >
                    <i class="iconfont" :class="item.icon"></i>
                    <span slot="title">{{ item.menuName }}</span>
                </el-menu-item>
            </div>
        </el-menu>
        <div class="is-collapse_box" @click="handleIsCollapse">
            <div class="is-collapse-mask">
                <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
            </div>
        </div>
    </el-aside>
</template>

<script>
    import menu from "./menu"; // 前端配置菜单 勿删

    export default {
        name: "index",
        props: {
            isLogo: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                logoVisibility: this.isLogo,
                isRefresh: true,
            };
        },
        computed: {
            menuList() {
                const storeMenu = this.$store.state.user.switchMenuList; // 后端菜单
                storeMenu.forEach(item => {
                    let menuData = menu.find(i => i.menuUrl === item.menuUrl);
                    item.icon = menuData.menuIcon;
                });
                if (storeMenu[0] && storeMenu[0].menuUrl === "/") {
                    return storeMenu[0].children;
                }
                return storeMenu;
            },
            isCollapse() {
                return this.$store.state.global.isCollapse;
            },
            activeAside() {
                return this.$store.state.user.activeAside;
            },
            headerCode() {
                return this.$store.state.user.activeHeader;
            },
        },
        watch: {
            isLogo: function(val) {
                this.logoVisibility = val;
            },
            headerCode: function(nv) {
                this.isRefresh = false;
            },
            activeAside: function(val) {
                this.isRefresh = true;
            },
        },
        methods: {
            // 路由切换参数
            handleRouterLink(params) {
                this.$store.dispatch("setAsideStatus", params.menuUrl);
                this.$router.push({path: params.menuUrl});
            },
            handleIsCollapse() {
                this.$store.dispatch("setIsCollapse");
            },
        },
    };
</script>

<style lang="less" scoped>
/deep/ .el-menu-item{
   height: 30px;
    line-height: 30px;
    padding: 0;
}
/deep/ .el-menu-item-group{
    //background-color: red;
    //height: 100px;
}
</style>
