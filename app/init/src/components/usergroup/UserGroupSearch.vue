<template>
    <div class="mt-5">
        <!-- Search bar -->
        <input class="form-control form-control-lg mb-5"
            type="search"
            aria-label="Search"
            placeholder="Search user groups"
            v-model="keyword"
            v-on:keyup.enter="search">

        <!-- User group table -->
        <user-group-table v-bind:userGroups="userGroups"></user-group-table>

        <!-- User group pagination -->
        <user-group-pagination
            v-bind:totalCount="nbUserGroups"
            v-bind:currentPage="currentPage"
            v-on:goToPage="getAllUserGroups"
        ></user-group-pagination>
    </div>
</template>

<script>
import UserGroupTable from './UserGroupTable.vue';
import Pagination from '../utils/Pagination.vue';

export default {
    components: {
        'user-group-table': UserGroupTable,
        'user-group-pagination': Pagination
    },
    data: function () {
        return {
            'keyword': null,
            'userGroups': [],
            'nbUserGroups': null,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            }
        }
    },
    methods: {
        getAllUserGroups(page) {
            let payload = {
                'query': this.$store.state.queryGetAllUserGroups,
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
                        this.userGroups = response.data.data.allSysUserGroups.nodes;
                        this.nbUserGroups = response.data.data.allSysUserGroups.totalCount;

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
            // Search user groups based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllUserGroups(this.currentPage);
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchUserGroup,
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
                            this.userGroups = response.data.data.searchUserGroup.sysUserGroups;
                            this.nbUserGroups = this.userGroups.length;

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
        this.getAllUserGroups(this.currentPage);
    }
}
</script>