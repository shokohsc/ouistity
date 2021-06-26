import "../node_modules/bulma/css/bulma.css";
import "@fontsource/source-sans-pro";
import "@fortawesome/fontawesome-free/css/all.css";
// import Vue3TouchEvents from "vue3-touch-events";

import router from './router.js'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
// app.use(Vue3TouchEvents);
app.use(router)
app.mount('#app')
