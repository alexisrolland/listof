<template>
    <button type="button" class="btn btn-danger float-right" v-on:click="deleteList">
        Delete
    </button>
</template>

<script>
export default {
    props: {
        listId: Number
    },
    methods: {
        deleteList() {
            // Method to delete a list
            let payload = {
                'query': this.$store.state.mutationDeleteList,
                'variables': { 
                    'id': this.listId
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
                            name: 'view-list'
                        });
                    }
                }
            );
        }
    }
}
</script>