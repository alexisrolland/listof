export const queryGetAllUsers = `query getAllUsers{
    allSysUsers(orderBy: EMAIL_ASC) {
        nodes {
            id
            email
            role
            flagActive
        }
    }
}`;

export const queryGetUser = `query getUser($id: Int!) {
    sysUserById(id: $id) {
        id
        email
        role
        flagActive
        sysUserGroupUsersByUserId {
            nodes {
                id
                userGroupId
                sysUserGroupByUserGroupId { name }
            }
        }
    }
}`;

export const mutationCreateUser = `mutation createUser($sysUser: SysUserInput!) {
    createSysUser(input: {sysUser: $sysUser}) {
        sysUser {
            id
        }
    }
}`;

export const mutationUpdateUser = `mutation updateUser($id: Int!, $sysUserPatch: SysUserPatch!) {
    updateSysUserById(input: {id: $id, sysUserPatch: $sysUserPatch}) {
        sysUser {
            id
        }
    }
}`;

export const mutationSearchUser = `mutation searchUser($keyword: String) {
    searchUser(input: {keyword: $keyword}) {
        sysUsers {
            id
            email
            role
            flagActive
        }
    }
}`;

export const mutationCreateUserGroupUser = `mutation createUserGroupUser($sysUserGroupUser: SysUserGroupUserInput!) {
    createSysUserGroupUser(input: {sysUserGroupUser: $sysUserGroupUser}) {
        sysUserGroupUser {
            id
            userGroupId
            sysUserGroupByUserGroupId { name }
        }
    }
}`;

export const mutationDeleteUserGroupUser = `mutation deleteUserGroupUser($id: Int!) {
    deleteSysUserGroupUserById(input: {id: $id}){
        sysUserGroupUser {
            id
        }
    }
}`;