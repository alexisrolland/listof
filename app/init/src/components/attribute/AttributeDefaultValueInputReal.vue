<template>
    <div>
        <!-- Label -->
        <label class="col-form-label" for="defaultValue">
            Default Value:
        </label>

        <!-- Number input, used for data type real (id: 7) -->
        <input class="form-control col-sm"
            id="defaultValue"
            type="number"
            v-bind:disabled="isReadOnly"
            v-bind:readonly="isReadOnly"
            v-model="inputValue"
            v-on:change="change" />
    </div>
</template>

<script>
export default {
    props: {
        value: Number
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