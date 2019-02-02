<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <div>{{ list.description }}</div>

        <value-button-menu></value-button-menu>
        <value-table></value-table>
    </div>
</template>

<script>
import ValueButtonMenu from './ValueButtonMenu.vue';
import ValueTable from './ValueTable.vue';

export default {
    components: {
        'value-button-menu': ValueButtonMenu,
        'value-table': ValueTable
    },
    data: function () {
        return {
            'list': {},
            'attributes': [],
            'queryGetList': this.$store.state.queryGetList,
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
            'query': this.queryGetList,
            'variables': { 'id': this.listId }
        };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.list = response.data.data.sysListById;
                    this.attributes = this.list.sysAttributesByListId.nodes;
                }
            }
        );
    }
}
</script>
