<template>
  <div class="column is-narrow">
      <div class="box has-background-black">
        <router-link :to="file.route">
          <div class="block">
            <figure class="image">
              <img @load="enhance" :src="image" :alt="name" loading="lazy" class="cover" width="216" height="324" />
              <span class="tooltip">{{ summary }}</span>
            </figure>
          </div>
          <div class="block has-text-white has-text-centered">
            <div style="width: 216px; margin: 0 auto;">
              {{ name }}
            </div>
          </div>
        </router-link>
      </div>
  </div>
</template>

<script>
  import defaultCover from '../assets/marvel_default.jpg'
  import getEnv from '../utils/env';

  export default {
    computed: {
      lowRes: function() {
        return window.location.protocol + '//' + getEnv('THUMBOR_HOST') + '/unsafe/216x324/smart/filters:quality(40)/';
      },
      highRes: function() {
        return window.location.protocol + '//' + getEnv('THUMBOR_HOST') + '/unsafe/216x324/smart/filters:quality(100)/';
      },
      api: function() {
        return window.location.protocol + '//' + getEnv('API_GATEWAY_HOST');
      },
      image: function() {
        if (!this.file.cover) {
          return defaultCover;
        }
        return (this.useThumbor === 'true' ? (this.loaded ? this.highRes : this.lowRes) + getEnv('THUMBOR_API_GATEWAY_URL') : this.api) + this.file.cover;
      },
      summary: function() {
        if (this.file.info?.summary?.length > 0)
          return this.file.info.summary;
        return this.file.name;
      },
      name: function() {
        if (this.file.info?.series?.length > 0 && this.file.info?.number?.length > 0)
          return this.file.info.series + ' ' + this.file.info.number;
        return this.file.name;
      }
    },
    props: {
      file: Object
    },
    data() {
      return {
        loaded: false,
        useThumbor: getEnv('USE_THUMBOR')
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
/* Tooltip text */
figure.image .tooltip {
  visibility: hidden;
  width: 100%;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 1s;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
figure.image:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

figure.image .tooltip::after {
  content: " ";
  position: absolute;
  bottom: 100%;  /* At the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}
</style>
