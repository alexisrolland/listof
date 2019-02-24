export const mutationAuthenticateUser = `mutation authenticateUser($userEmail: String!, $userPassword: String!) {
    authenticateUser(input: {userEmail: $userEmail, userPassword: $userPassword}) {
        sysToken
    }
}`;