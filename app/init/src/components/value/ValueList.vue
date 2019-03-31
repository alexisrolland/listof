<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>User Group: {{ list.sysUserGroupByUserGroupId.name }}<br>
        Description: {{ list.description }}</p>

         <!-- Button Menu -->
        <div>
            <value-button-add-value
                v-bind:listId="list.id">
            </value-button-add-value>

            <value-button-edit-list
                v-bind:listId="list.id">
            </value-button-edit-list>
        </div>

        <!-- List of Values -->
        <value-table v-if="list.id" v-bind:list="list"></value-table>
    </div>
</template>

<script>
import ValueButtonAddValue from './ValueButtonAddValue.vue';
import ValueButtonEditList from './ValueButtonEditList.vue';
import ValueTable from './ValueTable.vue';

export default {
    components: {
        'value-button-add-value': ValueButtonAddValue,
        'value-button-edit-list': ValueButtonEditList,
        'value-table': ValueTable
    },
    data: function () {
        return {
            'list': {}
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        }
    },
    created: function () {
        // Get list details
        let payload = {
            'query': this.$store.state.queryGetList,
            'variables': {
                'id': parseInt(this.listId)
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
                    this.list = response.data.data.sysListById;
                }
            }
        );
    }
}
</script>