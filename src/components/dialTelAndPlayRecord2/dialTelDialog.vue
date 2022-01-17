<template>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :visible.sync="dialogVisible" title="拨打电话" width="420px" append-to-body>
    <div class="dia-tel">
      <div>
        <span>{{iptName}}</span>
        <el-input class="dia-tel-input" placeholder="首次使用需要填写" v-model="extNo" @input="handleIpt"></el-input>
      </div>
      <el-radio-group v-model="beforeOutto">
        <el-radio :label="info.tel" v-if="info.tel && info.tel !== '—'" border>
          <div class="dia-tel-label">
            <span>本人号码</span> <span>{{ info.tel }}</span>
          </div>
        </el-radio>
        <el-radio :label="info.contactTel" v-if="info.contactTel && info.contactTel !== '—'" border>
          <div class="dia-tel-label">
            <span>本人号码</span> <span>{{ info.contactTel }}</span>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer">
      <el-button type="primary" size="small" @click="handlePhoneCheck">拨 号</el-button>
      <el-button @click="reset" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        props: {
            info: {
                type: Object,
                default: () => {
                    return {
                        id: '',
                        detailId: '',
                        phone: '',
                        contactTel: ''
                    }
                }
            },
            applySence: {
                type: String
            }
        },
        data() {
            return {
                dialogVisible: false,
                beforeOutto: this.info.tel || this.info.contactTel,
                extNo: '',
                iptName: '当前分机号：',
                localExtNo: ''
            }
        },
        created() {
            this.localExtNo = window.localStorage.getItem('extNo')
            this.extNo = this.localExtNo
            this.getMfrs()
        },
        methods: {
            async handlePhoneCheck() {
                if (!this.info.detailId && !this.info.id) {
                    this.$message.error('数据异常')
                }
                if (!this.extNo) {
                    this.$message.error('请先填写分机号')
                }
                if (!this.beforeOutto) {
                    this.$message.error('拨打电话为空号')
                }
                let param = {
                    extNo: this.extNo,
                    id: this.info.detailId || this.info.id,
                    outto: this.beforeOutto,
                    // outto: '15818518021',
                    applySence: this.applySence
                }
                try {
                    // console.log(param)
                    // return
                    const res = await this.$http.common.phoneCheck(param)
                    if (res.code === 0) {
                        window.localStorage.setItem('extNo', this.extNo)
                        this.reset()
                        this.$emit('phoneCheck')
                    } else {
                        // this.$message('error', '拨打电话失败')
                    }
                } catch (error) {}
            },
            async getMfrs() {
                const res = await this.$http.common.getMfrs()
                console.log(res)
                if (res.data === 'tycc') {
                    this.iptName = '坐席工号：'
                } else if (res.data === 'linkus') {
                    this.iptName = '当前分机号：'
                }
            },
            handleIpt() {
                window.localStorage.setItem('extNo', '')
                this.localExtNo = ''
            },
            reset() {
                this.beforeOutto = ''
                this.extNo = ''
                this.iptName = '当前分机号：'
                this.dialogVisible = false
            }
        },
        watch: {
            info(newVal, oldVal) {
                this.beforeOutto = newVal.tel || newVal.contactTel
            }
        }
    }
</script>

<style lang="less" scoped>
.dia-tel {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dia-tel-input {
    width: 150px;
    margin-bottom: 10px;
  }
  .el-radio {
    display: flex;
    margin-right: 0;
  }
  .el-radio:last-child {
    margin-left: 0;
    margin-top: 10px;
  }
  .dia-tel-label {
    display: flex;
    justify-content: space-between;
    width: 180px;
  }
}
</style>
