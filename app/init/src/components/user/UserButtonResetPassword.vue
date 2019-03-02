<template>
    <button type="button" class="btn btn-secondary" v-on:click="resetPassword">
        Reset Password
    </button>
</template>

<script>
export default {
   methods: {
        resetPassword() {
            this.$emit("resetPassword", true);
        }
    }
}
</script>