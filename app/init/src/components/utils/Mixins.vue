<script>

export default {
    methods: {
        displayError(response) {
            this.$store.state.errorObject.flag = true;
            this.$store.state.errorObject.message = response.data.errors[0].message;
        }
    }
}
</script>

