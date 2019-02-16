<template>
    <!-- Use router-link rather than v-on:click to allow user to open page in new window -->
    <router-link v-bind:to="'usergroups/new'">
        <button type="button" class="btn btn-success">
            Create User Group
        </button>
    </router-link>
</template>