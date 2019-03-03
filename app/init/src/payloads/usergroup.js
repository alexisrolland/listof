export const queryGetAllUserGroups = `query getAllUserGroups($first: Int $offset: Int){
    allSysUserGroups(first: $first offset: $offset orderBy: NAME_ASC) {
        nodes {
            id
            name
        }
        totalCount
    }
}`;

export const queryGetUserGroup = `query getUserGroup($id: Int!) {
    sysUserGroupById(id: $id) {
        id
        name
        createdDate
        updatedDate
        sysUserByCreatedById { email }
        sysUserByUpdatedById { email }
    }
}`;

// Query to get the list of user groups for the dropdown list in user form
// Response labels must be formatted according to Treeselect requirements
export const queryGetUserUserGroups = `query getAllUserGroups {
    allSysUserGroups(orderBy: NAME_ASC) {
        nodes {
            id
            label:name
        }
    }
}`;

export const mutationCreateUserGroup = `mutation createUserGroup($sysUserGroup: SysUserGroupInput!) {
    createSysUserGroup(input: {sysUserGroup: $sysUserGroup}) {
        sysUserGroup {
            id
        }
    }
}`;

export const mutationUpdateUserGroup = `mutation updateUserGroup($id: Int!, $sysUserGroupPatch: SysUserGroupPatch!) {
    updateSysUserGroupById(input: {id: $id, sysUserGroupPatch: $sysUserGroupPatch }) {
        sysUserGroup {
            id
        }
    }
}`;

export const mutationSearchUserGroup = `mutation searchUserGroup($keyword: String) {
    searchUserGroup(input: {keyword: $keyword}) {
        sysUserGroups {
            id
            name
        }
    }
}`;