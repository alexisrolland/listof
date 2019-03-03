<template>
    <div v-if="show" class="dropdown">
        User Group: 
        <button class="btn btn-secondary dropdown-toggle ml-1"
            id="selectedUserGroup"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            {{selectedUserGroup.name}}
        </button>
        <div class="dropdown-menu dropdown-menu-lg-right" aria-labelledby="selectedUserGroup">
            <a class="dropdown-item"
                v-for="userGroup in userGroups"
                v-bind:key="userGroup.name"
                v-on:click="selectUserGroup(userGroup)">
                    {{userGroup.name}}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            'selectedUserGroup': this.$store.state.currentUser.selectedUserGroup,
            'userGroups': this.$store.state.currentUser.userGroups
        }
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        }
    },
    methods: {
        selectUserGroup(userGroup){
            this.$store.state.currentUser.selectedUserGroup = userGroup;
            this.selectedUserGroup = userGroup;
        }
    }
}
</script>
