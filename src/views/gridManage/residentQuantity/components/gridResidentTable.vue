<template>
    <div>
        <paginationTable
            :total="paginationConfig.total"
            :tableData="tableData"
            :showMore="showMore"
            @callbackPageSize="callbackPageSize"
            @callbackPageNo="callbackPageNo"
        >
            <el-table-column label="姓名" prop="userName" min-width="100"></el-table-column>
            <el-table-column label="性别" width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "—" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" prop="age" width="60"></el-table-column>
            <el-table-column label="身份证号" prop="identity" min-width="180"></el-table-column>
            <el-table-column label="联系电话" prop="phone" min-width="130"></el-table-column>
            <el-table-column
                show-overflow-tooltip
                label="学历"
                prop="education"
                min-width="120"
            ></el-table-column>
            <el-table-column label="区域" prop="regionName" min-width="130"></el-table-column>
            <el-table-column
                label="街道"
                prop="street"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="社区"
                prop="community"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="网格号"
                prop="gridName"
                min-width="160"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="楼栋"
                prop="buildingName"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="网格地址"
                prop="gridAddr"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="医疗地址"
                prop="medicalAddr"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="确认地址"
                prop="confirmAddr"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
<!--            <el-table-column-->
<!--                label="录入时间"-->
<!--                prop="createTime"-->
<!--                min-width="120"-->
<!--                show-overflow-tooltip-->
<!--            ></el-table-column>-->
<!--            <el-table-column-->
<!--                label="录入人"-->
<!--                prop="createBy"-->
<!--                min-width="120"-->
<!--                show-overflow-tooltip-->
<!--            ></el-table-column>-->
            <el-table-column
                label="更新时间"
                prop="updateTime"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
<!--            <el-table-column-->
<!--                label="更新人"-->
<!--                prop="updateBy"-->
<!--                min-width="120"-->
<!--                show-overflow-tooltip-->
<!--            ></el-table-column>-->
            <el-table-column label="操作" width="100" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        class="text-btn"
                        @click="handleAssign(scope.row)"
                    >
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </paginationTable>
        <!-- <el-dialog
            v-dialogDrag
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            @close="handleCancel"
        > -->
        <el-dialog
            width="600px"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            @close="handleCancel"
        >
            <div slot="title">
                <span style="font-size: 18px">居民详细信息</span>
            </div>
            <section class="detail" v-loading="dlgloading">
                <div class="detailRowTop">
                    <div class="detailLfet">
                        <el-form ref="allotForm" :model="currentRow" label-width="82px">
                            <el-form-item label="姓名:" prop="streetCode">
                                {{ currentRow.userName }}
                            </el-form-item>
                            <el-form-item label="年龄:" prop="community">
                                {{ currentRow.age }}
                            </el-form-item>
                            <el-form-item label="学历:" prop="buildingCode">
                                {{ currentRow.education }}
                            </el-form-item>
                            <el-form-item label="区域:" prop="address">
                                {{ currentRow.regionName }}
                            </el-form-item>
                            <el-form-item label="社区:" prop="assignOrgCode">
                                {{ currentRow.community }}
                            </el-form-item>
                            <el-form-item label="楼栋:" prop="buildingName">
                                {{ currentRow.buildingName }}
                            </el-form-item>
                            <el-form-item label="网格地址:" prop="gridAddr" class="gridAddr">
                                {{ currentRow.gridAddr }}
                            </el-form-item>
                            <el-form-item label="医疗地址:" prop="medicalAddr" class="medicalAddr">
                                {{ currentRow.medicalAddr }}
                            </el-form-item>
                            <el-form-item label="确认地址:" prop="confirmAddr" class="confirmAddr">
                                {{ currentRow.confirmAddr }}
                            </el-form-item>
<!--                            <el-form-item label="录入人:" prop="streetCode" class="createBy">-->
<!--                                {{ currentRow.createBy }}-->
<!--&lt;!&ndash;                            </el-form-item>&ndash;&gt;-->
<!--                            <el-form-item label="更新人:" prop="community">-->
<!--                                {{ currentRow.updateBy }}-->
<!--                            </el-form-item>-->
                        </el-form>
                    </div>
                    <div class="detailRight">
                        <el-form ref="allotForm" :model="currentRow" label-width="82px">
                            <el-form-item label="性别:" prop="streetCode">
                                {{ currentRow.sex == 1 ? "男" : currentRow.sex == 2 ? "女" : "-" }}
                            </el-form-item>
                            <el-form-item label="身份证号:" prop="community">
                                {{ currentRow.identity }}
                            </el-form-item>
                            <el-form-item label="联系电话:" prop="buildingCode">
                                {{ currentRow.phone }}
                            </el-form-item>
                            <el-form-item label="街道:" prop="address">
                                {{ currentRow.street }}
                            </el-form-item>
                            <el-form-item label="网格号:" prop="assignOrgCode">
                                {{ currentRow.gridCode }}
                            </el-form-item>
<!--                            <el-form-item label="录入时间:" prop="address" class="createTime">-->
<!--                                {{ currentRow.createTime }}-->
<!--                            </el-form-item>-->
                            <el-form-item label="更新时间:" prop="assignOrgCode">
                                {{ currentRow.updateTime }}
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </section>
        </el-dialog>
    </div>
</template>

<script>
    import paginationTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: { paginationTable },
        props: {
            tableData: {
                type: Array,
                required: true,
            },
            paginationConfig: {
                type: Object,
                required: true,
            },
            showMore: {
                type: Boolean,
            },
        },
        data() {
            return {
                dialogVisible: false,
                dlgloading: false,
                btnloading: false,
                tableHeight: 700,
                currentRow: "", // 弹窗当前行
                streetData: [],
            };
        },
        mounted() {},
        methods: {
            handleAssign(row) {
                this.currentRow = row;
                this.dialogVisible = true;
            },
            handleCancel() {
                this.dialogVisible = false;
            },
            callbackPageNo(num) {
                this.$emit("callbackPageNo", num);
            },
            callbackPageSize(num) {
                this.$emit("callbackPageSize", num);
            },
        },
    };
</script>

<style scoped lang="less">
    .text-btn {
        padding: 0;
    }
    .detail {
        margin-top: -8px;
        .detailRowTop {
            height: 390px;
            display: flex;
            .detailLfet,
            .detailRight {
                height: 390px;
                width: 284px;
                /deep/ .el-form-item {
                    margin-bottom: 16px;
                    .el-form-item__label,
                    .el-form-item__content {
                        width: 148px;
                        height: 20px;
                        font-size: 14px;
                        font-family: MicrosoftYaHei;
                        color: #262e38;
                        line-height: 20px;
                    }
                }
            }
            .detailLfet {
                position: relative;
                .confirmAddr {
                    white-space: nowrap;
                    position: absolute;
                    margin-top: 72px;
                }
                .gridAddr {
                    white-space: nowrap;
                    position: absolute;
                }
                .medicalAddr {
                    white-space: nowrap;
                    position: absolute;
                    margin-top: 36px;
                }
                .createBy {
                    margin-top: 122px;
                }
            }
            .detailRight {
                // display: flex;
                // flex: 1;
                // justify-content: flex-end;
                .createTime {
                    margin-top: 158px;
                }
            }
        }
        .detailRowBottom {
            display: flex;
            .detailRight {
                display: flex;
                flex: 1;
                justify-content: flex-end;
            }
        }
    }
    .detail .el-input,
    .detail .el-select {
        width: 100%;
    }
    .detail .el-form-item {
        margin-bottom: 10px;
    }
</style>
