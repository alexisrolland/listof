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
    </div>
</template>

<script>
import UserGroupTable from './UserGroupTable.vue';

export default {
    components: {
        'user-group-table': UserGroupTable
    },
    data: function () {
        return {
            'keyword': null,
            'userGroups': []
        }
    },
    methods: {
        getAllUserGroups() {
            let payload = { 'query': this.$store.state.queryGetAllUserGroups };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.userGroups = response.data.data.allSysUserGroups.nodes;
                    }
                }
            );
        },
        search() {
            // Search user groups based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllUserGroups();
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchUserGroup,
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
                            this.userGroups = response.data.data.searchUserGroup.sysUserGroups;
                        }
                    }
                );
            }
        }
    },
    created: function () {
        this.getAllUserGroups();
    }
}
</script>