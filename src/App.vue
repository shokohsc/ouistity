<template>
  <div>
  <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>

body {
	background-color: #23232e;
	font: 14px normal Arial, Helvetica, sans-serif;
	z-index: -4;
}

.hidden {
	display: none;
}

.visible {
	display: block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
