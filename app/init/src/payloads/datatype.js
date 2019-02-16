export const queryGetAllDataTypes = `query getAllDataTypes {
    allSysDataTypes(orderBy: NAME_ASC) {
        nodes {
            id
            name
        }
    }
}`;