<template>
    <div>
        <!-- Label -->
        <label class="col-form-label" v-bind:for="attribute.id">
            {{ attribute.name }}:
        </label>

        <!-- Select input, used for attributes which are linked to another list -->
        <treeselect
            v-bind:placeholder="'Select value from ' + attribute.sysAttributeByLinkedAttributeId.sysListByListId.name"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="false" />

        <!-- Description -->
        <small class="form-text text-muted" v-bind:id="attribute.id">
            {{ attribute.description }}
        </small>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    components: {
        'treeselect': Treeselect
    },
    props: {
        attribute: Object,
        value: Number
    },
    data() {
        return {
            'selectedValue': this.value,
            'options': []
        }
    },
    watch: {
        value(val) {
            this.selectedValue = val;
        },
        selectedValue(val) {
            let attributeValue = {
                'attribute': this.attribute.graphQlAttributeName,
                'value': this.selectedValue
            }
            this.$emit('changeAttributeValue', attributeValue);
        }
    },
    created: function () {
        // Compute GraphQL names for the list and attributes
        let inflection = require('inflection');

        // GraphQL list name
        let graphQlListName = inflection.pluralize(this.attribute.sysAttributeByLinkedAttributeId.sysListByListId.tableName); // Example table_name > table_names
        graphQlListName = inflection.camelize(graphQlListName); // Example table_names > TableNames

        // GraphQL attributes name
        let graphQlAttributeName = inflection.camelize(this.attribute.sysAttributeByLinkedAttributeId.columnName, true); // Example colum_name > columnName

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
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.options = response.data.data['all' + graphQlListName].nodes;
                }
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
