import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'
// import Vue3TouchEvents from "vue3-touch-events";

import 'normalize.css'
import router from './router.js'
import store from './stores'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VuesticPlugin)
// app.use(Vue3TouchEvents);
app.use(router)
app.use(store)
app.mount('#app')
