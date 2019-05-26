<template>
    <div>
        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th>
                        Id
                        <span class="sort"
                            v-bind:class="{ active: sortAttribute.columnName == 'id' && sortAttribute.sortOrder == 'asc' }"
                            v-on:click="sort('id', 'asc')">▲</span>
                        <span class="sort"
                            v-bind:class="{ active: sortAttribute.columnName == 'id' && sortAttribute.sortOrder == 'desc' }"
                            v-on:click="sort('id', 'desc')">▼</span>
                    </th>
                    <th v-for="attribute in sortedAttributes" v-bind:key="attribute.id" scope="col">
                        {{ attribute.name }}
                        <span class="sort"
                            v-bind:class="{ active: sortAttribute.columnName == attribute.columnName && sortAttribute.sortOrder == 'asc' }"
                            v-on:click="sort(attribute.columnName, 'asc')">▲</span>
                        <span class="sort"
                            v-bind:class="{ active: sortAttribute.columnName == attribute.columnName && sortAttribute.sortOrder == 'desc' }"
                            v-on:click="sort(attribute.columnName, 'desc')">▼</span>
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
export default {
    props: {
        attributes: Array,
        values: Array
    },
    data: function () {
        return {
            'sortAttribute': {
                'columnName': 'id',
                'sortOrder': 'asc'
            }
        }
    },
    computed: {
        showEditValue(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        },
        sortedAttributes(){
            let lodash = require('lodash');
            return lodash.sortBy(this.attributes, 'order');
        }
    },
    methods :{
        sort(columnName, sortOrder) {
            this.sortAttribute = {
                'columnName': columnName,
                'sortOrder': sortOrder
            }
            let payload = {
                'columnName': columnName,
                'sortOrder': sortOrder
            }
            this.$emit('sortAttribute', payload);
        }
    }
}
</script>

<style>
span.sort {
    cursor: pointer;
    font-size: 0.75rem;
    color: #6c757d;
    background-color: transparent;
}
span.sort:hover {
    color: white;
    background-color: transparent;
}
span.active {
    color: white;
}
</style>