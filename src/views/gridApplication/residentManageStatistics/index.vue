<template>
    <!-- <div v-if="tabData.length > 0"> -->
    <div>
        <el-tabs type="card" class="mhi-tabs" v-model="dynamicTable">
            <el-tab-pane name="table1" label="按团队统计"></el-tab-pane>
            <el-tab-pane name="table2" label="按社区统计"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component :is="dynamicTable"></component>
        </keep-alive>
    </div>
</template>

<script>
    import table1 from "./tables/table1.vue";
    import table2 from "./tables/table2.vue";
    export default {
        data() {
            return {
                dynamicTable: "table1"
            };
        },
        methods: {},
        mounted() {
            // let perms = this.$store.state.user.perms;
            // this.tabData = this.tabDict.filter(x => perms.includes(x.key));
            // this.tabData = this.tabDict;
            // if (this.tabData.length > 0) {
            //     // this.$nextTick(() => {
            //     this.dynamicTable = this.tabData[0].name;
            //     // });
            // }
        },
        components: {
            table1,
            table2,
        },
    };
</script>

<style lang="less" scoped></style>
