<template>
    <!-- <el-dialog
        v-dialogDrag
        width="1000px"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        @close="handleCancel"
    > -->
    <el-dialog
        width="1000px"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        @close="handleCancel"
    >
        <div slot="title">
            <span style="font-size:18px">审核</span>
        </div>
        <div class="info" style="border-bottom: 1px solid grey">
            <el-row style="padding-bottom: 0;">
                <el-col :span="24" style="margin-bottom: 0" >
                    <h4 class="title_shenhe">
                        <span>{{ currentRow.name }}</span>
                        <span>{{ currentRow.tel}}</span>
                        <dialTelAndPlayRecord class="phone" :info="currentRow" style="margin-top:5px" applySence="SAMPLING_AUTH_CHECK"></dialTelAndPlayRecord>

                    </h4>
                </el-col>
                <el-col :span="12">
                    <!-- <dialTelAndPlayRecord
                        :info="currentRow"
                        applySence="GRID_UN_SIGN_LIST"
                    ></dialTelAndPlayRecord> -->
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <span>性别：</span>
                    <span>{{currentRow.sex}}</span>
                </el-col>
                <el-col :span="8">
                    <span>年龄：</span>
                    <span>{{ currentRow.age ? currentRow.age : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>证件号码：</span>
                    <span>{{ currentRow.idCard ? currentRow.idCard : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>联系人：</span>
                    <span>{{ currentRow.contacts ? currentRow.contacts : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>联系人电话：</span>
                    <span>{{ currentRow.contactTel ? currentRow.contactTel : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>人群分类：</span>
                    <span>{{ currentRow.crowdType ? currentRow.crowdType : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>建档标记：</span>
                    <span>
                    {{ currentRow.filesFlag > 0 ? currentRow.fileFlagList.join(",") : "—" }}
                </span>
                </el-col>
                <el-col :span="8">
                    <span>街道：</span>
                    <span>{{ currentRow.streetName ? currentRow.streetName : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>社区：</span>
                    <span>{{ currentRow.communityName ? currentRow.communityName : "—" }}</span>
                </el-col>
                <el-col :span="8">
                    <span>网格楼栋：</span>
                    <span>{{ currentRow.buildingName ? currentRow.buildingName : "—" }}</span>
                </el-col>
                <el-col>
                    <span>详细地址：</span>
                    <span  class="addresss">
                    {{ currentRow.address ? currentRow.address : "—" }}
                </span>
                </el-col>
            </el-row>
        </div>
        <div class="operate cl">
            <div class="fd-team-operate clearFix" >
            <span class="l">
                <i>*</i>
                请选择审核结果:
            </span>
                <el-radio-group v-model="radioVal" >
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">不通过</el-radio>
                </el-radio-group>
            </div>
            <div class="fd-team-remark clearFix">
                <div class="l">备注:</div>
                <div class="input">
                    <el-input
                        size="small"
                        type="textarea"
                        maxlength="200"
                        :rows="4"
                        clearable
                        v-model="remark"
                    ></el-input>
                </div>
            </div>
        </div>
        <div slot="footer">
            <el-button size="small" @click="handleCancel" >取消</el-button>
            <el-button size="small" type="primary" :loading="btnloading" @click="handleSave">
                保存
            </el-button>
        </div>
    </el-dialog>
</template>

<script>

    import {personUpdateCheckState} from "../../../../../../httpRequset/module/sysTargetSignExclusion";
    import dialTelAndPlayRecord from "/src/components/dialTelAndPlayRecord2";

    export default {
        props: ["visible","params"],
        components: {
            dialTelAndPlayRecord
        },
        data() {
            return {
                dialogVisible: false,
                btnloading: false,
                currentRow:{},
                radioVal:undefined,
                remark:""
            };
        },
        watch: {
            visible: function (val){
                this.radioVal = "";
                this.remark = "";
                this.dialogVisible =val;
                this.currentRow =this.params;
            }
        },
        methods: {
            handleCancel() {
                this.dialogVisible = false;
                this.btnloading = false;
                this.$emit("callBackCancel",false)
                /**
                 * 点击取消按钮还原表单数据
                 */
            },
            handleSave() {
                if (!this.radioVal) {
                    this.$message.error("审核结果不可为空")
                    return
                }
                this.radioVal==2&this.remark==""?this.$message.error("审核不通过时备注不可为空"):this.save();
            },
            save(){
                let data = {
                    state: this.radioVal,
                    remark: this.remark,
                    shouldManageId:this.currentRow.id
                }
                this.$http.sysTargetSignExclusion.personUpdateCheckState(data)
                    .then((res) => {
                        if (res.code === 0) {
                            this.$message.success("保存成功")
                            this.$emit("callBackConfirm",false)
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            }
        },
    };
</script>

<style lang="less" scoped>
    .operate {
        padding: 10px;
        margin-bottom: -30px;
    }
    .title_shenhe{
        display: flex;
        line-height: 40px;
        .phone {
            display: flex;
            flex: 1;
            justify-content: flex-end;
        }
    }
</style>
<style lang="less" scoped>
.info {
    h4 {
        font-size: 16px;
        span:first-of-type {
            font-size: 24px;
            font-weight: bold;
            margin: 0 15px;
        }
    }
    .el-row {
        padding: 15px;
        .el-col {
            margin-bottom: 10px;
            span:first-of-type {
                color: #8e99a2;
            }
            .addresss {
                color: #00acc1;
                cursor: pointer;
            }
        }
    }
}
.margin-bottom20 {
    margin-bottom: 20px;
    padding-left: 10px;
    h3,
    p {
        line-height: 23px;
    }
    &:last-of-type {
        margin-bottom: 0;
    }
    /deep/ .el-timeline-item__node--large {
        left: 0;
        height: 24px;
        width: 24px;
    }
    /deep/ .el-timeline-item__icon {
        font-size: 16px;
    }
    /deep/ .el-timeline-item__tail {
        left: 11px;
    }
    /deep/ .el-timeline-item__timestamp.is-top {
        padding-top: 8px;
    }
}
.time-data {
    height: 500px;
    padding-right: 10px;
    overflow-y: auto;
    scrollbar-color: rgb(145, 141, 141);
    scrollbar-width: thin;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 1px rgb(145, 141, 141);
        background: #918d8d;
    }
}
.no-data {
    text-align: center;
    line-height: 60px;
    width: 50%;
    color: #909399;
    font-size: 20px;
    margin: 0 auto;
}
.fd-team-operate {
    margin-bottom: 10px;
    span.l {
        width: 120px;
        margin-right: 10px;
        text-align: right;
        display: inline-block;
        i {
            color: #f56c6c;
        }
    }
}
.fd-team-remark {
    width: 100%;
    div.l {
        width: 120px;
        text-align: right;
        float: left;
    }
    .input {
        width: 500px;
        padding-left: 130px;
        box-sizing: border-box;
    }
}
.remark {
    color: #f56c6c;
    font-size: 12px;
}
</style>
