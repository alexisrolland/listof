<template>
    <span>
        <button v-if="show" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#ModalBoxUpload">
            Upload CSV
        </button>

        <!-- Modal box to upload file -->
        <value-modal-box-upload v-bind:list="list"></value-modal-box-upload>
    </span>
</template>

<script>
import ValueModalBoxUpload from './ValueModalBoxUpload.vue';

export default {
    components: {
        'value-modal-box-upload': ValueModalBoxUpload
    },
    props: {
        list: Object
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>