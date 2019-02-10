<template>
    <button type="button" class="btn btn-secondary" v-on:click="viewValue">
        View Values
    </button>
</template>

<script>
export default {
    props: {
        listId: Number
    },
    methods: {
        viewValue() {
            this.$router.push({
                name: 'view-list-value',
                params: {
                    listId: this.listId
                }
            });
        }
   }
}
</script>