import Vue from 'vue'
import App from './App'

import { formatDate,imgPreview,getBeforeDay } from './utils/common.js'

// 定义弹窗组件
import commonRaceOrderModal from './components/commonRaceOrderModal.vue'
import bar from './components/bar.vue'

// 定义高德api 应用key
Vue.prototype.$key = 'b17cc7f6e216f17cfb934552ee9a778c'
// appid screct
Vue.prototype.$appid = 'wx13cd107b8969b098'
Vue.prototype.$screct = 'e8744e3a64b97d86d04083a7f98e3100'

Vue.prototype.$formatDate = formatDate
Vue.prototype.$imgPreview = imgPreview
Vue.prototype.$getBeforeDay = getBeforeDay

// 定义接口baseURL
// Vue.prototype.$baseURL = 'http://192.168.1.61:19082'
// export const baseURL = 'http://192.168.1.61:19082'
Vue.prototype.$baseURL = 'https://zmjk.gydata.cn:19082'
export const baseURL = 'https://zmjk.gydata.cn:19082'

// export const baseURL = 'http://192.168.1.172:19082'
// Vue.prototype.$baseURL = 'http://192.168.1.172:19082'

Vue.component('common-race-order-modal',commonRaceOrderModal)
Vue.component('header-bar',bar)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
