<template>
    <el-container
        class="left-right-layout ui_container"
        v-loading="isAllLoading"
        :element-loading-text="isLoadingText"
    >
        <Aside />
        <el-container direction="vertical">
            <Header :isLogo="false" />
            <BreadCrumb />
            <el-main v-loading="isLoading" :element-loading-text="isAllLoadingText">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "./../Header/index";
    import BreadCrumb from "./../BreadCrumb/index";
    import Aside from "./../Aside/index";
    export default {
        name: "index",
        components: {
            Header,
            BreadCrumb,
            Aside,
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
    };
</script>

<style lang="less" scoped></style>
