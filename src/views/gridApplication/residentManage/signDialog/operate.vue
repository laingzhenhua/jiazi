<template>
    <div>
        <div v-if="tableData.length">
            <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                style="width: 100%"
                @select="handleSelectChange"
                class="visibily-all"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="序号"
                    width="80"
                    type="index"
                ></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="数据源"
                    prop="sourceFrom"
                    width="120"
                ></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="街道"
                    prop="streetName"
                    width="100"
                ></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="社区"
                    prop="communityName"
                    width="100"
                ></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="详细地址"
                    prop="address"
                ></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    label="更新时间"
                    prop="updateTime"
                    width="180"
                ></el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <div
                            class="radio"
                            :class="{checked: scope.row.markResult === 1}"
                            @click.stop="checkstatus(scope.row, 1)"
                        >
                            <span class="circle"></span>
                            <span>准确</span>
                        </div>
                        <div
                            class="radio"
                            :class="{checked: scope.row.markResult === 2}"
                            @click.stop="checkstatus(scope.row, 2)"
                        >
                            <span class="circle"></span>
                            <span>错误</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-form
            ref="address"
            class="address_form"
            :model="formData"
            :rules="formRules"
            label-width="110px"
        >
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
        </el-form>
        <div class="fd-team-operate clearFix" v-if="curTab !== 'signed'">
            <span class="l">
                <i>*</i>
                电话核查情况
            </span>
            <el-radio-group v-model="radioVal" @change="handleRadioChange">
                <el-radio :label="1">在本社康</el-radio>
                <el-radio :label="2">排除人群</el-radio>
                <el-radio v-show="curTab != 'unfiled'" :label="3">在本区其他社康</el-radio>
            </el-radio-group>
        </div>
        <component :is="dynamicCom" :currentRow="detailData" ref="form"></component>
        <div class="fd-team-remark clearFix">
            <div class="l">备注</div>
            <div class="input">
                <el-input
                    size="small"
                    type="textarea"
                    maxlength="100"
                    :rows="4"
                    clearable
                    v-model="remark"
                    resize="none"
                ></el-input>
            </div>
        </div>
        <div class="fd-team-operate remark clearFix" v-if="curTab !== 'signed'">
            <span class="l">
                <i>*</i>
                说明
            </span>
            “不在管辖区”表示居民不居住在本区，“在本区其他社康”表示居民属于本区其他社康管辖
        </div>
    </div>
</template>
<script>
    import form1 from "./form1.vue";
    import form2 from "./form2.vue";
    import form3 from "./form3.vue";
    import {list1} from "./mgntDict.js";
    export default {
        components: {form1, form2, form3},
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
            curTab: {
                type: String,
            },
        },
        data() {
            return {
                radioVal: "",
                dynamicCom: "",
                remark: this.currentRow.handleLogs || "",
                mgntDict: list1,
                tableData: [],
                streetData: [], //街道
                communityData: [], //社区
                buildingData: [], //楼栋
                formData: {
                    streetCode: "",
                    communityCode: "",
                    buildingCode: "",
                    address: "",
                    handleState: "",
                },
                formRules: {
                    streetCode: [{required: true, message: "请选择街道", trigger: "change"}],
                    communityCode: [{required: true, message: "请选择社区", trigger: "change"}],
                    buildingCode: [{required: true, message: "请选择楼栋", trigger: "change"}],
                    address: [{required: true, message: "请输入地址", trigger: "blur"}],
                },
                detailData: this.currentRow,
            };
        },
        created() {
            this.initOperate();
            this.getAddrList(this.currentRow);
            this.initForm(this.currentRow);
        },
        methods: {
            initOperate() {
                if (this.currentRow.handleState === "15") {
                    this.radioVal = 3;
                    this.dynamicCom = form3;
                } else if (["11", "12", "13", "14"].includes(this.currentRow.handleState)) {
                    this.radioVal = 2;
                    this.dynamicCom = form2;
                } else if (["0", "1", "10"].includes(this.currentRow.handleState)) {
                    this.radioVal = 1;
                    this.dynamicCom = form1;
                }
            },
            handleRadioChange() {
                switch (this.radioVal) {
                    case 1: //在本社康
                        this.dynamicCom = form1;
                        break;
                    case 2: //排除人群
                        this.dynamicCom = form2;
                        break;
                    case 3: //在本区其他社康
                        this.dynamicCom = form3;
                        break;
                    default:
                        this.dynamicCom = "";
                        break;
                }
            },
            handleSelectChange(val) {
                if (!val.length) {
                    this.initForm(this.currentRow);
                    return;
                } else if (val.length !== 1) {
                    this.$refs.singleTable.clearSelection();
                    this.$refs.singleTable.toggleRowSelection(val[val.length - 1]);
                }
                let info = val.pop();
                this.initForm(info);
            },
            checkstatus(row, markResult) {
                this.$http.residentManage.addrSign({id: row.id, markResult}).then(res => {
                    if (res.code === 0) {
                        this.$message.success("标记成功");
                        this.$set(row, "markResult", markResult);
                    }
                });
            },
            getAddrList({id}) {
                this.$http.residentManage.addrList({id}).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data;
                    }
                });
            },
            initForm(data) {
                this.formData.handleState = data.handleState;
                this.formData.address = data.address;
                this.formData.streetCode = data.streetCode;
                this.queryStreet().then(() => {
                    if (!data.streetCode) {
                        this.detailData = Object.assign(this.formData, {
                            communityCode: "",
                            buildingCode: "",
                        });
                        return;
                    }
                    this.queryCommunity({townCode: this.formData.streetCode}).then(() => {
                        this.formData.communityCode = data.communityCode;
                        if (!data.communityCode) {
                            this.detailData = Object.assign(this.formData, {buildingCode: ""});
                            return;
                        }
                        this.queryBuilding({
                            regionCode: this.formData.communityCode,
                        }).then(() => {
                            this.formData.buildingCode = data.buildingCode;
                            this.detailData = Object.assign(this.formData, {});
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
                                return {key: e.regionCode, value: e.regionName};
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
                this.detailData = this.formData;
                this.buildingData = [];
                if (nv) {
                    this.queryCommunity({townCode: nv});
                } else {
                    this.communityData = [];
                }
            },
            // 选择社区
            selectCommunity(nv) {
                this.formData.buildingCode = "";
                this.detailData = this.formData;
                if (nv) {
                    this.queryBuilding({regionCode: nv});
                } else {
                    this.buildingData = [];
                }
            },
        },
        watch: {
            currentRow: {
                handler(newVal) {
                    console.log(newVal);
                    this.remark = newVal.handleLogs;
                    this.initOperate();
                    this.getAddrList(newVal);
                    this.initForm(newVal);
                },
                deep: true,
            },
            radioVal(newVal) {
                switch (newVal) {
                    case 1:
                        this.dynamicCom = form1;
                        break;
                    case 2:
                        this.dynamicCom = form2;
                        break;
                    case 3:
                        this.dynamicCom = form3;
                        break;
                    default:
                        this.dynamicCom = "";
                        break;
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    textarea{
        resize: none;
    }
    .fd-team-operate {
        margin-bottom: 22px;
        padding-left: 5px;
        span.l {
            margin-right: 10px;
            text-align: right;
            display: inline-block;
            i {
                color: #f56c6c;
            }
        }
    }
    .address_form {
        margin-top: 22px;
    }
    .fd-team-remark {
        width: 100%;
        div.l {
            width: 100px;
            text-align: right;
            float: left;
        }
        .input {
            width: 100%;
            padding-left: 110px;
            box-sizing: border-box;
        }
    }
    .remark {
        color: #f56c6c;
        font-size: 12px;
        padding-left: 110px;
    }
    .radio {
        width: 48%;
        display: inline-block;
        margin-bottom: 10px;
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        line-height: 1;
        justify-content: center;
        cursor: pointer;
        .circle {
            display: block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin-right: 10px;
        }
    }
    .checked {
        color: #00acc1;
        .circle {
            background-color: #00acc1;
            border: 1px solid #00acc1;
            position: relative;
            &::after {
                width: 4px;
                height: 4px;
                border-radius: 100%;
                background-color: #fff;
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    .visibily-all {
        /deep/ .el-table-column--selection.is-leaf {
            .cell {
                display: none;
                visibility: hidden;
            }
        }
    }
</style>
