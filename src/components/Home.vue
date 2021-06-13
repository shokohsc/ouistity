<template>
    <div class="filemanager">
        <!-- // <Breadcrumb></Breadcrumb>
        // <Search></Search> -->

        <div class="files">
            <div v-if="empty" class="nothingfound">
                <div class="nofiles"></div>
                <span>No files here.</span>
            </div>
            <div v-else>
                <ul class="data">
                    <li @click.stop.prevent="read" class="files" :propFile="file" v-for="file in files" :key="file.name">
                        <!-- <a :href="path" class="files"> -->
                            <!-- <span v-if="preview" :class="icon">
                                <img :src="preview" :alt="name" />
                            </span> -->
                            <!-- <span v-else :class="icon"></span> -->
                            <span class="name">{{ file.name }}</span>
                            <!-- <span class="details">{{ size }}</span> -->
                        <!-- </a> -->
                    </li>

                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    // import Breadcrumb from './Breadcrumb.vue';
    // import Search from './Search.vue';
    import Error from './Error.vue';
    import Loading from './Loading.vue';
    // import Reader from './Reader.vue';
    import { archives } from '../api';

    export default {
      computed: {
          empty: function() {
              return (0 == this.files.length);
          }
      },
      data() {
        return {
          loading: false,
          files: [],
          error: null,
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

          archives.browse(directory, page, pageSize)
            .then((response) => {
                this.loading = false

                let files = response.data.data.browse.rows;
                files.forEach(file => {
                  this.files.push(file);
                  console.log(file);
                  // const route = file.type === 'folder' ? '/?directory=' + directory + file.name : '/reader/' + file.urn;
                  // console.log(route);
                  // this.$router.push(route)

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
