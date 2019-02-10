<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>{{ list.description }}</p>

         <!-- Button Menu -->
        <div>
            <value-button-add-value
                v-bind:listId="list.id">
            </value-button-add-value>
        </div>

        <!-- List of Values -->
        <value-table v-if="list.id" v-bind:list="list"></value-table>
    </div>
</template>

<script>
import ValueButtonAddValue from './ValueButtonAddValue.vue';
import ValueTable from './ValueTable.vue';

export default {
    components: {
        'value-button-add-value': ValueButtonAddValue,
        'value-table': ValueTable
    },
    data: function () {
        return {
            'list': {}
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        }
    },
    created: function () {
        // Get list details
        let payload = {
            'query': this.$store.state.queryGetList,
            'variables': { 'id': this.listId }
        };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.list = response.data.data.sysListById;
                }
            }
        );
    }
}
</script>