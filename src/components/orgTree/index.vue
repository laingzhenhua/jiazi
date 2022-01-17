<template>
  <div >
    <el-tree
      v-if="reFresh"
      :data="treeData"
      :filter-node-method="filterNode"
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="defaultCheckedKeysTree"
      :show-checkbox="oprationMode !='see'"
      :default-expand-all="oprationMode =='see'"
      :check-strictly="true"
      @node-click="clickNode"
      @check-change="treeCheckChange"
      node-key="orgCode"
      ref="orgTree"
      :props="defaultProps"
    ></el-tree>
  </div>
</template>

<script>
    import {orgOwnedTree} from "../../httpRequset/module/common";

    /**
     * 双击时设置子节点为不选中状态
     * @param 当前被点击的节点
     */
    function setCheckedFalse(node) {
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                node.childNodes[i].checked = false;
                if (node.childNodes[i].childNodes.length > 0) {
                    setCheckedFalse(node.childNodes[i]);
                }
            }
        }
    }
    export default {
        props: ["oprationMode", "curTreeData"],
        data() {
            return {
                reFresh: true,
                treeData: [], //树形结构数据
                defaultProps: {
                    children: "children",
                    label: "orgName"
                },
                expandedKeys: [], //默认展开的节点
                defaultCheckedKeysTree: [], //默认选中的节点
                clickCounts: "" //点击树形节点的次数
            };
        },
        computed: {},
        created() {
            // console.log("2created当前树数据==》", this.curTreeData);
            // console.log("2当前操作为==》", this.oprationMode);
            if (this.oprationMode == "add") {
                this.getOrgTreeData(this.oprationMode);
            } else if (this.oprationMode == "edit" || this.oprationMode == "see") {
                this.treeData = this.curTreeData;
            }
        },
        mounted() {
            if (this.oprationMode == "edit") {
                this.$nextTick(function() {
                    this.defaultCheckedKeys = this.getTreeCheckIsTrueId(this.treeData);
                    this.expandedKeys = this.defaultCheckedKeys;
                    this.$refs.orgTree.setCheckedKeys(this.defaultCheckedKeys);
                });
            } else if (this.oprationMode == "see") {
                this.expandedKeys = [this.treeData[0].orgCode];
            }
        },
        methods: {
            //节点过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.orgName.indexOf(value) !== -1;
            },
            //获取子节点
            getChildKeys(treeNode) {
                var keys = [];
                if (treeNode.leaf === false) {
                    var children = treeNode.children;
                    for (var i = 0; i < children.length; i++) {
                        var obj = children[i];
                        keys.push(obj.orgCode);
                        if (obj.leaf === false) {
                            let childKeys = this.getChildKeys(obj);
                            keys = keys.concat(childKeys);
                        }
                    }
                }
                return keys;
            },
            //获取树形结构被勾选的id
            getTreeCheckIsTrueId(data) {
                let ids = [];
                for (let i in data) {
                    if (data[i].checked) {
                        ids.push(data[i].orgCode);
                    }
                    let a = this.getTreeCheckIsTrueId(data[i].children);
                    ids.push.apply(ids, a);
                }
                return ids;
            },
            //复选框被选中
            treeCheckChange(node, check, childCheck) {
                if (check === true && node.leaf === false) {
                    let keys = [node.orgCode];
                    let checkKeys = this.$refs.orgTree.getCheckedKeys();
                    if (checkKeys != null && checkKeys.length > 0) {
                        keys = keys.concat(checkKeys);
                    }
                    let childKeys = this.getChildKeys(node);
                    if (childKeys != null && childKeys.length > 0) {
                        keys = keys.concat(childKeys);
                    }
                    this.$refs.orgTree.setCheckedKeys(keys);
                }
            },
            //点击节点
            clickNode(curNodeData, curNodeObj, component) {
                this.clickCounts++;
                let self = this;
                setTimeout(function() {
                    if (self.clickCounts === 2) {
                        // curNodeObj.checked = false;//设置被点击的当前节点不选中
                        setCheckedFalse(curNodeObj); //递归设置子节点不选中
                    }
                    self.clickCounts = 0;
                }, 300);
            },

            //获取机构树数据
            getOrgTreeData(operationMode) {
                this.$http.common.orgOwnedTree().then(res => {
                    if (res.code === 0) {
                        this.treeData = res.data;
                        if (operationMode == "add") {
                            //添加任务操作时机构树默认全选
                            this.defaultCheckedKeysTree = this.defaultAllChecked(this.treeData);
                        }
                        this.expandedKeys = [res.data[0].orgCode];
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },

            //添加计划时 机构树默认全选
            defaultAllChecked(data) {
                let ids = [];
                for (let i in data) {
                    ids.push(data[i].orgCode);
                    let a = this.defaultAllChecked(data[i].children);
                    ids.push.apply(ids, a);
                }
                return ids;
            }
        },

        watch: {
            curTreeData(val) {
                // console.log(this.oprationMode, val);
                if (this.oprationMode == "edit") {
                    this.treeData = val;
                    this.defaultCheckedKeys = this.getTreeCheckIsTrueId(this.treeData); //要选中的节点
                    this.expandedKeys = this.defaultCheckedKeys; //要展开的节点
                    this.$refs.orgTree.setCheckedKeys(this.defaultCheckedKeys); //设置复选框选中
                    this.$nextTick(() => {
                        this.$refs.orgTree.setCheckedKeys(this.defaultCheckedKeys); //设置复选框选中
                    });
                } else if (this.oprationMode == "see") {
                    this.treeData = val;
                    if (this.treeData.length > 0) {
                        this.expandedKeys = [this.treeData[0].orgCode];
                    }
                }
            },
            oprationMode(val) {
                // console.log("当前操作为==》", val);
                if (val == "add") {
                    this.getOrgTreeData(this.oprationMode);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
