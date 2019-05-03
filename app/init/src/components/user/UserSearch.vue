<template>
    <div class="mt-5">
        <!-- Search bar -->
        <input class="form-control form-control-lg mb-4"
            type="search"
            aria-label="Search"
            placeholder="Search users"
            v-model="keyword"
            v-on:keyup.enter="search">

        <!-- User table -->
        <user-table v-bind:users="users"></user-table>

        <!-- User pagination -->
        <user-pagination
            v-bind:totalCount="nbUsers"
            v-bind:currentPage="currentPage"
            v-on:goToPage="getAllUsers"
        ></user-pagination>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';
import Pagination from '../utils/Pagination.vue';
import UserTable from './UserTable.vue';

export default {
    mixins: [Mixins],
    components: {
        'user-table': UserTable,
        'user-pagination': Pagination
    },
    data: function () {
        return {
            'keyword': null,
            'users': [],
            'nbUsers': null,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            }
        }
    },
    methods: {
        getAllUsers(page) {
            let payload = {
                'query': this.$store.state.queryGetAllUsers,
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
                        this.displayError(response);
                    } else {
                        this.users = response.data.data.allSysUsers.nodes;
                        this.nbUsers = response.data.data.allSysUsers.totalCount;

                        // Set current page
                        this.currentPage = {
                            'pageNum': page.pageNum,
                            'offset': page.offset,
                            'nbItems': page.nbItems,
                            'isActive': page.isActive
                        }
                    }
                },
                // Error callback
                function(response){
                    this.displayError(response);
                }
            );
        },
        search() {
            // Search users based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllUsers(this.currentPage);
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchUser,
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
                            this.displayError(response);
                        } else {
                            this.users = response.data.data.searchUser.sysUsers;
                            this.nbUsers = this.users.length;

                            // Set current page to first page
                            this.currentPage = {
                                'pageNum': 1,
                                'offset': 0,
                                'nbItems': 10,
                                'isActive': true
                            }
                        }
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
                    }
                );
            }
        }
    },
    created: function () {
        this.getAllUsers(this.currentPage);
    }
}
</script>