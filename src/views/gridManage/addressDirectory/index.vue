<template>
    <div class="sys-grid" v-loading="loading">
        <section class="pb-20">
            <h2>网格源设置</h2>
            <div class="grid-box">
                <div class="grid-pane">
                    <gridPane :paneType="1" :editable="false" @onSelect="handleSelect" />
                </div>
                <div class="grid-pane">
                    <gridPane :paneType="2" :editable="false" @onSelect="handleSelect" />
                </div>
                <div class="grid-pane">
                    <gridPane
                        :paneType="3"
                        :editable="false"
                        :paneParam="streetParam"
                        @onSelect="handleSelect"
                    />
                </div>
                <div class="grid-pane">
                    <gridPane :paneType="4" :paneParam="communityParam" @onSelect="handleSelect" />
                </div>
                <div class="grid-pane">
                    <gridPane
                        ref="buildingPane"
                        :paneType="5"
                        :paneParam="gridParam"
                        :communityCode="communityParam"
                        @onSelect="handleSelect"
                        @onSuccess="getTableData"
                    />
                </div>
            </div>
        </section>
        <section class="pt-20">
            <h2>未匹配地址列表</h2>
            <page-table
                :total="paginationConfig.total"
                :tableData="tableData"
                @callbackPageSize="callbackPageSize"
                @callbackPageNo="callbackPageNo"
                layout="total, prev, pager, next"
                :pageSizeT="6"
            >
                <el-table-column
                    label="区域"
                    prop="districtName"
                    min-width="110"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="街道"
                    prop="streetName"
                    min-width="110"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="社区"
                    prop="regionName"
                    min-width="110"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    label="楼栋"
                    prop="buildingName"
                    min-width="220"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            class="text-btn"
                            @click="handleMatch(scope.row)"
                        >
                            设置网格
                        </el-button>
                    </template>
                </el-table-column>
            </page-table>
        </section>
        <!-- 设置弹窗 -->
        <!-- <el-dialog
            v-dialogDrag
            title="设置网格"
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            @close="handleCancel"
        > -->
        <el-dialog
            title="设置网格"
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            @close="handleCancel"
        >
            <div class="match-form">
                <el-form ref="matchForm" :model="matchForm" :rules="matchRules" label-width="59px">
                    <el-form-item label="街道" prop="streetCode">
                        <el-select
                            size="small"
                            v-model="matchForm.streetCode"
                            @change="selectStreet"
                            filterable
                        >
                            <el-option
                                v-for="i in streetData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="社区" prop="communityCode">
                        <el-select
                            size="small"
                            v-model="matchForm.communityCode"
                            @change="selectCommunity"
                            filterable
                        >
                            <el-option
                                v-for="i in communityData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网格" prop="gridCode">
                        <el-select size="small" v-model="matchForm.gridCode" filterable>
                            <el-option
                                v-for="i in gridData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button size="small" @click="handleCancel">取消</el-button>
                <el-button size="small" type="primary" :loading="btnloading" @click="handleSave">
                    保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import gridPane from "./gridPane";
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: { gridPane, pageTable },
        props: {
            pageSizeT: {
                type: Number,
                default: 10,
            },
        },
        data() {
            return {
                loading: false,
                // 联级选中参数
                streetParam: "",
                communityParam: "",
                gridParam: "",
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0,
                    pageSize: 6,
                    pageNo: 1,
                },
                // 弹窗
                dialogVisible: false,
                btnloading: false,
                currentBuilding: "",
                matchForm: {
                    streetCode: "",
                    communityCode: "",
                    gridCode: "",
                },
                matchRules: {
                    streetCode: [{ required: true, message: "请选择街道", trigger: "blur" }],
                    communityCode: [{ required: true, message: "请选择社区", trigger: "blur" }],
                    gridCode: [{ required: true, message: "请选择网格", trigger: "blur" }],
                },
                streetData: [],
                communityData: [],
                gridData: [],
            };
        },
        mounted() {
            this.queryStreet();
            this.getTableData();
        },
        methods: {
            callbackPageSize(val) {
                this.paginationConfig.pageSize = val;
                this.getTableData();
            },
            callbackPageNo(val) {
                this.paginationConfig.pageNo = val;
                this.getTableData();
            },
            // 处理联级选择
            handleSelect({ data, type }) {
                switch (type) {
                    case 1:
                        break;
                    case 2:
                        this.streetParam = data.key;
                        this.communityParam = "";
                        this.gridParam = "";
                        break;
                    case 3:
                        this.communityParam = data.key;
                        this.gridParam = "";
                        break;
                    case 4:
                        this.gridParam = data.key;
                        break;
                    default:
                        break;
                }
            },
            // 获取未匹配楼栋列表
            getTableData() {
                let param = {
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                };
                this.loading = true;
                this.$http.staffAssignmentsManage
                    .getUnmatchBuilding(param)
                    .then(res => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.paginationConfig.total = res.data.totalCount;
                            this.tableData = res.data.content;
                        } else {
                            this.paginationConfig.total = 0;
                            this.tableData = [];
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                        this.paginationConfig.total = 0;
                        this.tableData = [];
                    });
            },
            // 获取街道
            queryStreet(area) {
                this.$http.staffAssignmentsManage
                    .queryStreet()
                    .then(res => {
                        if (res.code == 0) {
                            this.streetData = res.data.map(e => {
                                return { key: e.regionCode, value: e.regionName };
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(res => {});
            },
            queryCommunity(street) {
                let param = { townCode: street };
                this.$http.staffAssignmentsManage
                    .queryCommunity(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.communityData = res.data;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(res => {});
            },
            queryGrid(community) {
                let param = { regionCode: community };
                this.$http.staffAssignmentsManage
                    .queryGrid(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.gridData = res.data;
                        }
                    })
                    .catch(res => {});
            },
            // 选择街道
            selectStreet(nv) {
                if (nv) {
                    this.matchForm.communityCode = "";
                    this.matchForm.gridCode = "";
                    this.queryCommunity(nv);
                    this.gridData = [];
                }
            },
            // 选择社区
            selectCommunity(nv) {
                if (nv) {
                    this.matchForm.gridCode = "";
                    this.queryGrid(nv);
                }
            },
            // 设置网格
            handleMatch(row) {
                this.queryCommunity(row.streetCode);
                this.queryGrid(row.regionCode);
                this.matchForm.streetCode = row.streetCode;
                this.matchForm.communityCode = row.regionCode;
                this.currentBuilding = row.buildingCode;
                this.dialogVisible = true;
            },
            // 保存
            handleSave() {
                this.$refs.matchForm.validate().then(valid => {
                    let param = {
                        buildingCode: this.currentBuilding,
                        gridCode: this.matchForm.gridCode,
                    };
                    this.btnloading = true;
                    this.$http.staffAssignmentsManage
                        .addBuilding(param)
                        .then(res => {
                            if (res.code == 0) {
                                this.$message.success("保存成功");
                                this.handleCancel();
                                this.getTableData();
                                this.$refs.buildingPane.switchItem();
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.btnloading = false;
                        })
                        .catch(res => {
                            this.btnloading = false;
                        });
                });
            },
            // 取消
            handleCancel() {
                this.dialogVisible = false;
                this.$refs.matchForm.resetFields();
            },
        },
    };
</script>

<style scoped lang="less">
    .sys-grid {
        width: 100%;
        section {
            h2 {
                font-size: 16px;
                font-weight: bold;
            }
        }
        .pb-20 {
            padding-bottom: 16px;
            h2 {
                margin-bottom: 10px;
            }
        }
        .pt-20 {
            padding-top: 10px;
            h2 {
                margin-bottom: -6px;
            }
        }
        .grid-box {
            width: 100%;
            display: flex;
            border-left: 1px solid #dbe1e8;
            .grid-pane {
                flex: 1;
                border: 1px solid #dbe1e8;
                border-left: 0;
            }
        }
        .text-btn {
            padding: 0;
        }
        .match-form {
            display: flex;
            justify-content: center;
        }
    }
</style>
