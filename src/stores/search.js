import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    q: '',
    page: 1
  })
})
