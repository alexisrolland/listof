export const queryGetAllLists = `query getAllLists($first: Int $offset: Int){
    allSysLists(first: $first offset: $offset orderBy: NAME_ASC) {
        nodes {
            id
            name
            description
            sysUserGroupByUserGroupId { name }
        }
        totalCount
    }
}`;

export const queryGetList = `query getList($id: Int!) {
    sysListById(id: $id) {
        id
        name
        description
        tableName
        userGroupId
        sysUserGroupByUserGroupId { name }
        sysAttributesByListId {
            nodes {
                id
                name
                description
                order
                flagMandatory
                flagUnique
                dataTypeId
                sysDataTypeByDataTypeId { name }
                linkedAttributeId
                sysAttributeByLinkedAttributeId {
                    name
                    columnName
                    listId
                    sysListByListId {
                        name
                        tableName
                    }
                }
                columnName
                sysAttributesByLinkedAttributeId{
                    nodes {
                        id
                        name
                        sysListByListId {
                            id
                            name
                        }
                    }
                }
            }
        }
        createdDate
        updatedDate
        sysUserByCreatedById { email }
        sysUserByUpdatedById { email }
    }
}`;

// Response labels must be formatted according to Treeselect requirements
export const queryGetLinkedLists = `query getAllLists {
    allSysLists(orderBy: NAME_ASC) {
        nodes {
            id:nodeId
            label:name
            attributes:sysAttributesByListId {
                children:nodes {
                    id
                    label:name
                }
            }
        }
    }
}`;

export const mutationCreateList = `mutation createList($sysList: SysListInput!) {
    createSysList(input: {sysList: $sysList}) {
        sysList {
            id
        }
    }
}`;

export const mutationUpdateList = `mutation updateList($id: Int!, $sysListPatch: SysListPatch!) {
    updateSysListById(input: {id: $id, sysListPatch: $sysListPatch }) {
        sysList {
            id
        }
    }
}`;

export const mutationDeleteList = `mutation deleteList($id: Int!) {
    deleteSysListById(input: {id: $id}){
        sysList {
            id
        }
    }
}`;

export const mutationSearchList = `mutation searchList($keyword: String) {
    searchList(input: {keyword: $keyword}) {
        sysLists {
            id
            name
            description
            sysUserGroupByUserGroupId { name }
        }
    }
}`;

export const mutationDuplicateListValue = `mutation duplicateListValue($sourceListId: Int!, $targetListId: Int!){
    duplicateListValue(input:{sourceListId: $sourceListId, targetListId: $targetListId}) {
        boolean
    }
}`;