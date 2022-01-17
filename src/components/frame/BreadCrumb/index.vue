<template>
    <div class="ui-breadcrumb_container">
        <div class="bread-crumb_box">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    {{ navList.parentName }}
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="i in navList.childRoute" :key="i.path">
                    {{ i.name }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="operation_box">
            <el-button size="mini" @click="backToUp" v-if="isBack">
                返回
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        computed: {
            navList() {
                return this.$store.state.user.breadList;
            },
            isBack() {
                let {childRoute} = this.navList;
                return childRoute && childRoute.length > 1
            }
        },
        methods: {
            backToUp() {
                let {childRoute} = this.navList;
                if (childRoute.length > 1) {
                    childRoute.pop();
                    let bread = {
                        ...this.navList,
                        childRoute,
                    };
                    let {path, query, params} = childRoute[childRoute.length - 1];
                    this.$store.dispatch("setBreadList", bread);
                    this.$router.push({path, query, params});
                }
            },
        },
    };
</script>

<style lang="less" scoped></style>
