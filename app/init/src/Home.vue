<template>
    <div class="col-8">
        <search-bar></search-bar>
        <list-table></list-table>
    </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue';
import ListTable from './components/ListTable.vue';

export default {
    components: {
        'search-bar': SearchBar,
        'list-table': ListTable
    }
}
</script>


<style>
</style>
