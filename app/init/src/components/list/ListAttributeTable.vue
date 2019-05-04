<template>
    <div>
        <h1 class="mt-5">Attributes</h1>
        <p>Attributes of {{ list.name }}.</p>

        <p>
            <list-attribute-button-add
                v-if="list.id"
                v-bind:listId="list.id">
            </list-attribute-button-add>
        </p>

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
import ListAttributeButtonAdd from './ListAttributeButtonAdd.vue';
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    components: {
        'list-attribute-button-add': ListAttributeButtonAdd
    },
    props: {
        list: {}
    },
    computed: {
        showEditAttribute(){
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        },
        sortedAttributes(){
            let lodash = require('lodash');
            return lodash.sortBy(this.list.sysAttributesByListId.nodes, 'order');
        }
    },
    methods: {
        changeAttributeOrder(attributeId, order, change) {
            // Method to change the order of an attribute
            if (change == 'up') {
                order = order - 1;
                if (order < 1) { order = 1 }
                this.updateAttributeOrder(attributeId, order)
            }
            else if (change == "down") {
                order = order + 1;
                let nbAttributes = this.list.sysAttributesByListId.nodes.length;
                if (order > nbAttributes) { order = nbAttributes }
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
                        this.displayError(response);
                    } else {
                        let id = response.data.data.updateSysAttributeById.sysAttribute.id;

                        // Update order in frontend
                        let lodash = require('lodash');
                        let attributeIndex = lodash.findIndex(this.list.sysAttributesByListId.nodes, ['id', id]);
                        this.list.sysAttributesByListId.nodes[attributeIndex].order = order;
                    }
                },
                // Error callback
                function(response){
                    this.displayError(response);
                }
            );
        }
    }
}
</script>