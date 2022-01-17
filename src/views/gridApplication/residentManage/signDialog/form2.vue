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
                streetData: [], //街道
                communityData: [], //社区
                buildingData: [], //楼栋
                formData: {
                    mgntState: "",
                },
                formRules: {
                    mgntState: [{ required: true, message: "请选择状态", trigger: "blur" }],
                },
            };
        },
        mounted() {
            this.initForm(this.currentRow);
        },
        methods: {
            initForm(data) {
                if (["11", "12", "13", "14"].includes(data.handleState)) {
                    this.formData.mgntState = data.handleState;
                } else {
                    this.formData.mgntState = this.formData.mgntState || "";
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
