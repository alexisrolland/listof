<template>
    <div class="mt-5">
        <!-- Search bar -->
        <input class="form-control form-control-lg mb-5"
            type="search"
            aria-label="Search"
            placeholder="Search lists"
            v-model="keyword"
            v-on:keyup.enter="search">

        <!-- Lists table -->
        <home-list-table v-bind:lists="lists"></home-list-table>
    </div>
</template>

<script>
import HomeListTable from './HomeListTable.vue';

export default {
    components: {
        'home-list-table': HomeListTable
    },
    data: function () {
        return {
            'keyword': null,
            'lists': []
        }
    },
    methods: {
        getAllLists() {
            let payload = { 'query': this.$store.state.queryGetAllLists };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.lists = response.data.data.allSysLists.nodes;
                    }
                }
            );
        },
        search() {
            // Search list based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllLists();
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchList,
                    'variables': {
                        'keyword': this.keyword
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.lists = response.data.data.searchList.sysLists;
                        }
                    }
                );
            }
        }
    },
    created: function () {
        this.getAllLists();
    }
}
</script>