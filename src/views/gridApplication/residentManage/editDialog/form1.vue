<template>
    <el-form ref="detailForm" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="状态" prop="mgntState">
            <el-select size="small" filterable clearable v-model="formData.mgntState">
                <el-option
                    v-for="i in mgntDict"
                    :key="i.key"
                    :value="i.key"
                    :label="i.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-row>
            <el-col :span="8">
                <el-form-item label="街道" prop="streetCode">
                    <el-select
                        size="small"
                        filterable
                        v-model="formData.streetCode"
                        @change="selectStreet(formData.streetCode)"
                    >
                        <el-option
                            v-for="i in streetData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="社区" prop="communityCode">
                    <el-select
                        size="small"
                        filterable
                        v-model="formData.communityCode"
                        @change="selectCommunity(formData.communityCode)"
                    >
                        <el-option
                            v-for="i in communityData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="网格楼栋" prop="buildingCode">
                    <el-select size="small" filterable v-model="formData.buildingCode">
                        <el-option
                            v-for="i in buildingData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="address">
            <el-input
                size="small"
                type="textarea"
                :rows="1"
                maxlength="50"
                clearable
                v-model="formData.address"
                resize="none"
            ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input
                size="small"
                type="textarea"
                maxlength="100"
                :rows="4"
                clearable
                v-model="formData.remark"
            ></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
    import { list1 } from "./mgntDict.js";
    export default {
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
        },
        data() {
            return {
                mgntDict: list1,
                streetData: [], //街道
                communityData: [], //社区
                buildingData: [], //楼栋
                formData: {
                    mgntState: "",
                    streetCode: "",
                    communityCode: "",
                    buildingCode: "",
                    address: "",
                    remark: "",
                },
                formRules: {
                    mgntState: [{ required: true, message: "请选择状态", trigger: "blur" }],
                    streetCode: [{ required: true, message: "请选择街道", trigger: "change" }],
                    communityCode: [{ required: true, message: "请选择社区", trigger: "change" }],
                    buildingCode: [{ required: true, message: "请选择楼栋", trigger: "change" }],
                    address: [{ required: true, message: "请输入地址", trigger: "blur" }],
                },
            };
        },
        mounted() {
            this.initForm(this.currentRow);
        },
        methods: {
            initForm(data) {
                if (["1", "10"].includes(data.handleState)) {
                    this.formData.mgntState = data.handleState;
                } else {
                    this.formData.mgntState = ""; // data.handleState === "0"或其他
                }
                this.formData.address = data.address;
                this.formData.remark = data.handleLogs;
                this.formData.streetCode = data.streetCode;
                this.queryStreet().then(() => {
                    this.queryCommunity({ townCode: this.formData.streetCode }).then(() => {
                        this.formData.communityCode = data.communityCode;
                        this.queryBuilding({
                            regionCode: this.formData.communityCode,
                        }).then(() => {
                            this.formData.buildingCode = data.buildingCode;
                            // this.getBelong(this.formData.buildingCode);
                        });
                    });
                });
            },
            // 获取街道
            queryStreet() {
                this.streetData = [];
                return new Promise((resolve, reject) => {
                    this.$http.staffAssignmentsManage.queryStreet().then(res => {
                        if (res.code == 0) {
                            this.streetData = res.data.map(e => {
                                return { key: e.regionCode, value: e.regionName };
                            });
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 获取社区
            queryCommunity(param) {
                this.communityData = [];
                return new Promise((resolve, reject) => {
                    this.$http.staffAssignmentsManage.queryCommunity(param).then(res => {
                        if (res.code == 0) {
                            this.communityData = res.data;
                            if (this.communityData === null) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 获取楼栋
            queryBuilding(param) {
                this.buildingData = [];
                return new Promise((resolve, reject) => {
                    this.$http.staffAssignmentsManage.queryBuildingList(param).then(res => {
                        if (res.code == 0) {
                            this.buildingData = res.data;
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 选择街道
            selectStreet(nv) {
                this.formData.communityCode = "";
                this.formData.buildingCode = "";
                this.buildingData = [];
                if (nv) {
                    this.queryCommunity({ townCode: nv });
                } else {
                    this.communityData = [];
                }
            },
            // 选择社区
            selectCommunity(nv) {
                this.formData.buildingCode = "";
                if (nv) {
                    this.queryBuilding({ regionCode: nv });
                } else {
                    this.buildingData = [];
                }
            },
        },
        watch: {
            currentRow: {
                handler(newVal, oldVal) {
                    this.initForm(newVal);
                },
                immediate: true,
                deep: true,
            },
        },
    };
</script>

<style></style>
