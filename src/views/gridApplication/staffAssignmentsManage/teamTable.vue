<template>
    <div>
        <page-table
            :total="paginationConfig.total"
            :tableData="tableData"
            :showMore="showMore"
            @callbackPageSize="callbackPageSize"
            @callbackPageNo="callbackPageNo"
        >
            <el-table-column label="姓名" prop="name" min-width="120"></el-table-column>
            <el-table-column label="性别" width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "—" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" prop="age" width="60"></el-table-column>
            <el-table-column label="联系电话" prop="tel" min-width="130"></el-table-column>
            <el-table-column label="联系人" prop="contacts" min-width="120"></el-table-column>
            <el-table-column label="联系人电话" prop="contactTel" min-width="130"></el-table-column>
            <el-table-column
                label="人群分类"
                prop="crowdFlag"
                min-width="160"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="街道"
                prop="streetName"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="社区名称"
                prop="communityName"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="详细地址"
                prop="address"
                min-width="160"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="核查结果" min-width="120">
                <template slot-scope="scope">
                    <span>{{ dataFmt(scope.row.mgntState, mgntDict) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="分配团队"
                prop="assignTeamName"
                min-width="120"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        class="text-btn"
                        @click="handleAssign(scope.row)"
                    >
                        {{ scope.row.assignState == 2 ? "分配团队" : "重新分配" }}
                    </el-button>
                </template>
            </el-table-column>
        </page-table>
        <el-dialog
            width="500px"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            @close="handleCancel"
        >
            <div slot="title">
                <span style="font-size: 18px">
                    人员分配 (
                    <span style="color: #00acc1">{{ currentRow ? currentRow.name : "" }}</span>
                    )
                </span>
                <span>{{ currentRow ? currentRow.crowdFlag : "" }}</span>
            </div>
            <section class="allot-form" v-loading="dlgloading">
                <el-form
                    ref="allotForm"
                    class="allot-form"
                    :model="formData"
                    :rules="formRules"
                    label-width="80px"
                >
                    <el-form-item label="街道" prop="streetCode">
                        <el-select
                            size="small"
                            v-model="formData.streetCode"
                            @change="selectStreet"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="i in streetData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="社区" prop="community">
                        <el-select
                            size="small"
                            v-model="formData.community"
                            @change="selectCommunity"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="i in communityData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网格楼栋" prop="buildingCode">
                        <el-select
                            size="small"
                            v-model="formData.buildingCode"
                            @change="selectBuilding"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="i in buildingData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input
                            v-model="formData.address"
                            size="small"
                            type="textarea"
                            maxlength="50"
                            :rows="2"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择团队" prop="assignTeamId">
                        <el-select
                            size="small"
                            v-model="formData.assignTeamId"
                            filterable
                            clearable
                        >
                            <el-option
                                v-for="i in teamData"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="核查结果" prop="mgntState">
                        <el-select size="small" v-model="formData.mgntState" filterable clearable>
                            <el-option
                                v-for="i in mgntDict"
                                :key="i.key"
                                :value="i.key"
                                :label="i.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="assignTeamRemark">
                        <el-input
                            v-model="formData.assignTeamRemark"
                            size="small"
                            type="textarea"
                            maxlength="100"
                            :rows="4"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-form>
            </section>
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
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: { pageTable },
        props: {
            tableData: {
                type: Array,
                required: true,
            },
            paginationConfig: {
                type: Object,
                required: true,
            },
            mgntDict: {
                type: Array,
                required: true,
            },
            showMore: {
                type: Boolean
            }
        },
        data() {
            return {
                dialogVisible: false,
                dlgloading: false,
                btnloading: false,
                formData: {
                    address: "",
                    assignTeamId: "",
                    assignTeamRemark: "",
                    buildingCode: "",
                    community: "",
                    streetCode: "",
                    mgntState: "",
                },
                tableHeight: 700,
                formRules: {
                    // mgntState: [
                    //   { required: true, message: "请选择核查结果", trigger: "blur" }
                    // ]
                },
                currentRow: null, // 弹窗当前行
                streetData: [],
                communityData: [],
                buildingData: [],
                initTeamData: [],
                matchTeamData: [],
            };
        },
        computed: {
            teamData() {
                if (this.formData.buildingCode && this.matchTeamData.length) {
                    return this.matchTeamData;
                } else {
                    return this.initTeamData;
                }
            },
        },
        mounted() {
            this.queryStreet();
        },
        methods: {
            dataFmt(val, dict) {
                if (val) {
                    for (const item of dict) {
                        if (item.key == val) {
                            return item.value;
                        }
                    }
                }
            },
            // 获取街道
            queryStreet() {
                this.streetData = [];
                this.$http.staffAssignmentsManage.queryStreet().then(res => {
                    if (res.code == 0) {
                        this.streetData = res.data.map(e => {
                            return { key: e.regionCode, value: e.regionName };
                        });
                    }
                });
            },
            queryCommunity() {
                this.communityData = [];
                let param = { townCode: this.formData.streetCode };
                return this.$http.staffAssignmentsManage.queryCommunity(param).then(res => {
                    if (res.code == 0) {
                        this.communityData = res.data;
                    }
                });
            },
            queryBuilding() {
                this.buildingData = [];
                let param = { regionCode: this.formData.community };
                return this.$http.staffAssignmentsManage.queryBuildingList(param).then(res => {
                    if (res.code == 0) {
                        this.buildingData = res.data;
                    }
                });
            },
            // 查询团队
            queryTeam(org) {
                this.initTeamData = [];
                let param = { orgCode: org };
                return this.$http.staffAssignmentsManage.queryTeam(param).then(res => {
                    if (res.code == 0) {
                        this.initTeamData = res.data;
                    }
                });
            },
            // 按楼栋自动匹配团队
            matchTeam(building) {
                this.matchTeamData = [];
                let param = { buildingCode: building };
                return this.$http.staffAssignmentsManage.queryTeamByBuilding(param).then(res => {
                    if (res.code == 0 && res.data && res.data.length) {
                        this.matchTeamData = res.data;
                        this.formData.assignTeamId = res.data[0].key;
                    }
                });
            },
            // 选择街道
            selectStreet(nv) {
                this.formData.community = "";
                this.formData.buildingCode = "";
                this.buildingData = [];
                if (nv) {
                    this.queryCommunity();
                } else {
                    this.communityData = [];
                }
            },
            // 选择社区
            selectCommunity(nv) {
                this.formData.buildingCode = "";
                if (nv) {
                    this.queryBuilding();
                } else {
                    this.buildingData = [];
                }
            },
            // 选择楼栋
            selectBuilding(nv) {
                this.formData.assignTeamId = "";
                if (nv) {
                    this.matchTeam(nv);
                }
            },
            async handleDialog(row) {
                this.dlgloading = true;
                this.queryTeam(row.assignOrgCode);
                if (row.streetCode) {
                    this.formData.streetCode = row.streetCode;
                    await this.queryCommunity();
                }
                if (row.community) {
                    this.formData.community = row.community;
                    await this.queryBuilding();
                }
                if (row.buildingCode) {
                    this.formData.buildingCode = row.buildingCode;
                    await this.matchTeam(row.buildingCode);
                }
                this.formData.address = row.address;
                this.formData.mgntState = row.mgntState == 0 ? "" : row.mgntState;
                this.formData.assignTeamId = row.assignTeamId;
                this.formData.assignTeamRemark = row.assignTeamRemark;
                this.dlgloading = false;
            },
            handleAssign(row) {
                this.handleDialog(row);
                this.currentRow = row;
                this.dialogVisible = true;
            },
            handleSave() {
                this.$refs.allotForm.validate().then(() => {
                    let param = {
                        id: this.currentRow.id,
                        ...this.formData,
                    };
                    this.btnloading = true;
                    this.$http.staffAssignmentsManage
                        .allotByTeam(param)
                        .then(res => {
                            if (res.code == 0) {
                                this.handleCancel();
                                this.$emit("listenSave");
                                this.$message.success("保存成功");
                            }
                            this.btnloading = false;
                        })
                        .catch(res => {
                            this.btnloading = false;
                        });
                });
            },
            handleCancel() {
                this.$refs.allotForm.resetFields();
                this.currentRow = null;
                this.dialogVisible = false;
            },
            callbackPageSize(pageSize) {
                this.$emit("callbackPageSize", pageSize);
            },
            callbackPageNo(pageNo) {
                this.$emit("callbackPageNo", pageNo);
            }
        },
    };
</script>

<style scoped>
    .text-btn {
        padding: 0;
    }
    .allot-form {
        margin: -20px 0;
    }
    .allot-form .el-input,
    .allot-form .el-select {
        width: 100%;
    }
    .allot-form .el-form-item {
        margin-bottom: 10px;
    }
</style>
