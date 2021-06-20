<template>
  <div class="layout gutter--xl">
    <div class="row justify--center">
      <div class="flex xs12 md3" v-for="(file, index) in entries" :key="index">
        <va-card :to="file.route" color="#000000" style="padding-top:20px;">
          <va-image :src="file.cover" style="height:324px; width: 216px; margin: 0 auto;"/>
          <va-card-title class="justify--center">{{ file.name }}</va-card-title>
          <!-- <va-card-content>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</va-card-content> -->
        </va-card>
      </div>
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
        }
    },
    data() {
      return {
        loading: false,
        directory: "",
        page: 1,
        pageSize: 10,
        files: [],
        totalPages: 1,
      }
    },
    created() {
      // watch the params of the route to fetch the data again
      this.$watch(
        () => this.$route.query.directory,
        () => {
          this.directory = this.$route.query.hasOwnProperty('directory') ? this.$route.query.directory : ''
          this.page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1
          this.pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10
          this.files = []
          this.fetchData(this.directory, this.page, this.pageSize)
        },
        // fetch the data when the view is created and the data is
        // already being observed
        { immediate: true }
      )
    },
    methods: {
      async fetchData(directory = '', page = 1, pageSize = 10) {
        this.loading = true

        await archives.browse(this.directory, this.page, this.pageSize)
          .then((response) => {
              this.loading = false
              const thumbor = window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/216x324/smart/';
              // const api = window.location.protocol + '//api.' + window.location.hostname;

              const browse = response.data.data.browse;
              console.log(browse);
              browse.rows.forEach(row => {
                row.route = row.type === 'folder' ? { path: '/', query: { directory: directory + row.name } } : { name: 'Reader', params: { urn: row.urn } };
                row.cover = row.cover ? thumbor + 'http://api:5000' + row.cover : thumbor + window.location.protocol + "//i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_incredible.jpg";
                row.name  = row.type === 'file' ? row.name.replace(/(\(.+\))/gm, '').replace(/\.(cbr|cbz)$/, '') : row.name;
                this.files.push(row);
              });
              this.totalPages = browse.totalPages;
          })
          .catch((error) => {
              console.log(error);
              this.files = [];
              this.loading = false
          });
      },
    },
  }
</script>

<style>
</style>
