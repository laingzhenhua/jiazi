<template>
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :title="taskDate"
        @close="handleClose"
        width="1100px"
    >
        <el-table size="small" :data="tableData">
            <el-table-column label="子任务类型" prop="taskType">
                <template slot-scope="scope">{{ dataFmt(scope.row.taskType, typeDict) }}</template>
            </el-table-column>
            <el-table-column
                label="子任务描述"
                prop="taskDesc"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="子任务状态" prop="taskState" width="100">
                <template slot-scope="scope">
                    {{ dataFmt(scope.row.taskState, stateDict) }}
                </template>
            </el-table-column>
            <el-table-column
                label="业务时间"
                prop="serviceTime"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="创建时间"
                prop="createTime"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="更新时间"
                prop="updateTime"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <div class="mhi-table-btn">
                        <el-button
                            icon="el-icon-refresh"
                            type="text"
                            title="重置"
                            @click="handleReset(scope.row)"
                            :disabled="scope.row.taskState != 8 && scope.row.taskState != 9"
                        ></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
    export default {
        props: ["taskId"],
        data() {
            return {
                dialogVisible: false,
                taskDate: "",
                tableData: [],
                typeDict: [
                    { key: 9, value: "督导任务抽样" },
                    { key: 20, value: "常态化任务结果检测" },
                    { key: 100, value: "绩效任务当量所属家医团队更新" },
                    { key: 101, value: "绩效任务当量得分更新" },
                    { key: 109, value: "绩效任务当量统计" },
                ],
                stateDict: [
                    { key: 1, value: "未开始" },
                    { key: 2, value: "执行中" },
                    { key: 8, value: "成功" },
                    { key: 9, value: "失败" },
                ],
            };
        },
        watch: {
            taskId(nv) {
                if (nv) {
                    this.getTableData();
                } else {
                    this.tableData = [];
                }
            },
        },
        methods: {
            // 表格字段格式化
            dataFmt(val, dict) {
                for (const item of dict) {
                    if (item.key == val) {
                        return item.value;
                    }
                }
                return val;
            },
            // 获取表格数据
            getTableData() {
                let param = { serviceId: this.taskId };
                this.$http.sysDevOps
                    .getAsyncTask(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.tableData = this.$emptyHandle(res.data, []);
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(err => {});
            },
            // 点击重置
            handleReset(row) {
                this.$confirm("是否确认重置", "重置", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let params = { id: row.id };
                        this.$http.sysDevOps
                            .resetAsyncTask(params)
                            .then(res => {
                                if (res.code == 0) {
                                    this.getTableData();
                                    this.$message.success("重置成功!");
                                } else {
                                    this.$mes("error", res.msg);
                                }
                            })
                            .catch(res => {});
                    })
                    .catch(() => {
                        this.$mes("info", "已取消重置");
                    });
            },
            // 关闭列表
            handleClose() {
                this.$emit("listenClose");
            },
        },
    };
</script>

<style>
</style>
