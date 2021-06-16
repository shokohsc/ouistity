import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './components/Home.vue';
import Reader from './components/Reader.vue';
// import Search from './components/Search.vue';

const routes = [
  { name: 'Home', path: '/', component: Home, props: (route) => ({ query: route.query }) },
  { name: 'Reader', path: '/read/:urn', component: Reader },
  // { name: 'Search', path: '/search/:query', component: Search },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
