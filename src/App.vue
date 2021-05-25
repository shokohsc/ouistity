<template>
  <!-- <img alt="Loading" src="./assets/loading.gif" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <div>
    <va-input
      class="mb-4"
      v-model="value"
      placeholder="Placeholder"
    />
  </div>

  <va-button> Button </va-button>

  <va-switch v-model="darkThemeBool" />

  <va-breadcrumbs>
    <router-link to="/">Home</router-link>
    <va-breadcrumbs-item label="path" />
    <va-breadcrumbs-item label="to" />
    <va-breadcrumbs-item label="folder" />
  </va-breadcrumbs>

  <router-view></router-view>

  <div class="row">
    <div class="flex md6 lg4">
      <va-card>
        <va-image
          src="https://picsum.photos/400/200"
          style="height: 200px;"
        />
        <va-card-title>Title</va-card-title>
        <va-card-content>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
export default {
  data () {
    return {
      searchInput: '',
      darkThemeBool: true
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
