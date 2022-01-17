<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <section class="fdm-top clearFix" style="display: flex">
      <h3 class="l">团队网格管理设置</h3>
<!--      <div class="r" style="display: flex;flex: 1; justify-content: flex-end">-->
<!--        <el-button style="height: 32px;margin-top: 5px" size="small" type="primary" icon="el-icon-back" @click="clickCancel">返回</el-button>-->
<!--      </div>-->
    </section>
    <menu class="mhi-search clearFix">
      <el-form inline class="l">
        <el-form-item label="街道">
          <el-select size="small" v-model="searchParams.street" @change="changeStreet">
            <el-option
              v-for="item in streetList"
              :key="item.id"
              :label="item.regionName"
              :value="item.regionCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社区">
          <el-select size="small" v-model="searchParams.community" filterable clearable>
            <el-option
              v-for="item in communityList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleSaveClick">保存</el-button>
        </el-form-item>
      </el-form>
    </menu>
    <div class="selection-stats">
      已选：网格共
      <span>{{gridSum}}</span> 个，总人数共
      <span>{{personTotal}}</span> 人，重点人群共
      <span>{{totalKeyCnt}}</span> 人
    </div>
    <main class="main-wap-table">
        <paginationTable
            :tableData="tableData"
            :total="paginationConfig.total"
            @callbackPageSize="handleSizeChange"
            @callbackPageNo="handleCurrentChange"
            @callbackMultipleSelection="handleSelectionChange"
        >
        <el-table-column fixed type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="gridName" label="网格号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="buildingCnt" label="楼栋数" min-width="85" align="center"></el-table-column>
        <el-table-column prop="totalCnt" label="总人数" min-width="85" align="center"></el-table-column>
        <el-table-column label="一般人群" align="center">
          <el-table-column prop="notKeyRegisterCnt" label="户籍人口" min-width="85" align="center"></el-table-column>
          <el-table-column prop="notKeyUnregisterCnt" label="非户籍人口" min-width="105" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="重点人群" align="center">
          <el-table-column prop="htnCnt" label="高血压" min-width="85" align="center"></el-table-column>
          <el-table-column prop="dmCnt" label="糖尿病" min-width="85" align="center"></el-table-column>
          <el-table-column prop="agedCnt" label="老年人" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="孕产妇" min-width="85" align="center"></el-table-column>
          <el-table-column prop="childCnt" label="0-6岁儿童" min-width="105" align="center"></el-table-column>
          <el-table-column prop="mentalCnt" label="严重精神障碍" min-width="110" align="center"></el-table-column>
          <el-table-column prop="lungerCnt" label="肺结核" min-width="85" align="center"></el-table-column>
          <el-table-column prop="totalKeyCnt" label="合计" min-width="85" align="center"></el-table-column>
        </el-table-column>
          </paginationTable>
      <!-- 分页器 -->
<!--      <el-pagination-->
<!--        background-->
<!--        @current-change="getTableRow"-->
<!--        layout="total, prev, pager, next, jumper"-->
<!--        :current-page.sync="paginationConfig.pageNo"-->
<!--        :page-size="paginationConfig.pageSize"-->
<!--        :total="paginationConfig.total"-->
<!--      ></el-pagination>-->
    </main>
  </div>

</template>

<script>
    import paginationTable from "/src/components/paginationTable/paginationTable";

    export default {
        name: "newGridSet",
        components: {
            paginationTable
        },
        data() {
            return {
                loading: false,
                searchParams: {
                    street: "",
                    community: "",
                },
                teamData: {},
                communityList: [],
                streetList: [],
                tableData: [],
                paginationConfig: {
                    pageNo: 1,
                    pageSize:50,
                    total: 0

                },
                multipleSelection: [],
            };
        },
        computed: {
            gridSum: function() {
                return this.multipleSelection.length;
            },
            personTotal: function() {
                let sum = 0;
                this.multipleSelection.map(item => {
                    sum += item.totalCnt;
                });
                return sum;
            },
            totalKeyCnt: function() {
                let sum = 0;
                this.multipleSelection.map(item => {
                    sum += item.totalKeyCnt;
                });
                return sum;
            },
        },
        methods: {
            //改变每页数量
            handleSizeChange(val){
                this.paginationConfig.pageSize =val;
                this.getDataList();
            },
            //改变页码
            handleCurrentChange(val){
                this.paginationConfig.pageNo =val;
                this.getDataList()
            },
            clickCancel() {
                this.$emit("callback-Cancel", {
                    teamData: this.teamData,
                    component: "newGridSet",
                });
            },
            getTableRow() {
                this.getDataList();
            },
            searchList() {
                this.getDataList();
            },
            handleSaveClick() {
                this.fdGridAddrAdd();
            },
            changeStreet(data) {
                this.searchParams.community = "";
                this.communityList = [];
                if (data) {
                    this.getCommunityList(data);
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async getDataList() {
                let formData = {
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                    regionCode: this.searchParams.community,
                    streetCode: this.searchParams.street,
                    teamId: this.teamData.teamId,
                    // "teamId": '457'
                };
                this.loading = true;
                this.$http.fdManagement
                    .getFDGridAddrList(formData)
                    .then(res => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.tableData = res.data.content;
                            this.paginationConfig.total = res.data.totalCount;
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                    });
            },
            // 街道
            async getStreetList() {
                let fromData = {
                    // type: 1, // 单个社康所属街道
                    orgCode: this.teamData.orgCode,
                };
                this.$http.fdManagement.getStreetListByOrg1(fromData).then(res => {
                    if (res.code === 0) {
                        this.streetList = res.data;
                        this.searchParams.street = res.data[0].regionCode;
                        this.getCommunityList(res.data[0].regionCode);
                        this.getDataList();
                    } else {
                        // this.$mes("error", res.msg);
                    }
                });
            },
            // 社区
            async getCommunityList(code) {
                let fromData = {
                    townCode: code,
                };
                this.$http.fdManagement.getCommunityList(fromData).then(res => {
                    if (res.code === 0) {
                        this.communityList = res.data;
                    } else {
                        // this.$mes("error", res.msg);
                    }
                });
            },
            async fdGridAddrAdd() {
                let array = [];
                if (this.multipleSelection.length) {
                    this.multipleSelection.map(item => array.push(item.gridCode));
                }
                let formData = {
                    gridNoList: array,
                    teamId: this.teamData.teamId,
                    // "teamId": '457'
                };
                this.$http.fdManagement
                    .fdGridAddrAdd(formData)
                    .then(res => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg);
                            this.getDataList();
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                    });
            },
        },
        created() {
            this.teamData = this.$store.state.fdManagement.fdManagementRow
            this.getStreetList();
        },
        mounted() {},
    };
</script>

<style lang="less" scoped>
    .fdm-top {
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        h3 {
            font-size: 18px;
            font-weight: bold;
            line-height: 40px;
        }
    }
    .selection-stats {
        height: 40px;
        span {
            color: #f1556c;
        }
    }
</style>
