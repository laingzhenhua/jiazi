<template>
    <div v-loading="loading" class="mhi-zone-opt">
        <menu class="mhi-search clearFix" style="margin:0">
            <el-form class="l" inline>
                <el-form-item label="菜单名称">
                    <el-input
                        size="small"
                        :clearable="true"
                        maxlength="50"
                        @keyup.enter="query"
                        type="text"
                        placeholder="请输入菜单名称"
                        v-model="menuName"
                    ></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button
                        @click="query"
                        size="small"
                        class="query-btn"
                        type="primary"
                        icon="el-icon-search"
                    >
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="empty" size="small" icon="el-icon-refresh-right">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </menu>
        <main class="clearFix" style="position: relative;display: flex">
            <el-scrollbar class="tree-box mr-20" ref="curTreeBox" :style="treeBoxStyle">
                <el-tree
                    :data="treeData"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                ></el-tree>
            </el-scrollbar>
            <section class="table-box" :style="tableBoxStyle" style="">
                <page-table
                    :tableData="tableData"
                    :total="totalCount"
                    @callbackPageSize="handleSizeChange"
                    @callbackPageNo="handleCurrentChange"
                >
                    <el-table-column
                        show-overflow-tooltip
                        label="菜单编码"
                        prop="menuCode"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="菜单名称"
                        prop="menuName"
                    ></el-table-column>
                    <el-table-column
                        label="菜单路径"
                        show-overflow-tooltip
                        prop="menuUrl"
                    ></el-table-column>
                    <el-table-column align="center" fixed="right" label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.state"
                                :active-value="1"
                                :inactive-value="2"
                                @change="changeStatus(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                </page-table>
                <!-- <el-pagination
                    background=""
                    :current-page.sync="currentPage"
                    :total="totalCount"
                    @current-change="handleCurrentChange"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"
                    layout="total,prev, pager, next, jumper"
                ></el-pagination> -->
            </section>
        </main>
    </div>
</template>

<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: {pageTable},
        data() {
            return {
                loading: false,
                menuName: "",
                totalCount: 0,
                pageNo: 1,
                pageSize: 50,
                currentPage: 1,
                treeData: [],
                tableData: [],
                defaultProps: {
                    children: "children",
                    label: "menuName",
                },
                parentCode: "",
                treeBoxStyle: {},
                tableBoxStyle: {},
            };
        },
        created() {
            this.menuTree();
            this.dataList();
        },
        mounted() {
            this.$nextTick(() => {
                let mhiZoneDom = document.querySelector(".mhi-zone-opt");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 260 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            });
            window.addEventListener("resize", this.resizeLogic1, false);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resizeLogic1); //解绑resize事件
        },
        methods: {
            resizeLogic1() {
                let mhiZoneDom = document.querySelector(".mhi-zone-opt");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 260 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            },
            menuTree() {
                this.$http.sysMenu.sysTree().then(res => {
                    // console.log(res);
                    if (res.code === 0) {
                        this.treeData = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            dataList(cb) {
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    menuName: this.menuName,
                    parentCode: this.parentCode,
                };
                this.$http.sysMenu.menuList(params).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.totalCount = res.data.totalCount;
                        cb && cb();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            query() {
                this.pageNo = 1;
                this.currentPage = 1;
                this.parentCode = "";
                this.dataList();
            },
            empty() {
                this.menuName = "";
                this.query();
            },
            handleNodeClick(data) {
                this.menuName = "";
                this.pageNo = 1;
                this.currentPage = 1;
                this.parentCode = data.menuCode;
                console.log(data);
                this.dataList();
            },
            changeStatus(row) {
                console.log(row);
                let params = {
                    id: row.id,
                    state: row.state,
                };

                this.$http.sysMenu.menuEditState(params).then(res => {
                    if (res.code === 0) {
                        row.state == 2
                            ? this.$message.success("已禁用")
                            : this.$message.success("已启用");
                        this.$http.sysMenu.menuTree().then(res => {
                            if (res.code == 0) {
                                this.$store.dispatch("setMenuList", res.data);
                            }
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.dataList();
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.dataList();
            },
        },
    };
</script>

<style lang="less" scoped>
    .mhi-zone-opt {
        /deep/ .el-main {
            padding: 0;
        }
    }
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .table-box{
        flex: 1;
        justify-content: flex-end;
        width: 100px !important;
        padding-left: 20px;
    }
    .tree-box {
        border: 1px solid #d8dee2ff;
        margin: 16px 0 0 0;

        width: 240px;
        box-sizing: border-box;
    }
    @media (max-width: 1600px) {
        .tree-box {
            margin-top: 8px;
        }
    }
</style>
