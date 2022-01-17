<template>
    <div>
        <el-tabs type="card" class="mhi-tabs" v-model="tabName">
            <el-tab-pane
                v-for="x in tabDict"
                :key="x.name"
                :label="x.label"
                :name="x.name"
            ></el-tab-pane>
        </el-tabs>
        <component :is="tabName"></component>
    </div>
</template>

<script>
    import timedTask from "./timedTask";
    // import asyncTask from "./asyncTask";
    import jdsStat from "./jdsStat";
    export default {
        components: { timedTask,/* asyncTask,*/ jdsStat },
        data() {
            return {
                tabName: "timedTask",
                tabDict: [
                    { label: "定时任务", name: "timedTask" },
                    // { label: "异步任务", name: "asyncTask" },
                    { label: "调度任务集", name: "jdsStat" },
                ],
            };
        },
        methods: {},
    };
</script>

<style lang="less">
</style>