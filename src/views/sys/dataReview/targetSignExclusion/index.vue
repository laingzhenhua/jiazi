<template>
    <div v-loading="loading">
        <div class="mhi-search clearFix">
            <el-form inline>
                <el-form-item label="机构名称">
                    <el-select
                        v-model="searchParams.orgCode"
                        size="small"
                        @change="teamListByOrg()"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="i in orgList"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="家医团队">
                    <el-select v-model="searchParams.teamId" size="small" clearable filterable>
                        <el-option
                            v-for="i in teamList"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排除日期">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="searchParams.excludeStartDate"
                        size="small"
                        type="date"
                        placeholder="选择开始日期"
                        style="width: 140px"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="至">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="searchParams.excludeEndDate"
                        size="small"
                        type="date"
                        placeholder="选择结束日期"
                        style="width: 140px"
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
                <el-form-item>
                    <div class="mhi-search-a">
                        <a @click="showMore = !showMore">更多搜索</a>
                        <i class="el-icon-caret-top" v-show="showMore"></i>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <transition>
            <div>
                <div class="mhi-search-more" v-show="showMore">
                    <el-form inline>
                        <el-form-item label="姓名">
                            <el-input
                                placeholder="请输入姓名"
                                v-model="searchParams.name"
                                size="small"
                                clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchParams.state" size="small" clearable>
                                <el-option
                                    v-for="i in stateList"
                                    :key="i.key"
                                    :value="i.key"
                                    :label="i.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </transition>
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
                    label="机构名称"
                    prop="orgName"
                    width="180"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="团队名称"
                    prop="teamName"
                    width="140"
                ></el-table-column>
                <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>
                <el-table-column label="性别" prop="sex" min-width="80"></el-table-column>
                <el-table-column label="年龄" prop="age" min-width="80"></el-table-column>
                <el-table-column
                    label="人群分类"
                    prop="crowdType"
                    min-width="100"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="户籍类型"
                    prop="residentType"
                    width="120"
                >
                    <template slot-scope="scope">
                        <span v-show="scope.row.residentType == 0">非户籍</span>
                        <span v-show="scope.row.residentType == 1">户籍</span>
                    </template>
                </el-table-column>
                <el-table-column label="电话号码" prop="tel" min-width="140"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="详细地址"
                    prop="address"
                    width="260"
                ></el-table-column>
                <el-table-column label="排除原因" prop="excludeReason" min-width="120">
                    <!-- <template slot-scope="scope">{{mgntState(scope.row.mgntState)}}</template> -->
                    <!--                    <template slot-scope="scope">{{scope.row.remark == null ? '—':scope.row.remark}}</template>-->
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="排除备注"
                    prop="excludeRemarks"
                    min-width="140"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="操作人"
                    prop="operator"
                    min-width="140"
                ></el-table-column>
                <el-table-column label="排除时间" prop="excludeTime" min-width="160">
                    <template slot-scope="scope">
                        {{ scope.row.excludeTime === null ? "—" : scope.row.excludeTime }}
                    </template>
                </el-table-column>
                <el-table-column label="社康审核" prop="communityState" min-width="140">
                    <!--                    <template slot-scope="scope">{{scope.row.excludeTime == null ? '—':scope.row.excludeTime}}</template>-->
                </el-table-column>
                <el-table-column label="区域社康审核" prop="areaState" min-width="160">
                    <!--                    <template slot-scope="scope">{{scope.row.excludeTime == null ? '—':scope.row.excludeTime}}</template>-->
                </el-table-column>
                <el-table-column label="医院审核" prop="hospitalState" min-width="140">
                    <!--                    <template slot-scope="scope">{{scope.row.excludeTime == null ? '—':scope.row.excludeTime}}</template>-->
                </el-table-column>
                <el-table-column label="操作" min-width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="operation(scope.row)"
                            v-if="scope.row.canExam !== false"
                        >
                            审核
                        </el-link>
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="recall(scope.row)"
                            v-if="scope.row.canRecall !== false"
                        >
                            撤回
                        </el-link>
                    </template>
                </el-table-column>
            </page-table>
        </main>
        <!-- 编辑弹窗 -->
        <signDialog
            ref="signDialog"
            :params="params"
            :visible="visible"
            @callBackCancel="callBackCancel"
            @callBackConfirm="callBackConfirm"
        ></signDialog>
    </div>
</template>
<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    import signDialog from "./components/signDialog/index.vue";
    import {personRecallCheckState} from "../../../../httpRequset/module/sysTargetSignExclusion";
    function DateToStr(date) {
        var year = date.getFullYear(); //年
        var month = date.getMonth(); //月
        var day = date.getDate(); //日
        return (
            year +
            "-" +
            (month + 1 > 9 ? month + 1 : "0" + (month + 1)) +
            "-" +
            (day > 9 ? day : "0" + day)
        );
    }
    export default {
        components: {
            pageTable,
            signDialog,
        },
        data() {
            return {
                loading: false,
                showMore: false,
                params: {},
                visible: false,
                searchParams: {
                    name: "",
                    state: 0,
                    teamId: "",
                    orgCode: undefined,
                    excludeStartDate: DateToStr(new Date(2021, 0, 1)),
                    excludeEndDate: DateToStr(new Date()),
                },
                //表格数据
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总页数
                    pageSize: 50, //每页容量
                    currentPage: 1, //当前页
                },
                orgList: [],
                teamList: [],
                stateList: [
                    {
                        key: 0,
                        value: "待审核",
                    },
                    {
                        key: 1,
                        value: "已审核",
                    },
                    {
                        key: 2,
                        value: "已驳回",
                    },
                ],
            };
        },
        created() {
            this.getTableData();
            this.getOrgList();
        },
        mounted() {},
        computed: {
            mgntState: function(data) {
                return function(data) {
                    // 10-未接电话 11-失访 12-不在管辖区 13-非重点人群 14-不愿意纳入管理 98-死亡 99-删除
                    switch (data) {
                        case "10":
                            return "未接电话";
                            break;
                        case "11":
                            return "失访";
                            break;
                        case "12":
                            return "不在管辖区";
                            break;
                        case "13":
                            return "非重点人群";
                            break;
                        case "14":
                            return "不愿意纳入管理";
                            break;
                        case "98":
                            return "死亡";
                            break;
                        case "99":
                            return "删除";
                            break;
                        default:
                            break;
                    }
                };
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
                    name: "",
                    state: 0,
                    teamId: "",
                    orgCode: undefined,
                    excludeStartDate: new Date(2021, 0, 1),
                    excludeEndDate: new Date(),
                };
                this.handleSearch();
            },
            handleSizeChange(size) {
                this.paginationConfig.pageSize = size;
                this.getTableData();
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.getTableData();
            },
            recall(row) {
                this.$confirm("是否撤回?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.personRecallCheckState(row.id);
                    })
                    .catch(() => {
                        this.$message.info("已取消撤回");
                    });
            },
            personRecallCheckState(val) {
                let data = {
                    shouldManageId: val,
                };
                this.$http.sysTargetSignExclusion.personRecallCheckState(data).then(res => {
                    if (res.code === 0) {
                        this.$message.success("撤回成功");
                        this.getTableData();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            getTableData() {
                let params = {
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: this.paginationConfig.pageSize,
                    ...this.searchParams,
                };
                this.loading = true;
                this.$http.sysTargetSignExclusion.excludeExamList(params).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            getOrgList() {
                this.$http.common
                    .queryOrg()
                    .then(res => {
                        if (res.code === 0) {
                            this.orgList = res.data;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {});
            },
            teamListByOrg() {
                let data = this.searchParams.orgCode;
                console.log(data);
                this.$http.sysTargetSignExclusion
                    .teamListByOrg(data)
                    .then(res => {
                        if (res.code === 0) {
                            this.teamList = res.data;
                        } else {
                            // this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {});
            },
            // //点击返回按钮
            // handleBack(data) {
            //     this.$emit("listenChild", data);
            // },
        },
    };
</script>

<style lang="less"></style>
