import { pages } from '../../api/'

// initial state
const state = {
    pages: [],
    index: 0,
    total: 0,
}

// getters
const getters = {
  pages: state => {
      return state.pages;
  },
  page: state => {
      return state.pages[state.index];
  },
  index: state => {
      return state.index;
  },
  total: state => {
      return state.pages.length;
  }
}

// mutations
const mutations = {
    setPages(state, pages, index = 0) {
      state.pages = pages;
      state.index = index;
    },
    resetPages(state) {
      state.pages = [];
    },
    increaseIndex(state) {
      state.index = state.index < state.pages.length ? state.index + 1: state.index;
    },
    decreaseIndex(state) {
      state.index = state.index > 0 ? state.index - 1: 0;
    },
    resetIndex(state) {
      state.index = 0;
    },
    reset(state) {
      this.commit('pages/resetPages');
      this.commit('pages/resetIndex');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
