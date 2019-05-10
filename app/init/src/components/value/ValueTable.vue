<template>
    <div>
        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th>
                        Id
                    </th>
                    <th v-for="attribute in sortedAttributes" v-bind:key="attribute.id" scope="col">
                        {{ attribute.name }}
                        <a v-if="showSortAsc" style="cursor: pointer;" v-on:click="sort(attribute.graphQlAttributeName, 'asc')">▲</a>
                        <a v-if="showSortDesc" style="cursor: pointer;" v-on:click="sort(attribute.graphQlAttributeName, 'desc')">▼</a>
                    </th>
                    <th scope="col">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="value in values" v-bind:key="value.id">
                    <td>
                        {{ value.id }}
                    </td>
                    <td v-for="attribute in sortedAttributes" v-bind:key="attribute.id">
                        <!-- If attribute is linked to a list, fetch parent list value -->
                        <span v-if="attribute.linkedAttributeId">
                            <router-link v-if="value[attribute.graphQlAttributeName]"
                                v-bind:to="'/lists/' + attribute.sysAttributeByLinkedAttributeId.listId + '/values/' + value[attribute.graphQlAttributeName]">
                                    {{ value[attribute.graphQlAttributePath][attribute.graphQlLinkedAttributeName] }}
                            </router-link>
                        </span>
                        <span v-else>
                            {{ value[attribute.graphQlAttributeName] }}
                        </span>
                    </td>
                    <td>
                        <router-link v-if="showEditValue" class="badge badge-secondary" v-bind:to="'values/' + value.id">
                            Edit Value
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Pagination from '../utils/Pagination.vue';

export default {
    props: {
        attributes: Array,
        values: Array
    },
    computed: {
        showEditValue(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        },
        sortedAttributes(){
            let lodash = require('lodash');
            return lodash.sortBy(this.attributes, 'order');
        },
        showSortAsc() {
            return true;
        },
        showSortDesc() {
            return true;
        }
    },
    methods :{
        sort(attribute, order) {
            let payload = {
                'attribute': attribute,
                'sortOrder': order
            }
            this.$emit('sortList', payload);
        }
    }
}
</script>