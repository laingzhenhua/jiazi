<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <section class="pm-grid">
      <div class="pm-cell">
        <div class="pm-icon">
          <EmhiSvgIcon iconClass="pm_grid" />
        </div>
        <div class="pm-text">
          <p>网格数</p>
          <span class="pm-count">
            <span v-if="isNaN(overviewData.gridCount)">—</span>
            <countTo v-else :endVal="overviewData.gridCount" :duration="1000"></countTo>
          </span>
        </div>
      </div>
      <div class="pm-cell">
        <div class="pm-icon">
          <EmhiSvgIcon iconClass="pm_crowd" />
        </div>
        <div class="pm-text">
          <p>总人口数</p>
          <span class="pm-count">
            <span v-if="isNaN(overviewData.personSum)">—</span>
            <countTo v-else :endVal="overviewData.personSum" :duration="1000"></countTo>
          </span>
        </div>
      </div>
      <div class="pm-btn">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >新增</el-button>
      </div>
    </section>
    <section>
        <page-table
            :tableData="tableData"
            :total="paginationConfig.total"
            @callbackPageSize="handleSizeChange"
            @callbackPageNo="handleCurrentChange"
        >
        <!-- <el-table-column prop="gridNo" label="街道"></el-table-column>
        <el-table-column prop="gridNo" label="社区"></el-table-column>-->
        <el-table-column prop="gridNo" label="网格号" min-width="125"></el-table-column>
        <el-table-column prop="gridScope" label="网格范围" min-width="225"></el-table-column>
        <el-table-column prop="buildingNum" label="网格楼栋(栋)" min-width="125"></el-table-column>
        <el-table-column prop="peopleNum" label="人口信息情况(人)" min-width="125"></el-table-column>
        <el-table-column prop="gridMan" label="网格员" min-width="125"></el-table-column>
        <el-table-column prop="tel" label="网格员电话" min-width="125"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <div class="mhi-table-i">
              <i class="el-icon-edit" title="编辑" @click="handleEdit(scope.row)"></i>
              <i class="el-icon-delete" title="移除" @click="handleDelete(scope.row)"></i>
            </div>
          </template>
        </el-table-column>
        </page-table>
<!--      <el-pagination-->
<!--        background-->
<!--        hide-on-single-page-->
<!--        @current-change="getTableData"-->
<!--        layout="total, prev, pager, next, jumper"-->
<!--        :current-page.sync="paginationConfig.pageNo"-->
<!--        :page-size="paginationConfig.pageSize"-->
<!--        :total="paginationConfig.total"-->
<!--      ></el-pagination>-->
    </section>
    <gridDialog
      ref="gridDialog"
      :operate="operate"
      :teamId="teamData.teamId"
      :currentGrid="currentGrid"
      @listenClose="handleClose"
    />
  </div>
</template>

<script>
    import EmhiSvgIcon from "/src/components/EmhiSvgIcon";
    import countTo from "vue-count-to";
    import gridDialog from "./gridDialog";
    import pageTable from "/src/components/paginationTable/paginationTable";

    export default {
        components: { EmhiSvgIcon, countTo, gridDialog, pageTable },
        props: ["teamData"],
        data() {
            return {
                loading: false,
                overviewData: {},
                tableData: [],
                paginationConfig: {
                    total: 0,
                    pageSize: 50,
                    pageNo: 1
                },
                operate: "", // 操作
                currentGrid: null // 当前网格
            };
        },
        created() {
            this.getTableData();
        },
        methods: {
            //改变每页数量
            handleSizeChange(val){
                this.paginationConfig.pageSize =val;
                this.getTableData();
            },
            //改变页码
            handleCurrentChange(val){
                this.paginationConfig.pageNo =val;
                this.getTableData()
            },
            // 请求表格
            getTableData() {
                let param = { teamId: this.teamData.teamId };
                this.loading = true;
                this.$http.fdManagement.teamManage.getGridList(param)
                    .then(res => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.tableData = res.data.gridList;
                            this.paginationConfig.total =res.data.totalCount
                            this.overviewData = {
                                gridCount: res.data.gridCount,
                                personSum: res.data.personSum
                            };
                        } else {
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                    });
            },
            // 新增
            handleAdd() {
                this.operate = 'add';
            },
            // 编辑
            handleEdit(row) {},
            // 相应弹窗关闭
            handleClose() {
                this.operate = "";
                this.currentGrid = null;
            },
            // 移除
            handleDelete(row) {
                this.$confirm("是否确认移除", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    dangerouslyUseHTMLString: true
                })
                    .then(() => {
                        let param = { id: row.id };
                        this.$http.fdManagement
                            .deleteGrid(param)
                            .then(res => {
                                if (res.code == 0) {
                                    this.$message.success("移除成功");
                                    this.getTableData();
                                } else {
                                }
                            })
                            .catch(res => {});
                    })
                    .catch(() => {
                        this.$mes("info", "已取消操作");
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
.pm-grid {
  padding: 20px 0;
  display: flex;
  .pm-cell {
    height: 112px;
    min-width: 260px;
    margin-right: 50px;
    border: 1px solid #dbe1e8;
    display: flex;
    align-items: center;
    .pm-icon {
      width: 112px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eceff5;
      svg {
        font-size: 60px;
        color: #9899ab;
      }
    }
    .pm-text {
      padding: 0 20px;
      p {
        font-size:16px;
        color: #8e99a2;
      }
      .pm-count {
        font-size: 24px;
        line-height: 42px;
      }
    }
  }
  .pm-btn {
    flex: 1;
    text-align: right;
  }
}
</style>
