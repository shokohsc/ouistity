<template>
    <v-touch @tap="read" class="inline">
        <li @click.stop.prevent="read" class="files">
            <a :href="path" class="files">
                <span v-if="preview" :class="icon">
                    <img :src="preview" :alt="name" />
                </span>
                <span v-else :class="icon"></span>
                <span class="name">{{ name }}</span>
                <span class="details">{{ size }}</span>
            </a>
        </li>
    </v-touch>
</template>

<script>
    export default {
        props: ['propFile'],
        data: function () {
            return {
                id: '',
                path: '',
                type: '',
                fileType: '',
                icon: '',
                name: '',
                size: 0,
                preview: ''
            }
        },
        methods: {
            read: function (event) {
                if (event) {
                    this.$eventBus.$emit('loading-comic');
                    this.$store.dispatch('comic/read', encodeURIComponent(this.path))
                    .then((response) => {
                        this.$eventBus.$emit('display-comic', response);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$store.commit('comic/reset');
                        this.$eventBus.$emit('close-comic');
                    });
                }
            },
            bytesToSize: function (bytes) {
                let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Bytes';
                let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            },
            escapeHTML: function (text) {
                return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
            }
        },
        created: function () {
            this.id = this.propFile.id;
            this.path = this.propFile.path;
            this.type = this.propFile.type;
            this.size = this.bytesToSize(this.propFile.size);
            this.name = this.propFile.name;
            this.fileType = this.name.split('.');
            this.fileType = this.fileType[this.fileType.length - 1];
            this.icon = 'icon file f-' + this.fileType;
            if ('cbr' === this.fileType || 'cbz' === this.fileType) {
                this.preview = '//i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_incredible.jpg';
                this.$store.dispatch('comic/preview', encodeURIComponent(this.path))
                .then((response) => {
                    this.icon = 'icon preview';
                    this.preview = 'data:' + response[0].type + ';base64,' + response[0].image;
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    };
</script>

<style>
.icon {
	font-size: 23px;
}
.icon.preview {
	line-height: 3em;
	text-align: center;
	border-radius: 0.25em;
	color: #FFF;
	display: inline-block;
    margin: 20px 20px -15px;
	position: relative;
	overflow: hidden;
}
.icon.preview img{
	width: 100%;
}
.icon.file {
	line-height: 3em;
	text-align: center;
	border-radius: 0.25em;
	color: #FFF;
	display: inline-block;
    margin: 20px 20px -15px;
	position: relative;
	overflow: hidden;
	box-shadow: 1.74em -2.1em 0 0 #A4A7AC inset;
}
.icon.file:first-line {
	font-size: 13px;
	font-weight: 700;
}
.icon.file:after {
	content: '';
	position: absolute;
	z-index: -1;
	border-width: 0;
	border-bottom: 2.6em solid #DADDE1;
	border-right: 2.22em solid rgba(0, 0, 0, 0);
	top: -34.5px;
	right: -4px;
}
.icon.file.f-avi,
.icon.file.f-flv,
.icon.file.f-mkv,
.icon.file.f-mov,
.icon.file.f-mpeg,
.icon.file.f-mpg,
.icon.file.f-mp4,
.icon.file.f-m4v,
.icon.file.f-wmv {
	box-shadow: 1.74em -2.1em 0 0 #7e70ee inset;
}
.icon.file.f-avi:after,
.icon.file.f-flv:after,
.icon.file.f-mkv:after,
.icon.file.f-mov:after,
.icon.file.f-mpeg:after,
.icon.file.f-mpg:after,
.icon.file.f-mp4:after,
.icon.file.f-m4v:after,
.icon.file.f-wmv:after {
	border-bottom-color: #5649c1;
}
.icon.file.f-mp2,
.icon.file.f-mp3,
.icon.file.f-m3u,
.icon.file.f-wma,
.icon.file.f-xls,
.icon.file.f-xlsx {
	box-shadow: 1.74em -2.1em 0 0 #5bab6e inset;
}
.icon.file.f-mp2:after,
.icon.file.f-mp3:after,
.icon.file.f-m3u:after,
.icon.file.f-wma:after,
.icon.file.f-xls:after,
.icon.file.f-xlsx:after {
	border-bottom-color: #448353;
}
.icon.file.f-doc,
.icon.file.f-docx,
.icon.file.f-psd{
	box-shadow: 1.74em -2.1em 0 0 #03689b inset;
}
.icon.file.f-doc:after,
.icon.file.f-docx:after,
.icon.file.f-psd:after {
	border-bottom-color: #2980b9;
}
.icon.file.f-gif,
.icon.file.f-jpg,
.icon.file.f-jpeg,
.icon.file.f-pdf,
.icon.file.f-png {
	box-shadow: 1.74em -2.1em 0 0 #e15955 inset;
}
.icon.file.f-gif:after,
.icon.file.f-jpg:after,
.icon.file.f-jpeg:after,
.icon.file.f-pdf:after,
.icon.file.f-png:after {
	border-bottom-color: #c6393f;
}
.icon.file.f-deb,
.icon.file.f-dmg,
.icon.file.f-gz,
.icon.file.f-rar,
.icon.file.f-zip,
.icon.file.f-7z {
	box-shadow: 1.74em -2.1em 0 0 #867c75 inset;
}
.icon.file.f-deb:after,
.icon.file.f-dmg:after,
.icon.file.f-gz:after,
.icon.file.f-rar:after,
.icon.file.f-zip:after,
.icon.file.f-7z:after {
	border-bottom-color: #685f58;
}
.icon.file.f-cbz {
	box-shadow: 1.74em -2.1em 0 0 #C77D06 inset;
}
.icon.file.f-cbz:after {
	border-bottom-color: #9D6100;
}
.icon.file.f-cbr {
	box-shadow: 1.74em -2.1em 0 0 #381288 inset;
}
.icon.file.f-cbr:after {
	border-bottom-color: #2A0A6B;
}
.icon.file.f-html,
.icon.file.f-rtf,
.icon.file.f-xml,
.icon.file.f-xhtml {
	box-shadow: 1.74em -2.1em 0 0 #a94bb7 inset;
}
.icon.file.f-html:after,
.icon.file.f-rtf:after,
.icon.file.f-xml:after,
.icon.file.f-xhtml:after {
	border-bottom-color: #d65de8;
}
.icon.file.f-js {
	box-shadow: 1.74em -2.1em 0 0 #d0c54d inset;
}
.icon.file.f-js:after {
	border-bottom-color: #a69f4e;
}
.icon.file.f-css,
.icon.file.f-saas,
.icon.file.f-scss {
	box-shadow: 1.74em -2.1em 0 0 #44afa6 inset;
}
.icon.file.f-css:after,
.icon.file.f-saas:after,
.icon.file.f-scss:after {
	border-bottom-color: #30837c;
}
</style>
