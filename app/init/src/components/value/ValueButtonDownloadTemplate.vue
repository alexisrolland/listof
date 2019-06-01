<template>
    <button type="button" class="btn btn-secondary mr-auto" v-on:click="downloadTemplate">
        Download Template
    </button>
</template>

<script>
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    props: {
        listName: String,
        columnNames: Array
    },
    methods: {
        downloadTemplate(){
            // Convert data to CSV format
            let papa = require('papaparse');
            console.log('hello');
            let text = papa.unparse(this.columnNames);
            console.log(text);

            // Create CSV file
            let file = new Blob([text], {type: 'text/csv;charset=utf-8;'});
            let url;
            if (navigator.msSaveBlob) { url = navigator.msSaveBlob(file, this.list.name + '.csv'); }
            else { url = window.URL.createObjectURL(file); }
            let link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.listName + '.csv');
            link.click();
        }
    }
}
</script>