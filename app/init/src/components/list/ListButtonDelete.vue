<template>
    <span>
        <button v-if="show" type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#ModalBoxDelete">
            Delete
        </button>

        <!-- Modal box to confirm deletion -->
        <modal-box-delete
            v-bind:objectType="'list'"
            v-bind:listId="listId">
        </modal-box-delete>
    </span>
</template>

<script>
import ModalBoxDelete from '../utils/ModalBoxDelete.vue';
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    components: {
        'modal-box-delete': ModalBoxDelete
    },
    props: {
        listId: Number
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>