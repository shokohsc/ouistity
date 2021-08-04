<template>
    <div class="columns is-justify-content-center is-multiline">
      <File :file="file" v-for="(file, index) in files" :key="index" />
    </div>
</template>

<script>
  import File from './File.vue';

  export default {
    components: {
      File
    },
    props: {
      files: Array
    }
  }
</script>
