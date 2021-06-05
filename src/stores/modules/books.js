import { books } from '../../api/'

// initial state
const state = {
    books: [],
    total: 0,
}

// getters
const getters = {
    books: state => {
        return state.books;
    },
    total: state => {
        return state.books.length;
    }
}

// actions
const actions = {
    list({}, page, size) {
        return books.list(page, size)
    },
    get({}, urn) {
        return books.get(urn)
    }
}

// mutations
const mutations = {
    setBooks(state, books) {
        state.books = books;
    },
    resetBooks(state) {
        state.books = [];
    },
    addBooks(state, books) {
        state.books += books;
    },
    reset(state) {
        this.commit('books/resetBooks');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
