<template>
    <div v-loading="loading" class="role-main">
        <menu class="mhi-search clearFix" style="margin:0">
            <el-form class="l" inline>
                <el-form-item label="角色名称">
                    <el-input
                        size="small"
                        :clearable="true"
                        maxlength="15"
                        type="text"
                        placeholder="请输入角色名称"
                        v-model="name"
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
                <el-button icon="el-icon-circle-plus-outline" size="small" type="primary">
                    添加
                </el-button>
            </div>
        </menu>
        <main class="main-wap bgColorF">
            <el-container>
                <el-main class="main-wap-table">
                    <page-table
                        ref="roleTable"
                        :tableData="tableData"
                        @handleCurrentTable="handleCurrentTable"
                        highlightCurrentRow
                        :total="totalCount"
                        @callbackPageSize="handleSizeChange"
                        @callbackPageNo="handleCurrentChange"
                    >
                        <el-table-column
                            show-overflow-tooltip
                            label="角色名称"
                            prop="roleName"
                        ></el-table-column>
                        <el-table-column label="角色描述">
                            <template slot-scope="scope">
                                <el-popover placement="top-start" width="600" trigger="hover">
                                    <div>
                                        {{
                                            scope.row.descs === null
                                                ? "暂无相关描述"
                                                : scope.row.descs
                                        }}
                                    </div>
                                    <span slot="reference">
                                        {{
                                            scope.row.descs != null
                                                ? scope.row.descs.length >= 40
                                                    ? scope.row.descs.substr(0, 40) + "..." + ""
                                                    : scope.row.descs
                                                : ""
                                        }}
                                    </span>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column width="120" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <div class="mhi-table-i">
                                    <span @click.stop="editClick(scope.row)" title="编辑">
                                        编辑
                                    </span>
                                    <span @click.stop="deleteClick(scope.row)" title="删除">
                                        删除
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                    </page-table>
                    <!-- <el-pagination
                        background=""
                        :current-page.sync="currentPage"
                        :total="totalCount"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        @size-change="handleSizeChange"
                        layout="total,prev, pager, next, jumper"
                    ></el-pagination> -->
                </el-main>
                <div
                    class="permission-set"
                    v-loading="loading"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.2)"
                >
                    <div class="permissionSetTitle">
                        <h1 class="f-16 pl-20">
                            权限设置
                        </h1>
                        <el-button
                            size="small"
                            class="button r"
                            @click="getCheckedKeys"
                            type="primary"
                        >
                            保 存
                        </el-button>
                    </div>
                    <el-scrollbar class="tree-box" ref="treeWrap">
                        <el-tree
                            :data="treeData"
                            show-checkbox
                            default-expand-all
                            node-key="code"
                            :default-checked-keys="defaultCheckedKeys"
                            ref="tree"
                            :props="defaultProps"
                        ></el-tree>
                    </el-scrollbar>
                </div>
            </el-container>
        </main>
        <el-dialog
            v-dialogDrag
            :title="operation ? '添加角色' : '编辑角色'"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            @close="resetForm('ruleForm')"
            width="600px"
        >
            <div class="clearFix">
                <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-col :span="24">
                        <el-form-item label="角色名称：" prop="roleName" style="width: 100%">
                            <el-input
                                placeholder="请输入角色名称"
                                v-model="ruleForm.roleName"
                                maxlength="15"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色描述：" prop="descs" style="width: 100%">
                            <el-input
                                type="textarea"
                                :rows="5"
                                v-model="ruleForm.descs"
                                maxlength="255"
                                show-word-limit
                                placeholder="角色描述"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click.native="resetForm('ruleForm')" size="small">取 消</el-button>
                <el-button @click="submitForm" type="primary" :loading="saveLoading" size="small">
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
                saveLoading: false,
                name: "",
                totalCount: 0,
                pageNo: 1,
                pageSize: 50,
                currentPage: 1,
                treeData: [],
                tableData: [],
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                defaultCheckedKeys: [],
                parentOrgCode: "",
                parentOrgName: "",
                dialogFormVisible: false,
                operation: false,
                roleList: [],
                ruleForm: {
                    roleName: "",
                    descs: "",
                    roleId: "",
                },
                rules: {
                    roleName: [{required: true, message: "请输入角色名称", trigger: "blur"}],
                    descs: [{required: true, message: "请输入角色描述", trigger: "blur"}],
                },
                userId: "",
            };
        },
        created() {
            this.handleCurrentTable();
        },
        mounted() {
            this.dataList();
        },
        methods: {
            dataList(cb) {
                this.loading = true;
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    roleName: this.name,
                };
                this.$http.sysRole
                    .roleList(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.tableData = res.data.content;
                            this.totalCount = res.data.totalCount;
                            this.loading = false;
                            cb && cb();
                        } else {
                            this.loading = false;
                            // this.$message.error(res.msg);
                        }
                    })
                    .then(res => {
                        if (this.tableData.length > 0) {
                            // this.$refs.roleTable.setCurrentRow(this.tableData[0]);
                        }
                    });
            },
            query() {
                this.pageNo = 1;
                this.currentPage = 1;
                this.dataList();
            },
            empty() {
                this.name = "";
                this.query();
            },
            add() {
                this.operation = true;
                this.dialogFormVisible = true;
                this.ruleForm = {
                    roleName: "",
                    descs: "",
                };
            },
            editClick(row) {
                this.operation = false;
                this.dialogFormVisible = true;
                this.ruleForm.roleName = row.roleName;
                this.ruleForm.descs = row.descs;
                this.ruleForm.roleId = row.id;
            },
            deleteClick(row) {
                this.$http.sysRole.roleUsed({roleId: row.id}).then(res => {
                    if (res.code === 0) {
                        if (res.data.length === 0) {
                            let params = {id: row.id};
                            this.$msgbox({
                                title: "消息提示",
                                message: "确定删除该角色？",
                                showCancelButton: true,
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm") {
                                        instance.confirmButtonLoading = true;
                                        instance.confirmButtonText = "删除中...";
                                        this.$http.sysRole.roleDel(params).then(res => {
                                            if (res.code === 0) {
                                                this.dataList();
                                                instance.confirmButtonLoading = false;
                                                this.$message.success("删除成功");
                                                done();
                                            } else {
                                                done();
                                                instance.confirmButtonLoading = false;
                                                // this.$message.error(res.msg);
                                            }
                                        });
                                    } else {
                                        done();
                                    }
                                },
                            }).catch(() => {});
                        } else {
                            let num = 0;
                            let arrValue = [];
                            for (let i in res.data) {
                                num++;
                                if (num <= 2) {
                                    arrValue.push(res.data[i]);
                                }
                            }
                            this.$message.warning(`该角色被${arrValue}...等用户使用，无法删除`);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.dataList();
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.dataList();
            },
            handleCurrentTable(val) {
                console.log(val);
                if (val == null) {
                    this.treeData = [];
                    return;
                }
                this.loading = true;
                this.userId = val.id;
                let params = {
                    id: val.id,
                };
                this.$http.sysRole.rolePermissionList(params).then(res => {
                    if (res.code === 0) {
                        this.loading = false;
                        this.treeData = res.data;
                        this.defaultCheckedKeys = this.getTreeCheckIsTrueId(this.treeData);
                        this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
                    } else {
                        this.loading = false;
                        // this.$message.error(res.msg);
                    }
                });
            },
            getTreeCheckIsTrueId(data) {
                let ids = [];
                for (let i in data) {
                    if (data[i].check) {
                        ids.push(data[i].code);
                    }
                    let a = this.getTreeCheckIsTrueId(data[i].children);
                    ids.push.apply(ids, a);
                }
                return ids;
            },
            submitForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        if (this.operation === true) {
                            let params = Object.assign({}, this.ruleForm);
                            this.$http.sysRole.roleAdd(params).then(res => {
                                this.saveLoading = false;
                                if (res.code === 0) {
                                    this.dataList();
                                    this.$message.success("添加成功！");
                                    this.dialogFormVisible = false;
                                } else {
                                    // this.$message.error(res.msg);
                                }
                            });
                        } else {
                            let params = Object.assign({}, this.ruleForm);
                            this.$http.sysRole.roleEdit(params).then(res => {
                                this.saveLoading = false;
                                if (res.code === 0) {
                                    this.dataList();
                                    this.$message.success("编辑成功！");
                                    this.dialogFormVisible = false;
                                } else {
                                    // this.$message.error(res.msg);
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            getCheckedKeys() {
                this.$msgbox({
                    title: "消息提示",
                    message: "确定设置该权限吗？",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "设置中...";
                            let params = {
                                permissions: this.$refs.tree.getCheckedKeys(true),
                                roleId: this.userId,
                            };
                            this.$http.sysRole.roleEditPermission(params).then(res => {
                                if (res.code === 0) {
                                    instance.confirmButtonLoading = false;
                                    this.$message.success("权限设置成功！");
                                    this.upDatePer();
                                    done();
                                } else {
                                    done();
                                    instance.confirmButtonLoading = false;
                                    // this.$message.error(res.msg);
                                }
                            });
                        } else {
                            done();
                        }
                    },
                }).catch(() => {});
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false;
            },
            upDatePer() {
                setTimeout(() => {
                    this.$http.sysRole.permissions().then(res => {
                        if (res.code === 0) {
                            // this.$store.dispatch("setPermissions", res.data);
                        } else {
                            // this.$message.error(res.msg);
                        }
                    });
                }, 1000);
            },
        },
    };
</script>
<style scoped lang="less">
    .role-main {
        .mhi-search {
            display: flex;
            margin: 0;
            .r {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                button {
                    height: 33px;
                    margin-top: 5px;
                }
            }
        }
    }
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-container {
        width: 100%;
        overflow: auto;
        /deep/ .el-main {
            padding: 0;
        }
    }
    .permission-set {
        border: 1px solid #d8dee2ff;
        margin-left: 20px;
        position: relative;
        min-width: 360px;
        margin-top: 16px;
        .tree-box {
            border: 0;
            position: absolute;
            top: 61px;
            left: 0;
            right: 0;
            bottom: 0;
            height: auto;
            /deep/ .el-tree-node__content > .el-checkbox {
                margin-right: 8px;
            }
        }
    }
    .permissionSetTitle {
        display: flex;
        line-height: 60px;
        height: 60px;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #d8dee2ff;
        .button {
            height: 33px;
            margin-top: 13px;
            margin-right: 20px;
            width: 72px;
            justify-content: flex-end;
        }
    }
    .permission-set h1 {
        font-size: 16px;
        margin: 0;
        text-align: center;
        flex: 1;
        padding-left: 90px;
    }
    .mhi-table-i {
        font-size: 14px;
        letter-spacing: 0;
        span {
            margin: 0 7px;
        }
    }
    @media (max-width: 1600px) {
        .permission-set {
            margin-top: 8px;
        }
    }
</style>
<style lang="less">
    .role-main {
        .el-dialog__body {
            padding: 10px 20px;
        }
        .el-form--inline .el-form-item {
            > .el-form-item__content {
                width: 70%;
            }
        }
        .el-dialog__footer {
            padding: 10px 20px;
        }
    }
</style>
