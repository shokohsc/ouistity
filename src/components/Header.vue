<template>
  <div class="columns is-justify-content-center is-mobile">
    <div class="column is-narrow">
      <router-link to="/" >
        <button class="button is-large">
          <span class="icon">
            <i class="fas fa-home"></i>
          </span>
        </button>
      </router-link>
    </div>
    <div class="column is-6">
      <input v-model="q" class="input is-large has-text-black has-background-grey" type="text" placeholder="Search..." />
    </div>
    <div class="column is-narrow">
      <button @click="clear" class="button is-large">
        <span class="icon">
          <i class="fas fa-times"></i>
        </span>
      </button>
    </div>
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
    window.addEventListener('keyup', this.keyUp);
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.keyUp);
  },
  methods: {
    keyUp: function(e) {
      switch (e.keyCode) {
        case 13:
          this.validate();
          break;
      }
    },
    async clear(e) {
      if (this.q !== '') {
        this.q = '';
      }
    },
    async validate() {
      if (this.q.length > 2) {
        this.$router.push({ path: '/search', replace: true, query: { q: this.q }})
      }
    },
  }
};
</script>
