<template>
    <div v-loading="loading">
        <section>
            <!--      <menu class="mhi-search clearFix">-->

            <!--&lt;!&ndash;        <div class="r" >&ndash;&gt;-->
            <!--&lt;!&ndash;          <el-button&ndash;&gt;-->
            <!--&lt;!&ndash;            type="primary"&ndash;&gt;-->
            <!--&lt;!&ndash;            size="small"&ndash;&gt;-->
            <!--&lt;!&ndash;            icon="el-icon-back"&ndash;&gt;-->
            <!--&lt;!&ndash;            @click="handleBack({to:'index'})"&ndash;&gt;-->
            <!--&lt;!&ndash;          >返回</el-button>&ndash;&gt;-->
            <!--&lt;!&ndash;        </div>&ndash;&gt;-->
            <!--      </menu>-->
            <main>
                <paginationTable
                    :tableData="tableData"
                    :showPagination="false"
                    :treeProps="{children: 'children', hasChildren: 'hasChildren'}"
                    :load="loadChildren"
                    :lazy="true"
                    :showColumnIndex="false"
                    @rowClick="clickRow"
                    @expandChangeHandler="expandChangeHandler"
                    multipleTable="multipleTable"
                    :rowKey="'id'"
                >
                    <el-table-column
                        fixed="left"
                        prop="title"
                        label="社康名称"
                        width="220"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.title ? scope.row.title : "—" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="targetNum"
                        label="目标签约人群总数"
                        min-width="105"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.targetNum != null ? scope.row.targetNum : "—" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="signedNum"
                        label="目标人群已签约数"
                        min-width="105"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.signedNum != null ? scope.row.signedNum : "—" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="unsignNum"
                        label="目标人群未签约数"
                        min-width="105"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.unsignNum == null ? "—" : scope.row.unsignNum }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="excludeNum"
                        label="目标签约排除人群数量"
                        min-width="105"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div
                                v-if="
                                    scope.row.excludeNum != null &&
                                        scope.row.excludeNum != 0 &&
                                        scope.row.title != '合计'
                                "
                                style="color:red;text-decoration:underline;cursor:pointer;"
                                @click="handleCellEnter({data: scope.row, to: 'clickByViewDetail'})"
                            >
                                <span>{{ scope.row.excludeNum }}</span>
                            </div>
                            <span v-if="scope.row.title == '合计' || scope.row.excludeNum == 0">
                                {{ scope.row.excludeNum }}
                            </span>
                            <span v-if="scope.row.excludeNum == null">—</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sysExcludeRate"
                        label="目标签约完成率(%)"
                        min-width="115"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.signRate == null ? "—" : scope.row.signRate + "%" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="manualReviewRate"
                        label="人工复核真实率(%)"
                        min-width="115"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.checkRate == "—" ? "—" : scope.row.checkRate + "%" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="excludeRate"
                        label="目标签约完成率（校正后）"
                        min-width="120"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.checkSignRate == null
                                        ? "—"
                                        : scope.row.checkSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" min-width="105" align="center">
                        <template slot-scope="scope" v-if="scope.row.title != '合计'">
                            <span
                                v-show="scope.row.hasChildren == true && scope.row.checkType == 1"
                            >
                                <el-button
                                    @click.stop="handleEnter({data: scope.row, to: 'check'})"
                                    type="text"
                                    style="color: #00acc1;text-decoration: underline;cursor: pointer;"
                                >
                                    核查
                                </el-button>
                            </span>
                            <span
                                v-show="
                                    scope.row.hasChildren === undefined && scope.row.checkType == 2
                                "
                            >
                                <button
                                    @click.stop="handleEnter({data: scope.row, to: 'check'})"
                                    type="text"
                                    style="color: #00acc1;text-decoration: underline;cursor: pointer;"
                                >
                                    核查
                                </button>
                            </span>
                        </template>
                    </el-table-column>
                </paginationTable>
            </main>
        </section>
        <!--      <section v-else>-->
        <!--          <component-->
        <!--              :is="check"-->
        <!--              :taskId="taskId"-->
        <!--              :rowData="rowData"-->
        <!--              @listenChild="handleListenChild"-->
        <!--          ></component>-->
        <!--      </section>-->
    </div>
</template>

<script>
    import paginationTable from "../../../../components/paginationTable/paginationTable.vue";
    import handleTreeData from "./handleTreeData.js";
    // import Check from "./check";
    // import  clickByViewDetail from "./clickByViewDetail"
    function addId(data, nodeId = 1) {
        function work(children) {
            children.forEach(val => {
                val.nodeId = nodeId++;
                work(val.children);
            });
            return children;
        }
        return work(data);
    }
    export default {
        data() {
            return {
                loading: false,
                btnloading: false,
                isShow: true,
                orgData: [],
                rowData: {},
                check: "",
                searchParam: "",
                taskId: "",
                // 获取row的key值
                getRowKeys(row) {
                    return row.nodeId;
                },
                //是否展开
                isExpanded: {},
                processedData: [], //处理后的扁平树数据
                tableData: [],
                refresh: true,
            };
        },
        created() {
            this.getDataList();
        },

        methods: {
            // handleListenChild(data) {
            //     switch (data.to){
            //         case "index" :
            //             this.isShow = true;
            //             this.getDataList();
            //             break
            //         case "check" :
            //             this.check = Check;
            //             this.isShow = false;
            //             this.rowData = data.data
            //             break
            //         case "clickByViewDetail" :
            //             this.check = clickByViewDetail;
            //             this.isShow = false;
            //             this.rowData = data.data
            //             break
            //         default :
            //             break
            //     }
            //
            // },
            // 获取列表数据
            async getDataList() {
                this.loading = true;
                this.taskId = this.$route.query.row;
                let params = {
                    taskId: this.taskId,
                    orgCode: this.searchParam,
                };
                this.$http.sysSignCheckAgain.reportList(params).then(res => {
                    this.loading = false;
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
                                    this.processedData = this.$emptyHandle(res, []); //处理后的表格数据
                                    this.tableData = this.processedData.filter(item => {
                                        //要渲染的表格数据
                                        return item.parentId == undefined;
                                    });
                                    this.refresh = true;
                                });
                        }
                    } else {
                        // this.$message.error(res.msg);
                        this.tableData = [];
                    }
                });
            },
            //点击表格行 展开
            clickRow(row, event, column) {},
            //点击返回父级页面
            handleBack() {
                this.$router.push({
                    path: "/sys/dataReview/signCheckAgain",
                });
            },
            //点击行内跳转
            handleCellEnter(data) {
                this.$router.push({
                    path: "/sys/dataReview/signCheckAgain/clickByViewDetail",
                    query: {
                        orgCode: data.data.orgCode,
                        taskId: data.data.taskId,
                    },
                });
            },
            //点击操作跳转
            handleEnter(data) {
                this.$router.push({
                    path: "/sys/dataReview/signCheckAgain/check",
                    query: {
                        orgCode: data.data.orgCode,
                        taskId: data.data.taskId,
                    },
                });
            },
            // 加载子节点数据
            loadChildren(tree, treeNode, resolve) {
                let childrenData = this.processedData.filter(item => {
                    return item.parentId == tree.id;
                });
                resolve(childrenData);
            },
            // 树形表格展开or收起
            expandChangeHandler(row, expanded) {
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
            refreshRow(id, data) {
                this.$set(this.$refs.multipleTable.store.states.lazyTreeNodeMap, id, data);
            },
        },
        // eslint-disable-next-line vue/no-unused-components
        components: {paginationTable},
    };
</script>

<style scoped lang="less">
    .mhi-search {
        display: flex;
        padding: 0;
        margin: 0;
        height: 46px;
        .r {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            button {
                height: 33px;
                margin-top: 5px;
                margin-bottom: 16px;
            }
        }
    }
    .pagination_table_container {
        padding-top: 0;
    }
</style>
