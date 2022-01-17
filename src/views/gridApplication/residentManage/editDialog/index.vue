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
            <el-button size="small" @click="handleCancel">取消</el-button>
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
        naem: "editDialog",
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
        watch: {
            dialogVisible(nv) {
                nv && this.$refs.operate && this.$refs.operate.initOperate();
            },
        },
        methods: {
            handleCancel() {
                this.dialogVisible = false;
                this.btnloading = false;
                /**
                 * 点击取消按钮还原表单数据
                 */
                this.$refs.operate.radioVal = "";
                this.$refs.operate.dynamicCom = "";
                setTimeout(() => {
                    this.$refs.operate.radioVal = JSON.parse(
                        this.$sessionStorage.getStore("radioVal"),
                    );
                }, 400);
            },
            handleSave() {
                let formRef = this.$refs.operate.$refs.form;
                formRef.$refs.detailForm.validate().then(() => {
                    if (formRef.formData.mgntState === "12" && formRef.formData.address === "") {
                        this.$message.warning("详细地址还没有修改");
                        return false;
                    }
                    this.btnloading = true;
                    let param = {
                        id: this.currentRow.id,
                        ...formRef.formData,
                    };
                    if (formRef.formData.mgntState == "15") {
                        // 在本区其他社康时  详细地址必须有改动
                        let oldAdd = this.currentRow.address;
                        let newAdd = formRef.formData.address;
                        if (oldAdd === newAdd) {
                            this.$message.warning("详细地址还没有修改");
                            this.btnloading = false;
                            return;
                        }
                    }
                    this.$http.residentManage.editGridUnSign(param).then(res => {
                        if (res.code == 0) {
                            this.$message.success("保存成功");
                            this.dialogVisible = false;
                            this.btnloading = false;
                            this.$parent.getTableData();
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
