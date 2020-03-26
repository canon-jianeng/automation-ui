import Vue from 'vue'
import App from './App'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import "babel-polyfill"
import AMap from 'vue-amap';

Vue.config.productionTip = false;

Vue.use(ELEMENT);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(AMap);

// 初始化高德地图的 key 和插件
AMap.initAMapApiLoader({
  key: 'YOUR_KEY',
  plugin: [
    'Autocomplete',
    'PlaceSearch',
    'Scale',
    'OverView',
    'ToolBar',
    'MapType',
    'PolyEditor',
    'AMap.CircleEditor'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

// NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // NProgress.start();
  if (to.path === '/login') {
    sessionStorage.removeItem('token');
  }
  let token = sessionStorage.getItem('token');
  if (token === 'undefined'){
      token = ''
  }

  if (!token && to.path === '/register') {
      next()
  }
  else if (!token && to.path !== '/login') {
    console.log(to.path);
    next({ path: '/login', query: {url: to.path}})
  }
  else {
    next()
  }
  if (to.path === '/') {
    next({ path: '/projectList',})
  }
});


let Highlight = {};
Highlight.install = function (Vue, options) {
    // 先有数据再绑定，调用highlightA
    Vue.directive('highlightA', {
        inserted: function(el) {
            let blocks = el.querySelectorAll('pre code');
            for (let i = 0; i < blocks.length; i++) {
              console.log(blocks)
                console.log(blocks[i])
                const item = blocks[i];
                console.log(item)
                hljs.highlightBlock(item);
            };
        }
    });
    // 先绑定，后面会有数据更新，调用highlightB
    Vue.directive('highlightB', {
        componentUpdated: function(el) {
            let blocks = el.querySelectorAll('pre code');
            for (let i = 0; i < blocks.length; i++) {
                const item = blocks[i];
                hljs.highlightBlock(item);
            };
        }
    });
};

Vue.use(Highlight);

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app');

