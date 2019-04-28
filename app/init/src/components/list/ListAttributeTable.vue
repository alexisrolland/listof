<template>
    <div>
        <h1 class="mt-5">Attributes</h1>

        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">
                        Order
                    </th>
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
                <tr v-for="attribute in sortedAttributes" v-bind:key="attribute.id">
                    <td>
                        {{ attribute.order }}
                    </td>
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
                        <router-link v-if="showEditAttribute" class="badge badge-secondary" v-bind:to="list.id + '/attributes/' + attribute.id">
                            Edit Attribute
                        </router-link>
                        <a class="badge badge-secondary" style="cursor: pointer;" v-on:click="changeAttributeOrder(attribute.id, attribute.order, 'up')">▲</a>
                        <a class="badge badge-secondary" style="cursor: pointer;" v-on:click="changeAttributeOrder(attribute.id, attribute.order, 'down')">▼</a>
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
    },
    computed: {
        showEditAttribute(){
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        },
        sortedAttributes(){
            let _ = require('lodash');
            return _.sortBy(this.list.sysAttributesByListId.nodes, 'order');
        }
    },
    methods: {
        changeAttributeOrder(attributeId, order, change) {
            // Method to change the order of an attribute
            if (change == 'up') {
                order = order - 1;
                this.updateAttributeOrder(attributeId, order)
            }
            else if (change == "down") {
                order = order + 1;
                this.updateAttributeOrder(attributeId, order)
            }
        },
        updateAttributeOrder(attributeId, order) {
            // Method to update the order of an attribute in the database
            let payload = {
                'query': this.$store.state.mutationUpdateAttribute,
                'variables': { 
                    'id': attributeId,
                    'sysAttributePatch': {
                        'order': order
                    }
                }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        let id = response.data.data.updateSysAttributeById.sysAttribute.id;

                        // Update order in frontend
                        let _ = require('lodash');
                        let attributeIndex = _.findIndex(this.list.sysAttributesByListId.nodes, ['id', id]);
                        this.list.sysAttributesByListId.nodes[attributeIndex].order = order;
                    }
                }
            );
        }
    }
}
</script>