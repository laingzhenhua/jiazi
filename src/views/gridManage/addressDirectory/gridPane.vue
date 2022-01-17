<template>
    <div class="mhi-pane" v-loading="loading">
        <div class="pane-title">{{ paneTitle }}</div>
        <div class="area-list">
            <ul :style="{height: ulHeight + 'px'}">
                <li
                    v-for="item in paneData"
                    :key="item.key"
                    :class="item.key === currentKey ? 'current' : ''"
                    @click="selectItem(item)"
                >
                    <el-tooltip
                        placement="top"
                        :disabled="item.value.length * 14 < spanWidth"
                        :content="item.value"
                    >
                        <span :style="{width: spanWidth + 'px'}">{{ item.value }}</span>
                    </el-tooltip>
                    <i class="el-icon-close" v-if="editable" @click.stop="deleteItem(item)"></i>
                </li>
            </ul>
            <div v-if="editable && paneParam">
                <div class="pane-add" v-if="showInput">
                    <el-autocomplete
                        v-if="paneType == 4"
                        size="small"
                        placeholder="网格名建议"
                        v-model="addValue"
                        :maxlength="30"
                        :fetch-suggestions="suggestGrid"
                        :trigger-on-focus="false"
                        @select="handleGridSelect"
                        @input="handleGridChange"
                    ></el-autocomplete>
                    <el-select
                        v-if="paneType == 5"
                        size="small"
                        remote
                        filterable
                        v-model="addValue"
                        :remote-method="suggestBuilding"
                        placeholder="请选择楼栋"
                        @focus="initSuggestBuilding"
                    >
                        <el-option
                            v-for="item in buildingData"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                    <span @click="addItem">保存</span>
                    <span @click="closeAdd">取消</span>
                </div>
                <div class="pane-add" v-else-if="paneType == 4 || paneType == 5">
                    <el-button size="small" icon="el-icon-plus" @click="showInput = true">
                        新增
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            paneType: {
                type: Number,
                required: true,
            },
            paneParam: {
                type: [String, Number],
                default: "",
            },
            communityCode: {
                type: [String, Number],
                default: "",
            },
            paneHeight: {
                type: Number,
                default: 240,
            },
            editable: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                loading: false,
                showInput: false,
                currentKey: "", // 选中样式
                spanWidth: "", // 文字长度样式
                buildingData: [], // 候选楼栋
                paneData: [], // 当前列表
                addValue: "", // 保存字段
                addCode: "", // 保存原有网格
            };
        },
        computed: {
            // 标题
            paneTitle() {
                switch (this.paneType) {
                    case 1:
                        return "区域";
                    case 2:
                        return "街道";
                    case 3:
                        return "社区";
                    case 4:
                        return "网格号";
                    case 5:
                        return "楼栋";
                    default:
                        return "—";
                }
            },
            // 动态列表高度
            ulHeight() {
                let h = this.paneData.length * 40;
                if (this.editable) {
                    if (h + 30 > this.paneHeight) {
                        return this.paneHeight - 30;
                    } else {
                        return h;
                    }
                } else {
                    if (h + 30 > this.paneHeight) {
                        return this.paneHeight;
                    } else {
                        return h;
                    }
                }
            },
        },
        mounted() {
            this.dynamicWidth();
            // 添加resize事件
            window.addEventListener("resize", this.dynamicWidth, false);
            // 默认加载区域和街道数据
            this.getItems();
        },
        beforeDestroy() {
            // 解绑resize事件
            window.removeEventListener("resize", this.dynamicWidth);
        },
        watch: {
            paneParam(nv) {
                this.currentKey = "";
                this.showInput = false;
                this.switchItem();
            },
            showInput(nv) {
                if (!nv) {
                    this.addValue = "";
                }
            },
        },
        methods: {
            // 动态文本宽度
            dynamicWidth() {
                // let maxw = document.querySelector(".mhi-zone-opt").offsetWidth - 40;
                // let minw = maxw / 5 - 70;
                // this.spanWidth = minw;
            },
            // 网格名搜索建议
            suggestGrid(string, cb) {
                if (string !== "") {
                    let param = {regionCode: this.paneParam, gridName: string};
                    this.$http.staffAssignmentsManage
                        .queryGovGrid(param)
                        .then(res => {
                            if (res.code == 0) {
                                cb(res.data);
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                        .catch(res => {});
                } else {
                    cb([]);
                }
            },
            // 采用原有建议网格
            handleGridSelect(item) {
                this.addCode = item.key;
            },
            // 采用原有建议网格
            handleGridChange() {
                this.addCode = "";
            },
            // 初次展示所有可选楼栋
            initSuggestBuilding() {
                this.suggestBuilding();
            },
            // 楼栋候选
            suggestBuilding(string) {
                let param = {
                    regionCode: this.communityCode,
                    buildingName: string ? string : "",
                };
                this.$http.staffAssignmentsManage
                    .queryMatchBuilding(param)
                    .then(res => {
                        if (res.code == 0) {
                            this.buildingData = res.data;
                        } else {
                            this.buildingData = [];
                        }
                    })
                    .catch(res => {
                        this.$message.error(res.msg);
                        this.buildingData = [];
                    });
            },
            // 初始化区域、街道
            getItems() {
                this.loading = true;
                switch (this.paneType) {
                    case 1:
                        this.$http.staffAssignmentsManage
                            .queryArea()
                            .then(res => {
                                if (res.code == 0 && res.data) {
                                    this.paneData = [res.data];
                                    this.currentKey = res.data.key;
                                } else {
                                    this.$message.error(res.msg);
                                }
                                this.loading = false;
                            })
                            .catch(res => {
                                this.$message.error(res.msg);
                                this.loading = false;
                            });
                        break;
                    case 2:
                        this.$http.staffAssignmentsManage
                            .queryStreet()
                            .then(res => {
                                if (res.code == 0) {
                                    this.paneData = res.data.map(e => {
                                        return {key: e.regionCode, value: e.regionName};
                                    });
                                } else {
                                    this.$message.error(res.msg);
                                }
                                this.loading = false;
                            })
                            .catch(res => {
                                this.$message.error(res.msg);
                                this.loading = false;
                            });
                        break;
                    default:
                        this.loading = false;
                        return;
                }
            },
            // 切换街道、社区、网格
            switchItem() {
                let param, req;
                switch (this.paneType) {
                    case 3:
                        param = {townCode: this.paneParam};
                        req = this.$http.staffAssignmentsManage.queryCommunity(param);
                        break;
                    case 4:
                        param = {regionCode: this.paneParam};
                        req = this.$http.staffAssignmentsManage.queryGrid(param);
                        break;
                    case 5:
                        param = {gridCode: this.paneParam};
                        req = this.$http.staffAssignmentsManage.queryBuilding(param);
                        break;
                    default:
                        return;
                }
                if (this.paneParam) {
                    this.loading = true;
                    req.then(res => {
                        if (res.code == 0) {
                            this.paneData = res.data;
                        } else {
                            this.paneData = [];
                            this.$message.error(res.msg);
                        }
                        this.loading = false;
                    }).catch(res => {
                        this.paneData = [];
                        this.$message.error(res.msg);
                        this.loading = false;
                    });
                } else {
                    this.paneData = [];
                }
            },
            // 选中
            selectItem(item) {
                this.currentKey = item.key;
                this.$emit("onSelect", {data: item, type: this.paneType});
            },
            // 删除
            deleteItem(item) {
                this.$confirm("是否确认删除?", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let param, req;
                        switch (this.paneType) {
                            case 4:
                                param = {code: item.key};
                                req = this.$http.staffAssignmentsManage.delGrid(param);
                                break;
                            case 5:
                                param = {buildingCode: item.key, gridCode: this.paneParam};
                                req = this.$http.staffAssignmentsManage.delBuilding(param);
                                break;
                        }
                        req.then(res => {
                            if (res.code == 0) {
                                this.$message.success("删除成功");
                                this.switchItem();
                                if (this.paneType == 5) {
                                    this.$emit("onSuccess");
                                }
                            } else {
                                this.$message.error(res.msg);
                            }
                        }).catch(res => {});
                    })
                    .catch(() => {
                        this.$message.info("已取消");
                    });
            },
            // 新增
            addItem() {
                let param, req;
                switch (this.paneType) {
                    case 4:
                        param = {
                            gridName: this.addValue,
                            gridCode: this.addCode,
                            regionCode: this.paneParam,
                        };
                        req = this.$http.staffAssignmentsManage.addGrid(param);
                        break;
                    case 5:
                        param = {buildingCode: this.addValue, gridCode: this.paneParam};
                        req = this.$http.staffAssignmentsManage.addBuilding(param);
                        break;
                }
                req.then(res => {
                    console.log(res);
                    if (res.code == 0) {
                        this.$message.success("添加成功");
                        this.switchItem();
                        this.closeAdd();
                        if (this.paneType == 5) {
                            this.$emit("onSuccess");
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(res => {});
            },
            // 关闭新增
            closeAdd() {
                this.addValue = "";
                this.addCode = "";
                this.showInput = false;
            },
        },
    };
</script>

<style lang="less" scoped>
    .mhi-pane {
        .pane-title {
            font-size: 14px;
            font-weight: bold;
            text-indent: 10px;
            height: 42px;
            line-height: 42px;
            background-color: #f7f7f8;
            border-bottom: 1px solid #dbe1e8;
        }
        .area-list {
            height: 240px;
            ul {
                overflow: auto;
                li {
                    padding: 0 20px;
                    height: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    i {
                        font-weight: bold;
                        color: transparent;
                    }
                }
                li:hover {
                    background-color: rgba(0, 172, 201, 0.08);
                    i {
                        color: #333;
                    }
                }
                .current {
                    background-color: rgba(0, 172, 201, 0.18) !important;
                }
            }
        }
    }
    .pane-add {
        padding: 0 20px;
        height: 25px;
        display: flex;
        align-items: center;
        .el-button {
            flex: 1;
            color: #00acc9;
            border: 1px dashed #00acc9;
            padding: 0;
            height: 24px;
        }
        span {
            color: #00acc9;
            margin-left: 20px;
            cursor: pointer;
        }
        span:hover {
            color: rgba(0, 172, 201, 0.8);
        }
    }
</style>
