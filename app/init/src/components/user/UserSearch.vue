<template>
    <div class="mt-5">
        <!-- Search bar -->
        <input class="form-control form-control-lg mb-5"
            type="search"
            aria-label="Search"
            placeholder="Search users"
            v-model="keyword"
            v-on:keyup.enter="search">

        <!-- User table -->
        <user-table v-bind:users="users"></user-table>
    </div>
</template>

<script>
import UserTable from './UserTable.vue';

export default {
    components: {
        'user-table': UserTable
    },
    data: function () {
        return {
            'keyword': null,
            'users': []
        }
    },
    methods: {
        getAllUsers() {
            let payload = { 'query': this.$store.state.queryGetAllUsers };
            let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.users = response.data.data.allSysUsers.nodes;
                    }
                }
            );
        },
        search() {
            // Search users based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllUsers();
            } else {
                let payload = {
                    'query': this.$store.state.mutationSearchUser,
                    'variables': {
                        'keyword': this.keyword
                    }
                };
                let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.users = response.data.data.searchUser.sysUsers;
                        }
                    }
                );
            }
        }
    },
    created: function () {
        this.getAllUsers();
    }
}
</script>