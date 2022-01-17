<template>
    <div v-loading="loading" class="fd-grid-unfiled">
        <div class="mhi-search">
            <el-form :model="searchParams" inline>
                <el-form-item label="姓名" prop="name">
                    <el-input size="small" v-model="searchParams.name" clearable></el-input>
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
            <div v-show="showMore">
                <div class="mhi-search-more">
                    <el-form inline>
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
        <main>
            <!-- <el-table ref="sortTable" stripe size="small" :data="tableData"> -->
            <paginationTable
                :stripe="true"
                :total="paginationConfig.total"
                :tableData="tableData"
                @callbackPageSize="callbackPageSize"
                @callbackPageNo="callbackPageNo"
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
                <el-table-column prop="contacts" label="联系人" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.contacts == null ? "—" : scope.row.contacts }}
                    </template>
                </el-table-column>
                <el-table-column prop="contactTel" label="联系人电话" min-width="120">
                    <template slot-scope="scope">
                        {{ scope.row.contactTel == null ? "—" : scope.row.contactTel }}
                    </template>
                </el-table-column>
                <el-table-column prop="residentGroup" label="人群分类" width="130">
                    <template slot-scope="scope">
                        {{ scope.row.residentGroup == null ? "—" : scope.row.residentGroup }}
                    </template>
                </el-table-column>
                <el-table-column prop="fileFlagList" label="建档标记" width="130">
                    <template slot-scope="scope">
                        <span
                            v-if="
                                scope.row.fileFlagList == null || scope.row.fileFlagList.length == 0
                            "
                        >
                            —
                        </span>
                        <span v-else>{{ scope.row.fileFlagList.join(",") }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="street" label="街道" show-overflow-tooltip min-width="120">
                    <template slot-scope="scope">
                        {{ scope.row.street == null ? "—" : scope.row.street }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="community"
                    label="社区名称"
                    show-overflow-tooltip
                    min-width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.community == null ? "—" : scope.row.community }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="gridName"
                    label="网格号"
                    show-overflow-tooltip
                    min-width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.gridName == null ? "—" : scope.row.gridName }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="详细地址"
                    show-overflow-tooltip
                    min-width="300"
                >
                    <template slot-scope="scope">
                        {{ scope.row.address == null ? "—" : scope.row.address }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" show-overflow-tooltip min-width="120">
                    <template slot-scope="scope">
                        {{ dataFmt(scope.row.handleState, mgntDict) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="confirmBy"
                    label="排除人"
                    show-overflow-tooltip
                    min-width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.confirmBy == null ? "—" : scope.row.confirmBy }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="confirmTime"
                    label="排除时间"
                    show-overflow-tooltip
                    min-width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.confirmTime == null ? "—" : scope.row.confirmTime }}
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
            </paginationTable>
        </main>
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
                        姓名：
                        <span>{{ detailData.name }}</span>
                    </p>
                    <p>
                        身份证号：
                        <span>{{ detailData.idCard }}</span>
                    </p>
                    <p>
                        学历：
                        <span>{{ detailData.education }}</span>
                    </p>
                    <p>
                        民族：
                        <span>{{ detailData.nation }}</span>
                    </p>
                    <p>
                        紧急联系人：
                        <span>{{ detailData.contacts }}</span>
                    </p>
                    <p>
                        与本人关系：
                        <span>{{ detailData.contactsRelation }}</span>
                    </p>
                </el-col>
                <el-col :span="12">
                    <p>
                        性别：
                        <span>
                            {{ detailData.sex == 1 ? "男" : detailData.sex == 2 ? "女" : "—" }}
                        </span>
                    </p>
                    <p>
                        联系电话：
                        <span>{{ detailData.phone }}</span>
                    </p>
                    <p>
                        血型：
                        <span>{{ detailData.bloodType }}</span>
                    </p>
                    <p>
                        常驻类型：
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
                        联系人电话：
                        <span>{{ detailData.contactTel }}</span>
                    </p>
                    <p>
                        基础疾病：
                        <span>{{ detailData.diseaseHistory }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        现住址：
                        <span>{{ detailData.address }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        户籍地址：
                        <span>{{ detailData.registeredAddress }}</span>
                    </p>
                </el-col>
                <el-col>
                    <p>
                        网格住址：
                        <span>{{ detailData.gridAddress }}</span>
                    </p>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <edit-dialog ref="editDialog" :currentRow="currentRow" :curTab="curTab"></edit-dialog>
    </div>
</template>
<script>
    import paginationTable from "/src/components/paginationTable/paginationTable";
    import editDialog from "./editDialog/index";
    export default {
        props: ["curTab"],
        data() {
            return {
                loading: false,
                showMore: false,
                searchParams: {
                    name: "",
                    state: "",
                    orderBy: "",
                    orderType: "",
                    orgCode: "",
                    teamId: "",
                },
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总数量
                    pageSize: 50, //每页容量
                    pageNo: 1, //当前页
                },
                currentRow: null, // 弹窗当前行
                mgntDict: [
                    { key: "11", value: "失访" },
                    { key: "2", value: "已签约" },
                    { key: "12", value: "不在管辖区" },
                    { key: "13", value: "非重点人群" },
                    { key: "14", value: "不愿意纳入管理" },
                    // { key: "15", value: "本区其他社康管辖" }
                ],
                detailVisible: false,
                detailData: {},
                tableHeight: 100,
                orgList: [],
                teamList: [],
            };
        },
        computed: {},
        created() {
            this.getTableData();
            this.getOrg();
            this.getTeam();
        },
        mounted() {},
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
            // 获取未签约居民列表
            async getTableData() {
                let params = {
                    ...this.paginationConfig,
                    ...this.searchParams,
                };
                this.loading = true;
                this.tableData = [];
                try {
                    let res = await this.$http.residentManage.getGridExcluded(params);
                    this.loading = false;
                    if (res.code == 0) {
                        this.tableData = this.$emptyHandle(res.data.content, []);
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.paginationConfig.total = 0;
                    }
                } catch (error) {
                    this.loading = false;
                }
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
            },
            // 点击重置
            clickResetBtn() {
                this.paginationConfig.pageNo = 1;
                this.searchParams.name = "";
                this.searchParams.state = "";
                this.searchParams.orderBy = "";
                this.searchParams.orderType = "";
                this.searchParams.orgCode = "";
                this.searchParams.teamId = "";
                this.getTableData();
                this.getTeam();
            },
            // 请求当前页的数据
            callbackPageSize(pageSize) {
                this.paginationConfig.pageSize = pageSize;
                this.getTableData();
            },
            callbackPageNo(pageNo) {
                this.paginationConfig.pageNo = pageNo;
                this.getTableData();
            },
            // 编辑信息
            handleEdit(row) {
                this.currentRow = row;
                this.$refs.editDialog.dialogVisible = true;
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
        watch: {},
        components: {
            editDialog,
            paginationTable,
        },
    };
</script>
<style lang="less">
    .fd-grid-unfiled {
        .detail-form {
            margin: -20px 0;
        }
        .detail-form .el-input,
        .detail-form .el-select {
            width: 100%;
        }
        .detail-form .el-form-item {
            margin-bottom: 20px;
        }
        .detail-dialog {
            position: relative;
            top: -20px;
            padding: 10px 10px 0;
            p {
                margin-bottom: 10px;
            }
            span {
                color: #00acc1;
            }
        }
    }
</style>
