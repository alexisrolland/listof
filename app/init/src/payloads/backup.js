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
            parentSysLists: sysAttributesByListId(filter: {linkedAttributeId: {isNull: false}}) {
                nodes {
                    sysAttributeByLinkedAttributeId {
                        sysListByListId {
                            tableName
                        }
                    }
                }
            }
            childSysLists: sysAttributesByListId {
                nodes {
                    sysAttributesByLinkedAttributeId {
                        nodes {
                            sysListByListId {
                                tableName
                            }
                        }
                    }
                }
              }
        }
    }
}`;

export const queryRestoreGetList = `query getList($tableName: String!) {
    allSysLists(condition: {tableName: $tableName}) {
        nodes {
            sysAttributesByListId {
                nodes {
                    columnName
                    sysDataTypeByDataTypeId {
                        id
                    }
                }
            }
        }
    }
}`;

export const mutationResetIdSequence = `mutation resetIdSequence($schema: String!, $tableName: String!) {
    resetIdSequence(input: {schema: $schema, tableName: $tableName}) {
        boolean
    }
}`;
