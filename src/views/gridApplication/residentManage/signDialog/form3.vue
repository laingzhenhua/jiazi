<template>
    <el-form ref="detailForm" :model="formData" label-width="110px">
        <el-row>
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
                    orgCode: "",
                    teamId: "",
                },
            };
        },
        methods: {
            initForm(data) {
                this.getOrgData().then(() => {
                    this.getBelong(data);
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
            // 查询网格楼栋所属社区及团队
            getBelong(buildingCode) {
                return new Promise((resolve, reject) => {
                    this.$http.residentManage
                        .getBelong({ buildingCode: buildingCode })
                        .then(res => {
                            if (res.code == 0) {
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
        },
        watch: {
            currentRow: {
                handler({ buildingCode }, oldVal) {
                    if (buildingCode) {
                        this.initForm(buildingCode);
                    } else {
                        this.formData = {
                            mgntState: "15", //15
                            orgCode: "",
                            teamId: "",
                        };
                    }
                },
                immediate: true,
                deep: true,
            },
        },
    };
</script>

<style></style>
