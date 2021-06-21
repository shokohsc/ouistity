<template>
  <div class="row justify--center">
    <div @click="previousPage" class="previous" />
    <div @click="fullscreen" class="fullscreen" />
    <div @click="close" class="close" />
    <div @click="nextPage" class="next" />
    <img v-if="!loading" :src="image" :width="width" class="image"/>
    <p class="pages glow">{{ currentPage }} / {{ total }}</p>
  </div>
</template>

<script>
  import { pages } from '../api';

  export default {
    computed: {
      currentPage: function() {
        return parseInt(this.index) + 1;
      },
      total: function() {
        return this.pages.length;
      },
      thumbor: function() {
        return window.location.protocol + '//thumbor.' + window.location.hostname + '/unsafe/';
      },
      api: function() {
        return window.location.protocol + '//api.' + window.location.hostname;
      },
      image: function() {
        return this.thumbor + 'http://api:5000' + (this.total > 0 ? this.pages[this.index].image : '/');
      },
      width: function() {
        return window.screen.availWidth;
      }
    },
    data() {
      return {
        loading: true,
        useThumbor: true,
        index: 0,
        pages: [],
      }
    },
    created: function() {
      window.scrollTo(0, 0);
      window.addEventListener('keyup', this.keyUp);
      this.$watch(
        () => this.$route.query.page,
        () => {
          this.pages = []
          this.fetchData()
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
        this.index = this.index < this.pages.length ? parseInt(this.index) + 1 : this.index;
        window.localStorage.setItem(this.$route.params.urn, this.index)
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      },
      previousPage: function() {
        this.index = parseInt(this.index > 0 ? parseInt(this.index) - 1 : this.index);
        window.localStorage.setItem(this.$route.params.urn, this.index)
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      },
      keyUp: function(event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
          case 39:
            this.nextPage();
            break;
          case 38:
            this.fullscreen();
            break;
          case 27:
            this.close();
            break;
          case 37:
            this.previousPage();
            break;
        }
      },
      async fetchData() {
        this.loading = true

        await pages.read(this.$route.params.urn)
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
    }
  };
</script>

<style>
.previous {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
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
    z-index: 1;
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
    z-index: 1;
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
    z-index: 1;
    height: 100%;
    width: 20%;
    cursor: e-resize;
    /* opacity: 0.5;
    background-color: #00F; */
}
.image {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
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
