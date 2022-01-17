<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <section class="fdm-top clearFix" style="display: flex">
      <h3 class="l">网格管理</h3>
<!--      <div class="r" style="display: flex;flex: 1;justify-content: flex-end">-->
<!--        <el-button style="height:32px;margin-top: 5px" size="small" type="primary" icon="el-icon-back" @click="clickCancel">返回</el-button>-->
<!--      </div>-->
    </section>
    <section class="data-card-box">
      <div class="data-card">
        <h3>网格数</h3>
        <p class="num">{{tableData.length == 0? "—" :tableData.length-1}}</p>
      </div>
      <div class="data-card">
        <h3>楼栋</h3>
        <p class="num">{{tableData.length == 0? "—" :tableData[tableData.length-1].buildingCnt}}</p>
      </div>
      <div class="data-card">
        <h3>总人数</h3>
        <p class="num">{{tableData.length == 0? "—" :tableData[tableData.length-1].totalCnt}}</p>
      </div>
      <div class="data-card">
        <h3>户籍非重点</h3>
        <p
          class="num"
        >{{tableData.length == 0? "—" :tableData[tableData.length-1].notKeyRegisterCnt}}</p>
      </div>
      <div class="data-card">
        <h3>非户籍非重点</h3>
        <p
          class="num"
        >{{tableData.length == 0? "—" :tableData[tableData.length-1].notKeyUnregisterCnt}}</p>
      </div>
      <div class="data-card">
        <h3>重点人群</h3>
        <p class="num">{{tableData.length == 0? "—" :tableData[tableData.length-1].totalKeyCnt}}</p>
      </div>
    </section>
    <div style="height:1px;background:rgba(219,225,232,1);margin: 20px 0;"></div>
    <menu class="mhi-search clearFix" style="padding:0 0 12px 0">
      <div class="selection-stats">
        <span class="title">网格列表</span>
        <el-button
          class="r"
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="handleManage"
        >添加网格</el-button>
      </div>
    </menu>
    <main>
          <page-table
              :tableData="tableData"
              :show-pagination="false"
              :span-method="summaryColspan"
              :row-class-name="summaryClassName"
          >
        <el-table-column prop="streetName" label="街道" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="regionName" label="社区" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gridName" label="网格号" min-width="120" show-overflow-tooltip></el-table-column>
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
          <el-table-column prop="poorCnt" label="低保" min-width="85" align="center"></el-table-column>
          <el-table-column prop="disabledCnt" label="残疾人" min-width="85" align="center"></el-table-column>
          <el-table-column prop="totalKeyCnt" label="合计" min-width="85" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="gridMan" label="网格员" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="网格员电话" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.no === tableData.length"></div>
            <div v-else class="mhi-table-btn">
              <el-button
                size="small"
                type="text"
                title="编辑"

                @click="handleClickModify(scope.row)"
              >
                  编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                title="删除"

                @click="handleClickDelete(scope.row)"
              >
                  删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </page-table>
    </main>
    <!--编辑弹框-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="编辑"
      width="400px"
    >
      <el-form :model="editForm" label-width="110px">
        <el-form-item label="网格员">
          <el-input size="small" v-model="editForm.gridMan" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="网格员电话">
          <el-input size="small" v-model="editForm.tel" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleModifyClick">确 定</el-button>
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import pageTable from "/src/components/paginationTable/paginationTable";

    export default {
        name: "newGridDetail",
        components: {
            pageTable
        },
        data() {
            return {
                loading: false,
                dialogFormVisible: false,
                tableData: [],
                teamData:{},
                editForm: {
                    id: "",
                    gridMan: "",
                    tel: "",
                },
            };
        },
        methods: {
            handleManage() {
                this.$router.push({
                    path: "/gridApplication/fdManagement/newGridSet"
                })
            },
            clickCancel() {
                this.$emit("callback-Cancel", {
                    teamData: "",
                    component: "newGridDetail",
                });
            },
            // 合计行合并
            summaryColspan({ row, column, rowIndex, columnIndex }) {
                if (row.no === this.tableData.length) {
                    if (columnIndex == 0) {
                        // 设置合并开始列
                        return [1, 4];
                    } else if ([1, 2, 3].includes(columnIndex)) {
                        // 隐藏被合并列
                        return [0, 0];
                    }
                }
            },
            //添加合计行样式
            summaryClassName({ row, rowIndex }) {
                if (row.no === this.tableData.length) {
                    return "mhi-table-sum";
                }
                return "";
            },
            // 编辑弹窗
            handleClickModify(data) {
                this.dialogFormVisible = true;
                let { gridMan, tel, id } = data;
                this.editForm = { gridMan, tel, id };
            },
            // 删除
            handleClickDelete(data) {
                let { id } = data;
                // this.id = id;
                this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.delete(id);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除",
                        });
                    });
            },
            // 保存编辑
            handleModifyClick() {
                let reg = /^[0-9]*$/;
                if (!reg.test(this.editForm.tel)) {
                    this.$message.info("请输入正确的电话号码");
                    return;
                }
                if (this.editForm.gridMan == null || this.editForm.gridMan == "null") {
                    this.$message.info("请输入网格员");
                    return;
                }
                this.update().then(() => (this.dialogFormVisible = false));
            },
            async getGridData() {
                let formData = {
                    teamId: this.teamData.teamId,
                    // teamId:'457'
                };
                this.loading = true;
                this.$http.fdManagement
                    .getNewGridData(formData)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.tableData = res.data;
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch((res) => {
                        this.loading = false;
                    });
            },
            async update() {
                this.$http.fdManagement
                    .fdGridAddrUpdate(this.editForm)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg);
                            this.dialogFormVisible = false;
                            this.getGridData();
                        } else {
                        }
                    })
                    .catch((res) => {
                        this.loading = false;
                    });
            },
            async delete(id) {
                let formData = { id };
                this.$http.fdManagement
                    .fdGridAddrDelete(formData)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.$message.success( res.msg);
                            this.getGridData();
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch((res) => {
                        this.loading = false;
                    });
            },
        },
        created() {
            this.teamData =this.$store.state.fdManagement.fdManagementRow
            this.getGridData();
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

.data-card-box {
  display: flex;
  .data-card {
    width: 180px;
    height: 104px;
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
      height: 60px;
      line-height: 60px;
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
.mhi-table-btn{
    .el-button{
        font-size: 14px;
    }

}
</style>
