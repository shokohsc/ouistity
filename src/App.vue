<template>
  <div class="layout gutter--xl">
    <div class="row justify--center">
      <va-input class="mb-4" v-model="q" placeholder="Search">
        <template #appendInner>
          <va-icon @click="search" @keyup="submit" name="search" />
        </template>
      </va-input>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      q: ''
    }
  },
  created() {
    this.$watch(
      () => this.$route.query.q,
      () => {
        this.q = this.$route.query.hasOwnProperty('q') ? this.$route.query.q : ''
      },
      { immediate: true }
    )
  },
  methods: {
    search: function() {
      this.$router.push({ path: '/search', query: { q: this.q } });
    },
    submit: function(e) {
      console.log(e);
      // this.$router.push({ path: '/search', query: { q: this.q } });
    }
  }
};
</script>

<style>
body {
	background-color: #23232e;
}
body::-webkit-scrollbar {
  display: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
