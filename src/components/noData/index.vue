<template>
  <div class="noData-container">
    <img src="/src/assets/images/no_data.png" alt="" :style="imgWidth">
    <p>{{tipText}}</p>
  </div>
</template>
<script>
    export default {
        name: "noData",
        props: {
            width: {
                type: Number,
                default: 330,
            },
            tipText: {
                type: String,
                default: "未查询到相关数据",
            },
        },
        data() {
            return {};
        },
        computed: {
            imgWidth() {
                return {
                    width: this.width + "px",
                };
            },
        },

        methods: {},
    };
</script>
<style lang="less" scoped>
@import "./index.less";
</style>



