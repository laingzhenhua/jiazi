<template>
    <div v-loading="loading" class="loading">
        <section class="mhi-zone-opt">
            <div class="mhi-search clearFix">
                <el-form class="l" inline>
                    <el-form-item label="档案所在机构">
                        <el-select
                            v-model="searchParams.healthMgntOrgCode"
                            filterable
                            clearable
                            placeholder="请输入内容"
                        >
                            <el-option
                                v-for="(item, index) in orgData"
                                :key="index"
                                :label="item.value"
                                :value="item.key"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下转机构">
                        <el-select size="small" v-model="searchParams.hospitalName" clearable>
                            <el-option
                                v-for="(item, index) in hospitalList"
                                :key="index"
                                :label="item.value"
                                :value="item.key"
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
                <div v-show="showMore">
                    <div class="mhi-search-more">
                        <el-form inline label-width="68px">
                            <el-form-item label="诊断">
                                <el-input
                                    type="text"
                                    size="small"
                                    v-model="searchParams.diagnosisName"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="类别">
                                <el-select
                                    size="small"
                                    v-model="searchParams.businessType"
                                    clearable
                                >
                                    <el-option value="0" label="挂号"></el-option>
                                    <el-option value="1" label="门诊"></el-option>
                                    <el-option value="2" label="住院"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select size="small" v-model="searchParams.readState" clearable>
                                    <el-option value="0" label="未读"></el-option>
                                    <el-option value="1" label="已读"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input
                                    type="text"
                                    size="small"
                                    v-model="searchParams.name"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="下转日期">
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="searchParams.startTime"
                                    size="small"
                                    type="date"
                                    placeholder="选择开始日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="至">
                                <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="searchParams.endTime"
                                    size="small"
                                    type="date"
                                    placeholder="选择结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="建档状态">
                                <el-select size="small" v-model="searchParams.type" clearable>
                                    <el-option value="ehr" label="未建立健康档案"></el-option>
                                    <el-option value="elder" label="未建立老年人专案"></el-option>
                                    <el-option value="hyper" label="未建立高血压专案"></el-option>
                                    <el-option value="dm" label="未建立糖尿病专案"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="患者意愿">
                                <el-select size="small" v-model="searchParams.agreen" clearable>
                                    <el-option value="0" label="全部"></el-option>
                                    <el-option value="1" label="同意"></el-option>
                                    <el-option value="2" label="不同意"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="专案类型">
                                <el-select
                                    size="small"
                                    v-model="searchParams.projectType"
                                    clearable
                                >
                                    <el-option value="高血压" label="高血压"></el-option>
                                    <el-option value="糖尿病" label="糖尿病"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </transition>
            <write ref="moretext" v-on:listenChildCom="handleEmitFromChild"></write>
            <main>
                <paginationTable
                    :total="paginationConfig.total"
                    :tableData="tableData"
                    :showMore="showMore"
                    @callbackPageSize="callbackPageSize"
                    @callbackPageNo="callbackPageNo"
                >
                    <el-table-column
                        prop="healthMgntOrgName"
                        label="档案所在机构"
                        width="200"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        prop="businessType"
                        label="类别"
                        width="100"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.businessType == 0
                                    ? "挂号 "
                                    : scope.row.businessType == 1
                                    ? "门诊"
                                    : scope.row.businessType == 2
                                    ? "住院"
                                    : "—"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="120"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="idCard" label="身份证" width="200"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="60">
                        <template slot-scope="scope">
                            {{ scope.row.sex === 1 ? "男" : scope.row.sex === 2 ? "女" : "—" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="contactTel"
                        label="联系电话"
                        width="130"
                    ></el-table-column>
                    <el-table-column prop="age" label="年龄" width="60"></el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址"
                        width="200"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        prop="referralNo"
                        label="转诊单号"
                        width="160"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        prop="diagnosisName"
                        label="诊断"
                        width="160"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column :label="'就诊科室'" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.referralDepartmeentName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="agreen"
                        label="患者意愿"
                        width="100"
                        show-overflow-tooltip
                    >
                        同意
                    </el-table-column>
                    <el-table-column
                        prop="hospitalName"
                        label="下转医院"
                        width="200"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        prop="referralownDate"
                        label="下转日期"
                        width="160"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column :label="'是否建立\n健康档案'" width="100">
                        <template slot-scope="scope">
                            {{
                                scope.row.ehrCase === 1
                                    ? "是"
                                    : scope.row.ehrCase === 0
                                    ? "否"
                                    : "—"
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column :label="'是否建立\n老年人专案'" width="100">
                        <template slot-scope="scope">{{ scope.row.agedCaseDesc }}</template>
                    </el-table-column>
                    <el-table-column :label="'是否建立\n高血压专案'" width="100">
                        <template slot-scope="scope">{{ scope.row.htnCaseDesc }}</template>
                    </el-table-column>
                    <el-table-column :label="'是否建立\n糖尿病专案'" width="100">
                        <template slot-scope="scope">{{ scope.row.dmCaseDesc }}</template>
                    </el-table-column>
                    <el-table-column :label="'备注'" min-width="150">
                        <template slot-scope="scope">{{ scope.row.remark }}</template>
                    </el-table-column>
                    <el-table-column :label="'跟踪结果'" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.trackResult }}</template>
                    </el-table-column>
                    <el-table-column :label="'状态'" width="100">
                        <template slot-scope="scope">{{ scope.row.readStateDesc }}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" min-width="150">
                        <template slot-scope="scope">
                            <div class="wirte">
                                <el-button type="text" @click="handleView(scope.row)">
                                    {{ scope.row.readState == 1 ? "恢复未读" : "标记已读" }}
                                </el-button>
                                <el-button type="text" @click="intext(scope.row)">
                                    跟踪录入
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </paginationTable>
            </main>
        </section>
    </div>
</template>

<script>
    import write from "./components/write.vue";
    import paginationTable from "../../../components/paginationTable/paginationTable.vue";
    export default {
        components: {write, paginationTable},
        data() {
            return {
                showMore: false,
                loading: false,
                searchParams: {
                    healthMgntOrgCode: "",
                    hospitalName: "",
                    startTime: "",
                    endTime: "",
                    type: "",
                    businessType: "",
                    name: "",
                    agreen: "0",
                    readState: "",
                    diagnosisName: "",
                    projectType: "",
                },
                orgData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总条数
                    pageSize: 50, //每页容量
                    pageNo: 1, //当前页
                },
                tableData: [],
                healthMgntName: "",
                hospitalList: [],
                isSmall: false,
            };
        },
        mounted() {
            this.queryOrgs();
            this.getTableData();
            this.getHospital();
            this.changeScreen();
            window.addEventListener("resize", this.changeScreen);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.changeScreen);
        },
        methods: {
            changeScreen() {
                this.isSmall = this.$getCurScreen() === "bigScreen";
            },
            getHospital() {
                this.$http.common
                    .getHospitalList()
                    .then(res => {
                        if (res.code === 0) {
                            this.hospitalList = res.data;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {});
            },
            handleEmitFromChild() {
                this.getTableData();
            },
            intext(row) {
                this.$refs.moretext.dialogVisible = true;
                this.$refs.moretext.form.desc = row.trackResult;
                this.$refs.moretext.id = row.id;
            },
            handleView(res) {
                let param = {
                    readSate: res.readState == 1 ? 0 : 1,
                    referralDownId: res.id,
                };
                this.$http.residentSearch.markReadSate(param).then(respon => {
                    if (respon.code == 0) {
                        this.getTableData();
                    }
                });
            },
            queryOrgs() {
                this.$http.common.queryOrgs().then(res => {
                    if (res.code == 0) {
                        this.orgData = res.data;
                    }
                });
            },
            getTableData() {
                try {
                    let param = {
                        ...this.searchParams,
                        ...this.paginationConfig,
                    };
                    this.loading = true;
                    this.$http.residentSearch.getReferralList(param).then(res => {
                        if (res.code === 0) {
                            this.tableData = this.$emptyHandle(res.data.content, ["trackResult"]);
                            this.paginationConfig.total = res.data.totalCount;
                        }
                        this.loading = false;
                    });
                } catch (error) {
                    this.loading = false;
                }
            },
            handleSearch() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
            },
            handleReset() {
                this.searchParams = {
                    healthMgntOrgCode: "",
                    hospitalName: "",
                    startTime: "",
                    endTime: "",
                    type: "",
                    businessType: "",
                    readState: "",
                    name: "",
                    agreen: "",
                    diagnosisName: "",
                    projectType: "",
                };
                this.healthMgntName = "";
                this.handleSearch();
            },
            clearHealthName() {
                this.searchParams.healthMgntOrgCode = "";
                this.healthMgntName = "";
            },
            callbackPageSize(pageSize) {
                this.paginationConfig.pageSize = pageSize;
                this.getTableData();
            },
            callbackPageNo(pageNo) {
                this.paginationConfig.pageNo = pageNo;
                this.getTableData();
            },
        },
    };
</script>

<style lang="less" scoped></style>
