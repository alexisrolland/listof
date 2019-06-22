export const queryBackupAllUserGroups = `query backupAllUserGroups {
    allSysUserGroups(orderBy: ID_ASC) {
        nodes {
            id
            name
            createdDate
            updatedDate
        }
    }
}`;

export const queryBackupAllLists = `query backupAllLists {
    allSysLists(orderBy: ID_ASC) {
        nodes {
            id
            name
            description
            tableName
            createdDate
            updatedDate
            userGroupId
        }
    }
}`;

export const queryBackupAllAttributes = `query backupAllAttributes {
    allSysAttributes(orderBy: ID_ASC) {
        nodes {
            id
            name
            description
            order
            columnName
            flagUnique
            flagMandatory
            defaultValue
            createdDate
            updatedDate
            userGroupId
            listId
            dataTypeId
            linkedAttributeId
        }
    }
}`;

export const queryBackupAllListsValues = `query backupAllListsValues{
    allSysLists(orderBy: ID_ASC) {
        nodes {
            tableName
            sysAttributesByListId{
                nodes {
                    columnName
                }
            }
        }
    }
}`;
