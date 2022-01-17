<template>
    <div class="report3">
        <div class="nodata" v-show="noData">{{ noData }}</div>
        <div id="report3" :style="heightStyle" v-show="!noData"></div>
    </div>
</template>

<script>
    import * as echarts from "echarts";
    export default {
        props: ["orgCode"],
        data() {
            return {
                noData: "",
                report3: null,
                heightStyle: "",
                echartsData: [],
                echartsOption: {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
                        },
                    },
                    legend: {
                        data: [],
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
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        top: "5%",
                        containLabel: true,
                    },
                    xAxis: {
                        type: "value",
                    },
                    yAxis: {
                        type: "category",
                        data: [],
                    },
                    series: [],
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
        watch: {
            orgCode(nv) {
                this.getMeshSignCrowd();
            },
            echartsData(nv) {
                let axisData = [];
                let legendData = [];
                let seriesData = [];
                let arr = [];
                for (const a of nv) {
                    axisData.push(a.title); // 获取纵坐标人员
                    for (const b in a.data) {
                        arr.push(b);
                    }
                }
                legendData = [...new Set(arr)]; // 获取图例项目
                for (const x of legendData) {
                    let data = nv.map(e => {
                        return e.data[x] ? e.data[x] : 0;
                    });
                    seriesData.push({
                        // 格式化数据
                        name: x,
                        type: "bar",
                        barWidth: 30,
                        stack: "总数",
                        data,
                    });
                }
                let { legend, series, yAxis } = this.echartsOption;
                legend.data = legendData;
                series = seriesData;
                yAxis.data = axisData;
                Object.assign(this.echartsOption, { series, legend, yAxis });
                this.report3.setOption(this.echartsOption);
            },
        },
        mounted() {
            this.getScreen();
            this.$nextTick(() => {
                this.report3 = echarts.init(document.getElementById("report3"));
                window.addEventListener("resize", this.resizeChart);
            });
            this.getMeshSignCrowd();
        },
        beforeDestroy() {
            // 解绑resize事件
            window.removeEventListener("resize", this.resizeChart);
        },
        methods: {
            getMeshSignCrowd() {
                this.$http.gridPreview.getMeshSignCrowd({ orgCode: this.orgCode }).then(res => {
                    if (res.code === 0) {
                        if (!res.data.length) {
                            this.noData = "暂无数据";
                            this.echartsData = [];
                            return;
                        }
                        this.noData = "";
                        this.echartsData = res.data;
                    }
                });
            },
            resizeChart() {
                this.getScreen();
                echarts.dispose(document.getElementById("report3"));
                this.$nextTick(() => {
                    this.report3 = echarts.init(document.getElementById("report3"));
                    this.report3.setOption(this.echartsOption);
                });
            },
            getScreen() {
                let bodyWidth = window.innerWidth;
                if (bodyWidth <= 1600) {
                    this.heightStyle = "height: 198px";
                    this.echartsOption.tooltip.position = "top";
                } else {
                    this.heightStyle = "height: 263px";
                    this.echartsOption.tooltip.position = ["50%", "60%"];
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .report3 {
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
