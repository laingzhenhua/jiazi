<template>
    <div v-loading="loading">
        <main class="main-wap-table">
            <paginationTable
                :tableData="assignedTableData"
                :showColumnIndex="false"
                :showPagination="false"
                ref="treeTable2"
                :load="load2"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                @expandChangeHandler="expandChangeHandler2"
                :rowKey="'id'"
            >
                <el-table-column prop="title" label="机构" width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
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
                                v-show="scope.row.depth == 4"
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
                    <el-table-column prop="gridMan" label="网格员" min-width="85" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.gridMan == null ? "—" : scope.row.gridMan }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tel" label="网格员电话" min-width="115" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.tel == null ? "—" : scope.row.tel }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100" align="center">
                    <template slot-scope="scope" v-if="scope.row.title != '合计'">
                        <span
                            v-if="scope.row.depth == 1"
                            style="color:#00acc7;text-decoration: underline;cursor: pointer"
                            @click="handleDel(scope.row)"
                        >
                            全部删除
                        </span>
                        <span
                            v-else
                            style="color:#00acc7;text-decoration: underline;cursor: pointer"
                            @click="handleDel(scope.row)"
                        >
                            删除
                        </span>
                    </template>
                </el-table-column>
            </paginationTable>
        </main>
    </div>
</template>

<script>
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
    /**
     * 根据id删除数组内的元素
     */
    const delById = (arr, id) => {
        let index = arr.findIndex(ele => {
            return ele.id === id;
        });
        if (index != -1) {
            //删除元素
            arr.splice(index, 1);
        }
        console.log(arr);
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
                assignedTableData: [], //已分配
                checkedGridData: [], //已选中的网格数据(分配接口用)
                ruleForm: { code: "" }, //机构编码
                rules: {
                    code: [{ required: true, message: "请选择机构", trigger: "blur" }],
                },
                dialogVisible: false,
                orgList: [], //可分配机构列表
                isLoading: false, //保存按钮loading
                allocatedTableIsExpanded: [], //待分配表格展开的行
                assignedTableIsExpanded: [], //已分配表格展开的行
                buildingData: [], //楼栋列表
            };
        },
        components: { paginationTable },
        methods: {
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
            // 获取已分配网格列表
            getAssignGridList(params, tree, resolve) {
                this.loading = true
                this.$http.distributeManage.getAssignGridList(params).then(res => {

                    if (res.code == 0) {
                        if (
                            params.code == "" &&
                            params.regionCode == "" &&
                            params.streetCode == ""
                        ) {
                            // 第一层数据
                            this.assignedTableData = res.data;
                        } else if (
                            params.code != "" &&
                            params.streetCode == "" &&
                            params.regionCode == ""
                        ) {
                            // 第二层数据
                            if (resolve) {
                                // 点击剪头展开时更新子节点数据
                                resolve(res.data);
                            } else {
                                // 点击行展开时更新子节点数据
                                this.$set(
                                    this.$refs.treeTable2.$refs.multipleTable.store.states
                                        .lazyTreeNodeMap,
                                    tree.id,
                                    res.data,
                                );
                            }
                            this.$set(tree, "children", res.data);
                        } else if (
                            params.code != "" &&
                            params.streetCode != "" &&
                            params.regionCode == ""
                        ) {
                            // 第三层数据
                            if (resolve) {
                                // 点击剪头展开时更新子节点数据
                                resolve(res.data);
                            } else {
                                // 点击行展开时更新子节点数据
                                this.$set(
                                    this.$refs.treeTable2.$refs.multipleTable.store.states
                                        .lazyTreeNodeMap,
                                    tree.id,
                                    res.data,
                                );
                            }
                            this.$set(tree, "children", res.data);
                        } else if (
                            params.code != "" &&
                            params.regionCode != "" &&
                            params.streetCode != ""
                        ) {
                            // 第四层数据
                            if (resolve) {
                                // 点击剪头展开时更新子节点数据
                                resolve(res.data);
                            } else {
                                // 点击行展开时更新子节点数据
                                this.$set(
                                    this.$refs.treeTable2.$refs.multipleTable.store.states
                                        .lazyTreeNodeMap,
                                    tree.id,
                                    res.data,
                                );
                            }
                            this.$set(tree, "children", res.data);
                        }
                    }
                    this.loading = false;
                });
            },
            load2(tree, treeNode, resolve) {
                if (tree.children && tree.children.length != 0) {
                    treeNode.expanded = !treeNode.expanded;
                    treeNode.loading = false;
                    return;
                }
                if (tree.depth == 1) {
                    this.getAssignGridList(
                        {
                            code: tree.code,
                            regionCode: "",
                            streetCode: "",
                        },
                        tree,
                        resolve,
                    );
                } else if (tree.depth == 2) {
                    this.getAssignGridList(
                        {
                            code: tree.code,
                            regionCode: "",
                            streetCode: tree.streetCode,
                        },
                        tree,
                        resolve,
                    );
                } else if (tree.depth == 3) {
                    this.getAssignGridList(
                        {
                            code: tree.code,
                            regionCode: tree.regionCode,
                            streetCode: tree.streetCode,
                        },
                        tree,
                        resolve,
                    );
                }
            },
            // 网格分配
            gridDistribution(params) {
                this.isLoading = true;
                this.$http.distributeManage.gridDistribution(params).then(res => {
                    this.isLoading = false;
                    if (res.code == 0) {
                        this.$message.success("分配成功");
                        this.dialogVisible = false;
                        this.sum = {
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
                        // this.getGridList({
                        //     checked: false,
                        //     regionCode: "",
                        //     streetCode: "",
                        // });
                        this.getAssignGridList({
                            code: "",
                            regionCode: "",
                            streetCode: "",
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            // 删除已分配网格列
            delAssignGridList(params, row) {
                let depth1Node;
                let depth2Node;
                let depth3Node;
                let depth4Node;
                this.$http.distributeManage.delAssignGridList(params).then(res => {
                    if (res.code == 0) {
                        this.$message.success("删除成功");
                        // this.getGridList({
                        //     checked: false,
                        //     regionCode: "",
                        //     streetCode: "",
                        // });
                        // this.getAssignGridList({
                        //     code: "",
                        //     regionCode: "",
                        //     streetCode: ""
                        // });
                        // ----------------------------前端模拟已分配表格删除start-------------------------
                        switch (row.depth) {
                            case 1:
                                setTimeout(() => {
                                    delById(this.assignedTableData, row.id);
                                }, 400);
                                break;
                            case 2:
                                depth1Node = getParentNode(
                                    this.assignedTableData,
                                    row.assignOrgCode,
                                    "assignOrgCode",
                                );
                                if (depth1Node.children.length == 1) {
                                    setTimeout(() => {
                                        delById(this.assignedTableData, depth1Node.id);
                                    }, 400);
                                } else {
                                    setTimeout(() => {
                                        delById(depth1Node.children, row.id);
                                    }, 400);
                                }
                                break;
                            case 3:
                                depth2Node = getParentNode(
                                    this.assignedTableData,
                                    row.streetCode,
                                    "street",
                                );
                                depth1Node = getParentNode(
                                    this.assignedTableData,
                                    depth2Node.assignOrgCode,
                                    "assignOrgCode",
                                );
                                if (
                                    depth2Node.children.length == 1 &&
                                    depth1Node.children.length == 1
                                ) {
                                    setTimeout(() => {
                                        delById(this.assignedTableData, depth1Node.id);
                                    }, 400);
                                } else if (depth2Node.children.length > 1) {
                                    setTimeout(() => {
                                        delById(depth2Node.children, row.id);
                                    }, 400);
                                }
                                break;
                            case 4:
                                depth3Node = getParentNode(
                                    this.assignedTableData,
                                    row.regionCode,
                                    "region",
                                );
                                depth2Node = getParentNode(
                                    this.assignedTableData,
                                    row.streetCode,
                                    "street",
                                );
                                depth1Node = getParentNode(
                                    this.assignedTableData,
                                    depth2Node.assignOrgCode,
                                    "assignOrgCode",
                                );
                                if (
                                    depth3Node.children.length == 1 &&
                                    depth2Node.children.length == 1 &&
                                    depth1Node.children.length == 1
                                ) {
                                    setTimeout(() => {
                                        delById(this.assignedTableData, depth1Node.id);
                                    }, 400);
                                } else if (
                                    depth3Node.children.length == 1 &&
                                    depth2Node.children.length == 1 &&
                                    depth1Node.children.length > 1
                                ) {
                                    setTimeout(() => {
                                        delById(depth1Node.children, depth2Node.id);
                                    }, 400);
                                } else if (
                                    depth3Node.children.length == 1 &&
                                    depth2Node.children.length > 1
                                ) {
                                    setTimeout(() => {
                                        delById(depth2Node.children, depth3Node.id);
                                    }, 400);
                                } else {
                                    setTimeout(() => {
                                        delById(depth3Node.children, row.id);
                                    }, 400);
                                }
                                break;
                            default:
                                break;
                        }
                        // ----------------------------前端模拟已分配表格删除over--------------------------
                    } else {
                        this.$message.error(res.msg);
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
                        this.$message.info("已取消删除");
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
                let param = { gridCode: row.gridCode };
                this.queryBuilding(param);
            },
            //点击待分配表格行 展开
            clickAllocatedTableRow(row, column, event) {
                if (row.hasChildren) {
                    if (row.id in this.allocatedTableIsExpanded) {
                        this.$refs.treeTable1.store.toggleTreeExpansion(
                            row,
                            this.allocatedTableIsExpanded[row.id],
                        );
                        this.allocatedTableIsExpanded[row.id] = !this.allocatedTableIsExpanded[
                            row.id
                        ];
                    } else {
                        this.$refs.treeTable1.store.toggleTreeExpansion(row, true);
                        this.allocatedTableIsExpanded[row.id] = false;
                    }
                    this.$nextTick(() => {
                        if (this.$refs.treeTable1) {
                            this.$refs.treeTable1.doLayout();
                        }
                    });
                }
            },
            // 树形表格展开or收起（未分配表格）
            expandChangeHandler(row, expanded) {
                if (expanded) {
                    if (row.children && row.children.length != 0) {
                        return;
                    }
                    // if (row.depth == 1) {
                    //     this.getGridList(
                    //         {
                    //             checked: row.checked,
                    //             regionCode: "",
                    //             streetCode: row.streetCode,
                    //         },
                    //         row,
                    //     );
                    // } else if (row.depth == 2) {
                    //     this.getGridList(
                    //         {
                    //             checked: row.checked,
                    //             regionCode: row.regionCode,
                    //             streetCode: row.streetCode,
                    //         },
                    //         row,
                    //     );
                    // }
                } else {
                    /**
                     * 收起时把子节点数据情清空
                     */
                    // console.log("收起了。。。", row);
                }
            },

            //点击已分配表格行 展开
            clickAssignedTableRow(row, column, event) {
                if (event.target.nodeName == "INPUT" || event.target.nodeName == "SPAN") {
                    // 如果点击的是checkbox则不执行展开收起逻辑
                    return;
                }
                if (row.hasChildren) {
                    if (row.id in this.assignedTableIsExpanded) {
                        this.$refs.treeTable2.$refs.multipleTable.store.toggleTreeExpansion(
                            row,
                            this.assignedTableIsExpanded[row.id],
                        );
                        this.assignedTableIsExpanded[row.id] = !this.assignedTableIsExpanded[
                            row.id
                        ];
                    } else {
                        this.$refs.treeTable2.$refs.multipleTable.store.toggleTreeExpansion(
                            row,
                            true,
                        );
                        this.assignedTableIsExpanded[row.id] = false;
                    }
                    this.$nextTick(() => {
                        this.$refs.treeTable2.$refs.multipleTable.doLayout();
                    });
                }
            },
            // 树形表格展开or收起（已分配表格）
            expandChangeHandler2({ row, expanded }) {
                if (expanded) {
                    if (row.children && row.children.length != 0) {
                        return;
                    }
                    if (row.depth == 1) {
                        this.getAssignGridList(
                            {
                                code: row.code,
                                regionCode: "",
                                streetCode: "",
                            },
                            row,
                        );
                    } else if (row.depth == 2) {
                        this.getAssignGridList(
                            {
                                code: row.code,
                                regionCode: "",
                                streetCode: row.streetCode,
                            },
                            row,
                        );
                    } else if (row.depth == 3) {
                        this.getAssignGridList(
                            {
                                code: row.code,
                                regionCode: row.regionCode,
                                streetCode: row.streetCode,
                            },
                            row,
                        );
                    }
                } else {
                    /**
                     * 收起时把子节点数据情清空
                     */
                    // console.log("收起了。。。", row);
                }
            },
        },
        created() {
            this.getAssignGridList({
                code: "",
                regionCode: "",
                streetCode: "",
            });
        },
    };
</script>

<style lang="less" scoped>
    .data-card-box {
        display: flex;
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
        height: 40px;
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
        .r {
            float: right;
        }
    }
    .dialog-footer {
        button {
            height: 32px;
            width: 56px;
            padding: 0;
            line-height: 0px;
            border-radius: 3px;
        }
    }
</style>
