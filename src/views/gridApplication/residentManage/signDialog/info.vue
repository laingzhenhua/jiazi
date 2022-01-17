<template>
    <div class="fd-card">
        <el-row>
            <el-col :span="12">
                <h4>
                    <span>{{ currentRow.name }}</span>
                    <span>{{ currentRow.phone }}</span>
                </h4>
            </el-col>
            <el-col :span="12">
                <!-- <dialTelAndPlayRecord
                    :info="currentRow"
                    applySence="GRID_UN_SIGN_LIST"
                ></dialTelAndPlayRecord> -->
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <span>性别：</span>
                <span>{{ currentRow.sex == 1 ? "男" : currentRow.sex == 2 ? "女" : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>年龄：</span>
                <span>{{ currentRow.age ? currentRow.age : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>证件号码：</span>
                <span>{{ currentRow.idCard ? currentRow.idCard : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>联系人：</span>
                <span>{{ currentRow.contacts ? currentRow.contacts : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>联系人电话：</span>
                <span>{{ currentRow.contactTel ? currentRow.contactTel : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>人群分类：</span>
                <span>{{ currentRow.residentGroup ? currentRow.residentGroup : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>建档标记：</span>
                <span>
                    {{ currentRow.filesFlag > 0 ? currentRow.fileFlagList.join(",") : "—" }}
                </span>
            </el-col>
            <el-col :span="8">
                <span>街道：</span>
                <span>{{ currentRow.street ? currentRow.street : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>社区：</span>
                <span>{{ currentRow.community ? currentRow.community : "—" }}</span>
            </el-col>
            <el-col :span="8">
                <span>网格楼栋：</span>
                <span>{{ currentRow.buildingName ? currentRow.buildingName : "—" }}</span>
            </el-col>
            <el-col>
                <span>详细地址：</span>
                <span @click="openTimeLine" class="addresss">
                    {{ currentRow.address ? currentRow.address : "—" }}
                </span>
            </el-col>
        </el-row>
        <!-- 地址变更日志 -->
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="timeVisible"
            @close="handleClose"
            title="地址变更日志"
            width="600px"
            append-to-body
        >
            <div class="time-data" v-if="addressLog.length">
                <timeline>
                    <timeline-item
                        type="info"
                        size="large"
                        icon="el-icon-location-outline"
                        v-for="(item, index) in addressLog"
                        :key="index"
                        class="margin-bottom20"
                        :timestamp="item.createTime"
                        placement="top"
                    >
                        <el-card shadow="hover">
                            <h3>
                                {{ item.streetName }}/{{ item.communityName }}/{{
                                    item.buildingName
                                }}/{{ item.address }}
                            </h3>
                            <p>修改人：{{ item.createName }}</p>
                        </el-card>
                    </timeline-item>
                </timeline>
            </div>
            <div class="no-data" v-else>暂无数据</div>
        </el-dialog>
    </div>
</template>
<script>
    // import dialTelAndPlayRecord from "component/dialTelAndPlayRecord";
    import { Timeline, TimelineItem } from "element-ui";
    export default {
        components: {
            // dialTelAndPlayRecord,
            Timeline,
            TimelineItem,
        },
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
        },
        data() {
            return {
                addressLog: [],
                timeVisible: false,
            };
        },
        created() {
            this.addressLog = [];
        },
        methods: {
            openTimeLine() {
                this.$http.residentManage
                    .addrLog({ id: this.currentRow.id })
                    .then(res => {
                        if (res.code === 0) {
                            this.timeVisible = true;
                            this.addressLog = res.data;
                        }
                    });
            },
            handleClose() {
                this.timeVisible = false;
                this.addressLog = [];
            },
        },
    };
</script>

<style lang="less" scoped>
    .fd-card {
        h4 {
            font-size: 16px;
            span:first-of-type {
                font-size: 24px;
                font-weight: bold;
                margin: 0 15px;
            }
        }
        .el-row {
            padding: 15px;
            .el-col {
                margin-bottom: 10px;
                span:first-of-type {
                    color: #8e99a2;
                }
                .addresss {
                    color: #00acc1;
                    cursor: pointer;
                }
            }
        }
    }
    .margin-bottom20 {
        margin-bottom: 20px;
        padding-left: 10px;
        h3,
        p {
            line-height: 23px;
        }
        &:last-of-type {
            margin-bottom: 0;
        }
        /deep/ .el-timeline-item__node--large {
            left: 0;
            height: 24px;
            width: 24px;
        }
        /deep/ .el-timeline-item__icon {
            font-size: 16px;
        }
        /deep/ .el-timeline-item__tail {
            left: 11px;
        }
        /deep/ .el-timeline-item__timestamp.is-top {
            padding-top: 8px;
        }
    }
    .time-data {
        height: 500px;
        padding-right: 10px;
        overflow-y: auto;
        scrollbar-color: rgb(145, 141, 141);
        scrollbar-width: thin;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 1px rgb(145, 141, 141);
            background: #918d8d;
        }
    }
    .no-data {
        text-align: center;
        line-height: 60px;
        width: 50%;
        color: #909399;
        font-size: 20px;
        margin: 0 auto;
    }
</style>
