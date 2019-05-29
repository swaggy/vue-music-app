import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue-lazyload"
import 'lib-flexible' // 移动端适配
import FastClick from 'fastclick'
Vue.config.productionTip = false;
import './common/scss/index.scss'

FastClick.attach(document.body);
Vue.use(VueLazyLoad,{
  loading:require("./common/image/default.png")
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
