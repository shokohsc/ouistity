import "../node_modules/bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Vue3TouchEvents from "vue3-touch-events";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import getEnv from './utils/env';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'

const pinia = createPinia()
const app = createApp(App)

if (getEnv('USE_SENTRY') === 'true') {
  Sentry.init({
    app,
    dsn: getEnv('SENTRY_DSN'),
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: [window.location.host, /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    sampleRate: 1.0,
    attachStacktrace: true,
    maxBreadcrumbs: 50,
    autoSessionTracking: true,
  });
}

app.use(Vue3TouchEvents);
app.use(router)
app.use(pinia)
app.mount('#app')
