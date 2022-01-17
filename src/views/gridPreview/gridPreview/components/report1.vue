<template>
    <div class="report1" ref="report1">
        <div class="nodata" v-show="noData">{{ noData }}</div>
        <div id="report1" :style="'height:' + heightStyle" v-show="!noData"></div>
    </div>
</template>

<script>
    import * as echarts from "echarts";
    export default {
        props: ["orgCode"],
        data() {
            return {
                noData: "",
                echartsData: [],
                report1: null,
                heightStyle: "",
                echartsOption: {
                    tooltip: {
                        trigger: "item",
                        formatter: "{b}: {d}%",
                    },
                    color: [
                        "#FF8A88",
                        "#EFB332",
                        "#94A4CD",
                        "#AB89D7",
                        "#61C777",
                        "#58A1F9",
                        "#7CDBE3",
                        "#787EF5",
                        "#FFA56C",
                        "#7F98F3",
                        "#47C2D2",
                        "#6986F2",
                    ],
                },
            };
        },
        mounted() {
            this.getScreen();
            this.$nextTick(() => {
                this.report1 = echarts.init(document.getElementById("report1"));
                window.addEventListener("resize", this.resizeChart);
            });
            this.getCrowdList();
        },
        beforeDestroy() {
            // 解绑resize事件
            window.removeEventListener("resize", this.resizeChart);
        },
        watch: {
            orgCode(nv) {
                this.getCrowdList();
            },
            echartsData(nv) {
                this.echartsOption.series[0].data = nv;
                this.report1.setOption(this.echartsOption);
            },
        },
        methods: {
            getCrowdList() {
                this.$http.gridPreview.getCrowdList({ orgCode: this.orgCode }).then(res => {
                    if (res.code === 0) {
                        if (!res.data.length) {
                            this.noData = "暂无数据";
                            this.echartsData = [];
                            return;
                        }
                        this.echartsData = res.data;
                        this.noData = "";
                    }
                });
            },
            resizeChart() {
                this.getScreen();
                echarts.dispose(document.getElementById("report1"));
                this.$nextTick(() => {
                    this.report1 = echarts.init(document.getElementById("report1"));
                    this.report1.setOption(this.echartsOption);
                });
            },
            getScreen() {
                let bodyWidth = window.innerWidth;
                if (bodyWidth <= 1600) {
                    this.heightStyle = "198px";
                    let series = [
                        {
                            type: "pie",
                            radius: "70%",
                            bottom: "10%",
                            left: 0,
                            data: this.echartsData,
                            startAngle: 45,
                            width: "60%",
                            itemStyle: {
                                borderColor: "#fff",
                                borderWidth: 1,
                            },
                            label: {
                                color: "#000000",
                                // position: 'inside'
                            },
                            labelLine: {
                                show: true,
                                showAbove: true,
                            },
                            labelLayout(params) {
                                return {
                                    verticalAlign: "middle",
                                    hideOverlap: false,
                                    smooth: 5,
                                    minTurnAngle: 90,
                                };
                            },
                        },
                    ];
                    let legend = [
                        {
                            orient: "vertical",
                            top: 0,
                            right: 0,
                            itemWidth: 8,
                            itemHeight: 8,
                            padding: 5,
                            itemGap: 15,
                            itemStyle: {
                                borderCap: "round",
                            },
                            textStyle: {
                                color: "#9298AD",
                            },
                        },
                    ];
                    this.echartsOption.legend = legend;
                    this.echartsOption.series = series;
                } else {
                    this.heightStyle = "263px";
                    let series = [
                        {
                            type: "pie",
                            radius: "70%",
                            bottom: "30%",
                            data: this.echartsData,
                            startAngle: 45,
                            itemStyle: {
                                borderColor: "#fff",
                                borderWidth: 1,
                            },
                            label: {
                                color: "#000000",
                                // position: 'inside'
                            },
                            labelLine: {
                                show: true,
                                showAbove: true,
                            },
                            labelLayout(params) {
                                return {
                                    verticalAlign: "middle",
                                    hideOverlap: false,
                                    smooth: 5,
                                    minTurnAngle: 90,
                                };
                            },
                        },
                    ];
                    let legend = {
                        orient: "horizontal",
                        bottom: 0,
                        left: "center",
                        itemWidth: 8,
                        itemHeight: 8,
                        padding: 5,
                        itemGap: 15,
                        itemStyle: {
                            borderCap: "round",
                        },
                        textStyle: {
                            color: "#9298AD",
                        },
                    };
                    this.echartsOption.legend = legend;
                    this.echartsOption.series = series;
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .report1 {
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
