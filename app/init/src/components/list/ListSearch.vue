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
        <list-table v-bind:lists="lists"></list-table>

        <!-- Lists pagination -->
        <list-pagination
            v-bind:totalCount="nbLists"
            v-bind:currentPage="currentPage"
            v-on:goToPage="getAllLists"
        ></list-pagination>
    </div>
</template>

<script>
import ListTable from './ListTable.vue';
import Pagination from '../utils/Pagination.vue';

export default {
    components: {
        'list-table': ListTable,
        'list-pagination': Pagination
    },
    data: function () {
        return {
            'keyword': null,
            'lists': [],
            'nbLists': null,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            }
        }
    },
    methods: {
        getAllLists(page) {
            let payload = {
                'query': this.$store.state.queryGetAllLists,
                'variables': {
                    'first': page.nbItems,
                    'offset': page.offset
                }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.lists = response.data.data.allSysLists.nodes;
                        this.nbLists = response.data.data.allSysLists.totalCount;

                        // Set current page
                        this.currentPage = {
                            'pageNum': page.pageNum,
                            'offset': page.offset,
                            'nbItems': page.nbItems,
                            'isActive': page.isActive
                        }
                    }
                }
            );
        },
        search() {
            // Search list based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllLists(this.currentPage);
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchList,
                    'variables': {
                        'keyword': this.keyword
                    }
                };
                let headers = {};
                if (this.$session.exists()) {
                    headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.lists = response.data.data.searchList.sysLists;
                            this.nbLists = this.lists.length;

                            // Set current page to first page
                            this.currentPage = {
                                'pageNum': 1,
                                'offset': 0,
                                'nbItems': 10,
                                'isActive': true
                            }
                        }
                    }
                );
            }
        }
    },
    created: function () {
        this.getAllLists(this.currentPage);
    }
}
</script>