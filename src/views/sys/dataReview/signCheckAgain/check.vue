<template>
  <div
    class="check-box"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中"
    v-loading="loading"

  >
    <section>
      <menu class="mhi-search clearFix">
        <el-form
          inline
          class="l"
        >
          <el-form-item label="社康名称">
            <el-select
              size="small"
              v-model="searchParam"
              clearable
              filterable
            >
              <el-option
                v-for="item in sheKangList"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button
              class="query-btn"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="clickSearchBtn"
            >查询</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button
              size="small"
              class="reset-btn"
              icon="el-icon-refresh-right"
              @click="clickResetBtn"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <div class="r">
          <el-button
            size="small"
            @click="clickSamplingBtn"
            type="primary"
          >抽样</el-button>
<!--          <el-button-->
<!--            size="small"-->
<!--            icon="el-icon-back"-->
<!--            @click="handleBack"-->
<!--            type="primary"-->
<!--          >返回</el-button>-->
        </div>
      </menu>
      <main>
          <div class="table-stats">
              <div class="stats">
                  <span>总人数：</span>
                  <span>{{personTotalObj.total}}</span>
                  <span>，失访：</span>
                  <span>{{personTotalObj.lossTofFollow }}</span>
                  <span>，不在管辖区：</span>
                  <span>{{personTotalObj.notInPrecinct}}</span>
                  <span>，非重点人群：</span>
                  <span>{{personTotalObj.notImportantCrowd}}</span>
                  <span>，不愿意纳入管理：</span>
                  <span>{{personTotalObj.notLikeManaged}}</span>
              </div>
          </div>
        <div
          class="left-card-box"
          :style="dynamicWidth"
        >
          <ul v-if="sampDetailList.length > 0">
            <li
              v-for="item in sampDetailList"
              :key="item.detailId"
            >
              <sampleCard
                :btnName="['不真实','真实']"
                :sampleData="item"
                :currentSample="curSampleId"
                @clickCard="handleClickCard"
                @clickBtn="handleChangeSample"
              />
            </li>
          </ul>
          <noData v-else></noData>
        </div>
      </main>
    </section>
    <!--  抽样弹框-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="1050px"
      title="抽样"
    >
      <el-form
        :model="ruleForm"
        label-width="110px"
        class="clearFix daily-dialog-box"
      >
        <el-col :span="24">
          <el-form-item label="抽样总数量">
            <el-input-number
              :controls="false"
              :min="0"
              :max="100"
              step-strictly
              v-model="ruleForm.samplingQuantity"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="抽样方式"
            class=""
          >
            <el-radio-group v-model="ruleForm.samplingType">
              <el-radio :label="1">分层随机</el-radio>
              <el-radio :label="2">分层等距</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="样本分组">
            <el-radio-group v-model="ruleForm.samplingGroup">
              <el-radio label="BY_REASON">按排除原因</el-radio>
              <el-radio label="BY_CROWD">按人群</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          v-show="ruleForm.samplingGroup === 'BY_CROWD'"
          :span="24"
        >
          <el-col :span="8">
            <el-form-item label="老年人">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.agedCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高血压">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.htnCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="糖尿病">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.dmCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="孕产妇">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.maternalCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="残疾人">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.disabledCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="0~6岁儿童">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.childCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="精神病">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.smdCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="肺结核">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.tbCount"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="低保">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.poorFamilyQuantity"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col
          v-show="ruleForm.samplingGroup === 'BY_REASON'"
          :span="24"
        >
          <el-col :span="12">
            <el-form-item label="失访">
              <el-input-number
                :controls="false"
                :min="0"
                :max="999"
                step-strictly
                v-model="ruleForm.missedFollowupQuantity"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不在管辖区">
              <el-input-number
                :controls="false"
                :min="0"
                :max="999"
                step-strictly
                v-model="ruleForm.outOfMgntZoneQuantity"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="非重点人群">
              <el-input-number
                :controls="false"
                :min="0"
                :max="999"
                step-strictly
                v-model="ruleForm.nonFocusGroupQuantity"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不愿意纳入管理">
              <el-input-number
                :controls="false"
                :min="0"
                :max="100"
                step-strictly
                v-model="ruleForm.unWillingMgntQuantity"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
      <!-- 底部按钮 -->
      <div
        class="dialog-footer"
        slot="footer"
      >
        <el-button
          @click="submitForm"
          type="primary"
          :loading="isLoading"
        >开始抽样</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <checkDialog
      ref="truthConfirmDialog"
      @saveSuccess="refreshSampleList"
      :detailId="curSampleId"
    />
    <ChangeSamplingDialog
      ref="changeSamplingDialog"
      :sampleDetail="curSampleDetail"
      :parentOrgCode="rowData.orgCode"
      :sheKangList="sheKangList"
      @changeSuccess="refreshSampleList"
    />
  </div>
</template>

<script>
    import checkDialog from "./checkDialog";
    import sampleCard from "/src/components/sample/sampleCard";
    import ChangeSamplingDialog from "../../dataReview/targetSignExclusion/changeSamplingDialog.vue";
    import noData from "/src/components/noData";
    import {getOrgList, personTotal, samplingDetailList} from "../../../../httpRequset/module/sysSignCheckAgain";
    export default {

        data() {
            return {
                loading: false,
                isLoading: false,
                dialogFormVisible: false,
                sheKangList: [],
                searchParam: "",
                dynamicWidth: {height:""},
                personTotalObj:{},
                //抽样详情列表数据
                sampDetailList: [],
                initSampDetailList: [],
                rowData: {},
                //当前样本
                curSampleDetail: "",
                curSampleId: "",
                //表单
                ruleForm: {
                    samplingQuantity: 0,
                    samplingType: 1,
                    samplingGroup: "BY_REASON",
                    agedCount: 0,
                    htnCount: 0,
                    dmCount: 0,
                    maternalCount: 0,
                    disabledCount: 0,
                    childCount: 0,
                    smdCount: 0,
                    tbCount: 0,
                    poorFamilyQuantity: 0,
                    missedFollowupQuantity: 0,
                    outOfMgntZoneQuantity: 0,
                    nonFocusGroupQuantity: 0,
                    unWillingMgntQuantity: 0,
                },
            };
        },

        created() {
            this.rowData={
                taskId: this.$route.query.taskId,
                orgCode: this.$route.query.orgCode
            }
            this.queryOwnerOrgs();
            this.getSampleDetailList(); //获取抽样详情数据 并默认获取第一个的真实性检查数据
            this.personTotal();
        },
        mounted() {
            this.$nextTick(() => {

                let tableHeight = document.body.clientHeight - 60 - 60  - 20 - 20 - 20 - 10 - 2 ;
                this.dynamicWidth.height = tableHeight + "px";
            });
            window.addEventListener("resize", this.resizeLogic1, false);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resizeLogic1); //解绑resize事件
        },
        methods: {
            resizeLogic1() {
                this.dynamicWidth.height= document.body.clientHeight - 60 - 60 - 20 - 20 - 20 - 10 - 2  + "px";
            },
            // 重置抽样配置
            resetSampleConfig() {
                this.ruleForm = {
                    samplingQuantity: 0,
                    samplingType: 1,
                    samplingGroup: "BY_REASON",
                    agedCount: 0,
                    htnCount: 0,
                    dmCount: 0,
                    maternalCount: 0,
                    disabledCount: 0,
                    childCount: 0,
                    smdCount: 0,
                    tbCount: 0,
                    poorFamilyQuantity: 0,
                    missedFollowupQuantity: 0,
                    outOfMgntZoneQuantity: 0,
                    nonFocusGroupQuantity: 0,
                    unWillingMgntQuantity: 0,
                }
            },
            // 请求当前用户当前任务安排下的社康列表
            queryOwnerOrgs() {
                let params = {
                    taskId: this.rowData.taskId,
                    orgCode: this.rowData.orgCode,
                };
                this.$http.sysSignCheckAgain.getOrgList(params)
                    .then((res) => {
                        this.loading = false;
                        if (res.code === 0) {
                            this.sheKangList = res.data;
                        } else {
                            this.sheKangList = [];
                            this.$message.error(res.msg);
                        }
                    });
            },
            // 重置查询
            clickResetBtn() {
                this.searchParam = "";
                this.clickSearchBtn();
            },
            // 点击查询(前端根据机构名字过滤)
            clickSearchBtn() {
                if (this.searchParam) {
                    let filterSampData = [];
                    for (const item of this.initSampDetailList) {
                        if (item.orgCode == this.searchParam) {
                            filterSampData.push(item);
                        }
                    }
                    this.sampDetailList = filterSampData;
                } else {
                    this.getSampleDetailList();
                }
            },
            //统计人数接口
            personTotal() {
                this.loading = true;
                let params = {
                    taskId: this.rowData.taskId,
                    orgCode: this.rowData.orgCode,
                };
                this.$http.sysSignCheckAgain.personTotal(params).then((res) => {
                    if (res.code == 0) {
                        this.personTotalObj = res.data;
                    } else {

                    }
                    this.loading = false;
                });
            },
            //获取抽样明细列表 taskId
            getSampleDetailList() {
                this.loading = true;
                let params = {
                    taskId: this.rowData.taskId,
                    orgCode: this.rowData.orgCode,
                };
                this.$http.sysSignCheckAgain.samplingDetailList(params).then((res) => {
                    if (res.code == 0) {
                        this.sampDetailList = res.data;
                        this.initSampDetailList = res.data;
                    } else {
                        this.sampDetailList = [];
                        this.initSampDetailList = [];
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                });
            },
            //点击抽样按钮
            clickSamplingBtn() {
                this.dialogFormVisible = true;
            },
            //重新抽样redoSampling
            redoSampling() {
                let params = {
                    taskId: this.rowData.taskId,
                    parentOrgCode: this.rowData.orgCode,
                    fdExcludeDissSamplingConfig: { ...this.ruleForm },
                };
                this.$http.sysSignCheckAgain
                    .signExcludeSampling(params)
                    .then((res) => {
                        this.isLoading = false;
                        this.dialogFormVisible = false;
                        if (res.code == 0) {
                            this.getSampleDetailList(); //获取抽样详情数据
                            if (res.data != null) {
                                this.$message.warning( res.data);
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((res) => {
                        this.isLoading = false;
                    });
            },
            //点击弹框确认按钮 开始抽样
            submitForm() {
                let total;
                this.isLoading = true;
                switch (this.ruleForm.samplingGroup) {
                    case "BY_CROWD":
                        //判断 总份数 是其它人数之和
                        total =
                            Number(this.ruleForm.agedCount) +
                            Number(this.ruleForm.htnCount) +
                            Number(this.ruleForm.dmCount) +
                            Number(this.ruleForm.maternalCount) +
                            Number(this.ruleForm.disabledCount) +
                            Number(this.ruleForm.childCount) +
                            Number(this.ruleForm.smdCount) +
                            Number(this.ruleForm.tbCount) +
                            Number(this.ruleForm.poorFamilyQuantity);
                        if (Number(this.ruleForm.samplingQuantity) < total) {
                            this.$message.error("总份数应该大于所有人群抽样数之和");
                            this.isLoading = false;
                        } else {
                            this.redoSampling();
                        }
                        break;
                    case "BY_REASON":
                        //判断 总份数 是其它人数之和
                        total =
                            Number(this.ruleForm.missedFollowupQuantity) +
                            Number(this.ruleForm.outOfMgntZoneQuantity) +
                            Number(this.ruleForm.nonFocusGroupQuantity) +
                            Number(this.ruleForm.unWillingMgntQuantity) ;
                        if (Number(this.ruleForm.samplingQuantity) < total) {
                            this.$message.error("总份数应该大于所有排除原因抽样数之和");
                            this.isLoading = false;
                        } else {
                            this.redoSampling();
                        }
                        break;
                    default:
                        break;
                }
            },
            //点击返回
            handleBack() {
                window.history.back()
            },
            //处理来自子组件emit过来的信息
            handleChangeSample(data) {
                this.curSampleId = data.cardData.detailId;
                this.curSampleDetail = data.cardData;
                this.$refs.changeSamplingDialog.dialogVisible = true;
            },
            handleClickCard(data) {
                this.curSampleId = data.cardData.detailId;
                this.$refs.truthConfirmDialog.getSamplingDetail(this.curSampleId);
            },
            //电话核查弹窗点击保存成功
            refreshSampleList() {
                this.getSampleDetailList(); //获取抽样详情数据
            },
        },
        components: {
            noData,
            sampleCard,
            checkDialog,
            ChangeSamplingDialog,
        },
        watch: {
            dialogFormVisible(newVal, oldVal) {
                this.resetSampleConfig()
            },
            rowData(val){
                console.log(val)
            }
        },
    };
</script>

<style lang="less" scoped>
.check-box .el-date-editor.el-input,
.check-box .el-date-editor.el-input__inner {
  width: 245px;
}
.table-stats {
    height: 40px;
    display: flex;
    line-height: 40px;
    span:nth-of-type(2n) {
        color: #f1556c;
    }

}
.left-card-box {
  //border: 1px solid rgba(216, 222, 226, 1);
  overflow: auto;
  position: relative;
  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    li {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
  }
}
.mhi-search {
    display: flex;
    margin: 0;
    padding: 0;
    .r {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        button {
            height: 33px;
            margin-top: 5px;
            //margin-right: 20px;
        }
    }
}
</style>

