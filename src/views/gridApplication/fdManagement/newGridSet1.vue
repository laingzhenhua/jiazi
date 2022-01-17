<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <section class="fdm-top clearFix" style="display: flex">
      <h3 class="l">团队网格管理设置</h3>
      <div class="r" style="display: flex;flex: 1; justify-content: flex-end">
        <el-button style="height: 32px;margin-top: 5px;" size="small" type="primary" icon="el-icon-back" @click="clickCancel">返回</el-button>
      </div>
    </section>
    <div class="data-card-box">
      <div class="data-card">
        <h3>网格数</h3>
        <p class="num">300</p>
        <p>
          <span>未分配：</span>
          <span>30</span>
        </p>
      </div>
      <div class="data-card">
        <h3>应管数</h3>
        <p class="num">300</p>
        <p>
          <span>未分配：</span>
          <span>30</span>
        </p>
      </div>
      <div class="data-card">
        <h3>户籍人口（非重点）</h3>
        <p class="num">300</p>
        <p>
          <span>未分配：</span>
          <span>30</span>
        </p>
      </div>
      <div class="data-card">
        <h3>重点人群</h3>
        <p class="num">300</p>
        <p>
          <span>未分配：</span>
          <span>30</span>
        </p>
      </div>
    </div>
    <div style="height:1px;background:rgba(219,225,232,1);margin: 20px 0;"></div>
    <menu class="mhi-search clearFix" style="padding:0 0 12px 0">
      <div class="selection-stats">
        <span class="title">待分配网格</span>
        已选：网格共
        <span>{{ gridSum }}</span>个，总人数共
        <span>{{ personTotal }}</span>人，重点人群共
        <span>{{ totalKeyCnt }}</span>人
        <el-button class="r" size="small" type="primary">分配</el-button>
      </div>
    </menu>
    <main class="main-wap-table">
          <pagination-table
              :tableData="tableData"
              :total="paginationConfig.total"
              @callbackPageSize="handleSizeChange"
              @callbackPageNo="handleCurrentChange"
              @callbackMultipleSelection="handleSelectionChange"
          >
        <el-table-column fixed type="selection" width="50" align="center"></el-table-column>
        <el-table-column prop="buildingCnt" label="楼栋数" min-width="85" align="center"></el-table-column>
        <el-table-column prop="buildingCnt" label="应管数" min-width="85" align="center"></el-table-column>
        <el-table-column prop="totalCnt" label="户籍人口（非重点）" min-width="100" align="center"></el-table-column>
        <el-table-column label="重点人群" align="center">
          <el-table-column prop="totalKeyCnt" label="重点合计" min-width="85" align="center"></el-table-column>
          <el-table-column prop="htnCnt" label="高血压" min-width="85" align="center"></el-table-column>
          <el-table-column prop="dmCnt" label="糖尿病" min-width="85" align="center"></el-table-column>
          <el-table-column prop="agedCnt" label="老年人" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="孕产妇" min-width="85" align="center"></el-table-column>
          <el-table-column prop="childCnt" label="0-6岁儿童" min-width="105" align="center"></el-table-column>
          <el-table-column prop="mentalCnt" label="严重精神障碍" min-width="110" align="center"></el-table-column>
          <el-table-column prop="lungerCnt" label="肺结核" min-width="85" align="center"></el-table-column>
        </el-table-column>
      </pagination-table>
    </main>
    <menu class="mhi-search clearFix" style="padding:0 0 12px 0">
      <div class="selection-stats">
        <span class="title">已分配网格</span>
      </div>
    </menu>
    <main class="main-wap-table">
      <el-table stripe size="small" :data="tableData">
        <el-table-column prop="buildingCnt" label="网格" min-width="85" align="center"></el-table-column>
        <el-table-column prop="buildingCnt" label="楼栋数" min-width="85" align="center"></el-table-column>
        <el-table-column prop="buildingCnt" label="应管数" min-width="85" align="center"></el-table-column>
        <el-table-column prop="totalCnt" label="户籍人口（非重点）" min-width="105" align="center"></el-table-column>
        <el-table-column label="重点人群" align="center">
          <el-table-column prop="totalKeyCnt" label="重点合计" min-width="85" align="center"></el-table-column>
          <el-table-column prop="htnCnt" label="高血压" min-width="85" align="center"></el-table-column>
          <el-table-column prop="dmCnt" label="糖尿病" min-width="85" align="center"></el-table-column>
          <el-table-column prop="agedCnt" label="老年人" min-width="85" align="center"></el-table-column>
          <el-table-column prop="childCnt" label="0-6岁儿童" min-width="105" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="精神疾病" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="肺结核" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="孕产妇" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="网格员" min-width="85" align="center"></el-table-column>
          <el-table-column prop="maternalCnt" label="网格员电话" min-width="85" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
    import PaginationTable from "@/components/paginationTable/paginationTable";

    export default {
        name: "newGridSet1",
        props: ["teamData"],
        components: {
            PaginationTable
        },
        data() {
            return {
                loading: false,
                tableData: [],
                paginationConfig: {
                    pageNo: 1,
                    pageSize: this.pageSize,
                    total: 0,
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
                this.multipleSelection.map((item) => {
                    sum += item.totalCnt;
                });
                return sum;
            },
            totalKeyCnt: function() {
                let sum = 0;
                this.multipleSelection.map((item) => {
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
                    component: "newGridSet1",
                });
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
                    .then((res) => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.tableData = res.data.content;
                            this.paginationConfig.total = res.data.totalCount;
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch((res) => {
                        this.loading = false;
                    });
            },
        },
        created() {},
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
}
</style>
