import { pages } from '../../api/'

// initial state
const state = {
    pages: [],
    total: 0,
}

// getters
const getters = {
    pages: state => {
        return state.pages;
    },
    total: state => {
        return state.pages.length;
    }
}

// actions
const actions = {
    get({}, urn) {
        return pages.get(urn)
    }
}

// mutations
const mutations = {
    setPages(state, pages) {
        state.pages = pages;
    },
    resetPages(state) {
        state.pages = [];
    },
    reset(state) {
        this.commit('pages/resetPages');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
