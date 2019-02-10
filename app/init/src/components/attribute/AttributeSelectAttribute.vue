<!-- Vue SFC -->
<template>
    <div class="form-group">
        <label for="linkedAttribute" class="col-form-label">
            Link With List:
        </label>
        <treeselect placeholder="Select list attribute"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="false"
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
        value: Number
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
            this.$emit("changeLinkedAttribute", arg);
        }
    },
    created: function () {
        let payload = { 'query': this.$store.state.queryGetLinkedLists };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.options = response.data.data.allSysLists.nodes;
                    
                    // Reformat data for selectreee
                    for (let i = 0; i < this.options.length; i++) {
                        this.options[i]['children'] = this.options[i]['attributes']['children']
                        delete this.options[i]['attributes'];
                    }
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

