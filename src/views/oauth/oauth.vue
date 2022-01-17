<template>
    <div
        v-loading="loading"
        element-loading-text="自动授权登录中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
        class="oauth-main"
    ></div>
</template>

<script>
    import {
        queryCommonMenuList,
        queryCommonPermissionsList,
    } from "@/components/utils/commonRequest";

    export default {
        name: "oauth",
        data() {
            return {
                loading: false,
            };
        },
        created() {
            this.autoLogin();
        },
        methods: {
            async autoLogin() {
                this.loading = true;
                let params = this.$route.query;
                try {
                    let res = await this.$http.oauth.authLogin(params);
                    if (res.code === 0 && res.data) {
                        if (res.code == 0) {
                            this.loading = false;
                            // 设置 token
                            await this.$store.dispatch("setToken", res.data.sessionId);
                            // 设置用户信息
                            await this.$store.dispatch("setUserInfo", res.data);
                            // 获取菜单及权限
                            await queryCommonPermissionsList();
                            await queryCommonMenuList();
                            // 跳转
                            if (params.targetMenu) {
                                await this.$store.dispatch("setAsideStatus", params.targetMenu);
                                this.$router.push({
                                    path: params.targetMenu,
                                    query: {actionCode: params.actionCode},
                                });
                            } else {
                                this.$router.push('/')
                            }
                        } else {
                            this.loading = false;
                            this.$mes("error", res.msg, 3000);
                        }
                    }
                } catch (error) {
                    console.log(error);
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .oauth-main {
        height: 100%;

        /deep/ .el-loading-spinner i {
            color: #fff;
        }

        /deep/ .el-loading-spinner .el-loading-text {
            color: #fff;
            font-size: 20px;
        }
    }
</style>
