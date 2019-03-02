<template>
    <button v-if="show" type="button" class="btn btn-success" v-on:click="addUserGroup">
        Add User to Groups
    </button>
</template>

<script>
export default {
    props: {
        user: Object,
        userGroups: Array
    },
    methods: {
        addUserGroup() {
            // Method to create a relationship between a user and a user group
            // Get list of current user groups
            let currentUserGroups = []
            for (let i = 0; i < this.user.sysUserGroupUsersByUserId.nodes.length; i++) {
                currentUserGroups.push(this.user.sysUserGroupUsersByUserId.nodes[i]['userGroupId']);
            }
            
            // For selected list of user groups
            // If current user group does not contain the new group, add user to it
            for (let i = 0; i < this.userGroups.length; i++) {
                if (currentUserGroups.includes(this.userGroups[i]) == false) {
                    // Method to insert a relationship between a user and a user group
                    let payload = {
                        'query': this.$store.state.mutationCreateUserGroupUser,
                        'variables': {
                                'sysUserGroupUser': {
                                    'userId': this.user.id,
                                    'userGroupId': this.userGroups[i]
                                }
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
                                let userGroupUser = response.data.data.createSysUserGroupUser.sysUserGroupUser;
                                this.$emit("addUserGroupUser", userGroupUser);
                            }
                        }
                    );
                }
            }
        }
    },
    computed: {
        show(){
            let roles = ['admin']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>