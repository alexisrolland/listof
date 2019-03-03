<template>
    <div class="col-8">
        <h1 class="mt-5">Login</h1>

        <!-- User Form -->
        <div class="form-group w-25">
            <label for="userEmail" class="col-form-label">
                E-mail:
            </label>
            <input class="form-control col-sm"
                id="userEmail"
                type="email"
                required="required"
                placeholder="Type user e-mail"
                v-model="credentials.email" />
        </div>
        <div class="form-group w-25">
            <label for="userPassword" class="col-form-label">
                Password:
            </label>
            <input class="form-control col-sm"
                id="userPassword"
                type="password"
                required="true"
                placeholder="Type user password"
                v-model="credentials.password" />
        </div>
        <button type="button" class="btn btn-success" v-on:click="authenticateUser">
            Login
        </button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            'credentials': {}
        }
    },
    methods: {
        authenticateUser() {
            // Method to authenticate a user and get a token
            let payload = {
                'query': this.$store.state.mutationAuthenticateUser,
                'variables': { 
                    'userEmail': this.credentials.email,
                    'userPassword': this.credentials.password
                }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        let token = response.data.data.authenticateUser.sysToken
                        if (token) {
                            // Set session token
                            this.$session.set('jwt', token);
                            this.$store.state.currentUser.isAuthenticated = true;
                            this.$router.push({
                                name: 'home'
                            });
                            this.getCurrentUser();
                        } else {
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = 'Authentication failed. Login or password incorrect or user account has been inactivated.';
                        }
                    }
                }
            )
        },
        getCurrentUser() {
            // Method to get authenticated user information
            let payload = {
                'query': this.$store.state.queryGetCurrentUser,
                'variables': { 'email': this.credentials.email }
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
                        // Set current user
                        this.$session.set('email', response.data.data.sysUserByEmail.email);
                        this.$store.state.currentUser.email = response.data.data.sysUserByEmail.email;

                        // Set current user role
                        this.$session.set('role', response.data.data.sysUserByEmail.role);
                        this.$store.state.currentUser.role = response.data.data.sysUserByEmail.role;

                        // Prepare list of current user groups
                        let rawUserGroups = response.data.data.sysUserByEmail.sysUserGroupUsersByUserId.nodes;
                        let currentUserGroups = [];
                        for (let i = 0; i < rawUserGroups.length; i++) {
                            currentUserGroups.push(rawUserGroups[i]['sysUserGroupByUserGroupId'])
                        }

                        // Set current user groups
                        this.$session.set('userGroups', currentUserGroups);
                        this.$store.state.currentUser.userGroups = currentUserGroups;

                        // Select first user group as context
                        this.$session.set('selectedUserGroup', currentUserGroups[0]);
                        this.$store.state.currentUser.selectedUserGroup = currentUserGroups[0];
                    }
                }
            )
        }
    }
}
</script>

