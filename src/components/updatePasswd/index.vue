<template>
    <el-dialog
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        @close="cancelForm"
        title="修改密码"
        width="600px"
    >
        <el-form :model="modify" :rules="rules" ref="modify" label-width="120px">
            <el-form-item label="旧密码" prop="oldPwd">
                <el-input
                    type="password"
                    v-model="modify.oldPwd"
                    size="small"
                ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input
                    type="password"
                    v-model="modify.newPwd"
                    show-password
                    size="small"
                ></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirm">
                <el-input
                    type="password"
                    v-model="modify.confirm"
                    show-password
                    size="small"
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
      <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>
</template>

<script>
    import md5 from "js-md5";
    import {midifyPassword, clearCache} from "@/components/utils/commonRequest";
    // import interval from "utils/interval.js";

    export default {
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value != this.modify.newPwd) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                loading: false,
                modify: {
                    oldPwd: "",
                    newPwd: "",
                    confirm: "",
                },
                rules: {
                    oldPwd: [
                        {required: true, message: "请输入旧的密码", trigger: "blur"},
                        {
                            pattern: /^[a-zA-Z0-9\W_]{6,18}$/,
                            message: "请输入6-18位的旧密码",
                            trigger: "blur",
                        },
                    ],
                    newPwd: [
                        {required: true, message: "请输入新的密码", trigger: "blur"},
                        {
                            pattern: /^(?![a-zA-Z]+$)(?![0-9]+$)(?![\W_]+$)[a-zA-Z0-9\W_]{6,18}$/,
                            message: "请使用字母、数字和符号两种及以上的组合（6-18个字符）",
                            trigger: "blur",
                        },
                    ],
                    confirm: [
                        {required: true, message: "请再次输入新的密码", trigger: "blur"},
                        {validator: validatePass, trigger: "change"},
                    ],
                },
            };
        },
        methods: {
            submitForm() {
                this.$refs.modify.validate(async (valid) => {
                    if (valid) {
                        this.loading = true;
                        let data = {
                            // id: '',
                            passwd: md5(this.modify.oldPwd),
                            newPasswd: md5(this.modify.newPwd),
                            passwdValid: 1, // 通过验证的强口令：1
                        };
                        await midifyPassword(data)
                            .then(async (res) => {
                                if (res.code === 0) {
                                    this.dialogVisible = false;
                                    await clearCache();
                                    window.location.href = "./index.html";
                                }
                                this.loading = false;
                            });
                        /*this.$api.login.modifyPass(data).then((res) => {
                            if (res.code == 0) {
                                this.$api.login.logout().then((res) => {
                                    if (res.code === 0) {
                                        this.$mes("success", "修改密码成功，稍后请重新登录");
                                        interval.clearTimeoutInterval();
                                        this.dialogVisible = false;
                                        setTimeout(() => {
                                            this.$sessionStorage.clear();
                                            this.$store.commit("setAllMenuTree", [])
                                            this.$router.push("/login");
                                        }, 1000);
                                    } else {
                                        this.$mes('error', res.msg);
                                    }
                                });
                            } else {
                                this.$mes("error", res.msg);
                            }
                            this.loading = false;
                        });*/
                    }
                });
            },
            cancelForm() {
                this.$refs.modify.resetFields();
            }
        },
    };
</script>

<style>
</style>