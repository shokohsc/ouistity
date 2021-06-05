<template>
    <div class="files">
        <div v-if="empty" class="nothingfound">
            <div class="nofiles"></div>
            <span>No files here.</span>
        </div>
        <div v-else>
            <ul class="data">
                <Folder :propFolder="folder" v-for="folder in folders" :key="folder.id"></Folder>
                <File :propFile="file" v-for="file in files" :key="file.id"></File>
            </ul>
        </div>
    </div>
</template>

<script>
    import Folder from './Folder.vue';
    import File from './File.vue';
    export default {
        components: {
            Folder,
            File
        },
        computed: {
            files: function() {
                return this.extractDataProperty('files');
            },
            folders: function() {
                return this.extractDataProperty('folders');
            },
            empty: function() {
                return (0 == this.files.length && 0 == this.folders.length);
            }
        },
        methods: {
            parseData: function(data) {
                let files   = [],
                    folders = [];
                data.forEach(function(file){
                    if (file.type === 'folder') {
                        this.parseData(file.items);
                        folders.push(file);
                    } else if (file.type === 'file') {
                        files.push(file);
                    }
                }, this);
                return {
                    folders: folders,
                    files: files
                };
            },
            extractDataProperty: function(property) {
                const id = this.$store.getters['router/key'];
                let files = this.$store.getters['files/filesInFolderWithId'](id);
                const isSearch = 0 === atob(id).indexOf('search=');
                if (isSearch) {
                    const value = (atob(id)).substring(('search=').length);
                    files = this.$store.getters['files/search'](value);
                }
                return this.parseData(files)[property];
            }
        }
    };
</script>

<style>
.filemanager .data {
	margin-top: 60px;
	z-index: -3;
}
.filemanager .data.animated {
	-webkit-animation: showSlowlyElement 700ms; /* Chrome, Safari, Opera */
	animation: showSlowlyElement 700ms; /* Standard syntax */
}
.filemanager .data li {
	border-radius: 3px;
	background-color: #373743;
	width: 250px;
	height: 415px;
	list-style-type: none;
	margin: 10px;
	display: inline-block;
	position: relative;
	overflow: hidden;
	padding: 0.3em;
	z-index: 1;
	cursor: pointer;
	box-sizing: border-box;
	transition: 0.3s background-color;
}
.filemanager .data li:hover {
	background-color: #42424E;
}
.filemanager .data li a {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	text-align: center;
}
.filemanager .data li .name {
	color: #ffffff;
	font-size: 15px;
	font-weight: 700;
	line-height: 20px;
	width: 80%;
	white-space: nowrap;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
}
.filemanager .data li .details {
	color: #b6c1c9;
	font-size: 13px;
	font-weight: 400;
	width: 80%;
	display: inline-block;
	text-align: center;
}
.filemanager .nothingfound {
	background-color: #373743;
	width: 23em;
	height: 21em;
	margin: 0 auto;
	display: block;
	font-family: Arial;
	-webkit-animation: showSlowlyElement 700ms; /* Chrome, Safari, Opera */
	animation: showSlowlyElement 700ms; /* Standard syntax */
}
.filemanager .nothingfound .nofiles {
	margin: 30px auto;
	top: 3em;
	border-radius: 50%;
	position:relative;
	background-color: #d72f6e;
	width: 11em;
	height: 11em;
	line-height: 11.4em;
}
.filemanager .nothingfound .nofiles:after {
	content: '×';
	position: absolute;
	color: #ffffff;
	font-size: 14em;
	margin-right: 0.092em;
	right: 0;
}
.filemanager .nothingfound span {
	margin: 0 auto auto 6.8em;
	color: #ffffff;
	font-size: 16px;
	font-weight: 700;
	line-height: 20px;
	height: 13px;
	position: relative;
	top: 2em;
}
@media all and (max-width:965px) {
	.filemanager .data li {
		width: 100%;
		margin: 5px 0;
	}
}
/* Chrome, Safari, Opera */
@-webkit-keyframes showSlowlyElement {
	100%   	{ transform: scale(1); opacity: 1; }
	0% 		{ transform: scale(1.2); opacity: 0; }
}
/* Standard syntax */
@keyframes showSlowlyElement {
	100%   	{ transform: scale(1); opacity: 1; }
	0% 		{ transform: scale(1.2); opacity: 0; }
}
</style>
