<template>
    <el-container
        class="top-left-right-layout ui_container"
        direction="vertical"
        v-loading="isAllLoading"
        :element-loading-text="isLoadingText"
    >
        <Header />
        <el-container>
            <Aside :isLogo="false" />
            <el-container direction="vertical" class="el-main_container">
                <BreadCrumb />
                <el-main v-loading="isLoading" :element-loading-text="isAllLoadingText">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "./../Header/index";
    import Aside from "./../Aside/index";
    import BreadCrumb from "./../BreadCrumb/index";
    export default {
        name: "index",
        components: {
            Header,
            Aside,
            BreadCrumb,
        },
        data() {
            return {};
        },
        computed: {
            isLoading() {
                return this.$store.state.global.portionLoading;
            },
            isLoadingText() {
                return this.$store.state.global.portionLoadingText;
            },
            isAllLoading() {
                return this.$store.state.global.globalLoading;
            },
            isAllLoadingText() {
                return this.$store.state.global.globalLoadingText;
            },
        },
        created() {},
    };
</script>

<style lang="less" scoped>
</style>
