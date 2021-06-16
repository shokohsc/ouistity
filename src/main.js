//main.js
import 'normalize.css'
// import { VuesticPlugin } from 'vuestic-ui'
// import 'vuestic-ui/dist/vuestic-ui.css'
// import Vue3TouchEvents from "vue3-touch-events";

import { createApp } from 'vue'
import App from './App.vue'

// import mitt from 'mitt'
// import { VueMasonryPlugin } from "vue-masonry/src/masonry-vue3.plugin";

import router from './router.js'
import store from './stores'

// const emitter = mitt()
const app = createApp(App)
// app.config.globalProperties.emitter = emitter
// app.use(VueMasonryPlugin)
app.use(router)
app.use(store)
// app.use(Vue3TouchEvents);
// app.use(VuesticPlugin)
app.mount('#app')
