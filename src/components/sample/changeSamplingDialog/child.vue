<template>
  <el-dialog v-dialogDrag :visible.sync="dialogVisible" @close="handleCancelClick" title="切换居民" width="500px">
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="clearFix">
      <el-form-item label="机构名称" prop="orgCode">
        <el-select v-model="ruleForm.orgCode" placeholder="请选择机构" style="width:100%">
          <el-option v-for="item in sheKangList" :key="item.key" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="原因" prop="memo">
        <el-input type="textarea" class="mhi-count" :rows="4" maxlength="100" show-word-limit placeholder="请输入原因" v-model="ruleForm.memo"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnloading" @click="handleSureClick">确 定</el-button>
      <el-button @click="handleCancelClick">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
        props: ['sampleDetail', 'sheKangList', 'parentOrgCode', 'sampleType'],
        data() {
            return {
                dialogVisible: false,
                btnloading: false,
                ruleForm: {
                    orgCode: '',
                    memo: ''
                }
            }
        },
        methods: {
            changeSampling() {
                let param = {
                    samplingDetailId: this.sampleDetail.detailId,
                    parentOrgCode: this.parentOrgCode,
                    ...this.ruleForm
                }
                let req
                if (this.sampleType == 1) {
                    req = this.$http.sysSignCheckAgain.changeChildVisitSample(param)
                } else if (this.sampleType == 2) {
                    req = this.$http.sysSignCheckAgain.changeChildExamSample(param)
                }
                req.then(res => {
                    if (res.code == 0) {
                        this.$emit('changeSuccess')
                        this.btnloading = false
                        this.dialogVisible = false
                    } else {
                        this.btnloading = false
                    }
                })
            },
            handleCancelClick() {
                this.dialogVisible = false
                this.$refs.ruleForm.resetFields() //重置表单
            },
            handleSureClick() {
                //切换样本
                this.btnloading = true
                this.changeSampling()
            }
        },
        watch: {
            sampleDetail(nv) {
                this.ruleForm.orgCode = nv.orgCode
            }
        }
    }
</script>

<style lang="less">
</style>

