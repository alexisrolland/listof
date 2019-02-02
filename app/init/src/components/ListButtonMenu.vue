<template>
    <div>
        <button type="button" class="btn btn-success" v-on:click="saveList()">
            Save
        </button>

        <router-link v-if="list.id" v-bind:to="list.id + '/attributes/new'">
            <button type="button" class="btn btn-secondary">
                Add Attribute
            </button>
        </router-link>

        <router-link v-if="list.id" v-bind:to="list.id + '/values'">
            <button type="button" class="btn btn-secondary">
                Edit Values
            </button>
        </router-link>

        <router-link to="/">
            <button type="button" class="btn btn-outline-secondary">
                Close
            </button>
        </router-link>

        <router-link v-if="list.id" to="/">
            <button type="button" class="btn btn-danger float-right" v-on:click="deleteList()">
                Delete
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        list: Object
    },
    data: function () {
        return {
            'mutationCreateList': this.$store.state.mutationCreateList,
            'mutationUpdateList': this.$store.state.mutationUpdateList,
            'mutationDeleteList': this.$store.state.mutationDeleteList,
        }
    },
    methods: {
        saveList() {
            // Method to create or update a list
            if (this.list.id) {
                // Update an existing list
                var payload = {
                    'query': this.mutationUpdateList,
                    'variables': { 
                        'id': this.list.id,
                        'sysListPatch': {
                            "name": this.list.name,
                            "description": this.list.description,
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        }
                    }
                );
            }
            else {
                // Create a new list
                var payload = {
                    'query': this.mutationCreateList,
                    'variables': {
                        'sysList': {
                            'name': this.list.name,
                            'description': this.list.description
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new list Id in case user wants to delete or update it
                            this.list.id = response.data.data.createSysList.sysList.id;
                            this.$router.push({ name: 'lists', params: { listId: this.list.id } });
                        }
                    }
                );
            }
        },
        deleteList() {
            // Method to delete a list
            if (this.list.id) {
                var payload = {
                    'query': this.mutationDeleteList,
                    'variables': { 
                        'id': this.list.id
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        }
                    }
                );
            }
        }
    }
}
</script>

