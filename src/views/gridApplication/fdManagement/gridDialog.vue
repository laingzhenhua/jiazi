<template>
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    @close="handleClose"
    width="600px"
  >
    <el-form
      ref="gridForm"
      class="grid-form"
      :model="gridForm"
      :rules="gridRules"
      label-width="120px"
    >
      <el-form-item label="街道" prop="streetCode">
        <el-select
          size="small"
          v-model="gridForm.streetCode"
          @change="selectStreet"
          clearable
          filterable
        >
          <el-option v-for="i in streetData" :key="i.key" :value="i.key" :label="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="社区" prop="orgCode">
        <el-select size="small" v-model="gridForm.orgCode" @change="selectOrg" clearable filterable>
          <el-option v-for="i in orgData" :key="i.key" :value="i.key" :label="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网格号" prop="id">
        <el-select size="small" v-model="gridForm.id" clearable filterable>
          <el-option v-for="i in gridData" :key="i.key" :value="i.key" :label="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网格范围" prop="gridScope">
        <el-input size="small" type="textarea" :rows="3" v-model="gridForm.gridScope" disabled></el-input>
      </el-form-item>
      <el-form-item label="网格楼栋(栋)" prop="buildingNum">
        <el-input size="small" v-model="gridForm.buildingNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="人口信息情况(人)" prop="peopleNum">
        <el-input size="small" v-model="gridForm.peopleNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="网格员" prop="gridMan">
        <el-input size="small" v-model="gridForm.gridMan" clearable></el-input>
      </el-form-item>
      <el-form-item label="网格员电话" prop="tel">
        <el-input size="small" v-model="gridForm.tel" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" type="primary" :loading="btnloading">保存</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        props: ["operate", "teamId", "currentGrid"],
        data() {
            return {
                dialogVisible: false,
                btnloading: false,
                streetData: [],
                orgData: [],
                gridData: [],
                gridForm: {
                    id: "",
                    streetCode: "",
                    orgCode: "",
                    gridScope: "",
                    buildingNum: "",
                    peopleNum: "",
                    gridMan: "",
                    tel: ""
                },
                gridRules: {
                    id: [{ required: true, message: "请选择网格", trigger: "blur" }]
                }
            };
        },
        computed: {
            dialogTitle() {
                switch (this.operate) {
                    case "add":
                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                        this.gridForm = { id: "" };
                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                        this.dialogVisible = true;
                        return "新增";
                    case "edit":
                        for (const item in this.gridForm) {
                            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                            this.gridForm[item] = this.currentGrid[item]
                                ? this.currentGrid[item]
                                : "";
                        }
                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                        this.dialogVisible = true;
                        return "编辑";
                    default:
                        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                        this.dialogVisible = false;
                        return "";
                }
            }
        },
        methods: {
            // 关闭弹窗
            handleClose() {
                this.$refs.gridForm.resetFields();
                this.$emit("listenClose");
            },
            // 获取街道
            queryStreet() {
                this.$http.common
                    .queryStreet()
                    .then(res => {
                        if (res.code == 0) {
                            this.streetData = res.data.map(e => {
                                return { key: e.regionCode, value: e.regionName };
                            });
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {});
            },
            // 获取医院
            queryOrg() {
                let param = { regionCode: this.gridForm.streetCode };
                this.$http.common
                    .queryOrg(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.orgData = res.data;
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {});
            },
            // 获取网格
            queryGrid() {
                let param = {
                    regionCode: this.gridForm.streetCode,
                    orgCode: this.gridForm.orgCode
                };
                this.$http.common
                    .queryOrg(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.gridData = res.data;
                        } else {
                            this.$mes("error", res.msg);
                        }
                    })
                    .catch(res => {});
            },
            // 选择街道
            selectStreet(nv) {
                if (nv) {
                    this.gridForm.id = "";
                    this.gridForm.orgCode = "";
                }
                this.queryOrg();
                this.queryGrid();
            },
            // 选择社康
            selectOrg(nv) {
                if (nv) {
                    this.gridForm.id = "";
                }
                this.queryGrid();
            }
        }
    };
</script>

<style lang="less" scoped>
.grid-form .el-select {
  width: 100%;
}
</style>
