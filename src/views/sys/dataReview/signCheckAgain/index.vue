<template>
    <div v-loading="loading" class="sign-check">
        <div class="mhi-search clearFix">
            <el-form inline>
                <el-form-item label="计划名称">
                    <el-input
                        size="small"
                        clearable
                        placeholder="请输入计划名称"
                        v-model="searchParams.taskName"
                    ></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="searchParams.taskExecDate"
                        size="small"
                        type="date"
                        placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleSearch"
                    >
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" icon="el-icon-refresh-right" @click="handleReset">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="r">
                <el-button
                    icon="el-icon-circle-plus-outline"
                    size="small"
                    type="primary"
                    @click="addTask"
                >
                    添加
                </el-button>
            </div>
        </div>
        <main>
            <page-table
                :total="paginationConfig.total"
                :tableData="tableData"
                :showMore="showMore"
                @callbackPageSize="handleSizeChange"
                @callbackPageNo="handleCurrentChange"
            >
                <el-table-column
                    show-overflow-tooltip
                    label="计划名称"
                    prop="taskName"
                    min-width="120"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="考核开始日期"
                    prop="checkBeginDate"
                    min-width="120"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="考核结束日期"
                    prop="checkEndDate"
                    min-width="120"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="开始执行时间"
                    prop="execBeginDate"
                    min-width="160"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="结束执行时间"
                    prop="execEndDate"
                    min-width="160"
                ></el-table-column>
                <el-table-column label="状态" align="center" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.execState === 10">未开始</span>
                        <span v-if="scope.row.execState === 11">初始化中</span>
                        <span v-if="scope.row.execState === 12">
                            <span v-show="scope.row.moduleCode === 'SOAP'">
                                <el-popover placement="top-start" trigger="hover">
                                    <span slot="reference">初始化完成</span>
                                </el-popover>
                            </span>
                            <span v-show="scope.row.moduleCode !== 'SOAP'">初始化完成</span>
                        </span>
                        <span v-if="scope.row.execState === 13">初始化失败</span>
                        <span v-if="scope.row.execState === 20">
                            <el-popover placement="top-start" trigger="hover">
                                <span slot="reference">执行中</span>
                            </el-popover>
                        </span>
                        <span v-if="scope.row.execState === 30">正在统计</span>
                        <span v-if="scope.row.execState === 31">执行失败</span>
                        <span v-if="scope.row.execState === 40">完成</span>
                        <span v-if="scope.row.execState === 41">统计失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="createdBy" min-width="120"></el-table-column>
                <el-table-column label="操作" align="center" width="140" fixed="right">
                    <template slot-scope="scope">
                        <div class="mhi-table-btn">
                            <el-button @click="seeTask(scope.row)" type="text" title="设置">
                                设置
                            </el-button>
                            <el-button
                                :class="scope.row.execState === 40 ? '' : 'mhi-table-disbtn'"
                                @click="seeReport(scope.row)"
                                type="text"
                                title="报告"
                            >
                                报告
                            </el-button>
                            <el-button
                                :class="
                                    scope.row.createdBy === userLoginInfo.name
                                        ? ''
                                        : 'mhi-table-disbtn'
                                "
                                @click="tryDelete(scope.row)"
                                type="text"
                                title="删除"
                            >
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </page-table>
        </main>
        <!-- 删除弹窗 -->
        <el-dialog
            width="500px"
            title="删除任务"
            :close-on-click-modal="false"
            :visible.sync="deleteVisible"
            @closed="deleteLog = ''"
        >
            <el-input
                type="textarea"
                :rows="2"
                maxlength="100"
                v-model.trim="deleteLog"
                placeholder="请填写删除原因（必填）"
                clearable
            ></el-input>
            <div slot="footer">
                <el-button size="small" type="primary" @click="deleteClick" :loading="delLoading">
                    确认
                </el-button>
                <el-button size="small" @click="deleteVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 创建弹窗 -->
        <configDialog
            ref="configDialog"
            :oprationMode="oprationMode"
            :taskId="taskId"
            @saveSuccess="handleSaveSuccess"
        />
    </div>
</template>
<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    import configDialog from "./configDialog";
    export default {
        components: {
            pageTable,
            configDialog,
        },
        props: {
            currentTab: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                loading: false,
                showMore: false,
                params: {},
                visible: false,
                searchParams: {
                    taskName: "",
                    taskExecDate: "",
                },
                //表格数据
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总页数
                    pageSize: 50, //每页容量
                    currentPage: 1, //当前页
                },
                taskId: "",
                oprationMode: "",
                // 删除弹窗
                deleteVisible: false,
                delLoading: false,
                deleteLog: "",
            };
        },
        created() {
            this.getTableData();
        },
        mounted() {},
        computed: {
            // 获取登录账号信息
            userLoginInfo() {
                return this.$store.state.user.userLoginInfo;
            },
        },
        methods: {
            //审核弹窗
            operation(row) {
                this.visible = true;
                this.params = row;
            },
            callBackCancel(val) {
                this.visible = val;
            },
            callBackConfirm(val) {
                this.visible = val;
                this.getTableData();
            },
            // 查询
            handleSearch() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
            },
            // 重置
            handleReset() {
                this.searchParams = {
                    taskName: "",
                    taskExecDate: "",
                };
                this.handleSearch();
            },
            //点击添加任务
            addTask() {
                this.oprationMode = "add";
                this.$refs.configDialog.dialogVisible = true;
            },
            //点击查看任务
            seeTask(row) {
                this.taskId = row.taskId;
                this.oprationMode = row.execState === 10 ? "edit" : "see";
                let flag = row.execState === 10 ? 2 : 1;
                let params = {
                    flag: flag,
                    taskId: row.taskId,
                };
                this.loading = true;
                this.$http.sysSignCheckAgain.excludeTaskDetail(params).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.$refs.configDialog.dialogVisible = true;
                        this.$refs.configDialog.handleData(res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            //点击查看报告
            seeReport(row) {
                if (row.execState === 40) {
                    this.$router.push({
                        path: "/sys/dataReview/signCheckAgain/clickByView",
                        query: {row: row.taskId},
                    });
                } else {
                    this.$message.error("暂无报告");
                }
            },
            //点击删除按钮
            tryDelete(row) {
                if (row.createdBy !== this.userLoginInfo.name) {
                    this.$message.error("非创建者无法删除");
                    return;
                }
                this.taskId = row.taskId;
                this.deleteVisible = true;
            },
            //点击删除任务
            deleteClick() {
                if (this.deleteLog) {
                    this.delLoading = true;
                    let param = {id: this.taskId, remark: this.deleteLog};
                    this.$http.sysSignCheckAgain.excludeTaskDelete(param).then(res => {
                        this.loading = false;
                        if (res.code === 0) {
                            this.$message.success("删除成功");
                            this.deleteVisible = false;
                            this.getTableData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    this.$message.error("删除原因不能为空");
                }
            },
            //弹窗保存成功
            handleSaveSuccess() {
                this.paginationConfig.currentPage = 1;
                this.getTableData();
            },
            handleSizeChange(size) {
                this.paginationConfig.pageSize = size;
                this.getTableData();
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.getTableData();
            },

            getTableData() {
                let params = {
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: this.paginationConfig.pageSize,
                    ...this.searchParams,
                };
                this.loading = true;
                this.$http.sysSignCheckAgain.excludeTaskList(params).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
        },
    };
</script>

<style lang="less">
    .sign-check {
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
                    //margin-right: 20px;
                }
            }
        }
        .mhi-table-btn {
            .el-button {
                font-size: 14px;
                letter-spacing: 0;
                margin: 0 4px;
            }
        }
    }
</style>
