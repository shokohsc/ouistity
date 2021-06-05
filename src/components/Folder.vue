<template>
    <div class="inline">
        <li @click.stop.prevent="browse" class="folders">
            <a :href="path" :title="path" class="folders">
                <span :class="iconClass"></span>
                <span class="name">{{ name }}</span>
                <span class="details">{{ itemsLength }}</span>
            </a>
        </li>
    </div>
</template>

<script>
    export default {
        props: ['propFolder'],
        data: function () {
            return {
                id: '',
                path: '',
                type: '',
                iconClass: '',
                name: '',
                itemsLength: 'Empty',
                items: []
            }
        },
        methods: {
            browse: function (event) {
                if (event) {
                    this.$store.commit('router/setPath', encodeURIComponent(this.path));
                    this.$store.commit('router/addUrl', this.path);
                    this.$store.commit('router/setKey', this.id);
                    window.location.hash = encodeURIComponent(this.path);
                }
            },
            escapeHTML: function (text) {
                return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
            }
        },
        created: function () {
            this.id = this.propFolder.id;
            this.path = this.propFolder.path;
            this.type = this.propFolder.type;
            this.items = this.propFolder.items;
            this.name = this.escapeHTML(this.propFolder.name);
            this.iconClass = 'icon folder';
            if (0 < this.propFolder.items.length) {
                this.iconClass = 'icon folder full';
                this.itemsLength = this.propFolder.items.length + ' items';
            }
            if (1 == this.propFolder.items.length) {
                this.itemsLength = '1 item';
            }
        }
    };
</script>

<style>
.icon {
	font-size: 23px;
}
.icon.folder {
	display: inline-block;
	margin: 1em;
	background-color: transparent;
	overflow: hidden;
}
.icon.folder:before {
	content: '';
	float: left;
	background-color: #7ba1ad;
	width: 1.5em;
	height: 0.45em;
	margin-left: 0.07em;
	margin-bottom: -0.07em;
	border-top-left-radius: 0.1em;
	border-top-right-radius: 0.1em;
	box-shadow: 1.25em 0.25em 0 0em #7ba1ad;
}
.icon.folder:after {
	content: '';
	float: left;
	clear: left;
	background-color: #a0d4e4;
	width: 3em;
	height: 2.25em;
	border-radius: 0.1em;
}
.icon.folder.full:before {
	height: 0.55em;
}
.icon.folder.full:after {
	height: 2.15em;
	box-shadow: 0 -0.12em 0 0 #ffffff;
}
</style>
