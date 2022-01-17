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
            <span style="font-size:18px">完善信息</span>
        </div>
        <div class="info" style="border-bottom: 1px solid grey">
            <info :currentRow="currentRow"></info>
        </div>
        <div class="operate cl">
            <operate :currentRow="currentRow" :curTab="curTab" ref="operate"></operate>
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
    import info from "./info.vue";
    import operate from "./operate.vue";
    export default {
        components: { info, operate },
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
                dialogVisible: false,
                btnloading: false,
            };
        },
        methods: {
            handleCancel() {
                this.dialogVisible = false;
                this.btnloading = false;
                /**
                 * 点击取消按钮还原表单数据
                 */
                this.$refs.operate.radioVal = "";
                this.$refs.operate.remark = "";
                this.$refs.operate.detailData = {};
                let { form, address } = this.$refs.operate.$refs;
                address.resetFields();
                if (this.curTab !== "signedResident") form.$refs.detailForm.resetFields();
                this.$emit("saveSuccess");
            },
            handleSave() {
                let { form, address } = this.$refs.operate.$refs;
                let result =
                    this.curTab === "signedResident"
                        ? [address.validate()]
                        : [form.$refs.detailForm.validate(), address.validate()];
                Promise.all(result).then(res => {
                    for (let i = 0; i < res.length; i++) {
                        if (!res[i]) return;
                    }
                    if (this.curTab !== "signedResident") {
                        if (form.formData.mgntState === "12" && form.formData.address === "") {
                            this.$message.warning("详细地址还没有修改");
                            return false;
                        }
                        this.btnloading = true;
                        if (form.formData.mgntState == "15") {
                            // 在本区其他社康时  详细地址必须有改动
                            let oldAdd = this.currentRow.address;
                            let newAdd = address.model.address;
                            if (oldAdd === newAdd) {
                                this.$message.warning("详细地址还没有修改");
                                this.btnloading = false;
                                return;
                            }
                        }
                    }
                    let params = {
                        id: this.currentRow.id,
                        ...address.model,
                        mgntState: 2,
                        remark: this.$refs.operate.remark,
                    };
                    if (this.curTab === "unSignedResident") {
                        Object.assign(params, form.formData);
                    }
                    this.$http.residentManage.editGridUnSign(params).then(res => {
                        if (res.code == 0) {
                            this.$message.success("保存成功");
                            this.handleCancel();
                            this.dialogVisible = false;
                            this.btnloading = false;
                        } else {
                            this.btnloading = false;
                        }
                    });
                });
            },
        },
    };
</script>

<style lang="less" scoped>
    .operate {
        padding: 10px;
        margin-bottom: -30px;
    }
</style>
