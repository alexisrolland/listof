<template>
    <div class="modal fade" id="ModalBoxUpload" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title">Upload CSV</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body bg-secondary text-light">
                    Select CSV file to upload: <br/>
                    Text
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" v-on:click="uploadFile" data-dismiss="modal">Upload</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    props: {
        list: Object
    },
    methods: {
        uploadFile() {

        }
    },
}
</script>

<style>
.modal-header { border: 0px; }
.modal-footer { border: 0px; }
</style>