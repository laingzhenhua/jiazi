<template>
    <main v-loading="loading">
        <el-table size="small" :data="tableData" :height="tableHeight">
            <el-table-column prop="title" label="姓名" min-width="120"></el-table-column>
            <el-table-column prop="title" label="性别" min-width="120"></el-table-column>
            <el-table-column prop="title" label="出生年月" min-width="120"></el-table-column>
            <el-table-column prop="title" label="身份证" min-width="180"></el-table-column>
            <el-table-column prop="title" label="联系电话" min-width="160"></el-table-column>
            <el-table-column prop="title" label="家庭地址" min-width="200"></el-table-column>
            <el-table-column label="高血压" align="center">
                <el-table-column
                    prop="htnNum"
                    label="确认医生"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnMgntNum"
                    label="确认时间"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnSignNum"
                    label="数据来源"
                    min-width="85"
                    align="center"
                ></el-table-column>
            </el-table-column>
            <el-table-column label="糖尿病" align="center">
                <el-table-column
                    prop="htnNum"
                    label="确认医生"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnMgntNum"
                    label="确认时间"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnSignNum"
                    label="数据来源"
                    min-width="85"
                    align="center"
                ></el-table-column>
            </el-table-column>
            <el-table-column label="肺结核" align="center">
                <el-table-column
                    prop="htnNum"
                    label="确认医生"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnMgntNum"
                    label="确认时间"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnSignNum"
                    label="数据来源"
                    min-width="85"
                    align="center"
                ></el-table-column>
            </el-table-column>
            <el-table-column label="精神病" align="center">
                <el-table-column
                    prop="htnNum"
                    label="确认医生"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnMgntNum"
                    label="确认时间"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="htnSignNum"
                    label="数据来源"
                    min-width="85"
                    align="center"
                ></el-table-column>
            </el-table-column>
            <el-table-column prop="title" label="管理机构" width="160"></el-table-column>
            <el-table-column prop="title" label="管理团队" width="160"></el-table-column>
        </el-table>
        <el-pagination
            background
            layout="total,prev, pager, next, jumper"
            :current-page.sync="paginationConfig.currentPage"
            :page-size="paginationConfig.pageSize"
            :total="paginationConfig.total"
        ></el-pagination>
    </main>
</template>

<script>
    export default {
        mixins: [commonMixin.withTabsAndPagination],
        name: "index",
        data() {
            return {
                loading: false,
                tableData: [],
                // 分页器
                paginationConfig: {
                    total: 0, //总数量
                    pageSize: 50, //每页容量
                    currentPage: 1, //当前页
                },
            };
        },
        methods: {},
        created() {},
        components: {},
    };
</script>

<style lang="less" scoped></style>
