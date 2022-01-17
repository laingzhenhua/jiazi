<template>
    <div>
        <div class="fd-team-operate clearFix">
            <span class="l">
                <i>*</i>
                电话核查情况
            </span>
            <el-radio-group v-model="radioVal">
                <el-radio :label="1">在本社康</el-radio>
                <el-radio :label="2">排除人群</el-radio>
                <el-radio v-show="curTab != 'unfiled'" :label="3">在本区其他社康</el-radio>
            </el-radio-group>
        </div>
        <component :is="dynamicCom" :currentRow="currentRow" ref="form"></component>
        <div class="fd-team-operate remark clearFix">
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
    export default {
        components: { form1, form2, form3 },
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
            };
        },
        mounted() {
            if (this.currentRow.handleState === "15") {
                this.radioVal = 3;
            } else if (["11", "12", "13", "14"].includes(this.currentRow.handleState)) {
                this.radioVal = 2;
            } else if (["0", "1", "10"].includes(this.currentRow.handleState)) {
                this.radioVal = 1;
            } else {
                this.radioVal = "";
                this.dynamicCom = "";
            }
            this.$sessionStorage.setStore("radioVal", this.radioVal);
        },
        watch: {
            currentRow(newVal) {
                this.currentRow = newVal;
                if (this.currentRow.handleState === "15") {
                    this.radioVal = 3;
                } else if (["11", "12", "13", "14"].includes(this.currentRow.handleState)) {
                    this.radioVal = 2;
                } else if (["0", "1", "10"].includes(this.currentRow.handleState)) {
                    this.radioVal = 1;
                } else {
                    this.radioVal = "";
                    this.dynamicCom = "";
                }
                this.$sessionStorage.setStore("radioVal", this.radioVal);
            },
            radioVal(newVal) {
                console.log("newVal============>", newVal);
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
    .fd-team-operate {
        margin-bottom: 10px;
        padding-left: 55px;
        span.l {
            width: 100px;
            margin-right: 10px;
            text-align: right;
            i {
                color: #f56c6c;
            }
        }
    }
    .remark {
        color: #f56c6c;
        font-size: 12px;
        padding-left: 110px;
    }
</style>
