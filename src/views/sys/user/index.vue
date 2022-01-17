<template>
    <div v-loading="loading" class="user-main" style="height: 100%">
        <menu class="mhi-search clearFix">
            <el-form class="l" inline>
                <el-form-item label="用户姓名">
                    <el-input
                        size="small"
                        :clearable="true"
                        @keyup.enter="query"
                        type="text"
                        placeholder="请输入用户姓名"
                        v-model="userName"
                    ></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="query" size="small" type="primary" icon="el-icon-search">
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="empty" size="small" icon="el-icon-refresh-right">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="r" @click="add">
                <el-button
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    class="add-btn"
                    type="primary"
                >
                    添加
                </el-button>
            </div>
        </menu>
        <div class="clearFix" style="position: relative;display: flex">
            <el-scrollbar class="tree-box mr-20" ref="curTreeBox" :style="treeBoxStyle">
                <el-tree
                    node-key="orgCode"
                    :data="treeData"
                    :props="defaultProps"
                    :default-expanded-keys="expandedOrg"
                    @node-click="handleNodeClick"
                >
                    <span slot-scope="{node}">
                        <span :title="node.label">{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
            <section class="table-box" :style="tableBoxStyle" style="">
                <page-table
                    :tableData="tableData"
                    :total="totalCount"
                    @callbackPageSize="handleSizeChange"
                    @callbackPageNo="handleCurrentChange"
                >
                    <el-table-column
                        show-overflow-tooltip
                        prop="userName"
                        label="用户姓名"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="loginName"
                        label="登录账号"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="orgName"
                        label="机构名称"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="userRole"
                        label="用户角色"
                    ></el-table-column>
                    <el-table-column label="状态" width="160" align="center">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.state"
                                :width="34"
                                :active-value="1"
                                :inactive-value="2"
                                @change="changeStatus(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="160"
                        fixed="right"
                        header-align="center"
                        align="right"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <div class="mhi-table-i">
                                <span
                                    v-if="scope.row.lockState > 0"
                                    @click="unlockClick(scope.row)"
                                    title="解锁"
                                >
                                    解锁
                                </span>
                                <span @click="editClick(scope.row)" title="编辑">编辑</span>
                                <span @click="deleteClick(scope.row.id)" title="删除">删除</span>
                                <span @click="restPwdClick(scope.row)" title="重置用户密码">
                                    重置
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </page-table>
            </section>
        </div>
        <el-dialog
            v-dialogDrag
            :title="operation ? '添加系统用户' : '编辑系统用户'"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            @close="resetForm('ruleForm')"
            width="550px"
        >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                size="small"
                label-width="120px"
                class="sys-user-form"
            >
                <el-form-item label="所属机构：" prop="orgName">
                    <el-input v-model="ruleForm.orgName" placeholder="请输入所属机构" disabled>
                        {{ orgName }}
                    </el-input>
                </el-form-item>
                <el-form-item label="登录账号：" prop="loginName">
                    <el-input
                        v-model="ruleForm.loginName"
                        maxlength="15"
                        :disabled="operation == false"
                        placeholder="请输入登录账号"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户姓名：" prop="userName">
                    <el-input
                        v-model="ruleForm.userName"
                        maxlength="15"
                        placeholder="请输入用户姓名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="phone">
                    <el-input
                        v-model="ruleForm.phone"
                        maxlength="15"
                        placeholder="请输入联系电话"
                    ></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idcard">
                    <el-input
                        v-model="ruleForm.idcard"
                        maxlength="30"
                        placeholder="请输入身份证号"
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户角色：">
                    <el-select v-model="roleIds" placeholder="请选择用户角色">
                        <el-option
                            v-for="item in roleList"
                            :value="item.id"
                            :key="item.id"
                            :label="item.roleName"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="resetForm('ruleForm')" size="small">取 消</el-button>
                <el-button @click="submitForm" :loading="btnloading" type="primary" size="small">
                    保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: {pageTable},
        data() {
            return {
                loading: false,
                btnloading: false,
                userName: "",
                pageNo: 1, //下一页
                totalCount: 0, //总条数
                pageSize: 50, //每页数据form
                currentPage: 1, //初始化第一页
                operation: false,
                treeData: [],
                tableData: [],
                defaultProps: {
                    children: "children",
                    label: "orgName",
                },
                expandedOrg: [],
                orgCode: "",
                orgName: "",
                dialogFormVisible: false,
                roleList: [],
                tableHeight: 0,
                ruleForm: {
                    orgName: "",
                    orgCode: this.orgCode,
                    loginName: "",
                    userName: "",
                    phone: "",
                    idcard: "",
                },
                roleIds: "",
                valueId: "",
                rules: {
                    orgName: [{required: true, message: "请输入所属机构", trigger: "blur"}],
                    loginName: [{required: true, message: "请输入登录账号", trigger: "blur"}],
                    userName: [{required: true, message: "请输入用户姓名", trigger: "blur"}],
                    idcard: [
                        {
                            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
                            message: "请输入正确的证件号",
                            trigger: "change",
                        },
                    ],
                    phone: [
                        {max: 11, message: "最多11位", trigger: "blur"},
                        {
                            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                            message: "请输入正确的手机号码",
                            trigger: "change",
                        },
                    ],
                },
                treeBoxStyle: {},
                tableBoxStyle: {},
            };
        },
        computed: {
            // isOperate() {
            //     const perms = this.$store.state.user.perms;
            //     return (
            //         perms.includes("per_01_01_03_03") ||
            //         perms.includes("per_01_01_03_04") ||
            //         perms.includes("per_01_01_03_06") ||
            //         perms.includes("per_01_01_03_07")
            //     );
            // },
        },
        created() {
            this.orgTree();
            this.dataList();
            this.roleSelect();
        },
        mounted() {
            this.$nextTick(() => {
                let mhiZoneDom = document.querySelector(".user-main");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 260 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            });
            window.addEventListener("resize", this.resizeLogic1, false);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resizeLogic1); //解绑resize事件
        },
        methods: {
            resizeLogic1() {
                let mhiZoneDom = document.querySelector(".user-main");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 300 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            },
            orgTree() {
                this.$http.sysDept.orgTree({by: 2}).then(res => {
                    // console.log(res);
                    if (res.code === 0) {
                        this.treeData = res.data;
                        this.expandedOrg = [res.data[0].orgCode];
                    } else {
                        // this.$message.error(res.msg);
                    }
                });
            },
            dataList(cb) {
                this.loading = true;
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    orgCode: this.orgCode,
                    userName: this.userName,
                };
                this.$http.sysUser.userList(params).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.totalCount = res.data.totalCount;
                        this.loading = false;
                        cb && cb();
                    } else {
                        this.loading = false;
                        this.$message.error(res.msg);
                    }
                });
            },
            query() {
                this.pageNo = 1;
                this.currentPage = 1;
                this.orgCode = "";
                this.dataList();
            },
            empty() {
                this.userName = "";
                this.query();
            },
            add() {
                if (this.orgCode == "") {
                    this.$message.error("请先选择所属机构");
                } else {
                    this.dialogFormVisible = true;
                    this.$nextTick(() => {
                        this.$refs["ruleForm"].resetFields();
                    });
                }
                this.ruleForm = {
                    loginName: "",
                    userName: "",
                    phone: "",
                    idcard: "",
                };
                this.roleIds = "";
                this.operation = true;
                this.ruleForm.orgName = this.orgName;
                this.ruleForm.orgCode = this.orgCode;
            },
            handleNodeClick(data) {
                this.userName = "";
                this.pageNo = 1;
                this.currentPage = 1;
                this.orgCode = data.orgCode;
                this.orgName = data.orgName;
                this.dataList();
            },
            changeStatus(row) {
                let params = {
                    id: row.id,
                    state: row.state,
                };
                this.$http.sysUser.userUpdateState(params).then(res => {
                    if (res.code === 0) {
                        this.$message.success(row.state == 1 ? "已启用" : "已禁用");
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            unlockClick(row) {
                let params = {
                    id: row.id,
                    lockState: row.lockState ? 0 : 1,
                };
                this.$http.sysUser.userUnlock(params).then(res => {
                    if (res.code === 0) {
                        this.$message.success(row.lockState == 1 ? "已解锁" : "已锁定");
                        row.lockState = 0;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            editClick(row) {
                let params = {
                    userId: row.id,
                };
                this.$http.sysRole.roleListBy(params).then(res => {
                    if (res.code === 0) {
                        [this.roleIds] = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
                this.valueId = row.id;
                this.ruleForm.orgName = row.orgName;
                this.ruleForm.orgCode = row.orgCode;
                this.ruleForm.loginName = row.loginName;
                this.ruleForm.userName = row.userName;
                this.ruleForm.phone = row.phone;
                this.ruleForm.idcard = row.idcard;
                this.operation = false;
                this.dialogFormVisible = true;
            },
            deleteClick(id) {
                let params = {
                    id: id,
                    state: 3,
                };
                this.$msgbox({
                    title: "消息提示",
                    message: "确定删除该用户？",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "删除中...";
                            this.$http.sysUser.userUpdateState(params).then(res => {
                                if (res.code === 0) {
                                    instance.confirmButtonLoading = false;
                                    this.$message.success("删除成功");
                                    done();
                                    this.dataList();
                                } else {
                                    done();
                                    instance.confirmButtonLoading = false;
                                    this.$message.error(res.msg);
                                }
                            });
                        } else {
                            done();
                        }
                    },
                }).catch(() => {});
            },
            restPwdClick(row) {
                let params = {
                    id: row.id,
                };
                this.$msgbox({
                    title: "消息提示",
                    message: "确认重置密码？",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "重置中...";
                            this.$http.sysUser.userRestPwd(params).then(res => {
                                if (res.code === 0) {
                                    instance.confirmButtonLoading = false;
                                    this.$message.success("重置密码成功");
                                    done();
                                } else {
                                    done();
                                    instance.confirmButtonLoading = false;
                                    this.$message.error(res.msg);
                                }
                            });
                        } else {
                            done();
                        }
                    },
                }).catch(() => {});
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.dataList();
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.dataList();
            },
            roleSelect() {
                let params = {
                    pageNo: 1,
                    pageSize: 100,
                };
                this.$http.sysRole.roleList(params).then(res => {
                    if (res.code === 0) {
                        this.roleList = res.data.content;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            submitForm() {
                let roleIds = [];
                roleIds.push(this.roleIds);
                this.$refs.ruleForm.validate(valid => {
                    console.log(valid);
                    if (valid) {
                        this.btnLoading = true;
                        if (this.operation === true) {
                            let params = Object.assign({roleIds: roleIds}, this.ruleForm);
                            this.$http.sysUser
                                .userAdd(params)
                                .then(res => {
                                    if (res.code === 0) {
                                        this.$message.success("添加成功！");
                                        this.dataList();
                                        // this.orgCode = '';
                                        this.dialogFormVisible = false;
                                    } else {
                                        this.$message.error(res.msg);
                                    }
                                })
                                .finally(() => {
                                    this.btnloading = false;
                                });
                        } else {
                            let params = Object.assign(
                                {roleIds: roleIds, id: this.valueId},
                                this.ruleForm,
                            );
                            this.$http.sysUser
                                .userEdit(params)
                                .then(res => {
                                    if (res.code === 0) {
                                        this.$message.success("保存成功！");
                                        this.dataList();
                                        this.orgCode = "";
                                        this.dialogFormVisible = false;
                                    } else {
                                        this.$message.error(res.msg);
                                    }
                                })
                                .finally(() => {
                                    this.btnloading = false;
                                });
                        }
                    } else {
                        this.btnLoading = false;
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false;
            },
        },
    };
</script>

<style lang="less" scoped>
    .user-main {
        .mhi-search {
            display: flex;
            margin: 0;
            .r {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                //margin-right: 20px;
                button {
                    height: 33px;
                    margin-top: 5px;
                }
            }
        }
    }
    .table-box{
        flex: 1;
        justify-content: flex-end;
        //width: 100px !important;
        padding-left: 20px;
    }
    .tree-box {

        width: 240px;
        margin: 16px 0 0 0;
        border: 1px solid #d8dee2ff;
    }
    .sys-user-form {
        .el-input,
        .el-select {
            width: 80%;
        }
    }
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .mhi-table-i {
        font-size: 14px;
        letter-spacing: 0;
        span {
            margin: 0 8px;
        }
    }
    @media (max-width: 1600px) {
        .tree-box {
            margin-top: 8px;
        }
    }
</style>
