import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        graphqlUrl: 'https://localhost/listof/api/v1/graphql',
        errorObject: {
            flag: false,
            message: ''
        },

        // Data types queries
        queryGetAllDataTypes: `query getAllDataTypes {
            allSysDataTypes(orderBy: NAME_ASC) {
                nodes {
                    id
                    name
                }
            }
        }`,

        // Data for linked list & attributes drodpdown in attribute form
        // Response labels must be formatted according to Treeselect requirements
        queryGetLinkedLists: `query getAllLists {
            allSysLists(orderBy: NAME_ASC) {
                nodes {
                    id:nodeId
                    label:name
                    attributes:sysAttributesByListId {
                        children:nodes {
                            id
                            label:name
                        }
                    }
                }
            }
        }`,

        // Data for linked list & attributes drodpdown in value form
        // Response labels must be formatted according to Treeselect requirements
        queryGetLinkedListValues: `query getAllValues {
            all<GraphQlListName> {
                nodes {
                    id
                    label:<graphQlAttributeName>
                }
            }
        }`,

        // Lists queries and mutations
        queryGetAllLists: `query getAllLists{
            allSysLists(orderBy: NAME_ASC) {
                nodes {
                    id
                    name
                    description
                }
            }
        }`,

        queryGetList: `query getList($id: Int!) {
            sysListById(id: $id) {
                id
                name
                description
                tableName
                sysAttributesByListId {
                    nodes {
                        id
                        name
                        description
                        flagMandatory
                        flagUnique
                        dataTypeId
                        sysDataTypeByDataTypeId { name }
                        linkedListAttributeId
                        sysAttributeByLinkedListAttributeId {
                            name
                            columnName
                            listId
                            sysListByListId {
                                name
                                tableName
                            }
                        }
                        columnName
                    }
                }
            }
        }`,

        mutationCreateList: `mutation createList($sysList: SysListInput!) {
            createSysList(input: {sysList: $sysList}) {
                sysList {
                    id
                }
            }
        }`,

        mutationUpdateList: `mutation updateList($id: Int!, $sysListPatch: SysListPatch!) {
            updateSysListById(input: {id: $id, sysListPatch: $sysListPatch }) {
                sysList {
                    id
                }
            }
        }`,

        mutationDeleteList: `mutation deleteList($id: Int!) {
            deleteSysListById(input: {id: $id}){
                sysList {
                    id
                }
            }
        }`,

        // Attributes queries and mutations
        queryGetAttribute: `query getAttribute($id: Int!) {
            sysAttributeById(id: $id) {
                id
                name
                description
                flagMandatory
                flagUnique
                dataTypeId
                sysDataTypeByDataTypeId { name }
                linkedListAttributeId
                sysAttributeByLinkedListAttributeId {
                    name
                    listId
                    sysListByListId { name }
                }
                defaultValue
            }
        }`,

        mutationCreateAttribute: `mutation createAttribute($sysAttribute: SysAttributeInput!) {
            createSysAttribute(input: {sysAttribute: $sysAttribute}) {
                sysAttribute {
                    id
                }
            }
        }`,

        mutationUpdateAttribute: `mutation updateAttribute($id: Int!, $sysAttributePatch: SysAttributePatch!) {
            updateSysAttributeById(input: {id: $id, sysAttributePatch: $sysAttributePatch }) {
                sysAttribute {
                    id
                }
            }
        }`,

        mutationDeleteAttribute: `mutation deleteAttribute($id: Int!) {
            deleteSysAttributeById(input: {id: $id}){
                sysAttribute {
                    id
                }
            }
        }`,

        // Generic query used as template to fetch all values from a list
        queryGetAllValues: `query getAllValues {
            all<GraphQlListName> {
                nodes {
                    id
                    createdDate
                    updatedDate
                    <graphQlAttributeName>
                }
            }
        }`,

        // Generic query used as template to fetch one value from a list
        queryGetValue: `query getValue($id: Int!) {
            <graphQlListName>ById(id: $id) {
                id
                createdDate
                updatedDate
                <graphQlAttributeName>
            }
        }`,

        // Generic mutation used as template to create a new value in a list
        mutationCreateValue: `mutation createValue($<graphQlListName>: <GraphQlListName>Input!) {
            create<GraphQlListName>(input: {<graphQlListName>: $<graphQlListName>}) {
                <graphQlListName> {
                    id
                }
            }
        }`,

        // Generic mutation used as template to update a value in a list
        mutationUpdateValue: `mutation updateValue($id: Int!, $<graphQlListName>Patch: <GraphQlListName>Patch!) {
            update<GraphQlListName>ById(input: {id: $id, <graphQlListName>Patch: $<graphQlListName>Patch }) {
                <graphQlListName> {
                    id
                }
            }
        }`,

        // Generic mutation used as template to delete a value in a list
        mutationDeleteValue: `mutation deleteValue($id: Int!) {
            delete<GraphQlListName>ById(input: {id: $id}){
                <graphQlListName> {
                    id
                }
            }
        }`,
    }
});