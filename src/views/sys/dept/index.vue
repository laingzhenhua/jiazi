<template>
    <div class="dept-main" v-loading="loading" style="height: 100%">
        <menu class="mhi-search clearFix">
            <el-form class="l" inline>
                <el-form-item label="机构名称">
                    <el-autocomplete
                        size="small"
                        :clearable="true"
                        :fetch-suggestions="querySearchAsync"
                        :trigger-on-focus="false"
                        :select-when-unmatched="true"
                        @select="handleSelect"
                        placeholder="请输入机构名称"
                        @keyup.enter="query"
                        v-model="name"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="机构编码">
                    <el-input
                        size="small"
                        :maxlength="50"
                        :clearable="true"
                        @keyup.enter="query"
                        type="text"
                        placeholder="请输入机构编码"
                        v-model="orgCode"
                    ></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-button @click="query" size="small" type="primary" icon="el-icon-search">
                        查询
                    </el-button>
                </el-form-item>
                <el-form-item label>
                    <el-button @click="empty" size="small" icon="el-icon-refresh-right">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="r">
                <el-button
                    @click="add"
                    size="small"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                >
                    添加
                </el-button>
            </div>
        </menu>
        <main class="dept-main-content" style="display: flex">
            <el-scrollbar
                class="tree-box mr-20"
                ref="curTreeBox"
                style="
                    width: 240px;
                    box-sizing: border-box;
                "
                :style="treeBoxStyle"
            >
                <el-tree
                    highlight-current
                    node-key="orgCode"
                    :data="orgTree"
                    :props="defaultProps"
                    :current-node-key="currentOrg"
                    :default-expanded-keys="expandedOrg"
                    @node-click="clickTreeNode"
                >
                    <span slot-scope="{node}">
                        <span :title="node.label">{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
            <section class="table-box" :style="tableBoxStyle" >
                <page-table
                    :tableData="tableData"
                    :total="paginationConfig.total"
                    @callbackPageSize="handleSizeChange"
                    @callbackPageNo="handleCurrentChange"
                    highlightCurrentRow
                >
                    <el-table-column
                        show-overflow-tooltip
                        label="机构编码"
                        prop="orgCode"
                    ></el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="机构名称"
                        prop="orgName"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip label="举办医院" prop="hostingHospital">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.hostingHospital ? scope.row.hostingHospital : "—" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="所属街道" prop="street">
                        <template slot-scope="scope">
                            <span>{{ scope.row.street ? scope.row.street : "—" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="所属区域社康"
                        prop="areaSocialHealth"
                    >
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.areaSocialHealth ? scope.row.areaSocialHealth : "—" }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="state" align="center">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.state"
                                :active-value="1"
                                :inactive-value="2"
                                @change="stateChange(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="编辑" fixed="right" width="100" align="center">
                        <template slot-scope="scope">
                            <div class="mhi-table-i">
                                <span @click="editClick(scope.row)" title="编辑">
                                    编辑
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </page-table>
            </section>
        </main>
        <!-- 弹窗组件 -->
        <addOr-editOrg
            ref="orgDialog"
            :operate="operate"
            :parentOrgCode="orgCode"
            v-on:listenOperateState="handleLiseten"
        ></addOr-editOrg>
    </div>
</template>

<script>
    import addOrEditOrg from "./addOrEditOrg.vue";
    import pageTable from "/src/components/paginationTable/paginationTable";
    export default {
        components: {pageTable, addOrEditOrg},
        data() {
            return {
                loading: false,
                name: "",
                orgCode: "",
                // orgTree配置
                orgTree: [],
                defaultProps: {
                    children: "children",
                    label: "orgName",
                },
                currentOrg: "",
                expandedOrg: [],
                // 分页器配置
                paginationConfig: {
                    total: 0, //总页数
                    pageSize: 50, //每页容量
                    currentPage: 1, //当前页
                },
                tableData: [], //表格数据
                // 操作方式 add/edit
                operate: "",
                treeBoxStyle: {},
                tableBoxStyle: {},
            };
        },
        created() {
            this.loading = true;
            // this.treeBoxStyle.height = this.tableHeight + "px";
            this.getOrgTree();
        },
        mounted() {
            this.$nextTick(() => {
                let mhiZoneDom = document.querySelector(".dept-main");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 260 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            });
            window.addEventListener("resize", this.resizeLogic1, false);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resizeLogic1); //解绑resize事件
        },
        methods: {
            resizeLogic1() {
                let mhiZoneDom = document.querySelector(".dept-main");
                let mhiZoneDomW = mhiZoneDom.offsetWidth;
                this.tableBoxStyle = {
                    width: mhiZoneDomW - 300 + "px",
                };
                let {top} = this.$refs.curTreeBox.wrap.getBoundingClientRect();
                let paddingBottom = window.innerWidth >= 1600 ? 16 : 8;
                let tableHeight = document.body.clientHeight - top - 48 - paddingBottom;
                this.treeBoxStyle.height = tableHeight + "px";
            },
            //获取整个机构树的数据
            getOrgTree() {
                this.$http.sysDept.orgTree({by: 2}).then(res => {
                    this.loading = false;
                    if (res.code === 0) {
                        this.orgTree = res.data;
                        this.expandedOrg = [res.data[0].orgCode];
                    } else {
                        // this.$mes("error", res.msg);
                    }
                });
            },
            // 处理树节点被点击
            clickTreeNode(data) {
                this.orgCode = data.orgCode;
                let params = {
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: 50,
                    parentOrgCode: this.orgCode,
                };
                //分页获取该节点下面详细列表
                this.getList(params);
            },
            handleSizeChange(size) {
                this.pageSize = size;
                let params = {
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: size,
                    parentOrgCode: this.orgCode,
                };
                this.getList(params);
            },
            //分页器页码改变函数
            handleCurrentChange(currentPage) {
                let params = {
                    pageNo: currentPage,
                    pageSize: 50,
                    parentOrgCode: this.orgCode,
                };
                this.getList(params);
            },
            //获取详细列表（表格数据）
            getList(params) {
                this.loading = true;
                this.$http.sysDept.orgList(params).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        // this.$message.error(res.msg);
                    }
                });
            },
            querySearchAsync(queryString, callback) {
                let result = [];
                let params = {name: queryString};
                this.$http.sysDept.orgSearch(params).then(res => {
                    if (res.code === 0) {
                        result = res.data;
                        if (res.data.length > 0) {
                            let obj = {};
                            obj.value = res.data.value;
                            result.push(obj);
                        } else {
                            result.push({
                                uuid: "-1",
                                value: "无匹配结果",
                            });
                        }
                    } else {
                        // this.$message.error(res.msg);
                    }
                });
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    callback(result);
                }, 2000 * Math.random());
            },
            handleSelect(item) {
                item.uuid != -1 ? (this.name = item.value) : (this.name = "");
            },
            // 点击查询按钮
            query() {
                this.pageNo = 1;
                this.currentPage = 1;
                this.parentOrgCode = "";
                // this.dataList();
                this.OrgSearch();
            },
            //查询接口
            OrgSearch() {
                let params = {
                    orgCode: this.orgCode,
                    orgName: this.name,
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: 50,
                    parentOrgCode: "",
                };
                //分页获取该节点下面详细列表
                this.$http.sysDept.orgList(params).then(res => {
                    console.log(res);
                    if (res.code === 0) {
                        this.tableData = res.data.content;
                        this.paginationConfig.total = res.data.totalCount;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        // this.$message.error(res.msg);
                    }
                });
            },
            // 点击重置按钮
            empty() {
                this.name = "";
                this.orgCode = "";
                this.query();
            },
            // 定义未调用（旧函数）
            dataList() {
                let params = {
                    pageIndex: this.pageNo,
                    itemCountPerPage: this.pageSize,
                    args: JSON.parse(this.$localstorage.getStore("userInfo")).id,
                };
                this.$http.post(this.$api.messageListSelfDetail, params).then(res => {
                    let data = res.data;
                    if (res.data.code === 0) {
                        this.messageList = data.data.list;
                        this.total = data.data.total;
                        this.imgPre = data.imgPre;
                        this.fileUrl = data.message;
                    } else {
                        // this.$message.error(data.message);
                    }
                });
            },
            // 点击添加按钮
            add() {
                if (!this.orgCode) {
                    return this.$message.warning("请先在左侧机构树点击选择上层机构！");
                }
                this.operate = "addOrg";
                this.$refs.orgDialog.ruleForm = {
                    orgType: "",
                    orgName: "",
                    orgCode: "",
                    hostingHospital: "",
                    areaSocialHealth: "",
                    street: "",
                    // holdType: "",
                    longitude: undefined,
                    latitude: undefined,
                };
                this.$refs.orgDialog.dialogFormVisible = true;
            },
            // 点击表格内的编辑按钮
            editClick(row) {
                this.operate = "editOrg";
                let longitude = row.longitude ? row.longitude.toFixed(6) : undefined;
                let latitude = row.latitude ? row.latitude.toFixed(6) : undefined;
                this.$refs.orgDialog.ruleForm = {
                    orgType: row.orgType.toString(),
                    orgCode: row.orgCode,
                    orgName: row.orgName,
                    hostingHospital: row.hostingHospitalCode,
                    areaSocialHealth: row.areaSocialHealthCode,
                    street: row.streetCode,
                    holdType: row.holdType,
                    longitude,
                    latitude,
                };
                this.$refs.orgDialog.dialogFormVisible = true;
            },
            // 更改机构启用禁用状态
            stateChange(row) {
                let _state = row.state;
                row.state = _state == 1 ? 2 : 1;
                this.$confirm(`是否修改当前机构状态`, `${_state == 1 ? "启用" : "禁用"}`, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let param = {
                        orgCode: row.orgCode,
                        state: _state,
                    };
                    this.$http.sysDept
                        .orgEnable(param)
                        .then(res => {
                            if (res.code == 0) {
                                row.state = _state;
                                this.$message.success("修改成功");
                            } else {
                                // this.$message.error(res.msg);
                            }
                        })
                        .catch(res => {});
                });
            },
            //点击表格内的删除按钮
            deleteClick(row) {
                let params = {code: row.orgCode};
                return;
                this.$msgbox({
                    title: "消息提示",
                    message: "确定删除该机构？",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = "删除中...";
                            this.$http.sysDept.orgDel(new URLSearchParams(params)).then(res => {
                                if (res.code === 0) {
                                    //this.dataList();
                                    instance.confirmButtonLoading = false;
                                    this.$message.success("删除成功");
                                    this.getOrgTree();
                                    done();
                                } else {
                                    done();
                                    instance.confirmButtonLoading = false;
                                    this.$message.error(res.msg);
                                }
                            });
                        } else {
                            done();
                        }
                    },
                }).catch(() => {});
            },
            // 监听弹窗保存后刷新机构树
            handleLiseten() {
                this.getOrgTree(); //更新树
                this.currentOrg = this.orgCode;
                this.expandedOrg = [this.orgCode];
                let params = {
                    pageNo: this.paginationConfig.currentPage,
                    pageSize: 50,
                    parentOrgCode: this.orgCode,
                };
                this.getList(params); //更新表格
            },
        },
    };
</script>

<style scoped lang="less">
    .dept-main {
        .mhi-search {
            display: flex;
            margin: 0;
            .r {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                button {
                    height: 33px;
                    margin-top: 5px;
                    margin-right: 20px;
                }
            }
        }
        .mhi-table-i {
            span {
                font-size: 14px;
                letter-spacing: 0;
            }
        }
        .dept-main-content {
            width: 100%;
            height: 100%;
            position: relative;
            .tree-box {
                border: 1px solid #d8dee2ff;
                margin-top: 16px;
            }
            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            .table-box{
                flex: 1;
                justify-content: flex-end;
                width: 100px !important;
                padding-left: 20px;
            }
        }
    }
    @media (max-width: 1600px) {
        .dept-main .dept-main-content .tree-box {
            margin-top: 8px;
        }
    }
</style>
