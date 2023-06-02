<template>
  <section class="section">
    <progress v-if="loading" class="progress is-large" max="100">10%</progress>
    <h1 class="title has-text-light has-text-centered">{{ formattedQuery }}</h1>
    <Files :files="entries" v-bind="$attrs" />
    <div class="has-text-centered" v-if="more" >
      <button @click="fetchData(this.store.q, this.lastFetchedPage + 1, this.pageSize, true)" class="button is-dark">More...</button>
    </div>
  </section>
</template>

<script>
  import Files from './Files.vue';
  import graphql from '../api';
  import { useSearchStore } from '../stores/search'

  export default {
    components: {
      Files
    },
    data() {
      return {
        loading: true,
        store: useSearchStore(),
        pageSize: 10,
        files: [],
        totalPages: 1,
        lastFetchedPage: 1,
        abortController: new AbortController()
      }
    },
    computed: {
      q: function() {
        return this.store.q
      },
      page: function() {
        return parseInt(this.store.page)
      },
      entries: function() {
        return this.files[this.filesKey] ? this.files[this.filesKey] : [];
      },
      filesKey: function() {
        return '#' + this.store.q;
      },
      formattedQuery: function() {
        if (this.loading)
          return 'Loading results'
        return '' !== this.store.q ? `Results for '${this.store.q}'`: ''
      },
      more: function() {
        return this.lastFetchedPage < this.totalPages;
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('scroll', this.handleScroll);
      this.store.$patch({ q: this.$route.query.hasOwnProperty('q') ? this.$route.query.q : '' })
      this.store.$patch({ page: this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1 })
      this.$watch(
        () => this.$route.query.q,
        async () => {
          // console.log(window.localStorage);
          this.store.$patch({ q: this.$route.query.hasOwnProperty('q') ? this.$route.query.q : '' })
          this.store.$patch({ page: this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1 })
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files[this.filesKey] = []
          await this.fetchData(this.store.q, this.page, this.pageSize)
          document.title = this.title(`Comics - ${this.formattedQuery}`)
        },
        { immediate: true }
      )
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      title(name = '') {
        return name.toLowerCase().replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, ($charOne) => {
          return $charOne.toUpperCase()
        })
      },
      async fetchData(q = '', page = 1, pageSize = 10, abort = false) {
        if (abort && this.abortController)
          this.abortController.abort()
        this.loading = true
        this.abortController = new AbortController()

        try {
          const response = await graphql.search(q, page, pageSize, this.abortController)
          const result = response.data.data.search;
          result.rows.forEach(row => {
            row.route = row.type === 'folder' ? { name: 'Browser', query: { directory: row.name } } : { name: 'Reader', params: { urn: row.urn } };
            row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name.match(/([^\/]*)\/*$/)[0];
            row.info = row.type === 'file' ? row.info : undefined;
            this.files['#' + q].push(row);
          });
          this.totalPages = result.totalPages;
          this.lastFetchedPage = page;
          this.loading = false
        } catch (e) {
          console.log(e);
          this.loading = false
        }
      },
      async handleScroll(e) {
        e.stopPropagation();
        if ((window.scrollY >= (document.body.offsetHeight - window.outerHeight)) && (!this.loading) && (this.lastFetchedPage < this.totalPages)) {
          await this.fetchData(this.store.q, this.lastFetchedPage + 1, this.pageSize)
        }
      }
    },
  }
</script>

<style>
progress.progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  border-radius: 0px;
}
progress.progress:indeterminate {
  background-color: #23232e;
  background-image: linear-gradient(to right, #0a0a0a 30%, #23232e 30%);
}
</style>
