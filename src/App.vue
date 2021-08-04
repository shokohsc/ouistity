<template>
  <router-view />
</template>

<script>
// import myOnErrorHandler from './utils/logger';
//
// const { onerror } = window; // Existing onerror handlers
//
// // Trust others adhere to onerror handling rules
// window.onerror = (...args) => {
//     let handled; // is someone else taking care this error?
//     try {
//         handled = onerror && onerror.apply(window, args);
//     } catch (error) {
//
//         // Catch others' onerror errors
//         myOnErrorHandler(error.message, '', 0, 0, error);
//     } finally {
//         handled || myOnErrorHandler(...args);
//     }
//     return false;
// }

// // Or simply be first and catch everything
// window.onerror = (...args) => {
//     myOnErrorHandler(...args);
//     onerror && onerror.apply(window, args);
//     return false;
// }

export default {};
</script>

<style>
body {
  font-family: "Source Sans Pro";
}
body::-webkit-scrollbar {
  display: none;
}
html {
  background-color: #23232e;
  height: 100%
}
</style>
