/**
 * 运维管理专用
 */
export const devOps = {
  data() {
    return {
      tableHeight: 0,
      dynamicHeight: {}
    }
  },
  methods: {
    computeTabletHeight() {
      let zoneDom = document.querySelector('.mhi-zone-opt');
      let mhiTabsDom = document.querySelector('.mhi-zone-opt .mhi-tabs');
      let mhiZoneMenuDom = document.querySelector('.mhi-zone-opt menu.mhi-search')
      let elPaginationDom = document.querySelector('div.el-pagination');
      let zoneDomPadding = parseInt(this.$getStyle(zoneDom, 'padding-top'));
      let tableHeight = zoneDom.offsetHeight - zoneDomPadding * 2 - mhiTabsDom.offsetHeight - mhiZoneMenuDom.offsetHeight -2;;
      if (elPaginationDom) {
        let elPaginationDomMarginTop = parseInt(this.$getStyle(elPaginationDom, 'margin-top'));
        tableHeight = tableHeight - elPaginationDom.offsetHeight - elPaginationDomMarginTop;
      }
      this.dynamicHeight = { height: tableHeight + "px" }
      this.tableHeight = tableHeight;
    },
    resizeLogic() {
      this.computeTabletHeight();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.computeTabletHeight();
    })
    window.addEventListener("resize", this.resizeLogic, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeLogic); //解绑resize事件
  },
}
