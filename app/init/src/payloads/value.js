// Generic query used as template to fetch all values from a list
export const queryGetAllValues = `query getAllValues($first: Int $offset: Int){
    all<GraphQlListName>(first: $first offset: $offset) {
        nodes {
            id
            createdDate
            updatedDate
            <graphQlAttributeName>
        }
        totalCount
    }
}`;

// Generic query used as template to fetch one value from a list
export const queryGetValue = `query getValue($id: Int!) {
    <graphQlListName>ById(id: $id) {
        id
        createdDate
        updatedDate
        sysUserByCreatedById { email }
        sysUserByUpdatedById { email }
        <graphQlAttributeName>
    }
}`;

// Data for linked list & attributes drodpdown in value form
// Response labels must be formatted according to Treeselect requirements
export const queryGetLinkedListValues = `query getAllValues {
    all<GraphQlListName> {
        nodes {
            id
            label:<graphQlAttributeName>
        }
    }
}`;

// Generic query used as template to download all values from a list (no pagination is applied)
export const queryDownloadAllValues = `query downloadAllValues{
    all<GraphQlListName>{
        nodes {
            id
            createdDate
            updatedDate
            <graphQlAttributeName>
        }
        totalCount
    }
}`;

// Generic mutation used as template to create a new value in a list
export const mutationCreateValue = `mutation createValue($<graphQlListName>: <GraphQlListName>Input!) {
    create<GraphQlListName>(input: {<graphQlListName>: $<graphQlListName>}) {
        <graphQlListName> {
            id
        }
    }
}`;

// Generic mutation used as template to update a value in a list
export const mutationUpdateValue = `mutation updateValue($id: Int!, $<graphQlListName>Patch: <GraphQlListName>Patch!) {
    update<GraphQlListName>ById(input: {id: $id, <graphQlListName>Patch: $<graphQlListName>Patch }) {
        <graphQlListName> {
            id
        }
    }
}`;

// Generic mutation used as template to delete a value in a list
export const mutationDeleteValue = `mutation deleteValue($id: Int!) {
    delete<GraphQlListName>ById(input: {id: $id}){
        <graphQlListName> {
            id
        }
    }
}`;

// Generic mutation to search a list of values
export const mutationSearchValue = `mutation searchValue($columnName: String, $keyword: String) {
    search<GraphQlMutationName>(input: {columnName: $columnName, keyword: $keyword}) {
        <graphQlMutationListName> {
            id
            createdDate
            updatedDate
            <graphQlAttributeName>
        }
    }
}`;