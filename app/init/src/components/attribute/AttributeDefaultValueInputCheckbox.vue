<template>
    <div>
        <!-- Label -->
        <label for="userRole" class="col-form-label">
            Default Value:
        </label>
        
        <!-- Checkbox input, used for data types boolean (id: 2) -->
        <select class="form-control col-sm"
            id="defaultValue"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"
            v-model="inputValue"
            v-on:change="change">
                <option value=""></option>
                <option value="true">true</option>
                <option value="false">false</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
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
            this.inputValue = val;
        }
    },
    methods: {
        change() {
            this.$emit('setDefaultValue', this.inputValue);
        }
    }
}
</script>