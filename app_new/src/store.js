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

        dataTypes: Array,
        queryGetAllDataTypes: `query getAllDataTypes {
            allSysDataTypes(orderBy: NAME_ASC) {
                nodes {
                    id
                    name
                }
            }
        }`,

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
                }
            }
        }`,

        mutationCreateList: `mutation createList($sysList: SysListInput!) {
            createSysList(input: {sysList: $sysList}) {
                sysList {
                    id
                    name
                    description
                }
            }
        }`,

        mutationUpdateList: `mutation updateList($id: Int!, $sysListPatch: SysListPatch!) {
            updateSysListById(input: {id: $id, sysListPatch: $sysListPatch }) {
                sysList {
                    id
                    name
                    description
                }
            }
        }`,

        mutationDeleteList: `mutation deleteList($id: Int!) {
            deleteSysListById(input: {id: $id}){
                sysList {
                    id
                }
            }
        }`
    }
});