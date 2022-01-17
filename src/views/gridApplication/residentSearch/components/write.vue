<template>
    <div>
        <el-dialog
            title="慢病患者跟踪结果录入"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="30%"
        >
            <!-- <span>跟踪结果：</span> -->
            <el-form>
                <el-form-item label="跟踪结果:" width="200px">
                    <el-input
                        size="small"
                        type="textarea"
                        class="mhi-count"
                        :rows="5"
                        maxlength="300"
                        show-word-limit
                        v-model="form.desc"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                id: "",
                form: {
                    desc: "",
                },
            };
        },
        methods: {
            submit() {
                let param = { trackResult: this.form.desc, referralDownId: this.id };
                this.$http.residentSearch.trackResultInput(param).then(respon => {
                    if (respon.code == 0) {
                        this.$message.success("录入成功");
                        setTimeout(() => {
                            this.dialogVisible = false;
                            this.$emit("listenChildCom");
                        }, 500);
                    }
                });
            },
        },
    };
</script>
<style lang="less" scoped>
    textarea {
        min-height: 100px !important;
    }
</style>
