<template>
    <button type="button" class="btn btn-success" v-on:click="saveUser">
        Save
    </button>
</template>

<script>
export default {
    props: {
        user: Object,
        userGroups: Array,
        previousUserGroups: Array
    },
    methods: {
        saveUser() {
            // Method to create or update a user
            // If user.id exists, update existing user
            if (this.user.id) {
                let payload = {
                    'query': this.$store.state.mutationUpdateUser,
                    'variables': { 
                        'id': this.user.id,
                        'sysUserPatch': {
                            "email": this.user.email,
                            "role": this.user.role,
                            "flagActive": this.user.flagActive
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Update user group user relationships
                            // Delete relationships which have been removed
                            let relationships = this.user.sysUserGroupUsersByUserId.nodes;
                            for (let i = 0; i < relationships.length; i++) {
                                if (this.userGroups.includes(relationships[i]['userGroupId']) == false) {
                                    this.deleteUserGroupUser(relationships[i]['id']);
                                }
                            }

                            // Insert relationships which have been added
                            for (let i = 0; i < this.userGroups.length; i++) {
                                if (this.previousUserGroups.includes(this.userGroups[i]) == false) {
                                    this.insertUserGroupUser(this.user.id, this.userGroups[i]);
                                }
                            }
                            this.$emit("changeUserGroups", this.userGroups);
                        }
                    }
                );
            }
            // If user.id does not exist, create a new user
            else {
                let payload = {
                    'query': this.$store.state.mutationCreateUser,
                    'variables': {
                        'sysUser': {
                            'email': this.user.email,
                            'password': this.user.password,
                            'role': this.user.role,
                            'flagActive': this.user.flagActive
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new list Id in case user wants to delete or update it
                            this.user.id = response.data.data.createSysUser.sysUser.id;

                            // Update user group user relationships
                            // Insert relationships which have been added
                            for (let i = 0; i < this.userGroups.length; i++) {
                                this.insertUserGroupUser(this.user.id, this.userGroups[i]);
                            }

                            this.$router.push({
                                name: 'edit-user',
                                params: {
                                    userId: this.user.id
                                }
                            });
                        }
                    }
                );
            }
        },
        deleteUserGroupUser(id) {
            // Method to delete a relationship between a user and a user group
            let payload = {
                'query': this.$store.state.mutationDeleteUserGroupUser,
                'variables': { 
                    'id': id
                }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        console.log('relationship deleted: ' + id);
                    }
                }
            );
        },
        insertUserGroupUser(userId, userGroupId) {
            // Method to insert a relationship between a user and a user group
            let payload = {
                'query': this.$store.state.mutationCreateUserGroupUser,
                'variables': {
                        'sysUserGroupUser': {
                            'userId': userId,
                            'userGroupId': userGroupId
                        }
                    }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        console.log('relationship created');
                    }
                }
            );
        }
    }
}
</script>