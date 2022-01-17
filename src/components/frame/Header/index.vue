<template>
    <el-header class="ui-header_container">
        <div :class="['logo', { 'is-logo-hide': !logoVisibility }]">
            <img src="~assets/images/header.png" alt="">
        </div>
        <el-menu :default-active="parentActions" class="el-menu-demo" mode="horizontal">
            <el-menu-item
                v-for="item in headerMenuList"
                :key="item.menuCode"
                :index="item.menuCode"
              @click="handleSwitchNav(item)"
            >
                {{item.menuName}}
            </el-menu-item>
        </el-menu>
        <div class="g-right_box">
            <el-dropdown>
                <a class="user">
                    <img src="~assets/images/user.png"/>
                    <span>{{userInfo.name}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </a>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editPasswd">修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <Update-Passwd ref="updatePasswd"/>
    </el-header>
</template>

<script>
    import UpdatePasswd from "@/components/updatePasswd";
    import {outLogin} from "@/components/utils/commonRequest";
    export default {
        name: "index",
        props: {
            isLogo: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            UpdatePasswd
        },
        data() {
            return {
                logoVisibility: this.isLogo,
            }
        },
        watch: {
            isLogo: function (val) {
                this.logoVisibility = val;
            },
        },
        computed: {
            headerMenuList() {
                return this.$store.state.user.menuList;
            },
            parentActions() {
                return this.$store.state.user.activeHeader;
            },
            userInfo() {
                return this.$store.state.user.userLoginInfo
            }
        },
        methods: {
            editPasswd() {
                this.$refs.updatePasswd.dialogVisible = true;
            },
            logout() {
                let that = this;
                that.$confirm("是否确定退出当前系统", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    await outLogin();
                    this.$router.push("/login");
                }).catch(() => {
                    this.$message.info('已取消删除');
                })
            },
            handleSwitchNav(item) {
                if (item.menuCode !== this.$store.state.user.activeHeader) {
                    // 设置头部状态
                    this.$store.dispatch("setActiveHeader", item.menuCode);
                    this.$store.dispatch("setSwitchMenuList", item.children);
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .ui-header_container {
        box-sizing: border-box;
        width: 100%;
        //height: 60px;
        //background: linear-gradient(90deg,
        //rgba(0, 151, 212, 1) 0%,
        //rgba(2, 192, 170, 1) 100%);
        //box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 1;

        .el-menu-demo {
            background-color: transparent;
            border-bottom: 0;

            .el-menu-item {
                color: #fff !important;
                font-weight: bold;
                height: 48px;
                line-height: 48px;
            }

            .el-menu-item:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .el-menu-item:focus {
                background-color: transparent;
            }

            .el-menu-item.is-active {
                background-color: rgba(8, 139, 172, 0.5);
                //border-bottom: 3px solid #fff;
            }
        }

        .g-right_box {
            height: 24px;
            display: flex;
            align-items: center;

            .user {
                height: 24px;
                display: flex;
                align-items: center;
                color: #ffffff;
                cursor: pointer;

                img {
                    width: 24px;
                    height: 24px;
                    margin: 0 10px 0 20px;
                }
            }

            .el-dropdown {
                color: #fff;
            }
        }
    }
</style>
