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
import { archives } from './api';

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
        const directory = 'comics/star wars'; // TODO link that to the router
        archives.list(directory)
        .then((response) => {
            console.log(response.data);
            // this.$store.commit('folders/setFolders', response.data);
            this.activeComponent = Filebrowser;
        })
        .catch((error) => {
            console.log(error);
            // this.$store.commit('books/resetBooks');
            this.activeComponent = Error;
        });
        // let self = this;
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
