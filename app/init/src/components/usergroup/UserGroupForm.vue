<template>
    <div>
        <h1 class="mt-5">Edit User Group</h1>

        <!-- User Form -->
        <div class="form-group required">
            <label for="userGroupName" class="col-form-label">
                Name:
            </label>
            <input class="form-control col-sm"
                id="userGroupName"
                type="text"
                required="required"
                placeholder="Type user group name"
                v-model="userGroup.name" />
        </div>

        <!-- Button Menu -->
        <div>
            <user-group-button-save
                v-bind:userGroup="userGroup">
            </user-group-button-save>

            <user-group-button-close>
            </user-group-button-close>
        </div>
    </div>
</template>

<script>
import UserGroupButtonSave from './UserGroupButtonSave.vue';
import UserGroupButtonClose from './UserGroupButtonClose.vue';

export default {
    components: {
        'user-group-button-save': UserGroupButtonSave,
        'user-group-button-close': UserGroupButtonClose
    },
    data: function () {
        return {
            'userGroup': {}
        }
    },
    computed: {
        userGroupId() {
            return this.$route.params.userGroupId;
        }
    },
    created: function () {
        // If userGroupId != new then get data for existing user group
        if (this.userGroupId != 'new') {
            let payload = {
                'query': this.$store.state.queryGetUserGroup,
                'variables': {
                    'id': this.userGroupId
                }
            };
            let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.userGroup = response.data.data.sysUserGroupById;
                    }
                }
            );
        };
    }
}
</script>