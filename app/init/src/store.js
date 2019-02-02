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

        // Data types
        dataTypes: Array,
        queryGetAllDataTypes: `query getAllDataTypes {
            allSysDataTypes(orderBy: NAME_ASC) {
                nodes {
                    id
                    name
                }
            }
        }`,

        // Lists
        lists: Array,
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
                sysAttributesByListId {
                    nodes {
                        id
                        name
                        flagMandatory
                        flagUnique
                        sysListByLinkedListId {
                            name
                        }
                        sysDataTypeByDataTypeId {
                            name
                        }
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

        // List attributes
        queryGetAttribute: `query getAttribute($id: Int!) {
            sysAttributeById(id: $id) {
                id
                name
                description
                flagMandatory
                flagUnique
                linkedListId
                sysListByLinkedListId {
                    name
                }
                dataTypeId
                sysDataTypeByDataTypeId {
                    name
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
        }`
    }
});