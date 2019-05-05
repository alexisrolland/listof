<template>
    <div>
        <!-- Label -->
        <label class="col-form-label" for="defaultValue">
            Default Value:
        </label>

        <!-- Select input, used for attributes which are linked to another list -->
        <treeselect
            v-bind:placeholder="'Select value from ' + linkedList.sysListByListId.name"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="false"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"/>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    mixins: [Mixins],
    components: {
        'treeselect': Treeselect
    },
    props: {
        linkedAttributeId: Number,
        value: Number
    },
    data() {
        return {
            'linkedList': '',
            'selectedValue': this.value,
            'options': []
        }
    },
    computed: {
        isReadOnly(){
            let roles = ['admin', 'advanced']
            return !roles.includes(this.$store.state.currentUser.role)
        }
    },
    watch: {
        selectedValue(val) {
            if (val) {
                this.$emit('setDefaultValue', String(val));
            } else {
                this.$emit('setDefaultValue', null);
            }
        }
    },
    created: function () {
        // Get linked list and attribute
        let payload = {
            'query': this.$store.state.queryGetLinkedList,
            'variables': {
                'id': this.linkedAttributeId
            }
        };
        let headers = {};
        if (this.$session.exists()) {
            headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
        };
        this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
            function(response){
                if(response.data.errors){
                    this.displayError(response);
                } else {
                    this.linkedList = response.data.data.sysAttributeById;

                    // Compute GraphQL names for the list and attributes
                    let graphQlListName = this.getGraphQlName(this.linkedList.sysListByListId.tableName, 'plural', true);  // Example table_name > TableNames
                    let graphQlAttributeName = this.getGraphQlName(this.linkedList.columnName) // Example colum_name > columnName

                    // Build GraphQL query
                    let graphQlQuery = this.$store.state.queryGetLinkedListValues.replace(/<GraphQlListName>/g, graphQlListName);
                    graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQlAttributeName);

                    let payload = { 'query': graphQlQuery };
                    let headers = {};
                    if (this.$session.exists()) {
                        headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                    };
                    this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                        function(response){
                            if(response.data.errors){
                                this.displayError(response);
                            } else {
                                this.options = response.data.data['all' + graphQlListName].nodes;
                            }
                        },
                        // Error callback
                        function(response){
                            this.displayError(response);
                        }
                    );
                }
            },
            // Error callback
            function(response){
                this.displayError(response);
            }
        );
    }
}
</script>

<style>
.vue-treeselect {
    color:#666666;
}
</style>
