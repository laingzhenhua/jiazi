<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <section >
      <menu class="mhi-search clearFix">
        <el-form inline class="l">
          <el-form-item label="医院">
            <el-select
              size="small"
              v-model="searchParams.hospitalCode"
              @change="selectHospital"
              filterable
              clearable
            >
              <el-option
                v-for="item in hospitalData"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构名称">
            <el-select size="small" v-model="searchParams.orgCode" filterable clearable>
              <el-option
                v-for="item in orgData"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="团队名称">
            <el-input
              size="small"
              :maxlength="50"
              clearable
              placeholder="请输入姓名"
              v-model="searchParams.teamName"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-form-item>
            <div class="mhi-search-a">
              <a @click="showMore = !showMore">更多搜索</a>
              <i class="el-icon-caret-top" v-show="showMore"></i>
            </div>
          </el-form-item>
        </el-form>
      </menu>
      <transition>
        <div :style="{'height':showMore?'77px':0}">
          <div class="mhi-search-more" v-show="showMore">
            <el-form inline>
              <el-form-item label="团队长">
                <el-input
                  size="small"
                  :maxlength="50"
                  clearable
                  placeholder="请输入姓名"
                  v-model="searchParams.leaderName"
                ></el-input>
              </el-form-item>
              <el-form-item label="更新时间">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchParams.beginDate"
                  size="small"
                  type="date"
                  placeholder="选择开始日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchParams.endDate"
                  size="small"
                  type="date"
                  placeholder="选择结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>
      <transition>
        <main>
            <page-table
                :tableData="tableData"
                :total="paginationConfig.total"
                @callbackPageSize="handleSizeChange"
                @callbackPageNo="handleCurrentChange"
            >
            <el-table-column prop="teamName" label="团队名称" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orgName" label="机构名称" min-width="220" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hospitalName" label="医院" min-width="220" show-overflow-tooltip></el-table-column>
            <el-table-column prop="leaderName" label="团队长" min-width="120"></el-table-column>
            <el-table-column prop="teamMemberNum" label="团队成员数" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
            <el-table-column prop="updateTime" label="操作时间" min-width="160"></el-table-column>
            <el-table-column prop="updateBy" label="操作人" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template slot-scope="scope">
                <div class="mhi-table-i">
                  <span @click.stop="viewTeam(scope.row)"  title="查看团队" style="font-size: 14px;letter-spacing:0px">查看团队</span>

                  <span
                    @click.stop="viewGrid(scope.row)"
                    title="网格管理"
                    style="font-size: 14px;letter-spacing:0px"
                  >网格管理</span>
                </div>
              </template>
            </el-table-column>
            </page-table>
<!--          <el-pagination-->
<!--            background=""-->
<!--            @current-change="getTableData"-->
<!--            layout="total, prev, pager, next, jumper"-->
<!--            :current-page.sync="paginationConfig.pageNo"-->
<!--            :page-size="paginationConfig.pageSize"-->
<!--            :total="paginationConfig.total"-->
<!--          ></el-pagination>-->
        </main>
      </transition>
    </section>
  </div>
</template>
<script>
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: {
            pageTable,
        },
        data() {
            return {
                loading: false,
                showMore: false, // 更多搜索
                ManageShow: true,
                hospitalData: [],
                orgData: [],
                searchParams: {
                    hospitalCode: "",
                    orgCode: "",
                    teamName: "",
                    leaderName: "",
                    beginDate: "",
                    endDate: "",
                },
                tableData: [],
                paginationConfig: {
                    total: 0,
                    pageSize: 50,
                    pageNo: 1,
                },
                viewCom: "",
                teamData: {},
            };
        },
        created() {
            this.queryHospital();
            this.queryOrg();
            this.getTableData();
        },
        watch: {
            showMore(nv) {
                this.searchParams.leaderName = "";
                this.searchParams.beginDate = "";
                this.searchParams.endDate = "";
            },
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
            // 获取医院
            queryHospital() {
                this.$http.common
                    .queryHospital()
                    .then((res) => {
                        if (res.code == 0) {
                            this.hospitalData = res.data;
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch((res) => {});
            },
            // 获取医院
            queryOrg() {
                let param = {
                    hospitalOrgCode: this.searchParams.hospitalCode,
                };
                this.$http.common
                    .queryOrg(param)
                    .then((res) => {
                        if (res.code == 0) {
                            this.orgData = res.data;
                        } else {
                            // this.$mes("error", res.msg);
                        }
                    })
                    .catch((res) => {});
            },
            // 选择医院
            selectHospital(nv) {
                if (nv) {
                    this.searchParams.orgCode = "";
                }
                this.queryOrg();
            },
            // 请求表格数据
            getTableData() {
                let param = {
                    ...this.searchParams,
                    pageNo: this.paginationConfig.pageNo,
                    pageSize: this.paginationConfig.pageSize,
                };
                this.loading = true;
                this.$http.fdManagement
                    .getTeamList(param)
                    .then((res) => {
                        this.loading = false;
                        if (res.code == 0) {
                            this.tableData = this.$emptyHandle(res.data.content, []);
                            this.paginationConfig.total = res.data.totalCount;
                        } else {
                            this.$mes("error", res.msg);
                            this.tableData = [];
                            this.paginationConfig.total = 0;
                        }
                    })
                    .catch((res) => {
                        this.loading = false;
                        this.tableData = [];
                        this.paginationConfig.total = 0;
                    });
            },
            // 查询
            handleSearch() {
                this.paginationConfig.pageNo = 1;
                this.getTableData();
            },
            // 重置
            handleReset() {
                this.searchParams = {
                    hospitalCode: "",
                    orgCode: "",
                    teamName: "",
                    leaderName: "",
                    beginDate: "",
                    endDate: "",
                };
                this.handleSearch();
            },
            // 点击查看团队信息
            viewTeam(row) {
                this.teamData = row;
                this.$store.dispatch("setFdManagementRow",this.teamData)
                this.$router.push({
                    path: "/gridApplication/fdManagement/teamDetail"
                })
            },
            // 网格管理
            viewGrid(row) {
                this.teamData = row;
                this.$store.dispatch("setFdManagementRow",this.teamData)
                this.$router.push({
                    path: "/gridApplication/fdManagement/newGridDetail"
                })
            },
        },
    };
</script>
<style lang="less" scoped>
.pm-header {
  padding: 10px 20px;
  line-height: 40px;
  background-color: #fff;
  box-shadow: 0px 3px 6px 0px rgba(219, 219, 219, 0.5);
}

.pm-header h3 {
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
}
.mhi-table-i{
    span{
        margin: 0 5px;

    }
}
</style>
