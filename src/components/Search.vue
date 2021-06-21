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
  import { query } from '../api';

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
        q: '',
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
        () => this.$route.query.q,
        () => {
          this.q = this.$route.query.hasOwnProperty('q') ? this.$route.query.q : ''
          this.page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files = []
          this.fetchData(this.q, this.page, this.pageSize)
        },
        { immediate: true }
      )
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      async fetchData(q = '', page = 1, pageSize = 10) {
        this.loading = true

        await query.search(q, page, pageSize)
          .then((response) => {
              const search = response.data.data.search;
              search.rows.forEach(row => {
                row.route = row.type === 'folder' ? { path: '/', query: { directory: row.name } } : { name: 'Reader', params: { urn: row.urn } };
                row.cover = row.cover ? (this.useThumbor ? this.thumbor + 'http://api:5000' : this.api) + row.cover : this.thumbor + this.defaultCover;
                row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name.match(/([^\/]*)\/*$/)[0];
                this.files.push(row);
              });
              this.totalPages = search.totalPages;
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
          await this.fetchData(this.q, this.lastFetchedPage + 1, this.pageSize)
        }
      }
    },
  }
</script>
