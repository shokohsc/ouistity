<template>
  <div class="column is-narrow">
      <div class="box has-background-black">
        <router-link :to="file.route">
          <div class="block">
            <figure class="image">
              <img @load="enhance" :src="image" alt="{{ file.name }}" loading="lazy" class="cover" />
            </figure>
          </div>
          <div class="block has-text-white has-text-centered">
            <div style="width: 216px; margin: 0 auto;">
              {{ file.name }}
            </div>
          </div>
        </router-link>
      </div>
  </div>
</template>

<script>
  import defaultCover from '../assets/marvel_default.jpg'
  import Config from "../config.json";

  export default {
    computed: {
      lowRes: function() {
        return window.location.protocol + '//' + Config.THUMBOR_HOST + '/unsafe/216x324/smart/filters:quality(40)/';
      },
      highRes: function() {
        return window.location.protocol + '//' + Config.THUMBOR_HOST + '/unsafe/216x324/smart/filters:quality(100)/';
      },
      api: function() {
        return window.location.protocol + '//' + Config.API_GATEWAY_HOST;
      },
      image: function() {
        if (!this.file.cover) {
          return defaultCover;
        }
        return (this.useThumbor ? (this.loaded ? this.highRes : this.lowRes) + Config.THUMBOR_API_GATEWAY_URL : this.api) + this.file.cover;
      }
    },
    props: {
      file: Object
    },
    data() {
      return {
        loaded: false,
        useThumbor: true
      }
    },
    methods: {
      enhance(e) {
        this.loaded = true;
      }
    },
  }
</script>

<style>
img.cover {
  width: 216px;
  height: 324px;
  margin: 0 auto;
}
</style>
