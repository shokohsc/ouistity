import { defineStore, acceptHMRUpdate } from 'pinia'

const useSearchStore = defineStore('search', {
  state: () => ({
    q: '',
    page: 1
  })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}

export { useSearchStore }
