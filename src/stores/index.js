import { createStore, createLogger } from 'vuex'
import books from './modules/books'
import pages from './modules/pages'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    books,
    pages
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
