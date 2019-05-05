<template>
    <!-- Checkbox input, used for data types boolean (id: 2) -->
    <div class="custom-control custom-switch">
        <input class="custom-control-input"
            id="defaultValue"
            type="checkbox"
            value=""
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"
            v-model="inputValue"
            v-on:change="change" />
        
        <!-- Label -->
        <label class="custom-control-label" for="defaultValue">
            Default Value
        </label>
    </div>
</template>

<script>
export default {
    props: {
        value: Boolean
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
            this.$emit('setDefaultValue', String(this.inputValue));
        }
    }
}
</script>