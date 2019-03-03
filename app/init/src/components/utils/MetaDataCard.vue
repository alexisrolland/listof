<template>
    <p class="card text-white bg-secondary small p-2">
        Created date: {{createdDate}} <br>
        Created by: {{createdBy}} <br>
        Updated date: {{updatedDate}} <br>
        Updated by: {{updatedBy}}
    </p>
</template>

<script>
export default {
    props: {
        createdDate: String,
        createdBy: String,
        updatedDate: String,
        updatedBy: String
    }
}
</script>