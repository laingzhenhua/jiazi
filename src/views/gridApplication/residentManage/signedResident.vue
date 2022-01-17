<template>
    <div v-loading="loading" class="loading">
        <div class="mhi-search">
            <el-form :model="searchParams" inline>
                <el-form-item label="姓名" prop="name">
                    <el-input
                        size="small"
                        v-model="searchParams.name"
                        maxlength="30"
                        placeholder="请输入居民姓名"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="户籍类型" prop="residentType">
                    <el-select
                        size="small"
                        v-model="searchParams.residentType"
                        clearable
                        filterable
                    >
                        <el-option label="户籍人口" value="1"></el-option>
                        <el-option label="非户籍人口" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="searchParams.addrChange" :true-label="1" :false-label="0">
                        居民地址有变化
                    </el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleQuery"
                    >
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" icon="el-icon-refresh-right" @click="clickResetBtn">
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
            <div v-show="showMore">
                <div class="mhi-search-more">
                    <el-form inline>
                        <el-form-item label="人群分类" prop="residentGroup">
                            <el-select
                                size="small"
                                v-model="searchParams.residentGroup"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="i in residentGroupList"
                                    :key="i.key"
                                    :value="i.key"
                                    :label="i.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否网格居民">
                            <el-radio-group v-model="searchParams.gridPersonFlag">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="机构名称" prop="orgCode">
                            <el-select
                                v-model="searchParams.orgCode"
                                placeholder="请选择机构"
                                clearable
                                filterable
                                @change="changeTeam"
                            >
                                <el-option
                                    v-for="item in orgList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="团队名称" prop="teamId">
                            <el-select
                                v-model="searchParams.teamId"
                                clearable
                                filterable
                                placeholder="请选择团队"
                            >
                                <el-option
                                    v-for="item in teamList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </transition>
        <div class="table-stats">
            签约总数：
            <span>{{ dataSummary.findCount == null ? "—" : dataSummary.findCount }}</span>
            ，高血压：
            <span>{{ dataSummary.htnCount == null ? "—" : dataSummary.htnCount }}</span>
            ，糖尿病：
            <span>{{ dataSummary.dmCount == null ? "—" : dataSummary.dmCount }}</span>
            ，老年人：
            <span>{{ dataSummary.agedCount == null ? "—" : dataSummary.agedCount }}</span>
            ，0~6岁儿童：
            <span>{{ dataSummary.childCount == null ? "—" : dataSummary.childCount }}</span>
            ，孕产妇：
            <span>{{ dataSummary.maternalCount == null ? "—" : dataSummary.maternalCount }}</span>
            ，残疾人：
            <span>
                {{ dataSummary.disabilityCount == null ? "—" : dataSummary.disabilityCount }}
            </span>
            ，低保：
            <span>
                {{ dataSummary.subsistencesCount == null ? "—" : dataSummary.subsistencesCount }}
            </span>
            ，肺结核：
            <span>{{ dataSummary.tbCount == null ? "—" : dataSummary.tbCount }}</span>
            ，精神疾病：
            <span>{{ dataSummary.smdCount == null ? "—" : dataSummary.smdCount }}</span>
            ，计生特殊家庭：
            <span>
                {{
                    dataSummary.planningFamilyCount == null ? "—" : dataSummary.planningFamilyCount
                }}
            </span>
            ，户籍非重点：
            <span>{{ dataSummary.normalCount == null ? "—" : dataSummary.normalCount }}</span>
        </div>
        <transition>
            <main>
                <paginationTable
                    :tableData="tableData"
                    :total="paginationConfig.total"
                    @callbackPageSize="handleCurrentPageSizeChange"
                    @callbackPageNo="handleCurrentPageNoChange"
                    :showMore="showMore"
                    :rowKey="''"
                >
                    <el-table-column
                        prop="orgName"
                        label="机构名称"
                        width="150"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        prop="teamName"
                        label="团队名称"
                        width="150"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="name" label="姓名" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.name == null ? "—" : scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" width="50">
                        <template slot-scope="scope">
                            <span v-show="scope.row.sex == '1'">男</span>
                            <span v-show="scope.row.sex == '2'">女</span>
                            <span v-show="scope.row.sex == null">—</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="idCard" label="身份证号" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.idCard == null ? "—" : scope.row.idCard }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="age" label="年龄" width="50">
                        <template slot-scope="scope">
                            {{ scope.row.age == null ? "—" : scope.row.age }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="电话号码" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.phone == null ? "—" : scope.row.phone }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="contacts"
                        label="联系人"
                        width="80"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.contacts == null ? "—" : scope.row.contacts }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="contactTel" label="联系人电话" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.contactTel == null ? "—" : scope.row.contactTel }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="residentGroup"
                        label="人群分类"
                        show-overflow-tooltip
                        min-width="120"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.residentGroup == null ? "—" : scope.row.residentGroup }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fileFlagList"
                        label="建档标记"
                        show-overflow-tooltip
                        min-width="160"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span
                                v-if="
                                    scope.row.fileFlagList == null ||
                                        scope.row.fileFlagList.length == 0
                                "
                            >
                                —
                            </span>
                            <span v-else>{{ scope.row.fileFlagList.join(",") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="street"
                        label="街道"
                        show-overflow-tooltip
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.street == null ? "—" : scope.row.street }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="community"
                        label="社区名称"
                        show-overflow-tooltip
                        min-width="140"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.community == null ? "—" : scope.row.community }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="gridName" label="网格号" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.gridName == null ? "—" : scope.row.gridName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="详细地址"
                        show-overflow-tooltip
                        min-width="280"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.address == null ? "—" : scope.row.address }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="180" label="操作">
                        <template slot-scope="scope">
                            <div class="mhi-table-i">
                                <el-button
                                    type="text"
                                    @click="openFile(scope.row)"
                                    :disabled="scope.row.residentGroup === null"
                                >
                                    调阅健康档案
                                </el-button>
                                <el-button type="text" @click="handleEdit(scope.row)">
                                    完善信息
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </paginationTable>
            </main>
        </transition>
        <signDialog
            ref="signDialog"
            :currentRow="currentRow"
            :curTab="curTab"
            @saveSuccess="getGridSign"
        ></signDialog>
    </div>
</template>
<script>
    import paginationTable from "/src/components/paginationTable/paginationTable";
    import signDialog from "./signDialog/index";
    export default {
        props: ["curTab", "checkman"],
        components: {
            signDialog,
            paginationTable,
        },
        data() {
            return {
                loading: false,
                showMore: false,
                searchParams: {
                    name: "", //居民姓名
                    residentType: "", //户籍类型
                    residentGroup: "", //人群分类
                    gridPersonFlag: "", //是否网格居民
                    orderBy: "",
                    orderType: "",
                    addrChange: 0,
                    orgCode: "",
                    teamId: "",
                },
                residentGroupList: [
                    { key: "A", value: "0~6岁儿童" },
                    { key: "B", value: "糖尿病" },
                    { key: "E", value: "高血压" },
                    { key: "I", value: "老年人" },
                    { key: "K", value: "孕产妇" },
                    { key: "J", value: "低保" },
                    { key: "C", value: "残疾" },
                    { key: "F", value: "肺结核患者" },
                    { key: "G", value: "精神障碍" },
                    { key: "D", value: "计生特殊家庭" },
                    { key: "H", value: "非重点人群" },
                    { key: "S", value: "重点人群" },
                    // { key: "L", value: "纳入特殊帮扶家庭" },
                ],
                dataSummary: {
                    agedCount: "",
                    childCount: "",
                    dmCount: "",
                    findCount: "",
                    htnCount: "",
                    maternalCount: "",
                    normalCount: "",
                    disabilityCount: "",
                    subsistencesCount: "",
                    tbCount: "",
                    smdCount: "",
                    planningFamilyCount: "",
                },
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总数量
                    pageSize: 50, //每页容量
                    pageNo: 1, //当前页
                },
                currentRow: {},
                tableHeight: 100,
                orgList: [],
                teamList: [],
            };
        },
        created() {
            this.searchParams.residentGroup = this.checkman;
            this.getGridSignStat();
            this.getGridSign();
            this.getOrg();
            this.getTeam();
        },
        mounted() {},
        methods: {
            // 获取人群
            getResidentGroupList() {
                this.$http.residentManage
                    .getFdSignCrowd()
                    .then(res => {
                        if (res.code == 0) {
                            this.residentGroupList = res.data;
                        }
                    })
                    .catch(res => {});
            },
            // 获取签约居民统计数据
            getGridSignStat() {
                let params = {
                    orgCode: this.searchParams.orgCode,
                    teamId: this.searchParams.teamId,
                };
                this.$http.residentManage
                    .getGridSignStat(params)
                    .then(res => {
                        if (res.code == 0 && res.data) {
                            for (const item in this.dataSummary) {
                                this.dataSummary[item] = res.data[item];
                            }
                        } else {
                            for (const item in this.dataSummary) {
                                this.dataSummary[item] = "";
                            }
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(res => {});
            },
            // 获取签约居民列表
            getGridSign() {
                let params = {
                    ...this.paginationConfig,
                    ...this.searchParams,
                };
                this.loading = true;
                this.tableData = [];
                this.$http.residentManage
                    .getGridSign(params)
                    .then(res => {
                        if (res.code == 0) {
                            this.tableData = res.data.content;
                            this.paginationConfig.total = res.data.totalCount;
                        } else {
                            this.paginationConfig.total = 0;
                        }
                        this.loading = false;
                    })
                    .catch(res => {
                        this.paginationConfig.total = 0;
                        this.loading = false;
                    });
            },
            // 排序改变
            handleSortChange(column, prop, order) {
                this.searchParams.orderBy = column.prop;
                this.searchParams.orderType = this.$sliceOrderType(column.order);
                this.getGridSign();
            },

            // 点击查询
            handleQuery() {
                this.paginationConfig.pageNo = 1;
                this.getGridSign();
                this.getGridSignStat();
            },
            // 点击重置
            clickResetBtn() {
                this.paginationConfig.pageNo = 1;
                this.searchParams.name = "";
                this.searchParams.residentType = "";
                this.searchParams.residentGroup = "";
                this.searchParams.gridPersonFlag = "";
                this.searchParams.orderBy = "";
                this.searchParams.orderType = "";
                this.searchParams.addrChange = 0;
                this.searchParams.orgCode = "";
                this.searchParams.teamId = "";
                this.getGridSign();
                this.getTeam();
                this.getGridSignStat();
            },
            // 请求当前页的数据
            handleCurrentPageNoChange(pageNo) {
                this.paginationConfig.pageNo = pageNo;
                this.getGridSign();
            },
            handleCurrentPageSizeChange(pageSize) {
                this.paginationConfig.pageSize = pageSize;
                this.getGridSign();
            },
            // 调阅健康档案
            openFile(row) {
                let userName = this.$store.state.user.userName;
                let orgName = this.$store.state.user.orgName;
                let orgCode = this.$store.state.user.orgCode;
                let params =
                    `login_type=ThirdPart&sys_code=PHSS` +
                    `&icode=${row.idCard}` +
                    `&visit_doctor=${userName}` +
                    `&org_name=${orgName}` +
                    `&org_code=${orgCode}`;
                let thirdPartUrl = localStorage.getItem("Global");
                window.open(thirdPartUrl + `?params=${btoa(params)}`, "_blank");
            },
            // 编辑信息
            handleEdit(row) {
                this.currentRow = row;
                this.$refs.signDialog.dialogVisible = true;
            },
            async getOrg() {
                try {
                    let res = await this.$http.common.queryOrg();
                    if (res.code == 0) {
                        this.orgList = res.data;
                    }
                } catch (error) {}
            },
            async getTeam() {
                try {
                    let res = await this.$http.common.queryTeam({
                        orgCode: this.searchParams.orgCode,
                    });
                    if (res.code == 0) {
                        this.teamList = res.data;
                    }
                } catch (error) {}
            },
            changeTeam() {
                this.searchParams.teamId = "";
                this.getTeam();
            },
        },

        watch: {},
    };
</script>
<style lang="less" scope>
    .loading {
        height: calc(100% - 56px);
    }
    .table-stats {
        height: 40px;
        line-height: 40px;
        margin-bottom: -10px;
        span:nth-of-type(2n) {
            color: #f1556c;
        }
    }
    @media (max-width: 1600px) {
        .table-stats {
            height: auto;
            line-height: 22px;
            margin-bottom: 0;
        }
    }
</style>
