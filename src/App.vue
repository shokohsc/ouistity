<template>
  <Header v-if="isNotReaderRoute" />
  <router-view />
  <Footer v-if="isNotReaderRoute" />
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import 'virtual:fonts.css'

export default {
  components: {
    Header,
    Footer
  },
  computed: {
    isNotReaderRoute() {
      return 'Reader' !== this.$route.name
    }
  }
};
</script>

<style>
body {
  font-family: "Code New Roman";
}
body::-webkit-scrollbar {
  display: none;
}
html {
  background-color: #23232e;
  height: 100%
}
</style>
