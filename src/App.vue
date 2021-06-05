<template>
    <div>
        <component :is="activeComponent"></component>
    </div>
</template>

<script>
import Filebrowser from './components/Filebrowser.vue';
import Error from './components/Error.vue';
import Loading from './components/Loading.vue';
// import Reader from './components/Reader.vue';

export default {
    components: {
        Filebrowser,
        Loading
        // Error,
        // Reader
    },
    data() {
        return {
            activeComponent: Loading
        }
    },
    // methods: {
    //     loading: function() {
    //         this.activeComponent = Loading;
    //     },
    //     clear: function() {
    //         this.$store.commit('comic/reset');
    //         this.activeComponent = Filebrowser;
    //     },
    //     display: function(data) {
    //         this.$store.commit('comic/setComic', data);
    //         this.activeComponent = Reader;
    //     }
    // },
    created: function() {
        const page = 1,
              size = 10;
        this.$store.dispatch('books/list', page, size)
        .then((response) => {
            const archives = response.data.map((archive) => archive.archive); // TODO DO THAT ON BACKEND
            let folders = [];
            archives.forEach((archive) => {
              let folder = archive.replace('/usr/app/assets/data/archives', '').split('/');
              folder.pop()
              folder = folder.join('/')
              folders[folder] = folder;
            });
            console.log(folders);

            // this.$store.commit('books/setBooks', response.data.rows);
            // this.activeComponent = Filebrowser;
        })
        .catch((error) => {
            console.log(error);
            this.$store.commit('books/resetBooks');
            this.activeComponent = Error;
        });
        let self = this;
        // this.$eventBus.$on('loading-comic', () => self.loading());
        // this.$eventBus.$on('display-comic', (data) => self.display(data));
        // this.$eventBus.$on('close-comic', () => self.clear());
    }
};
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
