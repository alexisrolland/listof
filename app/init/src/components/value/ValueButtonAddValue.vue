<template>
    <!-- Use router-link rather than v-on:click to allow user to open page in new window -->
    <router-link v-bind:to="'/lists/' + listId + '/values/new'">
        <button type="button" class="btn btn-secondary">
            Add Value
        </button>
    </router-link>
</template>

<script>
export default {
    props: {
        listId: Number
    }
}
</script>