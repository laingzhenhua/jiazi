<template>
  <el-dialog
    @close="handleCancel"
    :visible.sync="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
    width="1100px"
    v-dialogDrag
  >
    <div class="addTask-dialog-box">
      <el-form
        ref="taskRef"
        size="small"
        :disabled="formDisabled"
        :model="ruleForm1"
        :rules="rules1"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="考核方式" prop="checkType">
              <el-radio-group v-model="ruleForm1.checkType">
                <el-radio :label="1">按区域社康</el-radio>
                <el-radio :label="2">按一般社康</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核开始日期" prop="checkBeginDate">
              <el-date-picker
                v-model="ruleForm1.checkBeginDate"
                @change="selectTaskTime('checkBeginDate')"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
                type="date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核截止日期" prop="checkEndDate">
              <el-date-picker
                @change="chooseEndDate(ruleForm1.checkEndDate)"
                v-model="ruleForm1.checkEndDate"
                :clearable="false"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="taskName">
              <el-input
                :disabled="!ruleForm1.checkEndDate"
                style="width:95%;"
                placeholder="请输入计划名称"
                v-model="ruleForm1.taskName"
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="计划执行时间" prop="planExecTime">-->
<!--              <el-date-picker-->
<!--                v-model="ruleForm1.planExecTime"-->
<!--                :clearable="false"-->
<!--                type="datetime"-->
<!--                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                placeholder="选择日期时间"-->
<!--              ></el-date-picker>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col>
            <el-form-item label="备注" prop="taskRemark">
              <el-input
                type="textarea"
                maxlength="255"
                show-word-limit
                v-model="ruleForm1.taskRemark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 抽样设置 -->
      <component
        ref="samplingRef"
        :is="samplingDynamic"
        :ruleFormSet="ruleForm2"
        :formDisabled="formDisabled"
      ></component>
      <!-- 右侧树 -->
      <div class="tree-box">
        <div
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.2)"
        >
          <!-- lable -->
          <h1 class="tree-label"><i class="slot-tree">*</i>考核机构</h1>
          <!-- 搜索框 -->
          <el-input
            :disabled="formDisabled"
            class="search-input"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            style="width: 100%"
          ></el-input>
          <div>
            <OrgTree
              :oprationMode="oprationMode"
              :curTreeData="treeData"
              ref="orgTree"
            ></OrgTree>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" v-if="!formDisabled">
      <el-button type="primary" :loading="btnloading" @click="handleSave"
        >保 存</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import OrgTree from "/src/components/orgTree";
    import {excludeTaskAdd, excludeTaskEdit} from "../../../../httpRequset/module/sysSignCheckAgain";
    export default {
        props: ["oprationMode", "taskId", ],
        components: {
            OrgTree
        },
        data() {
            return {
                dialogVisible: false,
                formDisabled: false,
                loading: false,
                btnloading: false,
                title: "",
                //表单一
                ruleForm1: {
                    checkType: 1, //考核方式
                    taskName: "", //计划名称
                    checkBeginDate: new Date().getFullYear() + "-01-01", //督导开始时间
                    checkEndDate: "", //督导截止时间
                    planExecTime: new Date().dateFormat("yyyy-MM-dd HH:mm:ss"),
                    taskRemark: "", //备注
                    applyScene: 1
                },
                rules1: {
                    checkType: [
                        { required: true, message: "请选择考核方式", trigger: "blur" }
                    ],
                    checkEndDate: [
                        { required: true, message: "请选择截至日期", trigger: "blur" }
                    ],
                    taskName: [
                        { required: true, message: "请输入计划名称", trigger: "blur" }
                    ],
                    planExecTime: [
                        { required: true, message: "请选择计划执行开始时间", trigger: "blur" }
                    ]
                },
                //表单二
                samplingDynamic: "",
                ruleForm2: null,
                //树数据
                filterText: "", //过滤机构树的关键词
                treeData: [],
                isTree:false,
            };
        },
        watch: {
            filterText(val) {
                this.$refs.orgTree.$refs.orgTree.filter(val);
            },
            dialogVisible(val) {
                if (val) {
                    switch(this.oprationMode) {
                        case "add":
                            this.title = "创建排除计划"
                            this.formDisabled = false
                            break;
                        case "edit":
                            this.title = "编辑排除计划"
                            this.formDisabled = false
                            break;
                        case "see":
                            this.title = "计划详情"
                            this.formDisabled = true
                            break;
                        default:
                            this.dialogVisible = false
                            break;
                    }
                }
            },
        },
        methods: {
            selectTaskTime(time) {
                let bd = new Date(this.ruleForm1.checkBeginDate);
                let ed = new Date(this.ruleForm1.checkEndDate);
                if (bd.getTime() > ed.getTime()) {
                    this.$message.error(`督导开始时间不能大于结束时间`);
                    this.ruleForm1[time] = "";
                    return false;
                }
                return true;
            },
            //自动生成任务名
            chooseEndDate(checkEndDate) {
                let check = this.selectTaskTime("checkEndDate");
                if (check) {
                    let taskName = ""
                    const gDate = checkEndDate.replace(/-/g, "");
                    this.ruleForm1.taskName = taskName + gDate;
                } else {
                    this.ruleForm1.taskName = "";
                }
            },
            //处理传递的表单数据
            handleData(val) {
                console.log(val)
                this.treeData = val.orgTree;
                this.ruleForm1 = { ...this.ruleForm1, ...val }
                this.ruleForm2 = { ...val.samplingSetting }
                // vacc等上次考核任务
                // this.ruleForm2.lastTaskId = val.lastTaskId;
            },
            //点击保存
            async handleSave() {
                this.btnloading = true;
                try {
                    // 验证机构树
                    let orgCodes = this.$refs.orgTree.$refs.orgTree.getCheckedKeys();
                    if (orgCodes.length === 0) {
                        this.$message.error("至少选一个机构");
                        this.btnloading = false;
                        return;
                    }
                    // 验证全区任务
                    let wholeDistrict = 0;
                    let defaultOrgKeys = this.$refs.orgTree.defaultCheckedKeysTree;
                    let userDistrict = this.$sessionStorage.getStore("district");
                    if (orgCodes.length === defaultOrgKeys.length && userDistrict == 1) {
                        wholeDistrict = 1;
                    }
                    // 校验考核设置
                    await this.$refs.taskRef.validate()
                    // 校验抽样设置
                    let validSamplingConfig = null
                    if (this.samplingDynamic) {
                        validSamplingConfig = await this.$refs.samplingRef.validRuleForm2()
                    }
                    // 初始化参数
                    let params = {
                        // moduleCode: this.activeTab.key,
                        orgCodes,
                        wholeDistrict,
                        ...this.ruleForm1,
                        ...validSamplingConfig
                    };
                    let res;
                    //添加
                    if (this.oprationMode === "add") {
                        res = await this.$http.sysSignCheckAgain.excludeTaskAdd(params);
                    }
                    //修改
                    if (this.oprationMode === "edit") {
                        params.taskId = this.taskId;
                        res = await this.$http.sysSignCheckAgain.excludeTaskEdit(params);
                    }
                    if (res.code === 0) {
                        this.$emit("saveSuccess");
                        this.$message.success("保存成功！");
                        this.dialogVisible = false;
                    } else {
                        this.btnloading = false;
                        this.$message.error(res.msg);
                    }
                } catch (error) {
                    this.btnloading = false;
                }
            },
            //点击取消
            handleCancel() {
                this.ruleForm1 = {
                    checkType: 1, //考核方式
                    taskName: "", //计划名称
                    checkBeginDate: new Date().getFullYear() + "-01-01", //督导开始时间
                    checkEndDate: "", //督导截止时间
                    planExecTime: new Date().dateFormat("yyyy-MM-dd HH:mm:ss"),
                    taskRemark: "", //备注
                    applyScene: 1
                };
                this.$refs.taskRef.clearValidate()
                this.ruleForm2 = null;
                this.samplingDynamic = "";
                this.filterText = "";
                this.treeData = [];
                this.btnloading = false;
            }
        }
    };
</script>

<style lang="less">
.addTask-dialog-box {
  .el-form-item {
    min-height: 34px;
  }
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 95%;
  }

  .el-textarea .el-input__count {
    line-height: 12px;
    bottom: -14px;
  }
  .sampling-h2 {
    background: #eee;
    padding: 12px 20px;
    margin-bottom: 10px;
  }
}
textarea{
    min-height: 200px!important;
}
</style>

<style lang="less" scoped>
.addTask-dialog-box {
  min-height: 500px;
  padding-right: 30%;
  position: relative;
  .tree-box {
    box-sizing: border-box;
    border: 1px solid #d8dee2;
    position: absolute;
    right: 0;
    top: 0;
    width: 28%;
    padding: 10px;
    overflow: auto;
      height:500px ;
    .tree-label {
      height: 50px;
      line-height: 30px;
      border-bottom: 1px solid #d8dee2;
        text-align: center;
      margin-top: 10px;
        font-size: 18px;
        font-weight: 700;
      .slot-tree {
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .search-input {
      margin-bottom: 10px;
    }
  }
}
</style>
