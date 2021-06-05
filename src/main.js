//main.js
import 'normalize.css'
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router.js'
import store from './stores'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(VuesticPlugin)
app.mount('#app')
