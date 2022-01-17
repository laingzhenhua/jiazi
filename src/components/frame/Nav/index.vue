<template>
    <div class="ui-nav_container">
        <div class="ctn-nav-item" v-for="(item, index) in menus" :key="index">
            <el-button
                size="small"
                :icon="item.icon"
                :class="navActive === index && 'is-active'"
                @click="navActive = index"
            >
                {{ item.name }}
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                menus: [
                    {
                        icon: "el-icon-star-on",
                        name: "一级菜单",
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "一级菜单",
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "一级菜单",
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "一级菜单",
                    },
                    {
                        icon: "el-icon-star-on",
                        name: "一级菜单",
                    },
                ],
                navActive: "",
            };
        },
    };
</script>

<style lang="less" scoped></style>
