<template>
    <div class="col-8">
        <h1 class="mt-5">Admin</h1>

        <!-- Button Menu -->
        <div>
            <admin-button-user></admin-button-user>
            <admin-button-user-group></admin-button-user-group>
        </div>

        <h2 class="mt-5">Create User</h2>
        <h2 class="mt-5">Users</h2>
    </div>
</template>

<script>
import AdminButtonUser from './admin/AdminButtonUser.vue';
import AdminButtonUserGroup from './admin/AdminButtonUserGroup.vue';

export default {
    components: {
        'admin-button-user': AdminButtonUser,
        'admin-button-user-group': AdminButtonUserGroup
    }
}
</script>

