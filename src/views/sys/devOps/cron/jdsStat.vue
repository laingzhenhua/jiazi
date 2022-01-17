<template>
    <div class="mhi-iframe">
        <iframe frameborder="0" width="100%" :height="height" :src="frameSrc"></iframe>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                height: 0,
            };
        },
        computed: {
            frameSrc() {
                let jdsURL =
                    localStorage.getItem("Global") && JSON.parse(localStorage.getItem("Global")).jdsURL;
                return `${jdsURL}/mhi-jds`;
            },
        },
        mounted() {
            let that = this;
            this.$nextTick(() => {
                that.tableHeight()
            });
            window.addEventListener("resize", function () {
                that.$nextTick(() => {
                    that.tableHeight()
                });
            });
            console.log(this.frameSrc);
        },
        methods: {
            tableHeight(){
                let that =this
                that.height = document.body.clientHeight - 175;
            }
        },
    };
</script>

<style lang="less">
.mhi-iframe {
    // position: absolute;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
}
</style>
