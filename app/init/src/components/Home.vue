<template>
    <div class="col-8">
        <home-search-bar></home-search-bar>
        <home-list-table></home-list-table>
    </div>
</template>

<script>
import HomeSearchBar from './home/HomeSearchBar.vue';
import HomeListTable from './home/HomeListTable.vue';

export default {
    components: {
        'home-search-bar': HomeSearchBar,
        'home-list-table': HomeListTable
    }
}
</script>


<style>
</style>
