import { createStore, createLogger } from 'vuex'
import pages from './modules/pages'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    pages
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
