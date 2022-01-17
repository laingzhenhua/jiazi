<template>
    <el-form ref="detailForm" :model="formData" :rules="formRules" label-width="110px">
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
                        clearable
                        v-model="formData.communityCode"
                        @change="selectCommunity(formData.streetCode)"
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
                    <el-select
                        remote
                        :remote-method="remoteQueryBuilding"
                        size="small"
                        v-model="formData.buildingCode"
                        filterable
                        clearable
                        @change="selectBuilding(formData.buildingCode)"
                    >
                        <el-option
                            v-for="i in buildingData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="详细地址" prop="address">
                    <el-input
                        size="small"
                        type="textarea"
                        :rows="2"
                        maxlength="50"
                        clearable
                        v-model="formData.address"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="当前所属社康" prop="orgCode">
                    <el-select
                        size="small"
                        filterable
                        clearable
                        v-model="formData.orgCode"
                        disabled
                        placeholder="无"
                    >
                        <el-option
                            v-for="i in orgData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="当前所属团队" prop="teamId">
                    <el-select
                        size="small"
                        filterable
                        clearable
                        v-model="formData.teamId"
                        disabled
                        placeholder="无"
                    >
                        <el-option
                            v-for="i in teamData"
                            :key="i.key"
                            :value="i.key"
                            :label="i.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col>
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
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
    export default {
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
        },
        data() {
            return {
                streetData: [], //街道
                communityData: [], //社区
                buildingData: [], //楼栋
                orgData: [], //社康
                teamData: [], //团队
                formData: {
                    mgntState: "15", //15
                    streetCode: "",
                    communityCode: "",
                    buildingCode: "",
                    address: "",
                    remark: "",
                    orgCode: "",
                    teamId: "",
                },
                formRules: {
                    streetCode: [{ required: true, message: "请选择街道", trigger: "change" }],
                    address: [{ required: true, message: "请输入地址", trigger: "blur" }],
                },
            };
        },
        created() {
            this.initForm(this.currentRow);
            this.getOrgData().then(() => {
                if (this.currentRow.assignOrgCode != null) {
                    this.getTeam(this.currentRow.assignOrgCode);
                }
            });
        },
        mounted() {},
        methods: {
            initForm(data) {
                this.formData.orgCode = data.assignOrgCode;
                this.formData.teamId = data.assignTeamId;
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
                            this.getBelong(this.formData.buildingCode);
                        });
                    });
                });
            },
            // 获取街道
            queryStreet() {
                this.streetData = [];
                return new Promise((resolve, reject) => {
                    this.$http.residentManage.queryStreet().then(res => {
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
                    this.$http.residentManage.queryCommunity(param).then(res => {
                        if (res.code == 0) {
                            this.communityData = res.data;
                            resolve();
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
                    this.$http.residentManage.queryBuilding(param).then(res => {
                        if (res.code == 0) {
                            this.buildingData = res.data;
                            this.buildingData = this.buildingData.filter(
                                item => item.key === this.currentRow.buildingCode,
                            );
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 获取社康
            getOrgData() {
                this.orgData = [];
                return new Promise((resolve, reject) => {
                    this.$http.residentManage.ownedCommunities1().then(res => {
                        if (res.code == 0) {
                            this.orgData = res.data;
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },

            // 获取团队
            getTeam(code) {
                let fromData = {
                    orgCode: code,
                };
                return new Promise((resolve, reject) => {
                    this.$http.residentManage.getTeam1(fromData).then(res => {
                        if (res.code == 0) {
                            this.teamData = res.data;
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },

            // 获取楼栋
            remoteQueryBuilding(buildingName) {
                this.buildingData = [];
                let param = { regionCode: "", buildingName: buildingName || "" };
                return new Promise((resolve, reject) => {
                    this.$http.residentManage.queryBuilding(param).then(res => {
                        if (res.code == 0) {
                            this.buildingData = res.data;
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            // 查询网格楼栋所属社区及团队
            getBelong(buildingCode) {
                return new Promise((resolve, reject) => {
                    this.$http.residentManage
                        .getBelong({ buildingCode: buildingCode })
                        .then(res => {
                            if (res.code == 0) {
                                this.formData.streetCode = res.data.streetCode;
                                // 获取社区
                                this.queryCommunity({ townCode: this.formData.streetCode }).then(
                                    () => {
                                        this.formData.communityCode = res.data.communityCode;
                                    },
                                );
                                this.formData.orgCode = res.data.orgCode;
                                if (this.formData.orgCode == null) {
                                    this.teamData = [];
                                    this.formData.teamId = "";
                                } else {
                                    // 获取团队
                                    this.getTeam(this.formData.orgCode).then(() => {
                                        this.formData.teamId = res.data.teamId;
                                    });
                                }
                                resolve();
                            } else {
                                reject();
                            }
                        });
                });
            },
            // 选择楼栋
            selectBuilding(buildingCode) {
                if (buildingCode) {
                    this.getBelong(buildingCode);
                } else {
                    this.formData.orgCode = "";
                    this.formData.teamId = "";
                }
            },

            // 选择街道
            selectStreet(nv) {
                this.formData.communityCode = "";
                this.formData.buildingCode = "";
                this.formData.orgCode = "";
                this.formData.teamId = "";
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
                this.formData.orgCode = "";
                this.formData.teamId = "";
                this.buildingData = [];
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
