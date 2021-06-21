<template>
  <div class="row justify--center">
    <div class="flex xs12 md3" v-for="(file, index) in entries" :key="index">
      <va-card :to="file.route" color="#000000" style="padding-top:20px;">
        <va-image :src="file.cover" style="height:324px; width: 216px; margin: 0 auto;"/>
        <va-card-title class="justify--center">{{ file.name }}</va-card-title>
        <!-- <va-card-content>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</va-card-content> -->
      </va-card>
    </div>
  </div>
</template>

<script>
  import { archives } from '../api';

  export default {
    computed: {
      empty: function() {
        return 0 === this.files.length;
      },
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
          cover: this.thumbor + this.defaultCover
        }
      },
      defaultCover: function() {
        return window.location.protocol + "//i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_incredible.jpg";
      },
      thumbor: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/216x324/smart/filters:quality(80)/';
      },
      api: function() {
        return window.location.protocol + '//api.' + window.location.hostname;
      }
    },
    data() {
      return {
        loading: true,
        useThumbor: true,
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
      this.$watch(
        () => this.$route.query.directory,
        () => {
          this.directory = this.$route.query.hasOwnProperty('directory') ? this.$route.query.directory : ''
          this.page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files = []
          this.fetchData(this.directory, this.page, this.pageSize)
          if (this.directory !== '') {
            this.files.push(this.parentDirectory);
          }
        },
        { immediate: true }
      )
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      async fetchData(directory = '', page = 1, pageSize = 10) {
        this.loading = true

        await archives.browse(directory, page, pageSize)
          .then((response) => {
              const browse = response.data.data.browse;
              browse.rows.forEach(row => {
                row.route = row.type === 'folder' ? { path: '/', query: { directory: directory + row.name } } : { name: 'Reader', params: { urn: row.urn } };
                row.cover = row.cover ? (this.useThumbor ? this.thumbor + 'http://api:5000' : this.api) + row.cover : this.thumbor + this.defaultCover;
                row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name;
                this.files.push(row);
              });
              this.totalPages = browse.totalPages;
              this.lastFetchedPage = page;
              this.loading = false
          })
          .catch((error) => {
              console.log(error);
              this.loading = false
          });
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
