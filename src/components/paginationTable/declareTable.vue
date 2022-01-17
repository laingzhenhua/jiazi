<template>
    <div class="pagination_table_container">
        <div class="table_container">
            <el-table
                ref="multipleTable"
                :data="tableData"
                v-if="height"
                :border="border"
                :span-method="cellMerge"
                :height="height"
                :header-cell-style="{ background: '#F6F7F9' }"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClickChange"
                size="medium"
                :stripe="stripe"
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
                    type="index"
                    label="序号"
                    align="center"
                    width="60"
                    v-if="showColumnIndex"
                    :index="index => (pageNo - 1) * pageSize + index + 1"
                ></el-table-column>
                <slot></slot>
            </el-table>
        </div>
        <div class="footer_pagination" v-if="showPaginationT">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[50, 100, 200, 300, 400]"
                :page-size.sync="pageSize"
                :current-page.sync="pageNo"
                layout="total, sizes, prev, pager, next"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "paginationTable",
        props: {
            reducingHigh: {
                type: String,
                default: "0",
            },
            tableData: {
                type: Array,
                default: [],
            },
            total: {
                type: Number,
                default: 0,
            },
            showColumnIndex: {
                type: Boolean,
                default: false,
            },
            showPagination: {
                type: Boolean,
                default: true,
            },
            minHeight: {
                type: Boolean,
                default: false,
            },
            multiple: {
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
        },
        data() {
            return {
                list: this.tableData,
                height: undefined,
                otherHigh: this.reducingHigh,
                totals: this.total,
                pageSize: this.pageSizeT,
                pageNo: this.pageNoT,
                multipleSelection: [],
                resetRender: true,
                showPaginationT: this.showPagination,
            };
        },
        created() {
            this.otherHigh = this.reducingHigh;
            this.list = this.tableData;
            this.totals = this.total;
        },
        methods: {
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
            // computedHeight() {
            //   let browserHigh = document.body.clientHeight - 60 - 40 - 5;
            //   let computedHigt = this.showPagination
            //     ? this.otherHigh
            //     : this.otherHigh - 48;
            //   this.height = browserHigh - computedHigt + "px";
            // },
            computedHeight() {
                let browserHigh = null;
                if (document.getElementsByClassName("search_box")[0]) {
                    let search = document.getElementsByClassName("search_box")[0].clientHeight;
                    browserHigh = document.body.offsetHeight - 105 - 20 - 16 - 20 - 16 - search;
                } else {
                    browserHigh = document.body.offsetHeight - 105 - 20 - 16 - 16;
                }
                let computedHigt = this.showPagination ? 48 : 0;
                if (this.minHeight && screen.width <= 1366) {
                    this.height = browserHigh - computedHigt + "px";
                } else {
                    this.height = browserHigh - this.otherHigh - computedHigt + "px";
                }
            },
            handleRowClickChange(val) {
                this.$emit("handleRowClickChange", val);
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.computedHeight();
            });
            let that = this;
            window.addEventListener("resize", function() {
                that.$nextTick(() => {
                    // that.computedHeight();
                    that.computedHeight();
                });
            });
        },
    };
</script>

<style lang="less" scoped>
    .pagination_table_container {
        flex: 1;
        background-color: #ffffff;
        /*margin-top: 20px;*/
        /*padding: 26px 20px 0 20px;*/
        .footer_pagination {
            position: relative;
            top: -1px;
            z-index: 2;
            height: 48px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.1);
        }
        .table_container {
            padding: 0 20px;
        }
        /deep/ .el-table td,
        .el-table th {
        }
    }
    /deep/ .has-gutter {
        color: #262e38ff !important;
    }
</style>
