<template>
  <progress v-if="!loaded" class="progress" max="100">80%</progress>
  <div class="page is-align-items-center">
    <div @click="previousPage" class="previous" />
    <div @click="fullscreen" class="fullscreen" />
    <div @click="close" class="close" />
    <div @click="nextPage" class="next" />
    <img id=page v-if="!loading" @load="enhance" :src="image" class="loading" />
    <p class="pages glow">{{ currentPage }} / {{ total }}</p>
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
      lowRes: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/smart/filters:quality(40)/';
      },
      highRes: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/smart/filters:quality(100)/';
      },
      api: function() {
        return window.location.protocol + '//api.' + window.location.hostname;
      },
      image: function() {
        return (this.useThumbor ? (this.loaded ? this.highRes : this.lowRes) + 'http://api:5000' : this.api) + (this.total > 0 ? this.pages[this.index].image : '/');
      }
    },
    data() {
      return {
        loading: true,
        loaded: false,
        useThumbor: true,
        index: 0,
        pages: [],
      }
    },
    created() {
      window.scrollTo(0, 0);
      window.addEventListener('keyup', this.keyUp);
      this.$watch(
        () => this.$route.query.page,
        async () => {
          this.pages = []
          await this.fetchData()
          this.index = this.$route.query.page || window.localStorage.getItem(this.$route.params.urn) || 0
          window.localStorage.setItem(this.$route.params.urn, this.index)
        },
        { immediate: true }
      )
    },
    destroyed: function() {
      window.removeEventListener('keyup', this.keyUp);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
    methods: {
      close: function() {
        this.loading = true;
        this.pages = [];
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
      nextPage: function() {
        this.loaded = false;
        this.index = this.index < this.pages.length ? parseInt(this.index) + 1 : this.index;
        window.localStorage.setItem(this.$route.params.urn, this.index)
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById('page').classList.add('is-hidden')
      },
      previousPage: function() {
        this.loaded = false;
        this.index = parseInt(this.index > 0 ? parseInt(this.index) - 1 : this.index);
        window.localStorage.setItem(this.$route.params.urn, this.index)
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        document.getElementById('page').classList.add('is-hidden')
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
      enhance(e) {
        this.loaded = true
        document.getElementById('page').classList.remove('is-hidden')
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
      }
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
  height: 50%;
  width: 60%;
  cursor: zoom-in;
  /* opacity: 0.5;
  background-color: #F00; */
}
.close {
  position: fixed;
  left: 20%;
  top: 50%;
  z-index: 10;
  height: 50%;
  width: 60%;
  cursor: not-allowed;
  /* opacity: 0.5;
  background-color: #0F0; */
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
  background-color: #00F; */
}
.page {
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 5;
}
.page img {
  width: 100%;
}
img.loading {
  opacity: 1;
  transition: opacity 1s linear;
}
.pages {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0.2;
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
