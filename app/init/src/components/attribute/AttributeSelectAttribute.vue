<template>
    <div v-if="showTreeSelect" class="form-group">
        <label for="linkedAttribute" class="col-form-label">
            Link with List:
        </label>
        <treeselect placeholder="Select list attribute"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="false"
            v-bind:disable-branch-nodes="true"/>
    </div>
    <div v-else class="form-group">
        Linked with List: 
        <router-link v-bind:to="'/lists/' + linkedAttribute.listId">
            {{ linkedAttribute.sysListByListId.name }} 
            ({{ linkedAttribute.name }})
        </router-link>
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
        value: Number,
        linkedAttribute: Object
    },
    data() {
        return {
            'selectedValue': this.value,
            'options': []
        }
    },
    computed: {
        attributeId() {
            return this.$route.params.attributeId;
        },
        showTreeSelect() {
            if(this.attributeId == 'new'){ return true; }
            else { return false; }
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
        //Only query list of linked list if it's a new attribute
        if(this.attributeId == 'new'){
            let payload = { 'query': this.$store.state.queryGetLinkedLists };
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
                        this.options = response.data.data.allSysLists.nodes;
                        for (let i = 0; i < this.options.length; i++) {
                            this.options[i]['children'] = this.options[i]['attributes']['children'];
                            delete this.options[i]['attributes'];
                        }
                    }
                }
            );
        }
    }
}
</script>

<style>
.vue-treeselect {
    color:#666666;
}
</style>

