<template>
    <p class="card text-white bg-secondary small p-2">
        <table>
            <tr>
                <td>Id:</td>
                <td>{{id}}</td>
            </tr>
            <tr>
                <td>Created Date:</td>
                <td>{{createdDate}}</td>
            </tr>
            <tr>
                <td>Created By:</td>
                <td>{{createdBy}}</td>
            </tr>
            <tr>
                <td>Updated Date:</td>
                <td>{{updatedDate}}</td>
            </tr>
            <tr>
                <td>Updated By:</td>
                <td>{{updatedBy}}</td>
            </tr>
        </table>
    </p>
</template>

<script>
export default {
    props: {
        id: Number,
        createdDate: String,
        createdBy: String,
        updatedDate: String,
        updatedBy: String
    }
}
</script>