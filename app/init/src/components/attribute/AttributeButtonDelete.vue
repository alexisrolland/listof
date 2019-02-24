<template>
    <button type="button" class="btn btn-danger float-right" v-on:click="deleteAttribute">
        Delete
    </button>
</template>

<script>
export default {
    props: {
        listId: Number,
        attributeId: Number
    },
    methods: {
        deleteAttribute() {
            // Method to delete an attribute
            let payload = {
                'query': this.$store.state.mutationDeleteAttribute,
                'variables': { 
                    'id': this.attributeId
                }
            };
            let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.$router.push({
                            name: 'edit-list',
                            params: {
                                listId: this.listId
                            }
                        });
                    }
                }
            );
        }
    }
}
</script>