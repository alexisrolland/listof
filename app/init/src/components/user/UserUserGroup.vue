<template>
    <div class="form-group">
        <label for="userGroup" class="col-form-label">
            User Groups:
        </label>
        <treeselect placeholder="Select user group"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="true"
            v-bind:disable-branch-nodes="true"/>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    components: {
        'treeselect': Treeselect
    },
    props: {
        value: Array
    },
    data() {
        return {
            'selectedValue': this.value,
            'options': []
        }
    },
    watch: {
        value(arg) {
            this.selectedValue = arg;
        },
        selectedValue(arg) {
            this.$emit("changeUserGroups", arg);
        }
    },
    created: function () {
        let payload = { 'query': this.$store.state.queryGetUserUserGroups };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.options = response.data.data.allSysUserGroups.nodes;
                }
            }
        );
    }
}
</script>

<style>
.vue-treeselect {
    color:#666666;
}
</style>

