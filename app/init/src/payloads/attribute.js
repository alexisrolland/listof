export const queryGetAttribute = `query getAttribute($id: Int!) {
    sysAttributeById(id: $id) {
        id
        name
        description
        flagMandatory
        flagUnique
        dataTypeId
        sysDataTypeByDataTypeId { name }
        linkedAttributeId
        sysAttributeByLinkedAttributeId {
            name
            listId
            sysListByListId { name }
        }
        defaultValue
        createdDate
        updatedDate
        sysUserByCreatedById { email }
        sysUserByUpdatedById { email }
    }
}`;

export const mutationCreateAttribute = `mutation createAttribute($sysAttribute: SysAttributeInput!) {
    createSysAttribute(input: {sysAttribute: $sysAttribute}) {
        sysAttribute {
            id
        }
    }
}`;

export const mutationUpdateAttribute = `mutation updateAttribute($id: Int!, $sysAttributePatch: SysAttributePatch!) {
    updateSysAttributeById(input: {id: $id, sysAttributePatch: $sysAttributePatch }) {
        sysAttribute {
            id
        }
    }
}`;

export const mutationDeleteAttribute = `mutation deleteAttribute($id: Int!) {
    deleteSysAttributeById(input: {id: $id}){
        sysAttribute {
            id
        }
    }
}`;