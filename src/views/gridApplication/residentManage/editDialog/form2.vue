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
    import { list2 } from "./mgntDict.js";
    export default {
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
        },
        data() {
            return {
                mgntDict: list2,
                formData: {
                    mgntState: "",
                    address: "",
                    remark: "",
                },
                formRules: {
                    mgntState: [{ required: true, message: "请选择状态", trigger: "blur" }],
                    remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
                },
            };
        },
        created() {
            this.initForm(this.currentRow);
        },
        mounted() {},
        methods: {
            initForm(data) {
                if (["11", "12", "13", "14"].includes(data.handleState)) {
                    this.formData.mgntState = data.handleState;
                } else {
                    this.formData.mgntState = "";
                }
                this.formData.address = data.address;
                this.formData.remark = data.handleLogs;
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
