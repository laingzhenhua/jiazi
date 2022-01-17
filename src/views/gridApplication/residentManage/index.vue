<template>
    <section class="residentManage">
        <el-tabs type="card" class="mhi-tabs" v-model="curTab">
            <el-tab-pane
                v-for="(item, index) in tabList"
                :key="index"
                :label="item.value"
                :name="item.key"
            >
                <span slot="label">{{ item.value }}</span>
            </el-tab-pane>
        </el-tabs>
        <component :is="curTab" :curTab="curTab" :checkman="checkman"></component>
    </section>
</template>
<script>
    let signedResident = () => import("./signedResident");
    let unSignedResident = () => import("./unSignedResident");
    let unfiled = () => import("./unfiled");
    let excluded = () => import("./excluded");
    export default {
        props: ["checkman"],
        data() {
            return {
                tabList: [
                    { key: "signedResident", value: "已签约居民" },
                    { key: "unSignedResident", value: "未签约居民" },
                    { key: "unfiled", value: "一般人群" },
                    { key: "excluded", value: "已排除人群" },
                ],
                curTab: ''
            };
        },
        created() {
            this.curTab = this.$route.query.actionCode || 'signedResident'
        },
        methods: {
        },
        components: {
            signedResident,
            unSignedResident,
            unfiled,
            excluded,
        },
    };
</script>

<style lang="less" scoped>
    .residentManage {
        height: 100%;
    }
</style>
