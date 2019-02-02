// Method used to get GraphQL query to fetch all values from a list
function getQueryGetAllValues(list) {
    var inflection = require('inflection');
    var queryGetAllValues = this.$store.state.queryGetList,

    // Get list name in GraphQL format
    var graphQlListName = inflection.transform(list.tableName, ['camelize', 'pluralize']);

    // Get list attributes names in GraphQL format
    var i;
    var attributes = list.sysAttributesByListId.nodes;
    var graphQlAttributeName = '';
    for (i = 0; i < attributes.length; i++) {
        graphQlAttributeName = inflection.camelize(attributes[i].columnName, true) + ' ' + graphQlAttributeName;
    }

    // Replace query template
    queryGetAllValues = queryGetAllValues.replace('<GraphQlListName>', graphQlListName);
    queryGetAllValues = queryGetAllValues.replace('<graphQlAttributeName>', graphQlAttributeName);
    return queryGetAllValues;
}

export default getQueryGetAllValues;