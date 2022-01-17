<template>
    <section>
        <div class="mhi-search clearFix">
            <div class="r">
                <el-button size="small" type="primary" icon="el-icon-back" @click="handleBack">
                    返回
                </el-button>
            </div>
        </div>
        <el-tabs type="card" class="mhi-tabs" v-model="curTab" @tab-click="handleTabClick">
            <el-tab-pane
                v-for="(item, index) in tabList"
                :key="index"
                :label="item.value"
                :name="item.key"
            >
                <span slot="label">{{ item.value }}</span>
            </el-tab-pane>
        </el-tabs>
        <component :is="dynamicCom"></component>
    </section>
</template>
<script>
    import newSured from "./newSured";
    import moveOut from "./moveOut";
    import dead from "./dead";

    export default {
        props: [],
        data() {
            return {
                tabList: [
                    { key: "newSured", value: "新确诊" },
                    { key: "moveOut", value: "迁出" },
                    { key: "dead", value: "死亡" },
                ],
                curTab: "newSured",
                dynamicCom: "newSured",
            };
        },
        mounted() {},
        methods: {
            // 点击tab
            handleTabClick() {
                switch (this.curTab) {
                    case "newSured":
                        this.dynamicCom = newSured;
                        break;
                    case "moveOut":
                        this.dynamicCom = moveOut;
                        break;
                    case "dead":
                        this.dynamicCom = dead;
                        break;
                    default:
                        break;
                }
            },
            // 返回
            handleBack() {
                this.$emit("listenBack");
            },
        },
        components: {
            newSured,
            moveOut,
            dead,
        },
    };
</script>

<style></style>
