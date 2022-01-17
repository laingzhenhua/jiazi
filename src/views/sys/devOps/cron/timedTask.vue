<template>
    <section
        v-loading="loading"

    >
        <menu class="mhi-search clearFix">
            <el-form inline ref="searchForm" :model="searchParams" class="l">
                <el-form-item label="执行日期" prop="execDateStart">
                    <el-date-picker
                        size="small"
                        type="date"
                        v-model="searchParams.execDateStart"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="至" prop="execDateEnd">
                    <el-date-picker
                        size="small"
                        type="date"
                        v-model="searchParams.execDateEnd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="任务名称" prop="taskType">
                    <el-input
                        size="small"
                        type="text"
                        placeholder="请输入任务名称"
                        v-model="searchParams.scheduleName"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="标签" prop="taskType">
                    <el-input
                        size="small"
                        type="text"
                        placeholder="请输入标签名称"
                        v-model="searchParams.label"
                        clearable
                    ></el-input>
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
            </el-form>
        </menu>
        <page-table
            :tableData="tableData"
            :total="paginationConfig.total"
            @callbackPageSize="handleSizeChange"
            @callbackPageNo="handleCurrentChange"
        >
            <el-table-column
                label="任务名称"
                prop="scheduleName"
                min-width="220"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="任务描述"
                prop="scheduleDesc"
                min-width="220"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.scheduleDesc == null ? "—" : scope.row.scheduleDesc }}
                </template>
            </el-table-column>
            <el-table-column
                label="执行开始时间"
                prop="execStartTime"
                min-width="160"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.execStartTime == null ? "—" : scope.row.execStartTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="执行结束时间"
                prop="execEndTime"
                min-width="160"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.execEndTime == null ? "—" : scope.row.execEndTime }}
                </template>
            </el-table-column>
            <el-table-column label="执行状态" prop="execState">
                <template slot-scope="scope">{{ execState(scope.row.execState) }}</template>
            </el-table-column>
            <el-table-column label="执行日志" prop="execLogs">
                <template slot-scope="scope">
                    <el-popover placement="top" trigger="hover">
                        <div style="max-width: 800px; min-width: 300px">
                            {{ scope.row.execLogs }}
                        </div>
                        <div slot="reference" class="text-ellipsis">
                            {{ logFmt(scope.row.execLogs) }}
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="定时执行" prop="scheduleExecEnable">
                <template slot-scope="scope">
                    {{ scheduleExecEnable(scope.row.scheduleExecEnable) }}
                </template>
            </el-table-column>
            <el-table-column
                label="最后同步时间"
                prop="lastSyncDate"
                min-width="160"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.lastSyncDate == null ? "—" : scope.row.lastSyncDate }}
                </template>
            </el-table-column>
            <el-table-column label="标签" prop="labels" min-width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.labels == null ? "—" : scope.row.labels }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120" fixed="right">
                <template slot-scope="scope">
                    <div class="mhi-table-btn">
                        <el-button
                            type="text"
                            title="编辑"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            :disabled="scope.row.execState === '0'"
                            type="text"
                            title="执行"
                            @click="implement(scope.row)"
                        >执行</el-button>
                    </div>
                </template>
            </el-table-column>
        </page-table>
        <!-- 分页器 -->
        <timedTaskDoalog ref="timedTaskDoalog" :rowData="rowData"></timedTaskDoalog>
    </section>
</template>

<script>
    import timedTaskDoalog from "./timedTaskDoalog.vue";
    import pageTable from "/src/components/paginationTable/paginationTable";
    import { resolve } from "q";
    export default {
        components: { timedTaskDoalog, pageTable },
        data() {
            return {
                loading: false,
                taskTypeList: [],
                searchParams: {
                    execDateStart: new Date().dateFormat("yyyy-MM-dd"),
                    execDateEnd: new Date().dateFormat("yyyy-MM-dd"),
                    scheduleName: "",
                    label: "",
                    orderBy: "",
                    orderType: "",
                },

                paginationConfig: {
                    pageSize: 50,
                    pageNo: 1,
                    total: 0,
                },
                tableData: [],
                rowData: {},
            };
        },
        created() {},
        mounted() {
            this.getTableData();
        },
        methods: {
            logFmt(data) {
                if (data) {
                    if (data.length > 4) {
                        return data.substring(0, 5) + "...";
                    } else {
                        return data;
                    }
                } else {
                    return "—";
                }
            },
            // 结束时间应超过开始时间
            dateValidate(bd, ed) {
                if (ed == null) {
                    return true;
                }
                if (new Date(bd).getTime() > new Date(ed).getTime()) {
                    // 结束时间超过时返回 true
                    this.$mes("error", "结束日期应大于或等于开始日期");
                    return false;
                } else {
                    return true;
                }
            },
            //改变分页条数
            handleSizeChange(size) {
                this.paginationConfig.pageSize = size;
                this.getTableData();
            },
            //分页器页码改变函数
            handleCurrentChange(currentPage) {
                this.paginationConfig.pageNo = currentPage;
                this.getTableData();
            },
            // 获取表格数据
            getTableData() {
                let param = {
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                    ...this.searchParams,
                };
                this.loading = true;
                this.$http.sysDevOps.getDataList(param).then(res => {
                    this.loading = false;
                    if (res.code == 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.$mes("error", res.msg);
                    }
                });
            },
            // 查询
            handleSearch() {
                if (
                    this.dateValidate(
                        this.searchParams.execDateStart,
                        this.searchParams.execDateEnd,
                    )
                ) {
                    this.paginationConfig.pageNo = 1;
                    this.getTableData();
                }
            },
            // 点击编辑
            handleEdit(row) {
                this.rowData = row;
                this.$refs.timedTaskDoalog.dialogVisible = true;
            },
            // 执行
            implement(row) {
                this.$confirm(`确定执行该任务？`, "执行任务", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    callback: (action, instance) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            let params = {
                                lastSyncDate: row.lastSyncDate,
                                scheduleCode: row.scheduleCode,
                            };
                            this.$http.sysDevOps.execTask(params).then(res => {
                                instance.confirmButtonLoading = false;
                                if (res.code == 0) {
                                    this.getTableData();
                                    this.$message.success(res.msg);
                                } else {
                                    // this.$mes("error", res.msg);
                                }
                            });
                        } else {
                            // .....
                        }
                    },
                });
            },
        },
        computed: {
            execState(data) {
                return function(data) {
                    switch (data) {
                        case "0":
                            return "执行中";
                        case "1":
                            return "成功";
                        case "2":
                            return "失败";
                        default:
                            return "—";
                            break;
                    }
                };
            },
            scheduleExecEnable(data) {
                return function(data) {
                    switch (data) {
                        case 1:
                            return "允许";
                        case 2:
                            return "不允许";
                        default:
                            return "—";
                            break;
                    }
                };
            },
        },
    };
</script>

<style lang="less" scoped>
    .taskDetail-box .el-row {
        margin-bottom: 10px;
        span.title {
            font-weight: 700;
            font-size: 14px;
        }
    }
    .mhi-search {
        margin: 0;
    }
    .mhi-table-btn{
        .el-button{
            font-size: 14px;
            margin: 0 5px;
            letter-spacing: 0;
        }
    }
</style>
