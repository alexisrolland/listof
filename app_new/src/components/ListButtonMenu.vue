<template>
    <div>
        <button type="button" class="btn btn-success" v-on:click="saveList()">
            Save
        </button>

        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#attributeModal">
            Add Attribute
        </button>

        <router-link to="'/lists/' + list.id + '/values'">
            <button type="button" class="btn btn-secondary">
                Edit Values
            </button>
        </router-link>

        <button type="button" class="btn btn-danger float-right" v-on:click="deleteList(list.id)">
            Delete
        </button>

        <router-link to="/">
            <button type="button" class="btn btn-outline-secondary">
                Close
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
            if (list.id) {
                // Update an existing list
                payload = {
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
                        } else {
                            this.list = response.data.data.updateSysListById.sysList;
                        }
                    }
                );
            }
            else {
                // Create a new list
                payload = {
                    'query': this.mutationCreateList,
                    'variables': {
                        'sysList': {
                            'name': this.list.name,
                            'description': this.list.description
                        }
                    }
                };
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.list = response.data.data.updateSysListById.sysList;
                        }
                    }
                );
            }
        }
    }
}
</script>
