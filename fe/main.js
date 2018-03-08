import Vue from 'vue'
import App from './components/App.vue'
import About from './components/About.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: App },
  { path: '/about', component: About }
];

const router = new VueRouter({
  routes: routes,
  // https://router.vuejs.org/en/essentials/history-mode.html
  mode: 'history' // If you want use hash in the url, remove this line.
});

new Vue({
  router
}).$mount('#app');
