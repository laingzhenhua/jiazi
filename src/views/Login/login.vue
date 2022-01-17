j<template>
    <div class="login">
        <section class="level1">
            <div class="lg-box">
                <h1 class="lg-logo"></h1>
                <div class="lg-main">
                    <h2 class="lg-title">用户登录</h2>
                    <el-row class="lg-form">
                        <el-col>
                            <el-input
                                ref="username"
                                v-model="user"
                                placeholder="请输入账户名称"
                                prefix-icon="el-icon-user"
                                @keyup.enter.native="toLogin"
                            ></el-input>
                        </el-col>
                        <el-col>
                            <el-input
                                ref="password"
                                v-model="pass"
                                show-password
                                placeholder="请输入登录密码"
                                prefix-icon="el-icon-lock"
                                @keyup.enter.native="toLogin"
                            ></el-input>
                        </el-col>
                        <el-col :span="16">
                            <el-input
                                ref="checkcode"
                                v-model="code"
                                placeholder="输入验证码"
                                prefix-icon="el-icon-key"
                                @keyup.enter.native="toLogin"
                            ></el-input>
                        </el-col>
                        <el-col :span="8">
                            <div @click="getCodeFun">
                                <img :src="codeImg" class="r" alt="" />
                            </div>
                        </el-col>
                        <!-- <el-col>
                          <el-checkbox v-model="remember">记住密码</el-checkbox>
                        </el-col>-->
                        <el-col>
                            <el-button type="primary" :loading="loading" @click="toLogin">
                                登 录
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </section>
        <section class="level2">
            <div class="lg-bg"></div>
            <div class="lg-ft">Copyright 卫健智能（深圳）有限公司</div>
        </section>
    </div>
</template>

<script>
    import md5 from "js-md5";
    import {
        queryCommonMenuList,
        queryCommonPermissionsList,
    } from "@/components/utils/commonRequest";

    export default {
        data() {
            return {
                user: "",
                pass: "",
                code: "",
                codeImg: "",
                remember: false,
                loading: false,
            };
        },
        methods: {
            isLoginFun() {
                const token = this.$localstorage.getStore("token");
                if (token) {
                    this.$router.push({ path: "/" });
                }
            },
            async toLogin() {
                if (!this.user) {
                    this.$message.error("请输入账号");
                    this.$refs.username.focus();
                    return false;
                }
                if (!this.pass) {
                    this.$message.error("请输入密码");
                    this.$refs.password.focus();
                    return false;
                }
                if (!this.code) {
                    this.$message.error("请输入4位的图片验证码");
                    this.$refs.checkcode.focus();
                    return false;
                }

                if (!this.$service.isPwd(this.pass)) {
                    this.$message.error("密码长度为6-18位");
                    return false;
                }
                this.loading = true;
                let passwdValid = /^(?![a-zA-Z]+$)(?![0-9]+$)(?![\W_]+$)[a-zA-Z0-9\W_]{6,18}$/.test(
                    this.pass,
                );

                let params = {
                    loginName: this.user,
                    passwd: md5(this.pass),
                    randomKey: "",
                    verifyCode: this.code,
                    passwdValid: passwdValid ? 1 : 0, // 1-强口令；0-弱口令
                };
                try {
                    let res = await this.$http.login.LoginRequest(params);
                    if (res.code === 0 && res.data) {
                        // 设置 token
                        await this.$store.dispatch("setToken", res.data.sessionId);
                        // 设置用户信息
                        await this.$store.dispatch("setUserInfo", res.data);
                        // 获取菜单及权限
                        await queryCommonPermissionsList();
                        await queryCommonMenuList();
                        // 跳转
                        this.$router.push("/");
                    } else {
                        this.getCodeFun();
                    }
                    this.loading = false;
                } catch (error) {
                    console.log(error);
                    this.loading = false;
                }
            },
            getCodeFun() {
                this.codeImg = `${this.baseURL}/auth/verify_code?t=${new Date().getTime()}`;
            },
        },
        activated() {
            // this.getCodeFun();
        },
        created() {
            // 是否已经登录
            // this.isLoginFun();
            this.getCodeFun();
        },
        mounted() {
            // 首次加载默认为聚焦
            // this.$refs.username.focus();
        },
    };
</script>

<style lang="less" scoped>
    @import url("./login.less");
</style>
