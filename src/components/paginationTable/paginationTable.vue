<template>
    <div class="pagination_table_container" :class="tableClassName">
        <div class="table_container">
            <transition>
                <el-table
                    :ref="multipleTable"
                    :data="tableData"
                    v-if="height"
                    :border="border"
                    :span-method="cellMerge"
                    :height="height"
                    @expand-change="expandChangeHandler"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    @row-click="rowClick"
                    @current-change="handleCurrentTable"
                    size="normal"
                    :stripe="stripe"
                    :lazy="lazy"
                    :row-key="rowKey"
                    :tree-props="treeProps"
                    :load="load"
                    :highlight-current-row="highlightCurrentRow"
                >
                    <!-- 多选 -->
                    <el-table-column
                        v-if="multiple"
                        type="selection"
                        width="55"
                        align="center"
                    ></el-table-column>
                    <!-- 序号 -->
                    <el-table-column
                        show-overflow-tooltip
                        type="index"
                        label="序号"
                        align="center"
                        width="70"
                        v-if="showColumnIndex"
                        :index="index => (pageNo - 1) * pageSize + index + 1"
                    ></el-table-column>
                    <slot></slot>
                </el-table>
            </transition>
        </div>
        <div class="footer_pagination" v-if="showPaginationT">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[50, 100, 200, 300, 400]"
                :page-size.sync="pageSize"
                :current-page.sync="pageNo"
                :layout="layout"
                :total="total"
                prev-text="上一页"
                next-text="下一页"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "paginationTable",
        props: {
            reducingHigh: {
                type: Number,
                default: 0,
            },
            layout: {
                type: String,
                default: "total, sizes, prev, pager, next",
            },
            multipleTable: {
                type: String,
                default: "multipleTable",
            },
            treeProps: {
                type: Object,
                default: () => {},
            },
            rowKey: {
                type: String,
                default: undefined,
            },
            tableData: {
                type: Array,
                default: () => [],
            },
            total: {
                type: Number,
                default: 0,
            },
            load: {
                type: Function,
                default: () => {},
            },
            showColumnIndex: {
                type: Boolean,
                default: true,
            },
            showPagination: {
                type: Boolean,
                default: true,
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            highlightCurrentRow: {
                type: Boolean,
                default: false,
            },
            cellMerge: {
                type: Function,
                default: () => {},
            },
            border: {
                type: Boolean,
                default: false,
            },
            stripe: {
                type: Boolean,
                default: true,
            },
            pageNoT: {
                type: Number,
                default: 1,
            },
            pageSizeT: {
                type: Number,
                default: 50,
            },
            lazy: {
                type: Boolean,
                default: true,
            },
            showMore: {
                type: Boolean,
                default: false,
            },
        },
        watch: {
            total: function(value) {
                this.totals = value;
            },
            tableData: function(value) {
                this.list = value;
            },
            pageNoT: function(value) {
                let that = this;
                that.pageNo = value;
                that.showPaginationT = false;
                that.$nextTick(function() {
                    that.showPaginationT = true;
                });
            },
            pageSizeT: function(value) {
                this.pageSize = value;
            },
            showMore: function(value) {
                this.computedHeight();
            },
        },
        data() {
            return {
                list: this.tableData,
                height: undefined,
                totals: this.total,
                pageSize: this.pageSizeT,
                pageNo: this.pageNoT,
                multipleSelection: [],
                resetRender: true,
                showPaginationT: this.showPagination,
                tableClassName: "",
            };
        },
        created() {
            this.list = this.tableData;
            this.totals = this.total;
            this.tableClassName = `table-${Date.now()}`;
        },
        mounted() {
            this.$nextTick(() => {
                this.computedHeight();
            });
            let that = this;
            window.addEventListener("resize", function() {
                that.$nextTick(() => {
                    that.computedHeight();
                    that.changeTable();
                });
            });
        },
        beforeDestroy() {
            let that = this;
            window.removeEventListener("resize", function() {
                that.computedHeight();
                that.changeTable();
            });
        },
        methods: {
            changeTable() {
                try {
                    this.$refs.multipleTable.doLayout();
                } catch (error) {}
            },
            handleSizeChange(val) {
                let that = this;
                console.log(`每页 ${val} 条`);
                that.$emit("callbackPageSize", val);
            },
            handleCurrentChange(val) {
                let that = this;
                console.log(`当前页: ${val}`);
                that.$emit("callbackPageNo", val);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.$emit("callbackMultipleSelection", this.multipleSelection);
            },
            expandChangeHandler(val, expanded) {
                this.$emit("expandChangeHandler", {row: val, expanded});
            },
            handleCurrentTable(val) {
                this.$emit("handleCurrentTable", val);
            },

            computedHeight() {
                try {
                    const searchMoreDom = document.querySelector(".mhi-search-more");
                    let tableNode = document.querySelector(`.${this.tableClassName}`);
                    let bodyHeight = document.body.clientHeight;
                    let {top} = tableNode.getBoundingClientRect();
                    let paddingBottomHeight = this.getStyle(
                        document.querySelector(".el-main"),
                        "padding-bottom",
                    );
                    let computedHigt = this.showPagination ? 48 : 0;
                    let reducingHigh = this.reducingHigh || 0;
                    if (!this.showMore && searchMoreDom) {
                        let showMoreHeight = searchMoreDom.offsetHeight || 0;
                        let showMoreMargin = this.getStyle(searchMoreDom, "margin-bottom");
                        if (showMoreHeight > 0) {
                            top = top - showMoreHeight - showMoreMargin;
                        }
                    }
                    // paddingBottomHeight * 2 表格上间距和外层底部间距
                    let height =
                        bodyHeight - top - computedHigt - reducingHigh - (paddingBottomHeight * 2);
                    this.height = height < 252 ? 252 : height + "px";
                } catch (err) {}
            },
            rowClick: function(row) {
                if ((row.children && row.children.length) || row.hasChildren) {
                    this.$refs.multipleTable.toggleRowExpansion(row);
                    this.$nextTick(() => {
                        this.$refs.multipleTable && this.$refs.multipleTable.doLayout();
                    });
                }
                this.$emit("rowClick", row);
            },
            //获取当前样式
            getStyle(element, attr) {
                let num = "";
                if (element == null) {
                    return;
                }
                //特性侦测
                if (window.getComputedStyle) {
                    num = window.getComputedStyle(element)[attr];
                    //优先使用W3C规范
                } else {
                    //针对IE9以下兼容
                    num = element.currentStyle[attr];
                }
                return Number(num.substr(0, num.length - 2));
            },
        },
    };
</script>

<style lang="less" scoped>
    .pagination_table_container {
        flex: 1;
        background-color: #ffffff;
        padding-top: 16px;
        .footer_pagination {
            position: relative;
            top: -1px;
            z-index: 2;
            height: 48px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
        }
        /deep/ .el-table::before {
            position: static;
        }
        /deep/ .el-table__fixed-right::before,
        .el-table__fixed::before {
            position: static;
        }
    }
    /deep/ .has-gutter {
        color: #262e38ff !important;
    }

    @media (max-width: 1600px) {
        .pagination_table_container {
            padding-top: 8px;
        }
    }
</style>
