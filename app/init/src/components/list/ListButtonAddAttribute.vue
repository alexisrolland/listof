<template>
    <button type="button" class="btn btn-secondary" v-on:click="addAttribute">
        Add Attribute
    </button>
</template>

<script>
export default {
    props: {
        listId: Number
    },
    methods: {
        addAttribute() {
            this.$router.push({
                name: 'edit-list-attribute',
                params: {
                    listId: this.listId,
                    attributeId: 'new'
                }
            });
        }
   }
}
</script>