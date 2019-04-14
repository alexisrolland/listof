<template>
    <div class="form-group">
        <label for="userGroup" class="col-form-label">
            User Group:
        </label>
        <treeselect placeholder="Select user group"
            v-model="selectedValue"
            v-bind:options="options"
            v-bind:multiple="false"
            v-bind:disable-branch-nodes="true"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"/>
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
            this.$emit("changeUserGroup", arg);
        }
    },
    computed: {
        isReadOnly(){
            let roles = ['admin', 'advanced']
            return !roles.includes(this.$store.state.currentUser.role)
        }
    },
    created: function () {
        // Rename dictionary key to match treeselect requirements
        this.options = this.$store.state.currentUser.userGroups;
        for (let i = 0; i < this.options.length; i++) {
            this.options[i]['label'] = this.options[i]['name'];
        }
    }
}
</script>

<style>
.vue-treeselect {
    color:#666666;
}
</style>

