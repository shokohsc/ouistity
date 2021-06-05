<template>
    <div class="filemanager">
        <!-- // <Breadcrumb></Breadcrumb>
        // <Search></Search> -->
        <!-- <Files></Files> -->
    </div>
</template>

<script>
    // import Breadcrumb from './Breadcrumb.vue';
    import Files from './Files.vue';
    // import Search from './Search.vue';
    export default {
        components: {
            // Breadcrumb,
            // Files
            // Search
        }
    };
</script>

<style>
.filemanager {
	width: 100%;
	max-width:1440px;
	position: relative;
	margin: 100px auto 50px;
}
@media all and (max-width: 965px) {
	.filemanager {
		margin: 30px auto 0;
		padding: 1px;
	}
}
</style>
