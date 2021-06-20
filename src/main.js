// import { VueMasonryPlugin } from "vue-masonry/src/masonry-vue3.plugin";
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'
// import Vue3TouchEvents from "vue3-touch-events";

import 'normalize.css'
// import mitt from 'mitt'
import router from './router.js'
import store from './stores'

import { createApp } from 'vue'
import App from './App.vue'

// const emitter = mitt()
const app = createApp(App)
// app.config.globalProperties.emitter = emitter
// app.use(VueMasonryPlugin)
app.use(VuesticPlugin)
// app.use(Vue3TouchEvents);
app.use(router)
app.use(store)
app.mount('#app')
