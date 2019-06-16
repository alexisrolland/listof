export const queryGetAllDataTypes = `query getAllDataTypes {
    allSysDataTypes(orderBy: POPULARITY_ASC) {
        nodes {
            id
            name
            displayName
        }
    }
}`;
