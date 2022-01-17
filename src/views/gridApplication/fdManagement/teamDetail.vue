<template>
  <section >
      <h3 class="l" style="font-size: 18px;font-weight: bold;line-height: 34px;">家医团队管理</h3>
<!--      <div class="r" style="display: flex;flex: 1;justify-content: flex-end" >-->
<!--          <el-button size="small" type="primary" icon="el-icon-back" @click="handleBack">返回</el-button>-->
<!--      </div>-->
      <section class="pm-team">
    <div class="pm-main-title">
      <h2>团队信息</h2>
    </div>
    <section class="pm-card">
      <h4>
        <span>{{teamData.teamName}}</span>
        {{teamData.teamMemberNum}}人
      </h4>
      <el-row>
        <el-col :span="8">
          <span>社康：</span>
          {{teamData.orgName}}
        </el-col>
        <el-col :span="8">
          <span>团队长：</span>
          {{teamData.leaderName}}
        </el-col>
        <el-col :span="8">
          <span>创建日期：</span>
          {{teamData.createTime}}
        </el-col>
        <el-col>
          <span>团队介绍：</span>
          {{teamData.teamDesc}}
        </el-col>
      </el-row>
    </section>
    <div class="pm-main-title">
      <h2>团队成员</h2>
    </div>
    <section  :loading="tableloading">
        <page-table
            :tableData="tableData"
            :show-pagination="false"
            :showColumnIndex="false"
            :border = "false"
            :stripe="false"

        >
        <el-table-column width="130" align="center">
          <template >
            <EmhiSvgIcon iconClass="doctor_grey" style="font-size:60px" />
          </template>
        </el-table-column>
        <el-table-column label="成员角色">
          <template slot-scope="scope">
            <div :style="scope.row.isLeader == 1?'color:#00ACC7':''">
              <p style="font-size:18px;font-weight:bold">{{scope.row.name}}</p>
              <span>{{scope.row.isLeader == 1?'团队长':'团队成员'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="doctorType" label="医生类型">
          <template slot-scope="scope">
            <span>{{dataFmt(scope.row.doctorType, doctorDict)}}</span>
          </template>
        </el-table-column>
        <el-table-column  show-overflow-tooltip prop="createTime" label="创建日期" width="180"></el-table-column>
        <el-table-column prop="createBy" label="创建人"></el-table-column>
        <el-table-column prop="updateBy" label="最后修改人"></el-table-column>
      </page-table>
    </section>
  </section>
  </section>
</template>

<script>
    import EmhiSvgIcon from "/src/components/EmhiSvgIcon";
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: { EmhiSvgIcon, pageTable },

        data() {
            return {
                tableloading: false,
                tableData: [],
                teamData:{},
                doctorDict: [
                    { key: "1", value: "全科医生" },
                    { key: "2", value: "专科医生" },
                    { key: "3", value: "公卫医生" },
                    { key: "4", value: "护士" },
                    { key: "5", value: "药师" },
                    { key: "6", value: "助理" }
                ]
            };
        },
        mounted() {
            this.teamData = this.$store.state.fdManagement.fdManagementRow;
            this.getTableData();
        },
        methods: {
            dataFmt(val, dict) {
                for (const item of dict) {
                    if (val == item.key) {
                        return item.value;
                    }
                }
                return "—";
            },
            getTableData() {
                let param = { teamId: this.teamData.teamId };
                this.tableloading = true;
                this.$http.fdManagement
                    .getTeamMemberList(param)
                    .then(res => {
                        this.tableloading = false;
                        if (res.code == 0) {
                            this.tableData = res.data;
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {});
            }
        }
    };
</script>

<style lang="less" scoped>
.pm-team {
  width: 980px;
  margin: 0 auto;
/deep/ .el-table {
    border: none;
    border-right: none;
    &::before{
        width: 0;
        background-color: white;
    }
    .el-table__row {
        td {
            border-right: none;
            height: 77px;
        }
    }

}
    /deep/ .is-leaf{
        border-right: none;
    }
    /deep/  .el-table--border::after, .el-table--group::after, .el-table::before{
        width: 0;
        background-color: white;
    }
  .pm-main-title {
    padding: 30px 0;
    h2 {
      font-size: 16px;
      font-weight: bold;
      text-indent: 10px;
      border-left: 4px solid #00acc7;
    }
  }
  .pm-card {
    border: 1px solid #ced4da;
    h4 {
      height: 75px;
      line-height: 75px;
      font-size: 16px;
      border-bottom: 1px solid #ced4da;
      span {
        font-size: 24px;
        font-weight: bold;
        margin: 0 20px 0 30px;
      }
    }
    .el-row {
      padding: 15px;
      .el-col {
        padding: 15px;
        span {
          color: #8e99a2;
        }
      }
    }
  }
}
.pm-team .el-table th {
  font-weight: normal;
  color: #8e99a2;
  background-color: #fff;
  border-top: 0;
}
</style>
