export const mutationAuthenticateUser = `mutation authenticateUser($userEmail: String!, $userPassword: String!) {
    authenticateUser(input: {userEmail: $userEmail, userPassword: $userPassword}) {
        sysToken
    }
}`;

export const queryGetCurrentUser = `query getCurrentUser($email: String!) {
    sysUserByEmail(email: $email) {
        role
        sysUserGroupUsersByUserId{
            nodes {
                sysUserGroupByUserGroupId {
                    id
                    name
                }
            }
        }
    }
}`;