<template>
    <div>
        <!-- Label -->
        <label class="col-form-label" for="defaultValue">
            Default Value:
        </label>

        <!-- Timestamp input, used for data types timestamp (id: 9) -->
        <input class="form-control col-sm"
            id="defaultValue"
            type="datetime-local"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"
            v-model="inputValue"
            v-on:change="change" />
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
            if (this.inputValue == '') {
                this.$emit('setDefaultValue', null);
            } else {
                this.$emit('setDefaultValue', String(this.inputValue));
            }
        }
    }
}
</script>