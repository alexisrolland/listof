export const mutationAuthenticateUser = `mutation authenticateUser($userEmail: String, $userPassword: String) {
    authenticateUser(input: { userEmail: $userEmail userPassword: $userPassword }) {
        sysUser {
            id
            email
            role
            flagActive
        }
    }
}`;