<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>{{ list.description }}</p>

        <value-list-button-menu></value-list-button-menu>
        <value-table v-bind:list="list"></value-table>
    </div>
</template>

<script>
import ValueListButtonMenu from './ValueListButtonMenu.vue';
import ValueTable from './ValueTable.vue';

export default {
    components: {
        'value-list-button-menu': ValueListButtonMenu,
        'value-table': ValueTable
    },
    data: function () {
        return {
            'list': {},
            'values': []
        }
    },
    computed: {
        listId() {
            var listId = parseInt(this.$route.params.listId);
            if (isNaN(listId)) { return null; }
            else { return listId; }
        }
    },
    created: function () {
        var payload = {
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