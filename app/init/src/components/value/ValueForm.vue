<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>{{ list.description }}</p>

        <h1 class="mt-5">Edit Value</h1>

        <div v-for="attribute in attributes" v-bind:key="attribute.id" class="form-group">
            <label v-bind:for="attribute.id" class="col-form-label">
                {{ attribute.name }}:
            </label>
            <input
                v-bind:id="attribute.id"
                type="text"
                required="true"
                class="form-control col-sm"
                placeholder="Attribute name"
                v-model="value[attribute.graphQlAttributeName]" />
        </div>

        <value-form-button-menu v-bind:graphQlListName="graphQlListName" v-bind:value="value"></value-form-button-menu>
    </div>
</template>

<script>
import ValueFormButtonMenu from './ValueFormButtonMenu.vue';

export default {
    components: {
        'value-form-button-menu': ValueFormButtonMenu
    },
    data: function () {
        return {
            'list': {},
            'value': {}
        }
    },
    computed: {
        listId() {
            var listId = parseInt(this.$route.params.listId);
            if (isNaN(listId)) { return null; }
            else { return listId; }
        },
        valueId() {
            var valueId = parseInt(this.$route.params.valueId);
            if (isNaN(valueId)) { return null; }
            else { return valueId; }
        },
        attributes() {
            // Extract attributes and compute GraphQL column names
            if (this.list.sysAttributesByListId) {
                var inflection = require('inflection');
                var attributes = this.list.sysAttributesByListId.nodes;
                var i;
                for (i = 0; i < attributes.length; i++) {
                    attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true);
                }
                return attributes;
            }
        },
        graphQlListName() {
            // Compute GraphQL table name
            if (this.list.tableName) {
                var inflection = require('inflection');
                var graphQlListName = inflection.singularize(this.list.tableName);
                graphQlListName = inflection.camelize(graphQlListName, true);
                return graphQlListName;
            }
        },
        queryGetValue() {
            // Compute GraphQL query
            if (this.graphQlListName && this.attributes) {
                var attributeName = '';
                var i;
                for (i = 0; i < this.attributes.length; i++) {
                    attributeName = this.attributes[i].graphQlAttributeName + ' ' + attributeName;
                }

                var graphQlQuery = this.$store.state.queryGetValue.replace('<graphQlListName>', this.graphQlListName);
                graphQlQuery = graphQlQuery.replace('<graphQlAttributeName>', attributeName);
                return graphQlQuery;
            }
        }
    },
    watch: {
        // Execute query to get all values
        queryGetValue: function() {
            if (this.valueId && this.queryGetValue) {
                var payload = {
                    'query': this.queryGetValue,
                    'variables': { 'id': this.valueId }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.value = response.data.data[this.graphQlListName + 'ById'];
                        }
                    }
                );
            }
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