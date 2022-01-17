<template>
    <!-- 按社区统计 -->
    <div v-loading="loading">
        <div class="mhi-search clearFix">
            <el-form inline class="l">
                <el-form-item label="街道">
                    <el-select
                        size="small"
                        v-model="searchParams2.orgCode"
                        filterable
                        clearable
                        @change="changeStreet(searchParams2.orgCode)"
                    >
                        <el-option
                            v-for="item in orgData1"
                            :key="item.key"
                            :label="item.regionName"
                            :value="item.regionCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="社区">
                    <el-select size="small" v-model="searchParams2.community" filterable clearable>
                        <el-option
                            v-for="item in communityList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-search"
                        @click="searchClick"
                    >
                        查询
                    </el-button>
                    <el-button size="small" icon="el-icon-refresh-right" @click="resetClick">
                        重置
                    </el-button>
                </el-form-item>
                <el-form-item class="export">
                    <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-download"
                        :loading="btnloading"
                        @click="exportClick"
                    >
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <main>
            <pagination-table
                :tableData="tableData"
                :showPagination="false"
                :treeProps="{children: 'children', hasChildren: 'hasChildren'}"
                :load="loadChildren"
                :lazy="true"
                @expandChangeHandler="expandChangeHandler"
                ref="treeTable"
                :showColumnIndex="false"
                :rowKey="'id'"
            >
                <el-table-column
                    fixed
                    prop="title"
                    label="机构"
                    width="220"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="gridTotalCount"
                    label="网格居民总数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="totalResidentNum"
                    label="应管人数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="totalSignedResidentNum"
                    label="签约总人数"
                    min-width="105"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="signDynamicRate"
                    label="签约服务动态管理率"
                    min-width="105"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>
                            {{
                                scope.row.signDynamicRate == "—"
                                    ? "—"
                                    : scope.row.signDynamicRate + "%"
                            }}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
        prop="firstDiagRate"
        label="首诊率"
        min-width="85"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.firstDiagRate == "—" ? "—" : scope.row.firstDiagRate + "%"
          }}</span>
        </template>
      </el-table-column> -->
                <el-table-column label="重点人群" align="center">
                    <el-table-column
                        prop="keyPersonCount"
                        label="应管人数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonSignCount"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonGridSignCount"
                        :label="'网格\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonNoGridSignCount"
                        :label="'非网格\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="keyPersonSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.keyPersonSignRate == "—"
                                        ? "—"
                                        : scope.row.keyPersonSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="高血压" align="center">
                    <el-table-column
                        prop="htnNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="htnMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="htnMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.htnMgntRate == "—" ? "—" : scope.row.htnMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="htnSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="htnSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.htnSignRate == "—" ? "—" : scope.row.htnSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="htnMgntSignNum"
                        :label="'已建档\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="htnMgntSignRate"
                        :label="'已建档\n签约率'"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.htnMgntSignRate == "—"
                                        ? "—"
                                        : scope.row.htnMgntSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="htnTaskNum"
                        label="任务数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                </el-table-column>
                <el-table-column label="糖尿病" align="center">
                    <el-table-column
                        prop="dmNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="dmMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column prop="dmMgntRate" label="建档率" min-width="85" align="center">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.dmMgntRate == "—" ? "—" : scope.row.dmMgntRate + "%" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="dmSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column prop="dmSignRate" label="签约率" min-width="85" align="center">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.dmSignRate == "—" ? "—" : scope.row.dmSignRate + "%" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="dmMgntSignNum"
                        :label="'已建档\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="dmMgntSignRate"
                        :label="'已建档\n签约率'"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.dmMgntSignRate == "—"
                                        ? "—"
                                        : scope.row.dmMgntSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="dmTaskNum"
                        label="任务数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                </el-table-column>
                <el-table-column label="65岁以上老年人" align="center">
                    <el-table-column
                        prop="agedNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.agedMgntRate == "—"
                                        ? "—"
                                        : scope.row.agedMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="agedSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.agedSignRate == "—"
                                        ? "—"
                                        : scope.row.agedSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="agedMgntSignNum"
                        :label="'已建档\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedMgntSignRate"
                        :label="'已建档\n签约率'"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.agedMgntSignRate == "—"
                                        ? "—"
                                        : scope.row.agedMgntSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="agedTcmMgntCount"
                        label="中医药健康管理服务数"
                        min-width="100"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedTaskNum"
                        label="任务数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                </el-table-column>
                <el-table-column label="0-6岁儿童" align="center">
                    <el-table-column
                        prop="childNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="childMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="childMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.childMgntRate == "—"
                                        ? "—"
                                        : scope.row.childMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="childSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="childSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.childSignRate == "—"
                                        ? "—"
                                        : scope.row.childSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="childTcmMgntCount"
                        label="中医药健康管理服务数"
                        min-width="100"
                        align="center"
                    ></el-table-column>
                </el-table-column>
                <el-table-column label="精神疾病" align="center">
                    <el-table-column
                        prop="mentalNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="mentalMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="mentalMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.mentalMgntRate == "—"
                                        ? "—"
                                        : scope.row.mentalMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="mentalSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="mentalSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.mentalSignRate == "—"
                                        ? "—"
                                        : scope.row.mentalSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="肺结核" align="center">
                    <el-table-column
                        prop="infeNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="infeMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="infeMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.infeMgntRate == "—"
                                        ? "—"
                                        : scope.row.infeMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="infeSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="infeSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.infeSignRate == "—"
                                        ? "—"
                                        : scope.row.infeSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="孕产妇" align="center">
                    <el-table-column
                        prop="maternalNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="maternalMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="maternalMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.maternalMgntRate == "—"
                                        ? "—"
                                        : scope.row.maternalMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="maternalSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="maternalSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.maternalSignRate == "—"
                                        ? "—"
                                        : scope.row.maternalSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="残疾人" align="center">
                    <el-table-column
                        prop="disabledMgntCount"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="disabledFileCount"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="disabledFileRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.disabledFileRate == "—"
                                        ? "—"
                                        : scope.row.disabledFileRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="disabledSignCount"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="disabledSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.disabledSignRate == "—"
                                        ? "—"
                                        : scope.row.disabledSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="低保" align="center">
                    <el-table-column
                        prop="subAllowancesMgntCount"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="subAllowancesFileCount"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="subAllowancesFileRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.subAllowancesFileRate == "—"
                                        ? "—"
                                        : scope.row.subAllowancesFileRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="subAllowancesSignCount"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="subAllowancesSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.subAllowancesSignRate == "—"
                                        ? "—"
                                        : scope.row.subAllowancesSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="计生特殊家庭" align="center">
                    <el-table-column
                        prop="planningFamilyMgntCount"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="planningFamilyFileCount"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="planningFamilyFileRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.planningFamilyFileRate == "—"
                                        ? "—"
                                        : scope.row.planningFamilyFileRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="planningFamilySignCount"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="planningFamilySignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.planningFamilySignRate == "—"
                                        ? "—"
                                        : scope.row.planningFamilySignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="户籍人口（非重点人群）" align="center">
                    <el-table-column
                        prop="notKeyRegisterNum"
                        label="应管总数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="notKeyRegisterMgntNum"
                        label="已建档"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="notKeyRegisterMgntRate"
                        label="建档率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.notKeyRegisterMgntRate == "—"
                                        ? "—"
                                        : scope.row.notKeyRegisterMgntRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="notKeyRegisterSignNum"
                        label="签约数"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="notKeyRegisterGridSignNum"
                        :label="'网格\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="notKeyRegisterNoGridSignNum"
                        :label="'非网格\n签约数'"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="notKeyRegisterSignRate"
                        label="签约率"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.notKeyRegisterSignRate == "—"
                                        ? "—"
                                        : scope.row.notKeyRegisterSignRate + "%"
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </pagination-table>
        </main>
    </div>
</template>

<script>
    import PaginationTable from "../../../../components/paginationTable/paginationTable.vue";
    import handleTreeData from "../handleTreeData.js";
    export default {
        components: {PaginationTable},
        data() {
            return {
                loading: false,
                btnloading: false,
                orgData1: [],
                communityList: [],
                searchParams2: {
                    orgCode: "",
                    community: "",
                },
                processedData: [], //处理后的扁平树数据
                tableData: [],
                refresh: true,
                tableHeight: 700,
            };
        },
        methods: {
            //获取街道列表
            getStreetList() {
                this.$http.residentManageStatistics
                    .getStreetList()
                    .then(res => {
                        if (res.code === 0) {
                            this.orgData1 = res.data;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {});
            },
            // 获取社区  townCode
            getCommunityList(data) {
                data === undefined ? (data = "") : (data = data);
                let params = {townCode: data};
                this.$http.residentManageStatistics
                    .getCommunityList(params)
                    .then(res => {
                        if (res.code === 0) {
                            this.communityList = res.data;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {});
            },
            //选择街道
            changeStreet(data) {
                this.searchParams2.community = "";
                this.communityList = [];
                if (data) {
                    this.getCommunityList(data);
                }
            },
            searchClick() {
                this.getDataList();
            },
            resetClick() {
                this.searchParams2.orgCode = "";
                this.searchParams2.community = "";
                this.toggleExpand(this.tableData)
                this.getDataList();
            },
            toggleExpand(arr) {
                arr.forEach(item => {
                    this.$refs.treeTable.$refs.multipleTable.toggleRowExpansion(item, false);
                    this.refreshRow(item.id, []);
                    if (item.chilren) {
                        this.toggleExpand(item.chilren)
                    }
                });
            },
            // 导出
            exportClick() {
                this.btnloading = true;
                let formData = {
                    streetCode: this.searchParams2.orgCode,
                    communityCode: this.searchParams2.community,
                };
                this.$http.residentManageStatistics
                    .exportDoctorService2(formData)
                    .then(res => {
                        let blob = new Blob([res]);
                        this.$download(`家医团队管理居民统计.xlsx`, blob);
                        this.btnloading = false;
                    })
                    .catch(err => {
                        this.btnloading = false;
                    });
            },
            // 获取列表数据
            async getDataList() {
                let formData = {
                    streetCode: this.searchParams2.orgCode,
                    communityCode: this.searchParams2.community,
                };
                this.loading = true;
                this.refresh = false;
                this.$http.residentManageStatistics
                    .getDoctorService2(formData)
                    .then(res => {
                        if (res.code === 0) {
                            if (res.data.length === 0) {
                                this.tableData = [];
                                this.processedData = [];
                                this.refresh = true;
                            } else {
                                handleTreeData
                                    .addHasChildren(res.data) //对children长度大于0的添加hasChildren属性
                                    .then(res => {
                                        return handleTreeData.flatTree(res); //数组结构扁平化
                                    })
                                    .then(res => {
                                        return handleTreeData.delChildren(res); //删除children属性
                                    })
                                    .then(res => {
                                        this.processedData = this.$emptyHandle(res, []); //处理后的表格数据
                                        this.tableData = this.processedData.filter(item => {
                                            //要渲染的表格数据
                                            return item.parentId == undefined;
                                        });
                                        console.log(this.tableData);
                                        this.refresh = true;
                                    });
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                    });
            },
            // 加载子节点数据
            loadChildren(tree, treeNode, resolve) {
                let childrenData = this.processedData.filter(item => {
                    return item.parentId == tree.id;
                });
                resolve(childrenData);
            },
            // 树形表格展开or收起
            expandChangeHandler({row, expanded}) {
                if (expanded) {
                    // console.log("展开了。。。", row);
                    let childrenData = this.processedData.filter(item => {
                        return item.parentId == row.id;
                    });
                    /**
                     * 展开时更新子节点数据
                     */
                    this.refreshRow(row.id, childrenData);
                } else {
                    /**
                     * 收起时把子节点数据情清空
                     */
                    // console.log("收起了。。。", row);
                    // this.refreshRow(row.id, []);
                }
            },
            refreshRow(id, data) {
                this.$set(
                    this.$refs.treeTable.$refs.multipleTable.store.states.lazyTreeNodeMap,
                    id,
                    data,
                );
            },
        },
        activated() {
            this.getStreetList();
            this.searchClick();
            this.getCommunityList();
        },
    };
</script>

<style lang="less" scoped>
    .export {
        float: right;
        margin: 0;
    }
</style>
