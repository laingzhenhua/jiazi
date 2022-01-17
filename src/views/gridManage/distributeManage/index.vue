<template>
    <div>
        <el-tabs type="card" class="mhi-tabs" v-model="curTab">
            <el-tab-pane label="待分配网格" name="tab1"></el-tab-pane>
            <el-tab-pane label="已分配网格" name="tab2"></el-tab-pane>
        </el-tabs>
        <component :is="curTab"></component>
    </div>
</template>

<script>
    import tab1 from "./components/tab1.vue";
    import tab2 from "./components/tab2.vue";
    export default {
        data() {
            return {
                curTab: "tab1",
            };
        },
        components: {
            tab1,
            tab2,
        },
    };
</script>

<style lang="less" scoped>
    .data-card-box {
        display: flex;
        .data-card {
            width: 200px;
            height: 116px;
            padding: 0px 10px;
            box-sizing: border-box;
            border: 1px solid rgba(219, 225, 232, 1);
            margin-right: 20px;
            h3 {
                text-align: center;
                height: 40px;
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: rgba(50, 58, 70, 1);
                line-height: 40px;
                border-bottom: 1px solid #dbe1e8;
            }
            p.num {
                color: #00acc7;
                font-size: 28px;
                text-align: center;
                font-weight: bold;
                height: 38px;
                line-height: 38px;
            }
            p:last-child {
                text-align: center;
                height: 26px;
                line-height: 26px;
                span {
                    font-size: 14px;
                }
                span:first-child {
                    color: #dbe1e8;
                }
                span:nth-child(2) {
                    color: #323a46;
                }
            }
        }
    }
    .selection-stats {
        height: 40px;
        span {
            color: #f1556c;
        }
        span.title {
            font-size: 14px;
            color: #394263;
            padding-left: 10px;
            padding-right: 20px;
            font-weight: bold;
            border-left: 4px solid #00acc7;
        }
        .r {
            float: right;
        }
    }
    .dialog-footer {
        button {
            height: 32px;
            width: 56px;
            padding: 0;
            line-height: 0px;
            border-radius: 3px;
        }
    }
</style>
