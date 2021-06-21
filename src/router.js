import { createRouter, createWebHashHistory } from 'vue-router'

import Browser from './components/Browser.vue';
import Reader from './components/Reader.vue';
// import Search from './components/Search.vue';

const routes = [
  {
    name: 'Browser',
    path: '/',
    component: Browser,
    props: (route) => ({ query: route.query })
  },
  {
    name: 'Reader',
    path: '/read/:urn',
    component: Reader
  },
  // {
  //   name: 'Search',
  //   path: '/search/:query',
  //   component: Search,
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
