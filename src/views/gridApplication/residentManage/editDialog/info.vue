<template>
    <div class="fd-card">
        <el-row>
            <el-col :span="12">
                <h4>
                    <span>{{ currentRow.name }}</span>
                    {{ currentRow.phone }}
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
            <el-col :span="8" class="label">
                <span>性别：</span>
                {{ currentRow.sex == 1 ? "男" : currentRow.sex == 2 ? "女" : "—" }}
            </el-col>
            <el-col :span="8">
                <span>年龄：</span>
                {{ currentRow.age ? currentRow.age : "—" }}
            </el-col>
            <el-col :span="8">
                <span>证件号码：</span>
                {{ currentRow.idCard ? currentRow.idCard : "—" }}
            </el-col>
            <el-col :span="8">
                <span>联系人：</span>
                {{ currentRow.contacts ? currentRow.contacts : "—" }}
            </el-col>
            <el-col :span="8">
                <span>联系人电话：</span>
                {{ currentRow.contactTel ? currentRow.contactTel : "—" }}
            </el-col>
            <el-col :span="8">
                <span>人群分类：</span>
                {{ currentRow.residentGroup ? currentRow.residentGroup : "—" }}
            </el-col>
            <el-col :span="8">
                <span>建档标记：</span>
                {{ currentRow.filesFlag > 0 ? currentRow.fileFlagList.join(",") : "—" }}
            </el-col>
            <el-col :span="8">
                <span>街道：</span>
                {{ currentRow.street ? currentRow.street : "—" }}
            </el-col>
            <el-col :span="8">
                <span>社区：</span>
                {{ currentRow.community ? currentRow.community : "—" }}
            </el-col>
            <el-col :span="8">
                <span>网格楼栋：</span>
                {{ currentRow.gridName ? currentRow.gridName : "—" }}
            </el-col>
            <el-col>
                <span>详细地址：</span>
                {{ currentRow.address ? currentRow.address : "—" }}
            </el-col>
        </el-row>
    </div>
</template>
<script>
    // import dialTelAndPlayRecord from "component/dialTelAndPlayRecord";
    export default {
        components: {
            // dialTelAndPlayRecord,
        },
        props: {
            currentRow: {
                type: Object,
                requried: true,
            },
        },
        created() {},
    };
</script>

<style lang="less" scoped>
    .fd-card {
        h4 {
            font-size: 16px;
            span {
                font-size: 24px;
                font-weight: bold;
                margin: 0 15px;
            }
        }
        /deep/.el-row {
            padding: 15px;
            .el-col {
                margin-bottom: 10px;
                display: inline-flex;
                span {
                    color: #8e99a2;
                    text-align: right;
                    display: inline-block;
                    width: 90px;
                }
            }
        }
    }
</style>
