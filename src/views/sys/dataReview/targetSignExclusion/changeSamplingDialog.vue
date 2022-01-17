<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="切换居民"
      :visible.sync="dialogVisible"
      width="440px"
      @close="handleCancelClick"
    >
      <div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="clearFix">
          <el-col :span="24">
            <el-form-item label="机构名称" class prop="orgCode">
              <el-select style="width:76%;" v-model="ruleForm.orgCode" placeholder="请选择机构">
                <el-option
                  v-for="item in sheKangList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="原因" class prop="memo">
              <el-input
                style="width:76%;"
                type="textarea"
                :rows="5"
                placeholder="请输入原因"
                v-model="ruleForm.memo"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnloading" @click="handleSureClick">确 定</el-button>
        <el-button @click="handleCancelClick">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {changeSampling} from "../../../../httpRequset/module/sysSignCheckAgain";

    export default {
        props: ["sampleDetail", "sheKangList", "parentOrgCode"],
        data() {
            return {
                dialogVisible: false,
                btnloading: false,
                ruleForm: {
                    orgCode: "",
                    memo: ""
                }
            };
        },
        methods: {
            changeSampling() {
                let params = {
                    samplingDetailId: this.sampleDetail.detailId,
                    parentOrgCode: this.parentOrgCode,
                    orgCode: this.ruleForm.orgCode,
                    memo: this.ruleForm.memo
                };
                this.$http.sysSignCheckAgain.changeSampling(params).then(res => {
                    if (res.code == 0) {
                        this.$emit("changeSuccess");
                        this.btnloading = false;
                        this.dialogVisible = false;
                    } else {
                        this.btnloading = false;
                    }
                });
            },
            handleCancelClick() {
                this.dialogVisible = false;
                this.$refs.ruleForm.resetFields(); //重置表单
            },
            handleSureClick() {
                //切换样本
                this.btnloading = true;
                this.changeSampling();
            }
        },
        watch: {
            sampleDetail: function(n, o) {
                this.ruleForm.orgCode = this.sampleDetail.orgCode;
            }
        }
    };
</script>

<style scoped>
</style>

