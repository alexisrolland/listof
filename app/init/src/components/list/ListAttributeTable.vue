<template>
    <div>
        <h1 class="mt-5">Attributes</h1>

        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">
                        Name
                    </th>
                    <th scope="col">
                        Mandatory
                    </th>
                    <th scope="col">
                        Unique
                    </th>
                    <th scope="col">
                        Linked List
                    </th>
                    <th scope="col">
                        Data Type
                    </th>
                    <th scope="col">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody v-if="list.sysAttributesByListId">
                <tr v-for="attribute in list.sysAttributesByListId.nodes" v-bind:key="attribute.id">
                    <td>
                        {{ attribute.name }}
                    </td>
                    <td>
                        {{ attribute.flagMandatory }}
                    </td>
                    <td>
                        {{ attribute.flagUnique }}
                    </td>
                    <td v-if="attribute.linkedAttributeId">
                        <router-link v-bind:to="'/lists/' + attribute.sysAttributeByLinkedAttributeId.listId">
                            {{ attribute.sysAttributeByLinkedAttributeId.sysListByListId.name }} 
                            ({{ attribute.sysAttributeByLinkedAttributeId.name }})
                        </router-link>
                    </td>
                    <td v-else></td>
                    <td>
                        {{ attribute.sysDataTypeByDataTypeId.name }}
                    </td>
                    <td>
                        <router-link class="badge badge-secondary" v-bind:to="list.id + '/attributes/' + attribute.id">
                            Edit Attribute
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        
        
    </div>
</template>

<script>
export default {
    props: {
        list: {}
    }
}
</script>