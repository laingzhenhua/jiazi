<template>
    <div v-loading="loading" class="fd-grid-unsign">
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
                <el-form-item label="状态">
                    <el-select size="small" v-model="searchParams.state" clearable filterable>
                        <el-option
                            v-for="i in mgntDict"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
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
            <div>
                <div class="mhi-search-more" v-show="showMore">
                    <el-form inline>
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
                        <el-form-item label="人群分类" prop="residentGroup">
                            <el-select
                                size="small"
                                v-model="searchParams.residentGroup"
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="i in residentDict"
                                    :key="i.key"
                                    :value="i.key"
                                    :label="i.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据来源">
                            <el-select size="small" v-model="searchParams.sourceFrom" clearable>
                                <el-option
                                    v-for="i in sourceDict"
                                    :key="i.key"
                                    :value="i.key"
                                    :label="i.value"
                                ></el-option>
                            </el-select>
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
            <div class="stats">
                <span>未签约人数：</span>
                <span>{{ dataSummary.findCount == null ? "—" : dataSummary.findCount }}</span>
                <span>，高血压：</span>
                <span>{{ dataSummary.htnCount == null ? "—" : dataSummary.htnCount }}</span>
                <span>，糖尿病：</span>
                <span>{{ dataSummary.dmCount == null ? "—" : dataSummary.dmCount }}</span>
                <span>，老年人：</span>
                <span>{{ dataSummary.agedCount == null ? "—" : dataSummary.agedCount }}</span>
                <span>，0~6岁儿童：</span>
                <span>{{ dataSummary.childCount == null ? "—" : dataSummary.childCount }}</span>
                <span>，孕产妇：</span>
                <span>
                    {{ dataSummary.maternalCount == null ? "—" : dataSummary.maternalCount }}
                </span>
                <span>，残疾人：</span>
                <span>
                    {{ dataSummary.disabilityCount == null ? "—" : dataSummary.disabilityCount }}
                </span>
                <span>，低保：</span>
                <span>
                    {{
                        dataSummary.subsistencesCount == null ? "—" : dataSummary.subsistencesCount
                    }}
                </span>
                <span>，肺结核：</span>
                <span>{{ dataSummary.tbCount == null ? "—" : dataSummary.tbCount }}</span>
                <span>，精神疾病：</span>
                <span>{{ dataSummary.smdCount == null ? "—" : dataSummary.smdCount }}</span>
                <span>，计生特殊家庭：</span>
                <span>
                    {{
                        dataSummary.planningFamilyCount == null
                            ? "—"
                            : dataSummary.planningFamilyCount
                    }}
                </span>
                <span>，户籍非重点：</span>
                <span>{{ dataSummary.normalCount == null ? "—" : dataSummary.normalCount }}</span>
            </div>
            <div class="unread">
                <span>审核未通过人数(未读):</span>
                <span class="link" @click="unread">{{ unreadNumer }}</span>
            </div>
        </div>
        <transition>
            <main>
                <pagination-table
                    :tableData="tableData"
                    :total="paginationConfig.total"
                    @callbackPageSize="handleCurrentPageSizeChange"
                    @callbackPageNo="handleCurrentPageNoChange"
                    :showMore="showMore"
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
                        align="center"
                        show-overflow-tooltip
                        min-width="160"
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
                    <el-table-column
                        prop="gridName"
                        label="网格号"
                        show-overflow-tooltip
                        min-width="140"
                    >
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
                    <el-table-column label="状态" show-overflow-tooltip width="100">
                        <template slot-scope="scope">
                            {{ dataFmt(scope.row.handleState, mgntDict) }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="150" label="操作">
                        <template slot-scope="scope">
                            <div class="mhi-table-i">
                                <el-button type="text" @click="handleDetail(scope.row)">
                                    查看详情
                                </el-button>
                                <el-button type="text" @click="handleEdit(scope.row)">
                                    完善信息
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </pagination-table>
            </main>
        </transition>
        <!-- 详情 -->
        <!-- <el-dialog
            v-dialogDrag
            :close-on-click-modal="false"
            :visible.sync="detailVisible"
            @close="handleClose"
            title="查看详情"
            width="600px"
        > -->
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="detailVisible"
            @close="handleClose"
            title="查看详情"
            width="600px"
        >
            <el-row class="detail-dialog">
                <el-col :span="12">
                    <p>
                        <span>姓名：</span>
                        <span>{{ detailData.name }}</span>
                    </p>
                    <p>
                        <span>身份证号：</span>
                        <span>{{ detailData.idCard }}</span>
                    </p>
                    <p>
                        <span>学历：</span>
                        <span>{{ detailData.education }}</span>
                    </p>
                    <p>
                        <span>民族：</span>
                        <span>{{ detailData.nation }}</span>
                    </p>
                    <p>
                        <span>紧急联系人：</span>
                        <span>{{ detailData.contacts }}</span>
                    </p>
                    <p>
                        <span>与本人关系：</span>
                        <span>{{ detailData.contactsRelation }}</span>
                    </p>
                </el-col>
                <el-col :span="12">
                    <p>
                        <span>性别：</span>
                        <span>
                            {{ detailData.sex == 1 ? "男" : detailData.sex == 2 ? "女" : "—" }}
                        </span>
                    </p>
                    <p>
                        <span>联系电话：</span>
                        <span>{{ detailData.phone }}</span>
                    </p>
                    <p>
                        <span>血型：</span>
                        <span>{{ detailData.bloodType }}</span>
                    </p>
                    <p>
                        <span>常驻类型：</span>
                        <span>
                            {{
                                detailData.residentType == "0"
                                    ? "非户籍人口"
                                    : detailData.residentType == "1"
                                    ? "户籍人口"
                                    : "—"
                            }}
                        </span>
                    </p>
                    <p>
                        <span>联系人电话：</span>
                        <span>{{ detailData.contactTel }}</span>
                    </p>
                    <p>
                        <span>基础疾病：</span>
                        <span>{{ detailData.diseaseHistory }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        <span>现住址：</span>
                        <span>{{ detailData.address }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        <span>户籍地址：</span>
                        <span>{{ detailData.registeredAddress }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        <span>网格住址：</span>
                        <span>{{ detailData.gridAddress }}</span>
                    </p>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <signDialog
            ref="signDialog"
            :currentRow="currentRow"
            :curTab="curTab"
            @saveSuccess="getTableData"
        ></signDialog>
        <unread
            :visible="visible"
            :params="params"
            @callBackConfirm="callBackConfirm"
            @callBackCancel="callBackCancel"
        ></unread>
    </div>
</template>
<script>
    import paginationTable from "/src/components/paginationTable/paginationTable";
    import signDialog from "./signDialog/index.vue";
    import unread from "./components/unread";
    import { personUnReadAmount } from "../../../httpRequset/module/residentManage";
    export default {
        props: ["curTab"],
        data() {
            return {
                loading: false,
                showMore: false,
                visible: false,
                params: {},
                searchParams: {
                    name: "", //居民姓名
                    residentType: "", //户籍类型
                    residentGroup: "", //人群分类
                    state: "0", //是否网格居民
                    orderBy: "",
                    orderType: "",
                    sourceFrom: "",
                    teamId: this.teamId,
                    addrChange: 0,
                    orgCode: "",
                    teamId: "",
                },
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
                currentRow: null, // 弹窗当前行
                residentDict: [
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
                    // { key: "L", value: "纳入特殊帮扶家庭" },
                ],
                mgntDict: [
                    { key: "0", value: "待确认" },
                    { key: "1", value: "可纳入管理" },
                    { key: "10", value: "未接电话" },
                    { key: "11", value: "失访" },
                    { key: "12", value: "不在管辖区" },
                    { key: "13", value: "非重点人群" },
                    { key: "14", value: "不愿意纳入管理" },
                    // { key: "15", value: "本区其他社康管辖" },
                    // { key: "99", value: "删除" }
                ],
                sourceDict: [],
                detailVisible: false,
                detailData: {},
                tableHeight: 100,
                unreadNumer: undefined,
                orgList: [],
                teamList: [],
            };
        },
        created() {
            this.getSourceFrom();
            this.getGridUnSignStat();
            this.getTableData();
            this.getUnread();
            this.getOrg();
            this.getTeam();
        },
        methods: {
            dataFmt(val, dict) {
                if (val) {
                    for (const item of dict) {
                        if (item.key == val) {
                            return item.value;
                        }
                    }
                }
            },
            // 获取人群
            getResidentGroupList() {
                this.$http.residentManage.getFdSignCrowd().then(res => {
                    if (res.code == 0) {
                        this.residentGroupList = res.data;
                    }
                });
            },
            // 获取来源列表
            getSourceFrom() {
                let param = { dictCode: "MGNT_SOURCE_FROM" };
                this.$http.residentManage.dictItems(param).then(res => {
                    if (res.code == 0) {
                        this.sourceDict = res.data;
                    }
                });
            },
            // 获取未签约居民统计数据
            getGridUnSignStat() {
                let params = {
                    orgCode: this.searchParams.orgCode,
                    teamId: this.searchParams.teamId,
                };
                this.$http.residentManage.getGridUnSignStat(params).then(res => {
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
                });
            },
            unread() {
                this.visible = true;
            },
            callBackConfirm(val) {
                this.getUnread();
            },
            callBackCancel(val) {
                this.visible = val;
            },
            //查询未读数量
            getUnread() {
                this.$http.residentManage.personUnReadAmount().then(res => {
                    if (res.code === 0) {
                        this.unreadNumer = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            // 获取未签约居民列表
            getTableData() {
                let params = {
                    ...this.paginationConfig,
                    ...this.searchParams,
                };
                this.loading = true;
                this.tableData = [];
                return new Promise((resolve, reject) => {
                    this.$http.residentManage
                        .getGridUnSign(params)
                        .then(res => {
                            if (res.code == 0) {
                                this.tableData = res.data.content;
                                this.paginationConfig.total = res.data.totalCount;
                                resolve();
                            } else {
                                this.paginationConfig.total = 0;
                                reject();
                            }
                            this.loading = false;
                        })
                        .catch(res => {
                            this.paginationConfig.total = 0;
                            this.loading = false;
                        });
                });
            },
            // 排序改变
            handleSortChange(column, prop, order) {
                this.searchParams.orderBy = column.prop;
                this.searchParams.orderType = this.$sliceOrderType(column.order);
                this.getTableData();
            },
            // 点击查询
            handleQuery() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
                this.getGridUnSignStat();
            },
            // 点击重置
            clickResetBtn() {
                this.paginationConfig.pageNo = 1;
                this.searchParams.name = "";
                this.searchParams.residentType = "";
                this.searchParams.residentGroup = "";
                this.searchParams.state = "";
                this.searchParams.orderBy = "";
                this.searchParams.orderType = "";
                this.searchParams.sourceFrom = "";
                this.searchParams.orgCode = "";
                this.searchParams.teamId = "";
                this.getTableData();
                this.getTeam();
                this.getGridUnSignStat();
            },
            // 请求当前页的数据
            handleCurrentPageNoChange(pageNum) {
                this.paginationConfig.pageNo = pageNum;
                this.getTableData();
            },
            handleCurrentPageSizeChange(pageSize) {
                this.paginationConfig.pageSize = pageSize;
                this.getTableData();
            },
            // 编辑信息
            handleEdit(row) {
                this.currentRow = row;
                this.$refs.signDialog.dialogVisible = true;
            },
            // 查看详情
            handleDetail(row) {
                this.$http.residentManage
                    .getGridUnSignDetail({ shouldMgntId: row.id })
                    .then(res => {
                        if (res.code == 0) {
                            this.detailData = this.$emptyHandle(res.data, []);
                            this.detailVisible = true;
                        }
                    });
            },
            // 关闭详情
            handleClose() {
                this.detailData = {};
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
        components: { signDialog, paginationTable, unread },
    };
</script>
<style lang="less" scope>
    @media (max-width: 1600px) {
        .table-stats {
            height: auto;
            line-height: 22px;
            margin-bottom: 0;
        }
    }
    .fd-grid-unsign {
        .table-stats {
            height: 40px;
            display: flex;
            line-height: 40px;
            margin-bottom: -10px;
            span:nth-of-type(2n) {
                color: #f1556c;
            }
            .unread {
                min-width: 200px;
                display: flex;
                flex: 1;
                justify-content: flex-end;
                .link {
                    color: red;
                    cursor: pointer;
                    &:hover {
                        //border-bottom: 1px solid red;
                    }
                }
            }
        }
        @media (max-width: 1600px) {
            .table-stats {
                height: auto;
                line-height: 22px;
            }
        }
        .detail-form {
            margin: -20px 0;
        }
        .detail-form .el-input,
        .detail-form .el-select {
            width: 100%;
        }
        .detail-form .el-form-item {
            margin-bottom: 14px;
        }
        .detail-dialog {
            position: relative;
            top: -20px;
            padding: 10px 10px 0;
            p {
                margin-bottom: 10px;
            }
            span:nth-of-type(2n) {
                color: #00acc1;
            }
        }
    }
</style>
