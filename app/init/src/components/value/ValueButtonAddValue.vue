<template>
    <button type="button" class="btn btn-secondary" v-on:click="addValue">
        Add Value
    </button>
</template>

<script>
export default {
    props: {
        listId: Number
    },
    methods: {
        addValue() {
            this.$router.push({
                name: 'edit-list-value',
                params: {
                    listId: this.listId,
                    valueId: 'new'
                }
            });
        }
   }
}
</script>