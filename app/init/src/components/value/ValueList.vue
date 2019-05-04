<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p v-if="list.id">User Group: {{ list.sysUserGroupByUserGroupId.name }}<br>
        Description: {{ list.description }}</p>
        

         <!-- Button Menu -->
        <div>
            <value-button-add-value
                v-bind:listId="list.id">
            </value-button-add-value>

            <value-button-download
                v-bind:list="list">
            </value-button-download>

            <value-button-edit-list
                v-bind:listId="list.id">
            </value-button-edit-list>
        </div>

        <h1 class="mt-5">Values</h1>

        <!-- Values Search -->
        <value-search v-if="list.id" v-bind:list="list"></value-search>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';
import ValueButtonAddValue from './ValueButtonAddValue.vue';
import ValueButtonDownload from './ValueButtonDownload.vue';
import ValueButtonEditList from './ValueButtonEditList.vue';
import ValueSearch from './ValueSearch.vue';

export default {
    mixins: [Mixins],
    components: {
        'value-button-add-value': ValueButtonAddValue,
        'value-button-download': ValueButtonDownload,
        'value-button-edit-list': ValueButtonEditList,
        'value-search': ValueSearch
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
                    this.displayError(response);
                } else {
                    this.list = response.data.data.sysListById;
                }
            },
            // Error callback
            function(response){
                this.displayError(response);
            }
        );
    }
}
</script>