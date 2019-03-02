import Vue from 'vue';
import Vuex from 'vuex';
import * as Session from './payloads/session'
import * as DataTypePayload from './payloads/datatype'
import * as ListPayload from './payloads/list'
import * as AttributePayload from './payloads/attribute'
import * as ValuePayload from './payloads/value'
import * as UserPayload from './payloads/user'
import * as UserGroupPayload from './payloads/usergroup'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        graphqlUrl: '/graphql',
        errorObject: {
            flag: false,
            message: ''
        },

        // Authenticate user
        mutationAuthenticateUser: Session.mutationAuthenticateUser,
        queryGetCurrentUser: Session.queryGetCurrentUser,
        currentUser : {
            isAuthenticated: false,  // Used to customize UI display
            role: 'anonymous',  // Used to customize UI display
            userGroups: [],  // Used to manage user groups dropdown list in header
            selectedUserGroup: {},  // Select user group from dropdown list in header
        },

        // Data types queries
        queryGetAllDataTypes: DataTypePayload.queryGetAllDataTypes,

        // Lists queries and mutations
        queryGetAllLists: ListPayload.queryGetAllLists,
        queryGetList: ListPayload.queryGetList,
        queryGetLinkedLists: ListPayload.queryGetLinkedLists,  // Data for linked attribute drodpdown in attribute form
        mutationCreateList: ListPayload.mutationCreateList,
        mutationUpdateList: ListPayload.mutationUpdateList,
        mutationDeleteList: ListPayload.mutationDeleteList,
        mutationSearchList: ListPayload.mutationSearchList,

        // Attributes queries and mutations
        queryGetAttribute: AttributePayload.queryGetAttribute,
        mutationCreateAttribute: AttributePayload.mutationCreateAttribute,
        mutationUpdateAttribute: AttributePayload.mutationUpdateAttribute,
        mutationDeleteAttribute: AttributePayload.mutationDeleteAttribute,

        // Lists values queries and mutations 
        queryGetAllValues: ValuePayload.queryGetAllValues,
        queryGetValue: ValuePayload.queryGetValue,
        queryGetLinkedListValues: ValuePayload.queryGetLinkedListValues,  // Data for linked list & attributes drodpdown in value form
        mutationCreateValue: ValuePayload.mutationCreateValue,
        mutationUpdateValue: ValuePayload.mutationUpdateValue,
        mutationDeleteValue: ValuePayload.mutationDeleteValue,

        // Users queries and mutations
        queryGetAllUsers: UserPayload.queryGetAllUsers,
        queryGetUser: UserPayload.queryGetUser,
        mutationCreateUser: UserPayload.mutationCreateUser,
        mutationUpdateUser: UserPayload.mutationUpdateUser,
        mutationSearchUser: UserPayload.mutationSearchUser,
        mutationCreateUserGroupUser: UserPayload.mutationCreateUserGroupUser,
        mutationDeleteUserGroupUser: UserPayload.mutationDeleteUserGroupUser,

        // User groups queries and mutations
        queryGetAllUserGroups: UserGroupPayload.queryGetAllUserGroups,
        queryGetUserGroup: UserGroupPayload.queryGetUserGroup,
        queryGetUserUserGroups: UserGroupPayload.queryGetUserUserGroups,  // Data for user groups drodpdown in user form
        mutationCreateUserGroup: UserGroupPayload.mutationCreateUserGroup,
        mutationUpdateUserGroup: UserGroupPayload.mutationUpdateUserGroup,
        mutationSearchUserGroup: UserGroupPayload.mutationSearchUserGroup
    }
});