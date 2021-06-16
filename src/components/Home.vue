<template>
  <div :propFile="file" v-for="file in files" :key="file.name">
    <router-link :to="file.route">
      <img :src="file.cover" :alt="file.name" >
    </router-link>
    <router-link :to="file.route">
      {{ file.name }}
    </router-link>
  </div>
</template>

<script>
  import { archives } from '../api';

  export default {
    computed: {
        empty: function() {
          return (0 == this.files.length);
        },
        folder: function(file) {
          return file.type === 'folder';
        }
    },
    data() {
      return {
        loading: false,
        files: [],
      }
    },
    created() {
      // watch the params of the route to fetch the data again
      this.$watch(
        () => this.$route.params,
        () => {
          this.fetchData()
        },
        // fetch the data when the view is created and the data is
        // already being observed
        { immediate: true }
      )
    },
    methods: {
      fetchData() {
        this.loading = true
        this.files = [];

        const directory = this.$route.query.hasOwnProperty('directory') ? this.$route.query.directory : '';
        const page = this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1;
        const pageSize = this.$route.query.hasOwnProperty('pageSize') ? this.$route.query.pageSize : 10;
        const thumbor = window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/216x324/smart/';
        // const api = window.location.protocol + '//api.' + window.location.hostname;

        archives.browse(directory, page, pageSize)
          .then((response) => {
              this.loading = false

              let rows = response.data.data.browse.rows;
              rows.forEach(row => {
                row.route = row.type === 'folder' ? { path: '/', query: { directory: directory + row.name } } : { name: 'Reader', params: { urn: row.urn } };
                row.cover = row.cover ? thumbor + 'http://api:5000' + row.cover : thumbor + window.location.protocol + "//i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_incredible.jpg";
                this.files.push(row);
              });

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
