<template>
    <div>
        <el-dialog
            v-dialogDrag
            width="550px"
            :title="title"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            @close="clickCancelBtn"
        >
            <div class="dept-form">
                <el-form :model="ruleForm" :rules="rules" ref="deptForm" label-width="120px">
                    <el-form-item label="机构名称" prop="orgName">
                        <el-input
                            size="small"
                            v-model="ruleForm.orgName"
                            maxlength="20"
                            placeholder="请输入机构名称"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="机构编码" prop="orgCode">
                        <el-input
                            size="small"
                            v-model="ruleForm.orgCode"
                            maxlength="20"
                            placeholder="请输入机构编码"
                            :disabled="enableEdit"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="所属街道" prop="street">
                        <el-select
                            size="small"
                            v-model="ruleForm.street"
                            :disabled="enableEdit"
                            placeholder="请选择所属街道"
                            filterable
                        >
                            <el-option
                                v-for="item in streetList"
                                :label="item.regionName"
                                :value="item.regionCode"
                                :key="item.regionCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="举办机构类型" prop="holdType">
                        <el-select
                            size="small"
                            v-model="ruleForm.holdType"
                            placeholder="请选择类型"
                            filterable
                        >
                            <el-option label="公办" :value="1"></el-option>
                            <el-option label="民办" :value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="经度" prop="longitude">
                        <el-input-number
                            size="small"
                            :min="0"
                            :max="180"
                            :controls="false"
                            v-model="ruleForm.longitude"
                        ></el-input-number>
                    </el-form-item>

                    <el-form-item label="纬度" prop="latitude">
                        <el-input-number
                            size="small"
                            :min="0"
                            :max="90"
                            :controls="false"
                            v-model="ruleForm.latitude"
                        ></el-input-number>
                    </el-form-item>
                </el-form>
            </div>

            <div class="dialog-footer" slot="footer">
                <el-button @click="clickCancelBtn" size="small">取 消</el-button>
                <el-button type="primary" @click="clickSaveBtn" :loading="btnLoading" size="small">
                    保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ["operate", "parentOrgCode"],
        data() {
            return {
                btnLoading: false,
                dialogFormVisible: false,
                enable20: true,
                enable30: true,
                streetList: [], // 街道列表
                hostingHospitalList: [], // 举办医院列表
                areaSocialHealthList: [], // 区域社康列表
                //表单
                ruleForm: {
                    orgType: "",
                    orgName: "",
                    orgCode: "",
                    holdOrgCode: "",
                    parentOrgCode: "",
                    streetCode: "",
                    holdType: "",
                    longitude: undefined,
                    latitude: undefined,
                },
                rules: {
                    orgType: [{required: true, message: "请选择机构类型", trigger: "blur"}],
                    holdType: [{required: true, message: "请选择机构类型", trigger: "blur"}],
                    orgName: [{required: true, message: "请输入机构名称", trigger: "blur"}],
                    orgCode: [{required: true, message: "请输入机构编码", trigger: "blur"}],
                },
            };
        },
        watch: {
            dialogFormVisible() {
                this.getOrgList(20);
                this.getOrgList(30);
                this.getStreetList();
            },
        },
        computed: {
            title() {
                if (this.operate == "addOrg") {
                    return "添加机构";
                } else if (this.operate == "editOrg") {
                    return "编辑机构";
                }
                return "—";
            },
            enableEdit() {
                if (this.operate == "addOrg") {
                    return false;
                }
                return true;
            },
        },
        methods: {
            getStreetList() {
                this.$http.sysDept.regionStreetList().then(res => {
                    if (res.code === 0) {
                        this.streetList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            //查询机构下拉框列表 orgType: 20 举办医院  30-区域社康  40-一般社康
            getOrgList(type) {
                let params = {orgType: type};
                this.$http.sysDept.getSelectList(params).then(res => {
                    if (res.code === 0) {
                        if (type == 20) {
                            this.hostingHospitalList = res.data;
                        } else if (type == 30) {
                            this.areaSocialHealthList = res.data;
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            //选择机构类型
            selectOrgType() {
                switch (this.ruleForm.orgType) {
                    case "20":
                        this.enable20 = true;
                        this.enable30 = true;
                        break;
                    case "30":
                        this.enable20 = false;
                        this.enable30 = true;
                        break;
                    case "40":
                        this.enable20 = false;
                        this.enable30 = false;
                        break;
                    default:
                        this.enable20 = true;
                        this.enable30 = true;
                }
            },
            //保存
            clickSaveBtn() {
                this.$refs.deptForm.validate(valid => {
                    if (valid) {
                        this.btnLoading = true;
                        let longitude = this.ruleForm.longitude
                            ? this.ruleForm.longitude.toFixed(6)
                            : "";
                        let latitude = this.ruleForm.latitude
                            ? this.ruleForm.latitude.toFixed(6)
                            : "";
                        switch (this.operate) {
                            case "addOrg":
                                let param = {
                                    orgType: this.ruleForm.orgType,
                                    orgCode: this.ruleForm.orgCode,
                                    orgName: this.ruleForm.orgName,
                                    holdOrgCode: this.ruleForm.hostingHospital,
                                    // parentOrgCode: this.ruleForm.areaSocialHealth,
                                    parentOrgCode: this.parentOrgCode,
                                    streetCode: this.ruleForm.street,
                                    holdType: this.ruleForm.holdType,
                                    longitude,
                                    latitude,
                                };
                                this.$http.sysDept.orgAdd(param).then(res => {
                                    this.btnLoading = false;
                                    if (res.code === 0) {
                                        this.$refs.deptForm.resetFields(); // 清除验证结果
                                        this.dialogFormVisible = false;
                                        this.$message.success("添加成功！");
                                        this.$emit("listenOperateState");
                                    } else {
                                        // this.$message.error(res.msg);
                                    }
                                });
                                break;
                            case "editOrg":
                                let params = {
                                    orgCode: this.ruleForm.orgCode,
                                    orgName: this.ruleForm.orgName,
                                    holdType: this.ruleForm.holdType,
                                    longitude,
                                    latitude,
                                };
                                this.$http.sysDept.orgEdit(params).then(res => {
                                    this.btnLoading = false;
                                    if (res.code === 0) {
                                        this.$refs.deptForm.resetFields(); // 清除验证结果
                                        this.dialogFormVisible = false;
                                        this.$message.success("编辑成功！");
                                        this.$emit("listenOperateState");
                                    } else {
                                        this.$message.error(res.msg);
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    }
                });
            },
            //取消
            clickCancelBtn() {
                this.$refs.deptForm.resetFields(); // 清除验证结果
                this.enable20 = true;
                this.enable30 = true;
                this.dialogFormVisible = false;
            },
        },
    };
</script>

<style lang="less" scoped>
    .dept-form {
        .el-select,
        .el-input,
        .el-input-number {
            width: 80%;
        }

        .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
