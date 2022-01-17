/**
 * 对于子节点长度大于0的节点：自身添加hasChildren属性，子节点每一项添加parentId属性
 * @param {*} data 
 */
const addHasChildren = (data = []) => {
    return new Promise((resolve, reject) => {
      data.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.hasChildren = true;
          item.children.forEach(child => {
            child.parentId = item.id
          })
          addHasChildren(item.children);
        }
      });
      resolve(data)
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
  /**
   * tree数据扁平化
   * @param {*} data 
   */
  const flatTree = (data = [], treeMap = []) => {
    return new Promise((resolve, reject) => {
      if (!(data && data.length)) return;
      let res = data.reduce((acc, cur) => {
        acc.push(cur);
        if (cur.children && cur.children.length) {
          flatTree(cur.children, treeMap);
        }
        return acc;
      }, treeMap);
      resolve(res)
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
  
  /**
   * 删掉children属性
   * @param {*} data 
   */
  const delChildren = (data = []) => {
    return new Promise((resolve, reject) => {
      data.forEach(item => {
        if (item.children) {
          delete item.children;
        }
      });
      resolve(data)
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
  export default {
    addHasChildren,
    flatTree,
    delChildren
  }
  