<template>
    <div>
        <el-tabs type="card" class="mhi-tabs" v-model="dynamicTable">
            <el-tab-pane
                v-for="item in tabData"
                :key="item.perm"
                :label="item.label"
                :name="item.name"
            ></el-tab-pane>
        </el-tabs>
        <section v-loading="loading">
            <div class="mhi-search">
                <el-form inline>
                    <el-form-item label="核查结果">
                        <el-select v-model="searchParams.mgntState" size="small" clearable>
                            <el-option
                                v-for="i in mgntDict"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人群分类">
                        <el-select v-model="searchParams.crowdFlag" size="small" clearable>
                            <el-option
                                v-for="i in crowdDict"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分配状态">
                        <el-select v-model="searchParams.assignState" size="small" clearable>
                            <el-option
                                v-for="i in assignDict"
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
                            <el-form-item label="地址">
                                <el-input
                                    placeholder="请输入地址"
                                    v-model="searchParams.address"
                                    size="small"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="数据来源">
                                <el-select v-model="searchParams.sourceFrom" size="small" clearable>
                                    <el-option
                                        v-for="i in sourceDict"
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
                <!-- 表格 -->
                <component
                    :is="dynamicTable"
                    :tableData="tableData"
                    :paginationConfig="paginationConfig"
                    :mgntDict="mgntDict"
                    @listenSave="getTableData"
                    :showMore="showMore"
                    @callbackPageSize="callbackPageSize"
                    @callbackPageNo="callbackPageNo"
                ></component>
            </main>
        </section>
    </div>
</template>

<script>
    import orgTable from "./orgTable";
    import teamTable from "./teamTable";
    export default {
        components: { teamTable, orgTable },
        data() {
            return {
                loading: false,
                showMore: false, // 更多搜索
                dynamicTable: "orgTable",
                searchParams: {
                    mgntState: "",
                    crowdFlag: "",
                    assignState: 1,
                    name: "",
                    address: "",
                    sourceFrom: "",
                },
                tableData: [],
                paginationConfig: {
                    pageNo: 1,
                    pageSize: 50,
                    total: 0,
                },
                tabData: [],
                tabDict: [
                    { label: "分配社康", name: "orgTable", perm: "per_01_03_02_02" },
                    { label: "分配团队", name: "teamTable", perm: "per_01_03_02_01" },
                ],
                mgntDict: [
                    { key: 1, value: "可纳入管理" },
                    { key: 10, value: "未接电话" },
                    { key: 11, value: "失访" },
                    { key: 12, value: "不在管辖区" },
                    { key: 13, value: "非重点人群" },
                    { key: 14, value: "不愿意纳入管理" },
                ],
                crowdDict: [
                    { value: "0~6岁儿童", key: "A" },
                    { value: "糖尿病", key: "B" },
                    { value: "残疾人", key: "C" },
                    { value: "高血压", key: "E" },
                    { value: "老年人", key: "I" },
                    { value: "低保", key: "J" },
                    { value: "孕产妇", key: "K" },
                    { value: "肺结核患者", key: "F" },
                    { value: "精神障碍", key: "G" },
                    { value: "计生特殊家庭", key: "D" },
                    // { value: "纳入特殊帮扶家庭", key: "L" }
                ],
                assignDict: [
                    { key: 1, value: "待分配" },
                    { key: 2, value: "已分配" },
                ],
                sourceDict: [],
            };
        },
        created() {
            // let perms = this.$store.state.user.perms;
            for (const item of this.tabDict) {
                // if (perms.includes(item.perm)) {
                this.tabData.push(item);
                // }
            }
            this.dynamicTable = this.tabData.length ? this.tabData[0].name : "";
            this.queryCrowd();
            this.querySource();
            this.getTableData();
        },
        watch: {
            dynamicTable(nv) {
                if (nv) {
                    this.handleReset();
                }
            },
        },
        methods: {
            // 人群分类字典
            async queryCrowd() {
                await this.$http.staffAssignmentsManage.queryCrowd().then(res => {
                    if (res.code == 0) {
                        this.crowdDict = res.data;
                    }
                });
            },
            async querySource() {
                let param = { dictCode: "MGNT_SOURCE_FROM" };
                await this.$http.residentManage.dictItems(param).then(res => {
                    if (res.code == 0) {
                        this.sourceDict = res.data;
                    }
                });
            },
            // 查询
            handleSearch() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
            },
            // 重置
            handleReset() {
                this.searchParams = {
                    mgntState: "",
                    crowdFlag: "",
                    assignState: 1,
                    name: "",
                    address: "",
                    sourceFrom: "",
                };
                this.handleSearch();
            },
            handlePage() {
                this.getTableData();
            },
            // 获取表格数据
            getTableData() {
                let req;
                let param = {
                    ...this.searchParams,
                    ...this.paginationConfig,
                };
                console.log(this.dynamicTable);
                switch (this.dynamicTable) {
                    case "orgTable":
                        req = this.$http.staffAssignmentsManage.getListByOrg(param);
                        break;
                    case "teamTable":
                        req = this.$http.staffAssignmentsManage.getListByTeam(param);
                        break;
                    default:
                        return;
                }
                this.loading = true;
                this.tableData = [];
                req.then(res => {
                    if (res.code == 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                    } else {
                        this.paginationConfig.total = 0;
                    }
                    this.loading = false;
                }).catch(res => {
                    this.paginationConfig.total = 0;
                    this.loading = false;
                });
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

<style></style>
