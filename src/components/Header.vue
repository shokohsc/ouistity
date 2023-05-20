<template>
  <nav class="navbar is-black is-fixed-top is-spaced" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">

      <router-link class="navbar-item" to="/">
        <button class="button">
          <span class="icon">
            <i class="fas fa-home"></i>
          </span>
        </button>
      </router-link>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbar" class="navbar-menu">

      <div class="navbar-start">
        <router-link class="navbar-item has-text-white" to="/">
          Comics
        </router-link>
        <router-link class="navbar-item has-text-white" to="/about">
          About
        </router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field">
            <div class="control">
              <input v-model="q" class="input has-text-black has-background-grey" type="text" placeholder="Search..." />
            </div>
          </div>
        </div>
        <div class="navbar-item">
          <div class="field">
            <div class="control">
              <button @click="validate($event)" class="button">
                <span class="icon">
                  <i class="fas fa-search"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
import { useSearchStore } from '../stores/search'

export default {
  data() {
    return {
      store: useSearchStore(),
    }
  },
  computed: {
    q: {
        get(){
            return this.store.q
        },
        set(newValue){
            this.store.$patch({ q: newValue })
        }

    },
    page: function() {
      return this.store.page
    }
  },
  created() {
    document.addEventListener('DOMContentLoaded', () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    });
    document.addEventListener('keyup', this.keyUp);
    this.store.$patch({ q: this.$route.query.hasOwnProperty('q') ? this.$route.query.q : '' })
    this.store.$patch({ page: this.$route.query.hasOwnProperty('page') ? this.$route.query.page : 1 })
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.keyUp);
  },
  methods: {
    keyUp: function(e) {
      switch (e.keyCode) {
        case 13:
          this.validate();
          break;
      }
    },
    async validate(e = null) {
      if (this.store.q.length > 2) {
        this.$router.push({ path: '/search', query: { q: this.store.q, page: 1 }})
      }
    },
  }
};
</script>

<style>
nav.navbar {
  background-color: #0a0a0a !important;
}
.navbar-item {
  background-color: #0a0a0a;
}
.navbar-menu {
  background-color: #0a0a0a;
}
a.navbar-item:focus-within {
  background-color: #0a0a0a !important;
}
</style>
