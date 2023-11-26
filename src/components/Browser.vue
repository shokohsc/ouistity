<template>
  <section class="section">
    <progress v-if="loading" class="progress is-large" max="100">10%</progress>
    <h1 class="title has-text-light has-text-centered">{{ formattedDirectory }}</h1>
    <Files :files="entries" v-bind="$attrs" />
    <div class="has-text-centered" v-if="more" >
      <button @click="fetchData(this.directory, this.lastFetchedPage + 1, this.pageSize, true)" class="button is-dark">{{ formattedLoadingButton }}...</button>
    </div>
  </section>
</template>

<script>
  import Files from './Files.vue';
  import graphql from '../api';

  export default {
    components: {
      Files
    },
    computed: {
      entries: function() {
        return this.files[this.filesKey] ? this.files[this.filesKey] : [];
      },
      filesKey: function() {
        return '#' + this.directory;
      },
      formattedDirectory: function() {
        if (this.loading)
          return 'Loading files'
        return '' !== this.directory ? '/' + this.directory: '/'
      },
      formattedLoadingButton: function() {
        if (this.loading)
          return 'Loading'
        return 'More'
      },
      parentDirectory: function() {
        return {
          name: '..',
          type: 'folder',
          route: {
            path: '/',
            query: this.directory.replace(/([^\/]*)\/*$/, '').length > 0 ? {
              directory: this.directory.replace(/([^\/]*)\/*$/, '')
            } : {}
          },
          cover: null
        }
      },
      more: function() {
        return this.lastFetchedPage < this.totalPages;
      }
    },
    data() {
      return {
        loading: true,
        directory: '',
        page: 1,
        pageSize: 10,
        files: [],
        totalPages: 1,
        lastFetchedPage: 1,
        abortController: new AbortController()
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('scroll', this.handleScroll);
      this.$watch(
        () => this.$route.query.directory,
        async () => {
          this.directory = this.$route.query.hasOwnProperty('directory') ? this.$route.query.directory : ''
          this.page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files[this.filesKey] = []
          if (this.directory !== '' && this.directory !== '/') {
            this.files[this.filesKey].push(this.parentDirectory);
          }
          await this.fetchData(this.directory, this.page, this.pageSize)
          document.title = `Comics - ${this.formattedDirectory}`
        },
        { immediate: true }
      )
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      async fetchData(directory = '', page = 1, pageSize = 10, abort = false) {
        if (abort && this.abortController)
          this.abortController.abort()
        this.loading = true
        this.abortController = new AbortController()

        try {
          const response = await graphql.browse(directory, page, pageSize, this.abortController)
          const result = response.data.data.browse;
          result.rows.forEach(row => {
            row.route = row.type === 'folder' ? { name: 'Browser', query: { directory: directory + row.name } } : { name: 'Reader', params: { urn: row.urn } };
            row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name.match(/([^\/]*)\/*$/)[0];
            row.info = row.type === 'file' ? row.info : undefined;
            this.files['#' + directory].push(row);
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
          await this.fetchData(this.directory, this.lastFetchedPage + 1, this.pageSize)
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
