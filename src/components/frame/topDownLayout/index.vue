<template>
    <el-container
        class="top-down-layout ui_container"
        direction="vertical"
        v-loading="isAllLoading"
        :element-loading-text="isLoadingText"
    >
        <Header />
        <Nav />
        <el-main v-loading="isLoading" :element-loading-text="isAllLoadingText">
            <router-view />
        </el-main>
    </el-container>
</template>

<script>
    import Header from "./../Header/index";
    import Nav from "./../Nav/index";

    export default {
        name: "index",
        components: {
            Header,
            Nav,
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
