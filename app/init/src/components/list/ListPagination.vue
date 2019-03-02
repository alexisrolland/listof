<template>
    <nav class="bg-dark text-light" aria-label="Lists pages">
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
        nbLists: Number,
        currentPage: Number
    },
    data: function () {
        return {
            'nbItems': 10
        }
    },
    computed: {
        pages(){
            let nbPages = Math.round(this.nbLists/this.nbItems);
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
.active { background-color: #212529; }
.active:hover { background-color: #212529; }
</style>