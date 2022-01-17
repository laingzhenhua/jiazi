<template>
    <div class="ctn-grid-preview">
        <div class="grid-statistics">
            <div class="grid-org-info">
                <div class="grid-title">
                    网格概况
                </div>
                <div class="grid-org">
                    <el-select
                        size="small"
                        v-model="orgCode"
                        clearable
                        filterable
                        @change="getData"
                    >
                        <el-option
                            :label="item.value"
                            :value="item.key"
                            v-for="item in orgList"
                            :key="item.key"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="grid-statistics-num">
                <div class="statistics-item" v-for="item in statisticsList" :key="item.id">
                    <div class="item-name">{{ item.name }}</div>
                    <countTo
                        :endVal="statisticsNum[item.id]"
                        :duration="1000"
                        class="item-num"
                    ></countTo>
                </div>
            </div>
        </div>
        <div class="statistics-report clearFix">
            <div class="report-item margin10">
                <div class="report-title">网格内人群比例</div>
                <report1 :orgCode="orgCode"></report1>
            </div>
            <div class="report-item margin20">
                <div class="report-title">重点人群管理情况</div>
                <report2 :orgCode="orgCode"></report2>
            </div>
            <div class="report-item">
                <div class="report-title">签约人群结构</div>
                <report3 :orgCode="orgCode"></report3>
            </div>
        </div>
        <div class="statictics-table">
            <div class="table-title">
                <div>网格居民管理统计</div>
                <div @click="toStatistics">
                    <span>
                        查看更多
                        <i class="iconfont icon-chakangengduo"></i>
                    </span>
                </div>
            </div>
            <paginationTable
                :tableData="tableData"
                ref="treeTable"
                :lazy="true"
                :load="loadChildren"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @expandChangeHandler="expandChangeHandler"
                :showColumnIndex="false"
                :showPagination="false"
                :rowKey="'id'"
            >
                <el-table-column
                    fixed
                    prop="title"
                    label="机构"
                    width="220"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="gridTotalCount"
                    label="网格居民总数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="totalResidentNum"
                    label="应管人数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="totalSignedResidentNum"
                    label="签约总人数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="signDynamicRate"
                    label="签约服务动态管理率"
                    min-width="105"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>
                            {{
                                scope.row.signDynamicRate == "—"
                                    ? "—"
                                    : scope.row.signDynamicRate + "%"
                            }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="firstDiagRate" label="首诊率" min-width="105" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{
                                scope.row.firstDiagRate == "—" ? "—" : scope.row.firstDiagRate + "%"
                            }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="重点人群" align="center">
                    <el-table-column
                        prop="keyPersonCount"
                        label="应管人数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonSignCount"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonGridSignCount"
                        label="网格签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonNoGridSignCount"
                        label="非网格签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.keyPersonSignRate == "—"
                                        ? "—"
                                        : scope.row.keyPersonSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </paginationTable>
        </div>
    </div>
</template>

<script>
    import countTo from "vue-count-to";
    import report1 from "./components/report1.vue";
    import report2 from "./components/report2.vue";
    import report3 from "./components/report3.vue";
    import paginationTable from "../../../components/paginationTable/paginationTable";
    import handleTreeData from "./handleTreeData.js";
    export default {
        name: "index",
        components: {
            countTo,
            report1,
            report2,
            report3,
            paginationTable,
        },
        data() {
            return {
                orgCode: "",
                statisticsNum: {},
                reportList: [],
                tableData: [],
                orgList: [],
                nochart1: "",
                nochart2: "",
                nochart3: "",
                processedData: [],
                refresh: true,
                statisticsList: [
                    {name: "街道数", id: "streetNum"},
                    {name: "社区数", id: "communityNum"},
                    {name: "楼栋数", id: "buildingNum"},
                    {name: "网格数", id: "gridNum"},
                    {name: "应管数", id: "shouldMgntNum"},
                    {name: "重点数", id: "keyGroupsNum"},
                    {name: "已签约数", id: "signedNum"},
                    {name: "户籍非重点", id: "notKeyRegisterNum"},
                ],
            };
        },
        created() {
            this.getOrgList();
            this.getData();
            this.$store.dispatch("setGlobalLoading", true);
        },
        methods: {
            getOrgList() {
                this.$http.common.queryOrg().then(res => {
                    if (res.code === 0) {
                        this.orgList = res.data;
                        this.$store.dispatch("setGlobalLoading", false);
                    }
                });
            },
            getData() {
                this.getStatistics();
                this.getDataList();
            },
            getStatistics() {
                this.$http.gridPreview.getStatistics({orgCode: this.orgCode}).then(res => {
                    if (res.code === 0) {
                        this.statisticsNum = res.data;
                    }
                });
            },
            // 获取列表数据
            async getDataList() {
                let formData = {
                    orgCode: this.orgCode,
                    // teamId: this.searchParams1.teamId,
                };
                this.loading = true;
                this.$http.residentManageStatistics
                    .getDoctorService(formData)
                    .then(res => {
                        if (res.code === 0) {
                            if (res.data.length === 0) {
                                this.tableData = [];
                                this.processedData = [];
                                this.refresh = true;
                            } else {
                                handleTreeData
                                    .addHasChildren(res.data) //对children长度大于0的添加hasChildren属性
                                    .then(res => {
                                        return handleTreeData.flatTree(res); //数组结构扁平化
                                    })
                                    .then(res => {
                                        return handleTreeData.delChildren(res); //删除children属性
                                    })
                                    .then(res => {
                                        this.processedData = this.$emptyHandle(res, []); //处理后的表格数据
                                        this.tableData = this.processedData.filter(item => {
                                            //要渲染的表格数据
                                            return item.parentId == undefined;
                                        });
                                        this.refresh = true;
                                    });
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                    });
            },
            // 树形表格展开or收起
            expandChangeHandler({row, expanded}) {
                if (expanded) {
                    // console.log("展开了。。。", row);
                    let childrenData = this.processedData.filter(item => {
                        return item.parentId == row.id;
                    });
                    /**
                     * 展开时更新子节点数据
                     */
                    this.refreshRow(row.id, childrenData);
                } else {
                    /**
                     * 收起时把子节点数据情清空
                     */
                    // console.log("收起了。。。", row);
                    // this.refreshRow(row.id, []);
                }
            },
            // 加载子节点数据
            loadChildren(tree, treeNode, resolve) {
                let childrenData = this.processedData.filter(item => {
                    return item.parentId == tree.id;
                });
                resolve(childrenData);
            },
            refreshRow(id, data) {
                this.$set(
                    this.$refs.treeTable.$refs.multipleTable.store.states.lazyTreeNodeMap,
                    id,
                    data,
                );
            },
            toStatistics() {
                this.$store.dispatch("setAsideStatus", "/gridApplication/residentManageStatistics");
                this.$router.push("/gridApplication/residentManageStatistics")
            },
        },
    };
</script>

<style lang="less" scoped>
    .ctn-grid-preview {
        width: 100%;
        .grid-statistics {
            width: 100%;
            box-sizing: border-box;
            .grid-org-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .grid-title {
                    font-size: 18px;
                    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                    font-weight: bold;
                    color: #323a46;
                    line-height: 24px;
                    display: inline-block;
                }
                .grid-org {
                    display: inline-block;
                }
            }
            .grid-statistics-num {
                margin-top: 16px;
                display: flex;
                justify-content: space-between;
                .statistics-item {
                    width: calc(calc(100% - 140px) / 8);
                    height: 116px;
                    background: #ffffff;
                    border: 1px solid #dbe1e8;
                    border-radius: 2px;
                    padding: 12px;
                    text-align: center;
                    .item-name {
                        font-size: 16px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #3c4353;
                        line-height: 22px;
                        border-bottom: 1px solid #dbe1e8;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                        box-sizing: content-box;
                    }
                    .item-num {
                        font-size: 28px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #00acc7;
                        line-height: 40px;
                    }
                }
            }
        }
        .statistics-report {
            width: 100%;
            height: 319px;
            margin: 20px auto;
            .report-item {
                width: calc(calc(100% - 40px) / 3);
                height: 319px;
                background: #ffffff;
                border: 1px solid #dbe1e8;
                padding: 16px;
                float: left;
                .report-title {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 700;
                    color: #2c3542;
                    line-height: 22px;
                }
            }
            .margin20 {
                margin: 0 20px;
            }
        }
        .statictics-table {
            width: 100%;
            background: #ffffff;
            .table-title {
                line-height: 22px;
                margin-bottom: 0;
                display: flex;
                justify-content: space-between;
                div {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 700;
                    color: #000000;
                }
                div:last-of-type {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #00acc7;
                    cursor: pointer;
                    line-height: 22px;
                }
            }
        }
    }
    @media only screen and (max-width: 1600px) {
        .ctn-grid-preview {
            min-width: 1150px;
            .grid-statistics {
                .grid-org-info {
                    .grid-title {
                        font-size: 16px;
                        line-height: 21px;
                    }
                }
                .grid-statistics-num {
                    margin-top: 13px;
                    .statistics-item {
                        width: calc(calc(100% - 70px) / 8);
                        height: 70px;
                        padding: 8px;
                        min-width: 135px;
                        .item-name {
                            font-size: 16px;
                            line-height: 20px;
                            padding-bottom: 4px;
                            margin-bottom: 4px;
                        }
                        .item-num {
                            font-size: 20px;
                            line-height: 28px;
                        }
                    }
                }
            }
            .statistics-report {
                height: 490px;
                margin: 10px auto;
                .report-item {
                    width: calc(calc(100% - 10px) / 2);
                    height: 240px;
                    padding: 12px;
                    min-width: 570px;
                }
                .margin10 {
                    margin-bottom: 10px;
                }
                .margin20 {
                    margin: 0 0 0 10px;
                    height: 490px;
                    float: right;
                }
            }
            .statictics-table {
                width: 100%;
                background: #ffffff;
                .table-title {
                    margin-bottom: -6px;
                }
            }
        }
    }
</style>
