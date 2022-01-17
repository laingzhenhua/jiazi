import Vue from 'vue'
// import SvgIcon from 'component/SvgIcon'// svg组件
import EmhiSvgIcon from '/src/components/EmhiSvgIcon/index.vue'// svg组件
// register globally
Vue.component('emhi-svg-icon', EmhiSvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
