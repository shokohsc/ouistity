<template>
    <progress v-if="loading" class="progress" max="100">10%</progress>
    <div class="columns is-justify-content-center is-mobile" v-bind="$attrs">
      <div class="column is-narrow">
        <router-link to="/" >
          <button class="button is-large">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
          </button>
        </router-link>
      </div>
      <div class="column is-6">
        <input v-model="q" class="input is-large has-text-black has-background-grey" type="text" placeholder="Search..." />
      </div>
      <div class="column is-narrow">
        <button @click="clear" class="button is-large">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="columns is-justify-content-center is-multiline">
      <File :file="file" v-for="(file, index) in entries" :key="index" />
    </div>
</template>

<script>
  import File from './File.vue';
  import graphql from '../api';

  export default {
    components: {
      File
    },
    computed: {
      entries: function() {
        return this.files.sort(function (fileA, fileB) {
          if (fileA.name.toLowerCase() > fileB.name.toLowerCase()) {
            return 1;
          }
          if (fileA.name.toLowerCase() < fileB.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });
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
      }
    },
    data() {
      return {
        q: '',
        loading: true,
        directory: '',
        page: 1,
        pageSize: 10,
        files: [],
        totalPages: 1,
        lastFetchedPage: 1
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('keyup', this.keyUp);
      this.$watch(
        () => this.$route.query.directory,
        async () => {
          this.q = ''
          this.directory = this.$route.query.hasOwnProperty('directory') ? this.$route.query.directory : ''
          this.page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files = []
          await this.fetchData(this.q, this.directory, this.page, this.pageSize)
          if (this.directory !== '' && this.directory !== '/') {
            this.files.push(this.parentDirectory);
          }
        },
        { immediate: true }
      )
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('keyup', this.keyUp);
    },
    methods: {
      async fetchData(q = '', directory = '', page = 1, pageSize = 10) {
        this.loading = true

        const argument = q.length > 2 ? q : directory
        await graphql[`${q.length > 2 ? 'search' : 'browse'}`](argument, page, pageSize)
          .then((response) => {
              const result = response.data.data[`${q.length > 2 ? 'search' : 'browse'}`];
              result.rows.forEach(row => {
                row.route = row.type === 'folder' ? { path: '/', query: { directory: directory + row.name } } : { name: 'Reader', params: { urn: row.urn } };
                row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name.match(/([^\/]*)\/*$/)[0];
                this.files.push(row);
              });
              this.totalPages = result.totalPages;
              this.lastFetchedPage = page;
              this.loading = false
          })
          .catch((error) => {
              console.log(error);
              this.loading = false
          });
      },
      keyUp: function(e) {
        switch (e.keyCode) {
          case 13:
            this.validate();
            break;
        }
      },
      async clear(e) {
        if (this.q !== '') {
          this.files = []
          this.q = '';
          await this.fetchData(this.q, this.directory, this.page, this.pageSize)
        }
      },
      async validate() {
        if (this.q.length > 2) {
          this.files = []
          this.directory = ''
          await this.fetchData(this.q, this.directory, this.page, this.pageSize)
        }
      },
      async handleScroll(e) {
        e.stopPropagation();
        if ((window.scrollY >= (document.body.offsetHeight - window.outerHeight)) && (!this.loading) && (this.lastFetchedPage < this.totalPages)) {
          await this.fetchData(this.q, this.directory, this.lastFetchedPage + 1, this.pageSize)
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
