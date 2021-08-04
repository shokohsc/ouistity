import { createRouter, createWebHashHistory } from 'vue-router'

import Browser from './components/Browser.vue';
import Search from './components/Search.vue';
import Reader from './components/Reader.vue';

const routes = [
  {
    name: 'Browser',
    path: '/',
    component: Browser,
    props: (route) => ({ query: route.query })
  },
  {
    name: 'Search',
    path: '/search',
    component: Search,
    props: (route) => ({ query: route.query })
  },
  {
    name: 'Reader',
    path: '/read/:urn',
    component: Reader
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
