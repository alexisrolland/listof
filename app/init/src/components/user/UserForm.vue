<template>
    <div>
        <h1 class="mt-5">Edit User</h1>

        <!-- User Form -->
        <div class="form-group required">
            <label for="userEmail" class="col-form-label">
                E-mail:
            </label>
            <input class="form-control col-sm"
                id="userEmail"
                type="email"
                required="required"
                placeholder="Type user e-mail"
                v-model="user.email" />
        </div>
        <div v-if="userId=='new'" class="form-group required">
            <label for="userPassword" class="col-form-label">
                Password:
            </label>
            <input class="form-control col-sm"
                id="userPassword"
                type="password"
                required="true"
                placeholder="Type user password"
                v-model="user.password" />
        </div>
        <div class="form-group required">
            <label for="userRole" class="col-form-label">
                Role:
            </label>
            <select class="form-control"
                id="userRole"
                required="true"
                v-model="user.role">
                    <option disabled value="">Select user role</option>
                    <option value="standard">standard</option>
                    <option value="advanced">advanced</option>
                    <option value="admin">admin</option>
            </select>
        </div>
        <div class="custom-control custom-switch mr-4 mt-1 mb-2">
            <input class="custom-control-input"
                id="active"
                type="checkbox"
                value=""
                v-model="user.flagActive"/>
            <label for="active" class="custom-control-label">
                Active
            </label>
        </div>

        <div class="form-group required">
            <user-user-group
                v-bind:value="userGroups"
                v-on:changeUserGroups="getUserGroups">
            </user-user-group>
        </div>

        <!-- Button Menu -->
        <div>
            <user-button-save
                v-bind:user="user"
                v-bind:userGroups="userGroups"
                v-bind:previousUserGroups="previousUserGroups"
                v-on:changeUserGroups="updatePreviousUserGroups">
            </user-button-save>

            <user-button-close>
            </user-button-close>
        </div>
    </div>
</template>

<script>
import UserButtonSave from './UserButtonSave.vue';
import UserButtonClose from './UserButtonClose.vue';
import UserUserGroup from './UserUserGroup.vue';

export default {
    components: {
        'user-button-save': UserButtonSave,
        'user-button-close': UserButtonClose,
        'user-user-group': UserUserGroup
    },
    data: function () {
        return {
            'user': { 'flagActive': true },
            'userGroups': [],
            'previousUserGroups': []
        }
    },
    computed: {
        userId() {
            return this.$route.params.userId;
        }
    },
    methods: {
        getUserGroups(value) {
            // Get user groups from child component
            if (value != null) {
                this.userGroups = value;
            } else {
                this.userGroups = null;
            }
        },
        updatePreviousUserGroups(value) {
            this.previousUserGroups = value;
        }
    },
    created: function () {
        // If userId != new then get data for existing user
        if (this.userId != 'new') {
            let payload = {
                'query': this.$store.state.queryGetUser,
                'variables': {
                    'id': this.userId
                }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.user = response.data.data.sysUserById;
                        
                        // Build user group list
                        let userGroups = this.user.sysUserGroupUsersByUserId.nodes;
                        for (let i = 0; i < userGroups.length; i++) {
                            this.previousUserGroups.push(userGroups[i]['userGroupId']);
                        }
                        this.userGroups = this.previousUserGroups;
                    }
                }
            );
        };
    }
}
</script>