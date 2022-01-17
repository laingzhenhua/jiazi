<template>
    <div v-loading="loading">
        <div class="data-card-box">
            <div class="data-card">
                <h3>网格数</h3>
                <p class="num">{{ statistics.gridCnt }}</p>
                <p>
                    <span>未分配：</span>
                    <span>{{ statistics.unGridCnt }}</span>
                </p>
            </div>
            <div class="data-card">
                <h3>应管数</h3>
                <p class="num">{{ statistics.shouldMgntCnt }}</p>
                <p>
                    <span>未分配：</span>
                    <span>{{ statistics.unShouldMgntCnt }}</span>
                </p>
            </div>
            <div class="data-card">
                <h3>户籍人口（非重点）</h3>
                <p class="num">{{ statistics.notKeyRegisterCnt }}</p>
                <p>
                    <span>未分配：</span>
                    <span>{{ statistics.unNotKeyRegisterCnt }}</span>
                </p>
            </div>
            <div class="data-card">
                <h3>重点人群</h3>
                <p class="num">{{ statistics.totalKeyCnt }}</p>
                <p>
                    <span>未分配：</span>
                    <span>{{ statistics.unTotalKeyCnt }}</span>
                </p>
            </div>
        </div>
        <div class="selection-stats">
            <div>
                <span class="title">待分配网格</span>
                已选： 网格
                <span>{{ sum.gridCnt }}</span>
                ， 应管人数
                <span>{{ sum.shouldMgntCnt }}</span>
                ， 户籍人口（非重点）
                <span>{{ sum.notKeyRegisterCnt }}</span>
                ， 重点人群
                <span>{{ sum.totalKeyCnt }}</span>
                ， 高血压
                <span>{{ sum.htnCnt }}</span>
                ， 糖尿病
                <span>{{ sum.dmCnt }}</span>
                ， 老年人
                <span>{{ sum.agedCnt }}</span>
                ， 孕产妇
                <span>{{ sum.maternalCnt }}</span>
                ， 0-6岁儿童
                <span>{{ sum.childCnt }}</span>
                ， 严重精神障碍
                <span>{{ sum.mentalCnt }}</span>
                ， 肺结核
                <span>{{ sum.lungerCnt }}</span>
                ， 低保
                <span>{{ sum.subsistenceCnt }}</span>
                ， 残疾
                <span>{{ sum.disabilityCnt }}</span>
            </div>
            <el-button class="right-btn" size="small" type="primary" @click="handleDistribute">
                分配
            </el-button>
        </div>
        <main class="main-wap-table">
            <paginationTable
                :showColumnIndex="false"
                :showPagination="false"
                :tableData="toBeAllocatedTableData"
                ref="treeTable1"
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @expandChangeHandler="expandChangeHandler"
                :rowKey="'id'"
            >
                <el-table-column prop="title" label="机构" width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-checkbox
                            @change="handleCheckChange(scope.row)"
                            v-model="scope.row.checked"
                        ></el-checkbox>
                        <span>{{ scope.row.title }}</span>
                        <el-popover placement="right" width="260" trigger="click">
                            <ul>
                                <li
                                    v-for="item in buildingData"
                                    :key="item.key"
                                    style="margin-bottom:10px;"
                                >
                                    {{ item.value }}
                                </li>
                            </ul>
                            <span
                                slot="reference"
                                style="color:#00acc7;cursor:pointer"
                                v-show="scope.row.depth == 3"
                                @click="handleClickInfo(scope.row)"
                            >
                                <i class="el-icon-info"></i>
                            </span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="buildingCnt"
                    label="楼栋数"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="shouldMgntCnt"
                    label="应管数"
                    min-width="85"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="notKeyRegisterCnt"
                    label="户籍人口（非重点）"
                    min-width="160"
                    align="center"
                ></el-table-column>
                <el-table-column label="重点人群" align="center">
                    <el-table-column
                        prop="totalKeyCnt"
                        label="重点合计"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="htnCnt"
                        label="高血压"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="dmCnt"
                        label="糖尿病"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="agedCnt"
                        label="老年人"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="maternalCnt"
                        label="孕产妇"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="childCnt"
                        label="0-6岁儿童"
                        min-width="105"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="mentalCnt"
                        label="严重精神障碍"
                        min-width="110"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="lungerCnt"
                        label="肺结核"
                        min-width="85"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="subsistenceCnt"
                        label="低保"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.subsistenceCnt == null
                                        ? "—"
                                        : scope.row.subsistenceCnt
                                }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="disabilityCnt"
                        label="残疾"
                        min-width="85"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{
                                    scope.row.disabilityCnt == null ? "—" : scope.row.disabilityCnt
                                }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </paginationTable>
        </main>
        <el-dialog
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            title="网格分配"
            width="440px"
            class="clearFix"
        >
            <el-form
                :model="ruleForm"
                label-width="110px"
                :rules="rules"
                ref="ruleForm"
                class="clearFix"
            >
                <el-form-item label="机构" prop="code">
                    <el-select placeholder="请选择机构"
                               v-model="ruleForm.code"
                               style="width:100%"
                               filterable
                               clearable
                    >
                        <el-option
                            v-for="(item, index) in orgList"
                            :key="index"
                            :label="item.value"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSave" :loading="isLoading" size="small">
                    {{ isLoading ? "保存中" : "确 定" }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {gridDistribution} from "../../../../httpRequset/module/distributeManage";

    /**
     * 查找父节点
     */
    const getParentNode = (data, code, type) => {
        var hasFound = false;
        var result = null;
        var attrName = null;
        switch (type) {
            case "street":
                attrName = "streetCode";
                break;
            case "region":
                attrName = "regionCode";
                break;
            case "assignOrgCode":
                attrName = "assignOrgCode";
                break;
            default:
                break;
        }
        var fn = data => {
            if (Array.isArray(data) && !hasFound) {
                // 判断是否是数组并且没有的情况下，
                data.forEach(item => {
                    if (item[attrName] === code) {
                        result = item; // 返回的结果等于每一项
                        hasFound = true;
                    } else if (item.children) {
                        fn(item.children); // 递归调用下边的子项
                    }
                });
            }
        };
        fn(data);
        return result;
    };
    /**
     * 统计选中的网格数等等
     */
    const getStatistics = data => {
        let dataObj = {
            gridCnt: 0, //网格数
            shouldMgntCnt: 0, // 应管数人
            notKeyRegisterCnt: 0, // 户籍人口（非重点）
            totalKeyCnt: 0, // 重点人群
            htnCnt: 0, // 高血压
            dmCnt: 0, // 糖尿病
            agedCnt: 0, // 老年人
            maternalCnt: 0, // 孕产妇
            childCnt: 0, // 0-6岁儿童
            mentalCnt: 0, // 严重精神障碍
            lungerCnt: 0, // 肺结核
            subsistenceCnt: 0, // 低保
            disabilityCnt: 0, // 残疾
        };
        const fn = data => {
            data.forEach(item => {
                if (item.checked) {
                    for (let key in dataObj) {
                        dataObj[key] += item[key];
                    }
                } else if (!item.checked && item.children.length > 0) {
                    fn(item.children);
                }
            });
        };
        fn(data);
        return dataObj;
    };
    /**
     * 处理选中的网格数据（分配接口用）
     */
    const handleCheckedData = data => {
        let gridCodeList = [
            {
                codeList: [],
                type: 1,
            },
            {
                codeList: [],
                type: 2,
            },
            {
                codeList: [],
                type: 3,
            },
        ];
        const fn = data => {
            data.forEach(item => {
                if (item.checked) {
                    if (item.depth == 1) {
                        gridCodeList[0].codeList.push(item.streetCode);
                    } else if (item.depth == 2) {
                        gridCodeList[1].codeList.push(item.regionCode);
                    } else if (item.depth == 3) {
                        gridCodeList[2].codeList.push(item.gridCode);
                    }
                } else if (!item.checked && item.children.length > 0) {
                    fn(item.children);
                }
            });
        };
        fn(data);
        return gridCodeList;
    };
    import paginationTable from "../../../../components/paginationTable/paginationTable.vue";
    export default {
        data() {
            return {
                loading: false,
                statistics: {
                    gridCnt: "",
                    notKeyRegisterCnt: "",
                    shouldMgntCnt: "",
                    totalKeyCnt: "",
                    unGridCnt: "",
                    unNotKeyRegisterCnt: "",
                    unShouldMgntCnt: "",
                    unTotalKeyCnt: "",
                },
                sum: {
                    gridCnt: 0, //网格数
                    shouldMgntCnt: 0, // 应管数人
                    notKeyRegisterCnt: 0, // 户籍人口（非重点）
                    totalKeyCnt: 0, // 重点人群
                    htnCnt: 0, // 高血压
                    dmCnt: 0, // 糖尿病
                    agedCnt: 0, // 老年人
                    maternalCnt: 0, // 孕产妇
                    childCnt: 0, // 0-6岁儿童
                    mentalCnt: 0, // 严重精神障碍
                    lungerCnt: 0, // 肺结核
                    subsistenceCnt: 0, // 低保
                    disabilityCnt: 0, // 残疾
                },
                toBeAllocatedTableData: [], //待分配
                checkedGridData: [], //已选中的网格数据(分配接口用)
                ruleForm: {code: ""}, //机构编码
                rules: {
                    code: [{required: true, message: "请选择机构", trigger: "blur"}],
                },
                dialogVisible: false,
                orgList: [], //可分配机构列表
                isLoading: false, //保存按钮loading
                allocatedTableIsExpanded: [], //待分配表格展开的行
                buildingData: [], //楼栋列表
            };
        },
        components: {paginationTable},
        methods: {
            getGridStatistics() {
                this.$http.distributeManage.getGridStatistics().then(res => {
                    if (res.code == 0) {
                        this.statistics = {...res.data};
                    }
                });
            },
            // 获取待分配网格列表
            getGridList(params, tree, resolve) {
                this.loading = true;
                this.$http.distributeManage.getGridList(params).then(res => {
                    if (res.code == 0) {
                        if (params.regionCode == "" && params.streetCode == "") {
                            // 第一层街道数据
                            this.toBeAllocatedTableData = res.data;
                        } else if (params.streetCode != "" && params.regionCode == "") {
                            // 获取区域层数据
                            if (resolve) {
                                // 点击剪头展开时更新子节点数据
                                resolve(res.data);
                            } else {
                                // 点击行展开时更新子节点数据
                                this.$set(
                                    this.$refs.treeTable1.$refs.multipleTable.store.states
                                        .lazyTreeNodeMap,
                                    tree.id,
                                    res.data,
                                );
                            }
                            this.$set(tree, "children", res.data);
                        } else if (params.regionCode != "" && params.streetCode != "") {
                            // 获取网格层数据
                            if (resolve) {
                                // 点击剪头展开时更新子节点数据
                                resolve(res.data);
                            } else   {
                                // 点击行展开时更新子节点数据
                                this.$set(
                                    this.$refs.treeTable1.$refs.multipleTable.store.states
                                        .lazyTreeNodeMap,
                                    tree.id,
                                    res.data,
                                );
                            }
                            this.$set(tree, "children", res.data);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.loading = false;
                });
            },
            load(tree, treeNode, resolve) {
                if (tree.children && tree.children.length != 0) {
                    treeNode.expanded = !treeNode.expanded;
                    treeNode.loading = false;
                    return;
                }
                if (tree.depth == 1) {
                    this.getGridList(
                        {
                            checked: tree.checked,
                            regionCode: "",
                            streetCode: tree.streetCode,
                        },
                        tree,
                        resolve,
                    );
                } else if (tree.depth == 2) {
                    this.getGridList(
                        {
                            checked: tree.checked,
                            regionCode: tree.regionCode,
                            streetCode: tree.streetCode,
                        },
                        tree,
                        resolve,
                    );
                }
            },

            //选中所有子节点
            selectAllChildren(children, checked) {
                children.forEach((v, i) => {
                    v.checked = checked;
                    if (v.children && v.children.length > 0) {
                        this.selectAllChildren(v.children, checked);
                    }
                });
            },
            handleCheckChange(row) {
                let parentNode; //父节点
                let grandpaNode; //爷爷节点
                let trueCount2 = 0; //第二层选中的个数
                let trueCount3 = 0; //第三层选中的个数
                switch (row.depth) {
                    case 1:
                        if (row.children && row.children.length > 0) {
                            this.selectAllChildren(row.children, row.checked);
                        }
                        break;
                    case 2:
                        // 获取父节点(街道节点)
                        parentNode = getParentNode(
                            this.toBeAllocatedTableData,
                            row.streetCode,
                            "street",
                        );
                        if (row.children && row.children.length > 0) {
                            this.selectAllChildren(row.children, row.checked);
                        }
                        if (!row.checked) {
                            // 设置父节点为不选中 row.regionCode
                            parentNode.checked = false;
                        } else {
                            parentNode.children.forEach(item => {
                                if (item.checked) {
                                    trueCount3++;
                                }
                            });
                            if (trueCount3 == parentNode.children.length) {
                                // 当子节点全部选中时设置父节点选中
                                parentNode.checked = true;
                            }
                        }
                        break;
                    case 3:
                        // 获取父节点(区域节点)
                        parentNode = getParentNode(
                            this.toBeAllocatedTableData,
                            row.regionCode,
                            "region",
                        );
                        // 获取爷爷节点(街道节点)
                        grandpaNode = getParentNode(
                            this.toBeAllocatedTableData,
                            row.streetCode,
                            "street",
                        );
                        if (!row.checked) {
                            // 设置父节点为不选中
                            parentNode.checked = false;
                            grandpaNode.checked = false;
                        } else {
                            parentNode.children.forEach(item => {
                                if (item.checked) {
                                    trueCount3++;
                                }
                            });
                            if (trueCount3 == parentNode.children.length) {
                                // 当子节点全部选中时设置父节点选中
                                parentNode.checked = true;
                            }
                            grandpaNode.children.forEach(item => {
                                if (item.checked) {
                                    trueCount2++;
                                }
                            });
                            if (trueCount2 == grandpaNode.children.length) {
                                // 当子节点全部选中时设置父节点选中
                                grandpaNode.checked = true;
                            }
                        }
                        break;

                    default:
                        break;
                }
                this.sum = getStatistics(this.toBeAllocatedTableData);
                this.checkedGridData = handleCheckedData(this.toBeAllocatedTableData);
            },
            // 获取可分配的机构
            getGridOrgList() {
                this.$http.distributeManage.getGridOrgList().then(res => {
                    if (res.code == 0) {
                        this.orgList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            // 点击分配
            handleDistribute() {
                if (this.sum.gridCnt == 0) {
                    this.$message.warning("至少选择一个网格");
                } else {
                    this.dialogVisible = true;
                    this.ruleForm.code = "";
                    this.getGridOrgList();
                }
            },
            // 保存
            handleSave() {
                if (!this.ruleForm.code) {
                    this.$message.warning("请选择机构");
                } else {
                    let params = {
                        code: this.ruleForm.code,
                        gridCodeList: this.checkedGridData,
                    };
                    this.gridDistribution(params);
                }
            },
            gridDistribution(data) {
                this.$http.distributeManage.gridDistribution(data).then(res => {
                    if (res.code == 0) {
                        this.$message.success("分配成功");
                        this.dialogVisible = false;
                        this.getGridList({
                            checked: false,
                            regionCode: "",
                            streetCode: "",
                        })
                    } else {
                    }
                });
            },
            // 删除已分配的网格
            handleDel(row) {
                let params = {
                    code: "",
                    streetCode: "",
                    regionCode: "",
                    gridCode: "",
                };
                switch (row.depth) {
                    case 1:
                        params.code = row.code;
                        break;
                    case 2:
                        params.code = row.code;
                        params.streetCode = row.streetCode;
                        break;
                    case 3:
                        params.code = row.code;
                        params.regionCode = row.regionCode;
                        break;
                    case 4:
                        params.code = row.code;
                        params.gridCode = row.gridCode;
                        break;
                    default:
                        break;
                }
                this.$confirm("是否确定删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.delAssignGridList(params, row);
                    })
                    .catch(() => {
                        this.$message.info("已取消删除s");
                    });
            },
            // 根据网格查询楼栋信息
            queryBuilding(param) {
                return this.$http.gridManage.gridSource.queryBuilding(param).then(res => {
                    if (res.code == 0) {
                        this.buildingData = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            // 查看网格详细信息
            handleClickInfo(row) {
                let param = {gridCode: row.gridCode};
                this.queryBuilding(param);
            },
            //点击待分配表格行 展开
            clickAllocatedTableRow(row, column, event) {
                if (row.hasChildren) {
                    if (row.id in this.allocatedTableIsExpanded) {
                        this.$refs.treeTable1.$refs.multipleTable.store.toggleTreeExpansion(
                            row,
                            this.allocatedTableIsExpanded[row.id],
                        );
                        this.allocatedTableIsExpanded[row.id] = !this.allocatedTableIsExpanded[
                            row.id
                        ];
                    } else {
                        this.$refs.treeTable1.$refs.multipleTable.store.toggleTreeExpansion(
                            row,
                            true,
                        );
                        this.allocatedTableIsExpanded[row.id] = false;
                    }
                    this.$nextTick(() => {
                        if (this.$refs.treeTable1.$refs.multipleTable) {
                            this.$refs.treeTable1.$refs.multipleTable.doLayout();
                        }
                    });
                }
            },
            // 树形表格展开or收起（未分配表格）
            expandChangeHandler({row, expanded}) {
                if (expanded) {
                    if (row.children && row.children.length != 0) {
                        return;
                    }
                    if (row.depth == 1) {
                        this.getGridList(
                            {
                                checked: row.checked,
                                regionCode: "",
                                streetCode: row.streetCode,
                            },
                            row,
                        );
                    } else if (row.depth == 2) {
                        this.getGridList(
                            {
                                checked: row.checked,
                                regionCode: row.regionCode,
                                streetCode: row.streetCode,
                            },
                            row,
                        );
                    }
                }
            },
        },
        created() {
            this.getGridStatistics();
            this.getGridList({
                checked: false,
                regionCode: "",
                streetCode: "",
            });
        },
    };
</script>

<style lang="less" scoped>
    .data-card-box {
        display: flex;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(219, 225, 232, 1);
        .data-card {
            width: 200px;
            height: 116px;
            padding: 0px 10px;
            box-sizing: border-box;
            border: 1px solid rgba(219, 225, 232, 1);
            margin-right: 20px;
            h3 {
                text-align: center;
                height: 40px;
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: rgba(50, 58, 70, 1);
                line-height: 40px;
                border-bottom: 1px solid #dbe1e8;
            }
            p.num {
                color: #00acc7;
                font-size: 28px;
                text-align: center;
                font-weight: bold;
                height: 38px;
                line-height: 38px;
            }
            p:last-child {
                text-align: center;
                height: 26px;
                line-height: 26px;
                span {
                    font-size: 14px;
                }
                span:first-child {
                    color: #dbe1e8;
                }
                span:nth-child(2) {
                    color: #323a46;
                }
            }
        }
    }
    .selection-stats {
        height: 32px;
        display: flex;
        justify-content: space-between;
        div {
            flex: 1;
            align-self: center;
            padding-right: 20px;
            span {
                color: #f1556c;
            }
            span.title {
                font-size: 14px;
                color: #394263;
                padding-left: 10px;
                padding-right: 20px;
                font-weight: bold;
                border-left: 4px solid #00acc7;
            }
        }
        .right-btn {
            height: 32px;
        }
    }
    rgb(19, 12, 13) .dialog-footer {
        button {
            height: 32px;
            width: 56px;
            padding: 0;
            line-height: 0px;
            border-radius: 3px;
        }
    }
    @media (max-width: 1600px) {
        .selection-stats div {
            line-height: 22px;
        }
    }
</style>
