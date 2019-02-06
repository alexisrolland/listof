<template>
    <div>
        <router-link v-bind:to="'/lists/' + listId + '/values/new'">
            <button type="button" class="btn btn-secondary">
                Add Value
            </button>
        </router-link>

        <router-link v-if="!valueId" v-bind:to="'/'">
            <button type="button" class="btn btn-outline-secondary">
                Close
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        },
        valueId() {
            return this.$route.params.valueId;
        },
    }
}
</script>