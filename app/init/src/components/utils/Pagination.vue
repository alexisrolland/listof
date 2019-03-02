<template>
    <nav class="bg-dark text-light" aria-label="Pages">
        <ul class="pagination">
            <li v-for="page in pages"  v-bind:key="page.pageNum" class="page-item">
                <a class="page-link text-light"
                    v-bind:class="{ 'bg-secondary': !page.isActive, active: page.isActive }"
                    v-on:click="goToPage(page)" >
                        {{page.pageNum}}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        totalCount: Number,
        currentPage: Object
    },
    data: function () {
        return {
            'nbItems': 10
        }
    },
    computed: {
        pages(){
            let nbPages = Math.ceil(this.totalCount/this.nbItems);
            let pages = [];
            for (let i=0; i < nbPages; i++) {
                let page = {
                    'pageNum': i+1,
                    'offset': i*this.nbItems,
                    'nbItems': this.nbItems
                }
                if(this.currentPage.pageNum == i+1) {
                    page['isActive'] = true
                }
                pages.push(page)
            }
            return pages
        }
    },
    methods: {
        goToPage(page) {
            this.$emit("goToPage", page);
        }
    }
}
</script>

<style>
/*Style for pagination*/
.page-link, .page-link:hover { border-color: #343A40; }
.active { background-color: #2C3034; }
.active:hover { background-color: #2C3034; }
</style>