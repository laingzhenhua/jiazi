<template>
    <div>
        <el-dialog
            v-dialogDrag
            :close-on-click-modal="false"
            title="审核未通过人数"
            :visible.sync="dialogVisible"
            class="clearFix dialog-box"
            width="1000px"
            @close="closeDialog"
        >
            <div v-loading="loading">
                <!-- 表格 -->
                <el-table :data="tableData">
                    <el-table-column
                        show-overflow-tooltip
                        label="排除类别"
                        prop="type"
                        width="100"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="姓名"
                        prop="name"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="性别"
                        prop="sex"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="年龄"
                        prop="age"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="人群分类"
                        prop="crowdType"
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="驳回理由"
                        prop="remark"
                        width="120"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="审核人"
                        prop="userName"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="审核时间"
                        prop="updateTime"
                        width="180"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="操作"
                        prop="orgName"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false" @click="isRead(scope.row,1)" v-if="scope.row.isRead !== '已读'">标记已读</el-link>
                            <el-link type="primary" :underline="false" @click="isRead(scope.row,0)" v-else>撤销已读</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 底部按钮 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[50, 100, 200, 300, 400]"
                    :page-size.sync="paginationConfig.pageSize"
                    :current-page.sync="paginationConfig.pageNo"
                    layout="total, sizes, prev, pager, next"
                    :total="paginationConfig.total"
                    prev-text="上一页"
                    next-text="下一页"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>


<script>
// import pageTable from "/src/components/paginationTable/paginationTable";
    import {personCheckFailedList, personUpdateReadState} from "../../../../httpRequset/module/residentManage";
    export default {
        props: ["visible", "params"],
        components: {},
        data() {
            return {
                dialogVisible: false,
                loading: false,
                saveLoading: false,
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总页数
                    pageSize: 50, //每页容量
                    currentPage: 1, //当前页
                },
            };
        },
        watch: {
            visible: function (val) {
                this.dialogVisible = val;
            },
        },
        created() {
            this.getTableData();
        },
        computed: {},
        methods: {
            handleSizeChange(val) {
                this.paginationConfig.pageSize = val;
                this.getTableData();
            },
            handleCurrentChange(val) {
                this.paginationConfig.currentPage = val;
                this.getTableData();
            },
            //更新已读/未读
            isRead(row,type){
                let params ={
                    shouldManageId: row.shouldManageId,
                    readState: type
                }
                this.$http.residentManage.personUpdateReadState(params)
                    .then((res) => {
                        if (res.code === 0) {
                            this.$emit("callBackConfirm",type);
                            this.$message.success("操作成功")
                            this.getTableData();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            },
            //审核未通过通知列表
            getTableData(){
                let params ={
                    pageSize: this.paginationConfig.pageSize,
                    pageNo: this.paginationConfig.currentPage
                }
                this.$http.residentManage.personCheckFailedList(params)
                    .then((res) => {
                        if (res.code === 0) {
                            this.tableData = res.data.content;
                            this.paginationConfig.total = res.data.totalCount;
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            },
            closeDialog(){
                this.$emit("callBackCancel",false);
                return false;
            }

        },
    };
</script>

<style lang="less" scoped>
</style>

