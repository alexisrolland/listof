<template>
    <div>
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
        <list-button-menu v-bind:list="list" v-on:display-error="display()"></list-button-menu>
    </div>
</template>

<script>
import ListButtonMenu from './ListButtonMenu.vue';

export default {
    components: {
        'list-button-menu': ListButtonMenu
    },
    data: function () {
        return {
            'list': {},
            'attributes': [],
            'dataTypes': [],
            'linkedLists': [],
            'queryGetAllDataTypes': this.$store.state.queryGetAllDataTypes,
            'queryGetAllLists': this.$store.state.queryGetAllLists,
            'queryGetList': this.$store.state.queryGetList,
        }
    },
    created: function () {
        // Get list Id from URL parameters, verify if it's valid integer
        // If list Id is not NaN then get corresponding list
        var listId = parseInt(this.$route.params.listId);
        if (!isNaN(listId)) {
            payload = {
                'query': this.queryGetList,
                'variables': { 'id': listId }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        this.list = response.data.data.sysListById;
                        this.attributes = this.list.sysAttributesByListId.nodes;
                    }
                }
            );
        };

        // Get data types to populate dropdown box
        var payload = { 'query': this.queryGetAllDataTypes };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.status == "200"){
                    this.$store.state.dataTypes = response.data.data.allSysDataTypes.nodes;
                }
            }
        );

        // Get all linked lists to populate dropdown box
        var payload = { 'query': this.queryGetAllLists };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.status == "200"){
                    this.$store.state.lists = response.data.data.allSysLists.nodes;
                }
            }
        );
    },
    methods: {
        display() {
            //this.cssClass = 'show';
            //this.errorMessage='Goodbye';
            alert('hello');
        }
    }
}
</script>
