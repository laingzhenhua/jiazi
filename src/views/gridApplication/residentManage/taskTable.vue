<template>
    <div v-loading="loading">
        <div class="mhi-search clearFix">
            <el-form inline class="l" size="small" @submit.native.prevent>
                <el-form-item label="报告名称">
                    <el-input
                        v-model="searchParam.reportName"
                        placeholder="请输入"
                        maxlength="30"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                        size="small"
                        type="date"
                        value-format="yyyy-MM-dd"
                        v-model="searchParam.startTime"
                        placeholder="开始时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        size="small"
                        type="date"
                        value-format="yyyy-MM-dd"
                        v-model="searchParam.endTime"
                        placeholder="结束时间"
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
                    <el-button size="small" icon="el-icon-refresh-right" @click="handleReset">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="r">
                <el-button size="small" type="primary" icon="el-icon-receiving" @click="handleAdd">
                    生成报告
                </el-button>
            </div>
        </div>
        <main>
            <!-- <el-table stripe size="small" :data="tableData" :height="tableHeight"> -->
            <el-table stripe size="small" :data="tableData">
                <el-table-column
                    type="index"
                    label="序号"
                    width="81"
                    align="center"
                    :index="tableIndex"
                ></el-table-column>
                <el-table-column
                    prop="reportName"
                    label="报告名称"
                    min-width="220"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="checkBeginTime"
                    label="质控开始时间"
                    min-width="180"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="checkEndTime"
                    label="质控结束时间"
                    min-width="180"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="htnTaskName"
                    label="高血压任务名称"
                    min-width="180"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="dm2TaskName"
                    label="糖尿病任务名称"
                    min-width="180"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="agedTaskName"
                    label="老年人任务名称"
                    min-width="180"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="execStateName"
                    label="状态"
                    min-width="120"
                ></el-table-column>
                <el-table-column
                    prop="createByName"
                    label="操作人"
                    min-width="120"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <div class="mhi-table-btn">
                            <el-button
                                title="查看"
                                type="text"
                                icon="el-icon-view"
                                :disabled="scope.row.execState != 21"
                                @click="handleDetail(scope.row)"
                            ></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="getTableData"
                layout="total, prev, pager, next, jumper"
                :current-page.sync="paginationConfig.pageNo"
                :page-size="paginationConfig.pageSize"
                :total="paginationConfig.total"
            ></el-pagination>
        </main>
        <taskDialog ref="taskDialog" @updateInfo="handleClose" />
    </div>
</template>

<script>
    import taskDialog from "./taskDialog";
    // import {withSearchAndPagination} from "./../../../components/utils/tableHeight.js";
    export default {
        // mixins: [withSearchAndPagination],
        components: { taskDialog },
        data() {
            return {
                loading: false,
                searchParam: {
                    reportName: "",
                    startTime: "",
                    endTime: "",
                },
                tableData: [],
                paginationConfig: {
                    pageNo: 1,
                    pageSize: 50,
                    total: 0,
                },
                stateDict: [
                    { key: "10", value: "未开始" },
                    { key: "20", value: "任务执行中" },
                    { key: "22", value: "任务执行失败" },
                    { key: "30", value: "报告完成中" },
                    { key: "31", value: "执行生成成功" },
                    { key: "32", value: "执行生成失败" },
                ],
            };
        },
        methods: {
            stateFmt(state) {
                let item = this.stateDict.find(x => x.key == state);
                return item ? item.value : "—";
            },
            tableIndex(index) {
                return (
                    (this.paginationConfig.pageNo - 1) * this.paginationConfig.pageSize + index + 1
                );
            },
            getTableData() {
                let param = {
                    ...this.searchParam,
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                };
                // this.loading = true;
                this.$http.residentManage.getList(param).then(res => {
                    if (res.code == 0) {
                        this.tableData = this.$emptyHandle(res.data.content, []);
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.tableData = [];
                        this.paginationConfig.total = 0;
                    }
                    this.loading = false;
                });
            },
            handleSearch() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
            },
            handleReset() {
                this.searchParam = {
                    name: "",
                    startDate: "",
                    endDate: "",
                };
                this.handleSearch();
            },
            handleAdd() {
                this.$refs.taskDialog.showDialog();
            },
            handleDetail(row) {
                this.$emit("listenComChange", {
                    to: "detailTable",
                    data: row,
                });
            },
            handleClose() {
                this.handleSearch();
            },
        },
        activated() {
            // this.getTableData();
        },
    };
</script>

<style></style>
