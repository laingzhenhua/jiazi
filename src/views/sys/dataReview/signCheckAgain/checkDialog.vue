<template>
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      title="目标签约排除人群人工复核"
      :visible.sync="dialogVisible"
      class="clearFix dialog-box"
      width="920px"
    >
      <div style="display:flex;" v-loading="loading">
        <!-- 左侧 -->
        <div style="flex:2;" class="left-box">
          <div>
            <span>机构名称：{{tableData.orgName}}</span>
            <span>团队名称：{{tableData.teamName}}</span>
          </div>
          <div>
            <span>居民姓名：{{tableData.name}}</span>
            <span>性别：{{tableData.sex == 1? "男" : "女"}}</span>
          </div>
          <div>
            <span>年龄：{{tableData.age}}</span>
            <span>人群分类：{{tableData.crowdType}}</span>
          </div>
          <div>
            <span>户籍类型：{{tableData.residentType == 0 ? "非户籍" : "户籍"}}</span>
            <span>电话号码：{{tableData.tel}}</span>
          </div>
          <div>
            <span>详细地址：{{tableData.address}}</span>
            <span>排除原因：{{tableData.dissReason}}</span>
          </div>
          <div>
            <span>操作人：{{tableData.operator}}</span>
            <span>操作时间：{{tableData.operatorTime}}</span>
          </div>
        </div>
        <!-- 右侧 -->
        <div style="flex:1" class="right-box">
          <div class="verificationConclusions">人工复核结果</div>
          <div class="isStandardized">
            <span class="title-label gui">真</span>真实性结论
            <el-form label-position="top">
              <el-form-item label>
                <el-radio-group v-model="tableData.truthResult">
                  <el-radio :label="1">真实</el-radio>
                  <el-radio :label="0">不真实</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="remark">
            <h3>备注</h3>
            <el-input
              type="textarea"
              v-model="tableData.truthMemo"
              :rows="6"
              maxlength="200"
              show-word-limit
              class="mhi-count"
            ></el-input>
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="dialog-footer" slot="footer">
          <dialTelAndPlayRecord :info="tableData" style="margin-top:5px" applySence="SAMPLING_AUTH_CHECK"></dialTelAndPlayRecord>
          <ul class="dialog-footer-button">
              <el-button type="primary" @click="onSave" :loading="saveLoading">保 存</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button></ul>

      </div>
    </el-dialog>
  </div>
</template>


<script>
    import {samplingDetailGet, samplingDetailTruthSave} from "../../../../httpRequset/module/sysSignCheckAgain";
    import dialTelAndPlayRecord from "/src/components/dialTelAndPlayRecord2";
    export default {
        props: {
            detailId: {
                type: String,
            },
        },
        components: {
            dialTelAndPlayRecord
        },
        data() {
            return {
                dialogVisible: false,
                loading: false,
                saveLoading: false,
                tableData: {},
            };
        },
        created() {},
        computed: {},
        methods: {
            getSamplingDetail(detailId) {
                this.dialogVisible = true;
                this.loading = true;
                let data = {
                    detailId: String(detailId),
                    taskType: "exclude",
                };
                this.$http.sysSignCheckAgain.samplingDetailGet(data).then((res) => {
                    this.loading = false;
                    if (res.code == 0) {
                        this.tableData = res.data;
                    } else {
                        // this.$mes("error", res.msg);
                    }
                });
            },
            //保存
            onSave() {
                let data = this.tableData;
                data.truthResult = this.tableData.truthResult;
                this.saveLoading = true;
                this.$http.sysSignCheckAgain
                    .samplingDetailTruthSave(data)
                    .then((res) => {
                        this.saveLoading = false;
                        if (res.code == 0) {
                            this.$message.success("保存成功！");
                            this.$emit("saveSuccess");
                        } else {
                            // this.$mes("error", res.msg);
                        }
                        this.dialogVisible = false;
                    })
                    .catch((err) => {
                        this.saveLoading = false;
                        this.dialogVisible = false;
                    });
            },
        },
    };
</script>

<style lang="less" scoped>
.dialog-box {
    .dialog-footer{
        display: flex;
        .dialog-footer-button{
            display: flex;
            flex: 1;
            justify-content: flex-end;
        }
    }
  .left-box {
    padding: 6px 0;
    margin-right: 4%;
    border: 1px solid gainsboro;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      flex: 1;
      display: flex;
      justify-content: space-around;
      span {
        flex: 1;
        padding: 0 8px;
      }
    }
  }
  .right-box {
    padding-bottom: 20px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 2px;
    .verificationConclusions {
      height: 50px;
      background: rgba(255, 255, 255, 1);
      border-bottom: 1px solid rgba(220, 220, 220, 1);
      border-radius: 2px 2px 0px 0px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 50px;
      text-indent: 1em;
      color: rgba(51, 51, 51, 1);
    }

    .isStandardized {
      padding: 20px;
      padding-bottom: 0px;
      border-bottom: 1px solid rgba(220, 220, 220, 1);
      .title-label {
        width: 22px;
        height: 22px;
        display: inline-block;
        line-height: 22px;
        color: #fff;
        text-align: center;
        margin-right: 8px;
        font-size: 12px;
      }
      .title-label.gui {
        background: #6da7f1;
      }
    }

    .remark {
      h3 {
        margin-bottom: 10px;
      }
      padding: 20px;
      padding-bottom: 0px;
    }
  }
}
</style>

