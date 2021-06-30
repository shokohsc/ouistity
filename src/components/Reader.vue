<template>
  <progress v-if="loading" class="progress" max="100">15%</progress>
  <div
    v-touch:swipe.left="nextPage"
    v-touch:swipe.right="previousPage"
    v-if="metadataLoaded"
    class="page is-justify-content-center is-align-items-center"
    :style="{ 'height': divHeight + 'px' }"
  >
    <div @click="previousPage" class="previous" />
    <div @click="fullscreen" class="fullscreen" />
    <div @click="modal" class="options" />
    <div @click="close" class="close" />
    <div @click="nextPage" class="next" />
    <img v-for="(source, i) in pages" :key="i"
      @load="preload(i, $event)"
      :data-src="imageSource(source.image)"
      :id="`page-${i}`"
      :class="displayClass(i)"
      :style="{ 'height': imageHeight + 'px' }"
    />
    <p class="pages glow">{{ currentPage }} / {{ total }}</p>
  </div>
  <div class="modal">
    <div class="modal-background" @click="hide"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Menu</p>
        <button class="delete" aria-label="close" @click="hide"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns is-justify-content-center">
          <div class="column is-narrow">
            <div class="select">
              <select v-model="page">
                <option :value="i" v-for="(p, i) in pages" :key="i">{{ i + 1 }}/{{ total }}</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-justify-content-center">
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
  import graphql from '../api';

  export default {
    computed: {
      currentPage: function() {
        return parseInt(this.index) + 1;
      },
      total: function() {
        return this.pages.length;
      },
      api: function() {
        return window.location.protocol + '//api.' + window.location.hostname;
      },
      thumbor: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname;
      },
      height: function() {
        return window.innerHeight;
      },
      width: function() {
        return window.screen.availWidth;
      },
      metaUrl: function() {
        return this.thumbor + '/unsafe/meta/smart/filters:quality(80)/' + 'http://api:5000' + this.pages[this.index].image;
      },
      divHeight: function() {
        if (this.useThumbor) {
          return Math.floor(this.imageHeight > this.height ? this.imageHeight : this.height);
        }
      },
      imageHeight: function() {
        if (this.useThumbor && this.pages[this.index].metadata) {
          return Math.floor((this.pages[this.index].metadata.target.height * this.width) / this.pages[this.index].metadata.target.width);
        }
        return 0;
      },
      highRes: function() {
        return this.thumbor + '/unsafe/smart/filters:quality(100)/';
      }
    },
    data() {
      return {
        loading: true,
        metadataLoaded: false,
        useThumbor: true,
        index: 0,
        page: 0,
        pages: [],
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('keyup', this.keyUp);
      window.addEventListener('resize', this.update);
      this.$watch(
        () => this.$route.query.page,
        async () => {
          this.pages = []
          await this.fetchData()
          this.index = this.$route.query.page || window.localStorage.getItem(this.$route.params.urn) || 0
          this.page = this.$route.query.page || window.localStorage.getItem(this.$route.params.urn) || 0
          window.localStorage.setItem(this.$route.params.urn, this.index)
          this.turnPage(this.index)
        },
        { immediate: true }
      )
    },
    destroyed: function() {
      window.removeEventListener('keyup', this.keyUp);
      window.removeEventListener('resize', this.update);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
    methods: {
      update: function(e) {
        this.$forceUpdate()
      },
      imageSource: function(url) {
        return (this.useThumbor ? this.highRes + 'http://api:5000' : this.api) + (this.total > 0 ? url : '');
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
        this.loading = true;
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
          await this.metadata()
          window.localStorage.setItem(this.$route.params.urn, this.index)
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
          const el = document.getElementById(`page-${page}`)
          if (el && !el.hasAttribute('src')) {
            const src = this.imageSource(this.pages[this.index].image)
            el.setAttribute('src', src)
          }
          this.preload(page)
        }
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
          case 38:
            this.fullscreen();
            break;
          case 39:
            this.nextPage();
            break;
          case 40:
            this.close();
            break;
          case 27:
            this.close();
            break;
        }
      },
      async fetchData() {
        this.loading = true

        await graphql.read(this.$route.params.urn)
          .then((response) => {
            const read = response.data.data.read;
            read.rows.forEach(row => {
              this.pages.push(row)
            });
            this.loading = false
          })
          .catch((error) => {
            console.log(error);
            this.loading = false
          });
      },
      async metadata() {
        if (this.pages[this.index].metadata)
          return this.pages[this.index].metadata
        const self = this;
        return await fetch(this.metaUrl)
          .then(response => response.json())
          .then(data => {
            this.pages[this.index].metadata = data.thumbor
            self.metadataLoaded = true
          })
          .catch(error => {
            console.log(error);
          });
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
}
.glow {
  font-size: 80px;
  color: #fff;
  text-align: center;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
@-webkit-keyframes glow {
  from {
    text-shadow: 0 0 10px #000, 0 0 20px #000, 0 0 30px #0032e6, 0 0 40px #0032e6, 0 0 50px #0032e6, 0 0 60px #0032e6, 0 0 70px #0032e6;
  }
  to {
    text-shadow: 0 0 20px #000, 0 0 30px #4d62ff, 0 0 40px #4d62ff, 0 0 50px #4d62ff, 0 0 60px #4d62ff, 0 0 70px #4d62ff, 0 0 80px #4d62ff;
  }
}
</style>
