<template>
  <div class="column is-2">
    <router-link :to="file.route">
      <div class="box has-background-black">
        <div class="block">
          <figure class="image">
            <img @load="enhance" :src="image" alt="{{ file.name }}" />
          </figure>
        </div>
        <div class="block has-text-white has-text-centered">
          {{ file.name }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  import defaultCover from '../assets/marvel_default.jpg'

  export default {
    computed: {
      lowRes: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/216x324/smart/filters:quality(5)/';
      },
      highRes: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/216x324/smart/filters:quality(80)/';
      },
      api: function() {
        return window.location.protocol + '//api.' + window.location.hostname;
      },
      image: function() {
        if (!this.file.cover) {
          return defaultCover;
        }
        return (this.useThumbor ? (this.loaded ? this.highRes : this.lowRes) + 'http://api:5000' : this.api) + this.file.cover;
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
