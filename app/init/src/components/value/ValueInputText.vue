<template>
    <div>
        <!-- Label -->
        <label class="col-form-label" v-bind:for="attribute.id">
            {{ attribute.name }}:
        </label>

        <!-- Text input, used for all other data types char (id: 3), text (id: 9), varchar (id: 11) -->
        <input class="form-control col-sm"
            type="text"
            v-bind:id="attribute.id"
            v-bind:required="attribute.flagMandatory"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"
            v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
            v-model="inputValue"
            v-on:change="change" />

        <!-- Description -->
        <small class="form-text text-muted" v-bind:id="attribute.id">
            {{ attribute.description }}
        </small>
    </div>
</template>

<script>
export default {
    props: {
        attribute: Object,
        value: String
    },
    data: function () {
        return {
            'inputValue': this.value
        }
    },
    computed: {
        isReadOnly(){
            let roles = ['admin', 'advanced']
            return !roles.includes(this.$store.state.currentUser.role)
        }
    },
    watch: {
        value(val) {
            this.inputValue = this.value;
        }
    },
    methods: {
        change(val) {
            let attributeValue = {
                'attribute': this.attribute.graphQlAttributeName,
                'value': this.inputValue
            }
            this.$emit('changeAttributeValue', attributeValue);
        }
    }
}
</script>