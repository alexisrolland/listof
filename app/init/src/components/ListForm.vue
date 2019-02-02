<template>
    <div>
        <h1 class="mt-5">Edit list</h1>

        <div class="form-group">
            <label for="listName" class="col-form-label">
                Name:
            </label>
            <input
                id="listName"
                type="text"
                required="true"
                class="form-control col-sm"
                placeholder="List name"
                v-model="list.name" />
        </div>

        <div class="form-group">
            <label for="listDescription" class="col-form-label">
                Description:
            </label>
            <textarea
                id="listDescription"
                required="true"
                class="form-control col-sm"
                placeholder="List description"
                rows="3"
                v-model="list.description" />
        </div>

        <list-form-button-menu v-bind:list="list"></list-form-button-menu>
        <attribute-table v-if="listId" v-bind:attributes="attributes"></attribute-table>
    </div>
</template>

<script>
import ListFormButtonMenu from './ListFormButtonMenu.vue';
import AttributeTable from './AttributeTable.vue';

export default {
    components: {
        'list-form-button-menu': ListFormButtonMenu,
        'attribute-table': AttributeTable
    },
    data: function () {
        return {
            'list': {},
        }
    },
    computed: {
        listId() {
            var listId = parseInt(this.$route.params.listId);
            if (isNaN(listId)) { return null; }
            else { return listId; }
        },
        attributes() {
            if (this.list.sysAttributesByListId) {
                return this.list.sysAttributesByListId.nodes;
            }
        }
    },
    created: function () {
        // Get list Id from URL parameters, verify if it's valid integer
        // If list Id is not NaN then get corresponding list
        if (this.listId) {
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
        };
    }
}
</script>