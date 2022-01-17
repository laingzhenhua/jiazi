<template>
    <div>
        <el-dialog
            @close="handleCancel"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            title="编辑"
            class="clearFix"
            width="550px"
            v-dialogDrag
        >
            <el-form
                :model="ruleSettingForm"
                ref="ruleSettingForm"
                label-width="110px"
                class="clearFix"
                size="small"
            >
                <el-form-item label="定时执行：" prop="scheduleExecEnable">
                    <el-radio-group v-model="ruleSettingForm.scheduleExecEnable">
                        <el-radio :label="1">允许</el-radio>
                        <el-radio :label="2">不允许</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最后同步时间：" prop="lastSyncDate">
                    <el-date-picker
                        v-model="ruleSettingForm.lastSyncDate"
                        :clearable="false"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择时间"
                        style="width: 200px"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="标签：" prop="labels">
                    <el-input
                        style="width: 88%"
                        rows="3"
                        v-model="ruleSettingForm.labels"
                        placeholder="选择时间"
                        type="textarea"
                        maxlength="50"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <div class="dialog-footer" slot="footer">
                <el-button @click="handleCancel" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSave" :loading="btnloading" size="small">
                    保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ["rowData"],
        data() {
            return {
                dialogVisible: false,
                btnloading: false,
                ruleSettingForm: {
                    scheduleExecEnable: "",
                    lastSyncDate: "",
                    labels: "",
                },
            };
        },
        created() {},
        mounted() {},
        methods: {
            //点击保存
            handleSave() {
                this.btnloading = true;
                this.$http.sysDevOps
                    .edit(this.ruleSettingForm)
                    .then(res => {
                        this.btnloading = false;
                        this.dialogVisible = false;
                        if (res.code == 0) {
                            this.$parent.getTableData();
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(() => {
                        this.btnloading = false;
                        this.dialogVisible = false;
                    });
            },
            //点击取消
            handleCancel() {
                this.dialogVisible = false;
                this.ruleSettingForm = JSON.parse(JSON.stringify(this.rowData));
            },
        },
        watch: {
            rowData(nv) {
                if (nv) {
                    this.ruleSettingForm = JSON.parse(JSON.stringify(nv));
                } else {
                }
            },
        },
    };
</script>
<style lang="less" scoped>

    /deep/ .el-date-picker{
        width:350px!important;
    }


</style>
