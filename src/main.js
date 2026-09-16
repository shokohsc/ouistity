import "../node_modules/bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Vue3TouchEvents from "vue3-touch-events";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'

const pinia = createPinia()
const app = createApp(App)

app.use(Vue3TouchEvents);
app.use(router)
app.use(pinia)
app.mount('#app')
