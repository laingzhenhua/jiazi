<template>
    <div class="report2">
        <div class="nodata" v-show="noData">{{ noData }}</div>
        <div id="report2" :style="heightStyle" v-show="!noData"></div>
    </div>
</template>

<script>
    import * as echarts from "echarts";
    export default {
        props: ["orgCode"],
        data() {
            return {
                noData: "",
                report2: null,
                heightStyle: "",
                echartsData: [],
                echartsOption: {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow",
                        },
                    },
                    legend: {
                        data: ["应管数", "已签约数"],
                        orient: "horizontal",
                        top: 0,
                        right: "0",
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 15,
                        itemStyle: {
                            borderCap: "round",
                        },
                        textStyle: {
                            color: "#9298AD",
                        },
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        top: 40,
                        bottom: "3%",
                        containLabel: true,
                    },
                    xAxis: {
                        type: "value",
                    },
                    yAxis: {
                        name: "单位：人",
                        type: "category",
                        data: [],
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: "rgba(0, 0, 0, 0.15)",
                            },
                        },
                        axisLabel: {
                            color: "#9298AD",
                        },
                        nameLocation: "end",
                        nameTextStyle: {
                            align: "right",
                            verticalAlign: "bottom",
                            color: "#9298AD",
                        },
                    },
                    series: [
                        {
                            name: "应管数",
                            type: "bar",
                            data: [],
                            barMaxWidth: 5,
                        },
                        {
                            name: "已签约数",
                            type: "bar",
                            data: [],
                            barMaxWidth: 5,
                        },
                    ],
                    color: ["#5B8FF9", "#26B8CA"],
                },
            };
        },
        mounted() {
            this.getScreen();
            this.$nextTick(() => {
                this.report2 = echarts.init(document.getElementById("report2"));
                window.addEventListener("resize", this.resizeChart);
            });
            this.getCrowdMangement();
        },
        beforeDestroy() {
            // 解绑resize事件
            window.removeEventListener("resize", this.resizeChart);
        },
        watch: {
            orgCode(nv) {
                this.getCrowdMangement();
            },
            echartsData(nv) {
                let yData = [];
                let sData1 = []; // 应管数
                let sData2 = []; // 已签约数
                nv.forEach(item => {
                    yData.push(item.moduleName);
                    sData1.push(item.shouldKeyRegisterNum);
                    sData2.push(item.signFocusGroupsNum);
                });
                let {yAxis, series} = this.echartsOption
                yAxis.data = yData
                let [first, last] = series
                first.data = sData1
                last.data = sData2
                this.echartsOption.yAxis = yAxis
                this.echartsOption.series = [first, last]
                this.report2.setOption(this.echartsOption)
            },
        },
        methods: {
            getCrowdMangement() {
                this.$http.gridPreview.getCrowdMangement({ orgCode: this.orgCode }).then(res => {
                    if (res.code === 0) {
                        if (!res.data.length) {
                            this.noData = "暂无数据";
                            this.echartsData = []
                            return;
                        }
                        this.noData = "";
                        this.echartsData = res.data
                    }
                });
            },
            resizeChart() {
                this.getScreen();
                echarts.dispose(document.getElementById("report2"));
                this.$nextTick(() => {
                    this.report2 = echarts.init(document.getElementById("report2"));
                    this.report2.setOption(this.echartsOption);
                });
            },
            getScreen() {
                let bodyWidth = window.innerWidth;
                if (bodyWidth <= 1600) {
                    this.heightStyle = "height: 440px";
                } else {
                    this.heightStyle = "height: 263px";
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .report2 {
        width: 100%;
        .nodata {
            z-index: 5;
            background-color: #fff;
            color: #909399;
            font-size: 20px;
            text-align: center;
            line-height: 279px;
        }
    }
</style>
