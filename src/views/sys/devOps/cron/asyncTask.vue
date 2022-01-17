<template>
    <section
        v-loading="loading"

    >
        <menu class="mhi-search clearFix">
            <el-form inline ref="searchForm" :model="searchParams" class="l">
                <el-form-item label="创建日期" prop="startDate">
                    <el-date-picker
                        size="small"
                        type="date"
                        v-model="searchParams.startDate"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="至" prop="endDate">
                    <el-date-picker
                        size="small"
                        type="date"
                        v-model="searchParams.endDate"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="taskState">
                    <el-select
                        size="small"
                        v-model="searchParams.taskState"
                        placeholder="请选择状态"
                        clearable
                        filterable
                    >
                        <el-option value="1" label="未开始"></el-option>
                        <el-option value="2" label="进行中"></el-option>
                        <el-option value="8" label="成功"></el-option>
                        <el-option value="9" label="失败"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型" prop="taskType">
                    <el-select
                        size="small"
                        v-model="searchParams.taskType"
                        placeholder="请选择任务类型"
                        clearable
                        filterable
                    >
                        <el-option value="" label="全部"></el-option>
                        <el-option
                            :value="item.key"
                            :label="item.value"
                            v-for="item in taskTypeList"
                            :key="item.key"
                        ></el-option>
                    </el-select>
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
        >
            <el-table-column
                label="任务类型"
                prop="taskTypeName"
                min-width="150"
                show-overflow-tooltip
            >
                <!-- <template slot-scope="scope">{{ taskType(scope.row.taskType) }}</template> -->
            </el-table-column>
            <el-table-column label="状态" prop="taskState" min-width="80">
                <template slot-scope="scope">{{ taskState(scope.row.taskState) }}</template>
            </el-table-column>
            <el-table-column
                label="任务信息"
                prop="taskInfo"
                min-width="220"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="任务描述"
                prop="taskDesc"
                min-width="220"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="创建时间"
                prop="createTime"
                min-width="166"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="执行开始时间"
                prop="execStartTime"
                min-width="166"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.execStartTime == null ? "—" : scope.row.execStartTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="执行结束时间"
                prop="execEndTime"
                min-width="166"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.execEndTime == null ? "—" : scope.row.execEndTime }}
                </template>
            </el-table-column>
            <el-table-column label="日志" prop="logs" min-width="140">
                <template slot-scope="scope">
                    <el-popover placement="left" trigger="click">
                        <div style="max-width: 400px; max-height: 400px; overflow: auto">
                            {{ scope.row.logs }}
                        </div>
                        <div slot="reference">{{ logFmt(scope.row.logs) }}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" fixed="right">
                <template slot-scope="scope">
                    <div class="mhi-table-btn">
                        <el-button
                            icon="el-icon-view"
                            type="text"
                            title="查看"
                            @click="handleView(scope.row)"
                        ></el-button>
                    </div>
                </template>
            </el-table-column>
        </page-table>
        <!-- 分页器 -->
        <el-pagination
            background=""
            @current-change="getTableData"
            layout="total, prev, pager, next, jumper"
            :current-page.sync="paginationConfig.pageNo"
            :page-size="paginationConfig.pageSize"
            :total="paginationConfig.total"
        ></el-pagination>
        <el-dialog
            v-dialogDrag
            class="taskDetail-box"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            title="任务详情"
            width="800px"
        >
            <el-row>
                <el-col :span="12">
                    <span class="title">任务类型：</span>
                    <!-- <span>{{taskType(dialogData.taskType)}}</span> -->
                    <span>{{ dialogData.taskTypeName }}</span>
                </el-col>
                <el-col :span="12">
                    <span class="title">任务状态：</span>
                    <span>{{ taskState(dialogData.taskState) }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">任务信息：</span>
                    <span :title="dialogData.taskInfo">
                        {{
                            dialogData.taskInfo.length > 30
                                ? dialogData.taskInfo.substring(0, 30) + "..."
                                : dialogData.taskInfo
                        }}
                    </span>
                </el-col>
                <el-col :span="12">
                    <span class="title">任务描述：</span>
                    <span :title="dialogData.taskDesc">
                        {{
                            dialogData.taskDesc.length > 30
                                ? dialogData.taskDesc.substring(0, 30) + "..."
                                : dialogData.taskDesc
                        }}
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">执行开始时间:</span>
                    <span>
                        {{ dialogData.execStartTime == null ? "—" : dialogData.execStartTime }}
                    </span>
                </el-col>
                <el-col :span="12">
                    <span class="title">执行结束时间：</span>
                    <span>{{ dialogData.execEndTime == null ? "—" : dialogData.execEndTime }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">创建时间:</span>
                    <span>{{ dialogData.createTime == null ? "—" : dialogData.createTime }}</span>
                </el-col>
                <el-col :span="12">
                    <span class="title">更新时间：</span>
                    <span>{{ dialogData.updateTime == null ? "—" : dialogData.updateTime }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">业务id:</span>
                    <span>{{ dialogData.serviceId }}</span>
                </el-col>
                <el-col :span="12">
                    <span class="title">业务时间:</span>
                    <span>{{ dialogData.serviceTime == null ? "—" : dialogData.serviceTime }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span class="title">执行方式:</span>
                    <span>{{ dialogData.execType == 1 ? "串行" : "异步执行" }}</span>
                </el-col>
                <el-col :span="12">
                    <span class="title">短信告警:</span>
                    <span>{{ dialogData.smsAlarm == 0 ? "否" : "是" }}</span>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleReset">重 置</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            v-dialogDrag
            class="taskDetail-box"
            :close-on-click-modal="false"
            :visible.sync="sureDialogVisible"
            title="提示"
            width="400px"
        >
            <el-row>
                <div style="margin-bottom: 10px">
                    业务id：
                    <span
                        @click="handleClickSpanDom($event)"
                        style="color: red; padding: 2px; background: #e4e7ed; border-radius: 6px"
                        title="点击复制"
                    >
                        {{ dialogData.serviceId }}
                    </span>
                </div>
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="0px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="" prop="serviceId">
                        <el-input v-model="ruleForm.serviceId" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureReset" :loading="btnLoading">确 认</el-button>
                <el-button @click="cancelReset">取 消</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: { pageTable },
        data() {
            return {
                loading: false,
                btnLoading: false,
                taskTypeList: [],
                searchParams: {
                    startDate: new Date().dateFormat("yyyy-MM-dd"),
                    endDate: new Date().dateFormat("yyyy-MM-dd"),
                    taskState: "9",
                    taskType: "",
                },

                paginationConfig: {
                    pageSize: 50,
                    pageNo: 1,
                    total: 0,
                },
                tableData: [],
                dialogVisible: false,
                dialogData: {
                    taskType: "",
                    taskTypeName: "",
                    taskState: "",
                    taskInfo: "",
                    taskDesc: "",
                    createTime: "",
                    execStartTime: "",
                    execEndTime: "",
                    updateTime: "",
                    serviceId: "",
                    serviceTime: "",
                    smsAlarm: "",
                    serviceId: "",
                    logs: "",
                },
                sureDialogVisible: false,
                ruleForm: {
                    serviceId: "",
                },
                rules: {
                    serviceId: [{ required: true, message: "请输入业务id", trigger: "change" }],
                },
            };
        },
        created() {
            this.getTaskTypeList();
        },
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
            getTaskTypeList() {
                this.$http.sysDevOps.getAsyncTaskType({}).then(res => {
                    if (res.code == 0) {
                        this.taskTypeList = res.data;
                    } else {
                        this.$mes("error", res.msg);
                    }
                });
            },
            // 获取表格数据
            getTableData() {
                let param = {
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                    ...this.searchParams,
                };
                this.loading = true;
                this.$http.sysDevOps.getAsyncTaskList(param).then(res => {
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
                if (this.dateValidate(this.searchParams.startDate, this.searchParams.endDate)) {
                    this.paginationConfig.pageNo = 1;
                    this.getTableData();
                }
            },
            // 点击查看
            handleView(row) {
                this.dialogVisible = true;
                this.dialogData = { ...row };
            },
            // 点击重置
            handleReset() {
                this.sureDialogVisible = true;
                this.ruleForm.serviceId = "";
            },
            handleClickSpanDom(e) {
                this.ruleForm.serviceId = e.target.innerText;
            },
            //点击确认
            sureReset() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        if (this.dialogData.serviceId === this.ruleForm.serviceId) {
                            this.btnLoading = true;
                            let params = { id: this.dialogData.id };
                            this.$http.sysDevOps
                                .resetAsyncTask(params)
                                .then(res => {
                                    this.btnLoading = false;
                                    if (res.code == 0) {
                                        this.$message.success("重置成功!");
                                        this.sureDialogVisible = false;
                                        this.dialogVisible = false;
                                        this.getTableData();
                                    } else {
                                        this.$mes("error", res.msg);
                                    }
                                })
                                .catch(res => {
                                    this.btnLoading = false;
                                });
                        } else {
                            this.$message.error("输入的业务id不对");
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 点击取消
            cancelReset() {
                this.$refs["ruleForm"].resetFields();
                this.sureDialogVisible = false;
            },
        },
        computed: {
            taskState(data) {
                return function (data) {
                    switch (data) {
                        case 1:
                            return "未开始";
                            break;
                        case 2:
                            return "进行中";
                            break;
                        case 8:
                            return "成功";
                            break;
                        case 9:
                            return "失败";
                            break;
                        default:
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
</style>

