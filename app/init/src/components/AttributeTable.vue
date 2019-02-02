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
            <tbody>
                <tr v-for="attribute in attributes" v-bind:key="attribute.id">
                    <td>
                        {{ attribute.name }}
                    </td>
                    <td>
                        {{ attribute.flagMandatory }}
                    </td>
                    <td>
                        {{ attribute.flagUnique }}
                    </td>
                    <td v-if="attribute.sysListByLinkedListId">
                        {{ attribute.sysListByLinkedListId.name }}
                    </td>
                    <td v-else></td>
                    <td>
                        {{ attribute.sysDataTypeByDataTypeId.name }}
                    </td>
                    <td>
                        <router-link class="badge badge-secondary" v-bind:to="listId + '/attributes/' + attribute.id">
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
        attributes: Array
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        }
    }
}
</script>