<template>
    <div class="ctn-grid-manage">
        <section v-loading="loading">
            <div class="mhi-search">
                <el-form inline>
                    <el-form-item label="姓名">
                        <el-input
                            placeholder="请输入姓名"
                            v-model="searchParams.userName"
                            size="small"
                            maxlength="10"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input
                            placeholder="请输入身份证号"
                            v-model="searchParams.identity"
                            size="small"
                            maxlength="18"
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
                            <el-form-item label="街道">
                                <el-select
                                    v-model="searchParams.street"
                                    size="small"
                                    clearable
                                    filterable
                                    style="width: 180px"
                                    @change="changeOrg(searchParams.street)"
                                >
                                    <el-option
                                        v-for="i in streetData"
                                        :key="i.key"
                                        :value="i.key"
                                        :label="i.value"
                                    ></el-option>
                                </el-select>
                                <el-form-item label="社区" style="margin-left: 10px">
                                    <el-select
                                        size="small"
                                        v-model="searchParams.community"
                                        filterable
                                        clearable
                                    >
                                        <el-option
                                            v-for="item in communityList"
                                            :key="item.key"
                                            :label="item.value"
                                            :value="item.key"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input
                                        placeholder="请输入地址"
                                        v-model="searchParams.address"
                                        maxlength="50"
                                        size="small"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </transition>
            <main>
                <!--  表格 -->
                <component
                    :is="dynamicTable"
                    :tableData="tableData"
                    :paginationConfig="paginationConfig"
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
    import gridResidentTable from "./components/gridResidentTable";
    export default {
        name: "index",
        components: { gridResidentTable },
        data() {
            return {
                loading: false,
                showMore: false, // 更多搜索
                dynamicTable: "gridResidentTable",
                searchParams: {
                    identity: "",
                    street: "",
                    userName: "",
                    address: "",
                    community: "",
                },
                tableData: [],
                communityList: [],
                paginationConfig: {
                    pageNo: 1,
                    pageSize: 50,
                    total: 0,
                },
                tabData: [],
                streetData: [
                    { value: "分配社康", key: "1" },
                    { value: "分配团队", key: "2" },
                ],
                sourceDict: [],
            };
        },
        created() {
            this.getTableData();
            this.queryStreet();
        },
        methods: {
            handleSearch() {
                this.getTableData();
            },
            handleReset() {
                this.searchParams = {
                    identity: "",
                    street: "",
                    userName: "",
                    address: "",
                    community: "",
                };
                this.getTableData();
            },
            // 获取街道
            queryStreet() {
                this.streetData = [];
                return new Promise((resolve, reject) => {
                    this.$http.staffAssignmentsManage.queryStreet().then(res => {
                        if (res.code == 0) {
                            this.streetData = res.data.map(e => {
                                return { key: e.regionCode, value: e.regionName };
                            });
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 获取社区  townCode
            getCommunityList(data) {
                let params = { townCode: data };
                this.$http.residentManageStatistics
                    .getCommunityList(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.communityList = res.data;
                        } else {
                        }
                    })
                    .catch(err => {});
            },
            //街道改变获取社区
            changeOrg(data) {
                this.searchParams.teamId = "";
                this.communityList = [];
                if (data) {
                    this.getCommunityList(data);
                }
            },
            async getTableData() {
                this.loading = true;
                this.tableData = [];
                let data = {
                    ...this.searchParams,
                    ...this.paginationConfig,
                };
                await this.$http.residentQuantity.gridPeopleList(data).then(res => {
                    if (res.code == 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                    }
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

<style scoped lang="less">
    .ctn-grid-manage {
        .mhi-search {
            //padding: 0 20px;
        }
    }
</style>
