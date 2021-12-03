<template>
  <progress v-if="loading" class="progress" max="100">15%</progress>
  <p class="pages glow">{{ currentPage }} / {{ total }}</p>
  <div
    v-touch:swipe.left="nextPage"
    v-touch:swipe.right="previousPage"
    v-if="metadataLoaded"
    class="page is-justify-content-center is-align-items-center"
    :style="divStyle"
  >
    <div @click="previousPage" class="previous" />
    <div @click="fullscreen" class="fullscreen" />
    <div @click="modal" class="options" />
    <div @click="close" class="close" />
    <div @click="nextPage" class="next" />
    <img v-for="(source, i) in pages" :key="i"
      @load="preload(i, $event)"
      @error="reload(i, $event)"
      :data-src="imageSource(source.image)"
      :id="`page-${i}`"
      :class="displayClass(i)"
      :style="imageStyle"
    />
  </div>

  <div class="modal">
    <div class="modal-background" @click="hide"></div>
    <div class="modal-card has-background-dark">
      <header class="modal-card-head has-background-dark">
        <p class="modal-card-title">Menu</p>
        <button class="delete" aria-label="close" @click="hide"></button>
      </header>
      <section class="modal-card-body has-background-dark">
        <div class="columns">
          <div class="column">
            <div class="field has-addons has-addons-centered">
              <div class="control">
                <div class="select">
                  <select v-model="page">
                    <option :value="i" v-for="(p, i) in pages" :key="i">{{ i + 1 }}/{{ total }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-justify-content-center has-background-dark">
        <div class="columns">
          <div class="column">
            <button class="button is-fullwidth is-primary" @click="skip">Go</button>
          </div>
          <div class="column">
            <button class="button is-fullwidth" @click="hide">Hide</button>
          </div>
          <div class="column">
            <button class="button is-fullwidth is-danger" @click="close">Close</button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import graphql from '../api';
  import getEnv from '../utils/env';

  export default {
    computed: {
      currentPage: function() {
        return parseInt(this.index) + 1;
      },
      total: function() {
        return this.pages.length;
      },
      api: function() {
        return window.location.protocol + '//' + getEnv('API_GATEWAY_HOST');
      },
      imgproxy: function() {
        return window.location.protocol + '//' + getEnv('IMGPROXY_HOST');
      },
      thumbor: function() {
        return window.location.protocol + '//' + getEnv('THUMBOR_HOST');
      },
      metaUrl: function() {
        return this.thumbor + '/unsafe/meta/smart/filters:quality(40)/' + getEnv('INTERNAL_API_GATEWAY_URL') + this.pages[this.index].image;
      },
      highRes: function() {
        if (this.useImgproxy === 'true')
        return this.imgproxy + '/insecure/width:216/height:324/quality:100/plain/';
        return this.thumbor + '/unsafe/smart/filters:quality(100)/';
      }
    },
    data() {
      return {
        loading: true,
        metadataLoaded: false,
        useThumbor: getEnv('USE_THUMBOR'),
        useImgproxy: getEnv('USE_IMGPROXY'),
        index: 0,
        page: 0,
        pages: [],
        divStyle: { 'height': `${this.divHeight()}px` },
        imageStyle: { 'height': `${this.imageHeight()}px` },
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('keyup', this.keyUp);
      window.addEventListener('resize', this.resize);
      this.$watch(
        () => this.$route.query.page,
        async () => {
          this.pages = []
          await this.fetchData()
          this.index = this.$route.query.page || window.localStorage.getItem(this.$route.params.urn) || 0
          this.page = this.$route.query.page || window.localStorage.getItem(this.$route.params.urn) || 0
          window.localStorage.setItem(this.$route.params.urn, this.index)
          await this.turnPage(this.index)
        },
        { immediate: true }
      )
    },
    beforeUnmount: function() {
      window.removeEventListener('keyup', this.keyUp);
      window.removeEventListener('resize', this.resize);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
    methods: {
      resize: function() {
        this.divStyle = { height: `${this.divHeight()}px` }
        this.imageStyle = { height: `${this.imageHeight()}px` }
      },
      height: function() {
        return window.innerHeight;
      },
      width: function() {
        return window.innerWidth;
      },
      divHeight: function() {
        return this.imageHeight() > this.height() ? this.imageHeight() : this.height();
      },
      imageHeight: function() {
        return this.metadataLoaded === true ? Math.floor(this.pages[this.index].metadata.target.height * this.width() / this.pages[this.index].metadata.target.width) : this.height();
      },
      imageSource: function(url) {
        return (this.useThumbor === 'true' || this.useImgproxy === 'true' ? this.highRes + getEnv('INTERNAL_API_GATEWAY_URL') : this.api) + (this.total > 0 ? url : '');
      },
      displayClass: function(item) {
        return parseInt(this.index) === parseInt(item) ? 'displayed' : 'hidden'
      },
      modal: function() {
        this.page = this.index
        const modal = document.querySelector('.modal')
        modal.classList.add('is-active');
      },
      hide: function() {
        const modal = document.querySelector('.modal')
        modal.classList.remove('is-active');
      },
      async skip() {
        const modal = document.querySelector('.modal')
        modal.classList.remove('is-active');
        await this.turnPage(parseInt(this.page));
      },
      close: function() {
        window.removeEventListener('keyup', this.keyUp);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        this.$router.back();
      },
      fullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      },
      async nextPage() {
        await this.turnPage(parseInt(this.index) + 1);
      },
      async previousPage() {
        await this.turnPage(parseInt(this.index) - 1);
      },
      async turnPage(page = 0) {
        if (this.pages[page]) {
          self.metadataLoaded = false
          this.index = page
          this.page = page
          window.scrollTo(0, 0);
          await this.metadata()
          this.divStyle = { height: `${this.divHeight()}px` }
          this.imageStyle = { height: `${this.imageHeight()}px` }
          window.localStorage.setItem(this.$route.params.urn, this.index)
          const el = document.getElementById(`page-${page}`)
          if (el && !el.hasAttribute('src')) {
            const src = this.imageSource(this.pages[this.index].image)
            el.setAttribute('src', src)
          }
          this.preload(page)
        }
      },
      reload: function(page, e = null) {
        page = parseInt(page)
        setTimeout(() => {
          const el = document.getElementById(`page-${page}`)
          if (el && el.hasAttribute('src')) {
            el.removeAttribute('src')
            const src = el.getAttribute('data-src')
            el.setAttribute('src', src)
          }
        }, 3000);
      },
      preload: function(page, e = null) {
        page = parseInt(page) + 1
        if (this.pages[page] && page < (parseInt(this.index) + 3)) {
          const el = document.getElementById(`page-${page}`)
          if (el && !el.hasAttribute('src')) {
            const src = el.getAttribute('data-src')
            el.setAttribute('src', src)
          }
        }
      },
      keyUp: function(event) {
        switch (event.keyCode) {
          case 37:
            this.previousPage();
            break;
          case 39:
            this.nextPage();
            break;
          case 27:
            this.close();
            break;
        }
      },
      async fetchData() {
        this.loading = true

        try {
          const response = await graphql.read(this.$route.params.urn)
          const read = response.data.data.read;
          read.rows.forEach(row => {
            this.pages.push(row)
          });
          this.loading = false
        } catch (e) {
          console.log(e.message);
          this.loading = false
        }
      },
      async getRemoteImageSize(src) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.onload = () => resolve({ 'target': { 'height': img.height, 'width': img.width } })
          // img.onerror = reject(src)
          img.src = src
        })
      },
      async metadata() {
        try {
          if (this.pages[this.index].metadata)
            return this.pages[this.index].metadata

          if ('true' === this.useThumbor) {
            const response = await fetch(this.metaUrl)
            const data = await response.json()
            this.pages[this.index].metadata = data.thumbor
          } else {
            const imageUrl = window.location.protocol + '//' + getEnv('API_GATEWAY_HOST') + this.pages[this.index].image
            const data = await this.getRemoteImageSize(imageUrl)
            this.pages[this.index].metadata = data
          }
          this.metadataLoaded = true
        } catch (e) {
          console.log(e);
        }
      },
    }
  };
</script>

<style>
progress.progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8;
  border-radius: 0px;
}
progress.progress:indeterminate {
  background-color: #23232e;
  background-image: linear-gradient(to right, #0a0a0a 30%, #23232e 30%);
}
.previous {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  height: 100%;
  width: 20%;
  cursor: w-resize;
  /* opacity: 0.5;
  background-color: #F00; */
}
.fullscreen {
  position: fixed;
  left: 20%;
  top: 0;
  z-index: 10;
  height: 25%;
  width: 60%;
  cursor: zoom-in;
  /* opacity: 0.5;
  background-color: #0F0; */
}
.options {
  position: fixed;
  left: 20%;
  top: 25%;
  z-index: 10;
  height: 50%;
  width: 60%;
  cursor: context-menu;
  /* opacity: 0.5;
  background-color: #00F; */
}
.close {
  position: fixed;
  left: 20%;
  top: 75%;
  z-index: 10;
  height: 25%;
  width: 60%;
  cursor: not-allowed;
  /* opacity: 0.5;
  background-color: #FF0; */
}
.next {
  position: fixed;
  left: 80%;
  top: 0;
  z-index: 10;
  height: 100%;
  width: 20%;
  cursor: e-resize;
  /* opacity: 0.5;
  background-color: #0FF; */
}
.page {
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 5;
}
.page img {
  width: 100%;
}
img.hidden {
  opacity: 0;
  visibility: hidden;
  width: 0;
}
img.displayed {
  opacity: 1;
  visibility: visible;
  transition: visibility 1s ease-out, opacity 1s ease-out;
  width: 100%;
}
.pages {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.1;
  pointer-events: none;
  font-family: monospace;
  z-index: 10;
}
.glow {
  font-size: 8vw;
  color: #fff;
  text-align: center;
}
</style>
