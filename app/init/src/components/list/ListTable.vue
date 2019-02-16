<template>
    <table class="table table-striped table-dark table-hover table-borderless">
        <thead>
            <tr>
                <th scope="col">
                    Name
                </th>
                <th scope="col">
                    Description
                </th>
                <th scope="col">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="list in lists" v-bind:key="list.id">
                <td>
                    <router-link v-bind:to="'lists/' + list.id + '/values'">
                        {{ list.name }}
                    </router-link>
                </td>
                <td>
                    {{ list.description }}
                </td>
                <td>
                    <router-link class="badge badge-secondary" v-bind:to="'lists/' + list.id + '/values'">
                        Edit Values
                    </router-link>
                    <router-link  class="badge badge-secondary" v-bind:to="'lists/' + list.id">
                        Edit List
                    </router-link>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        lists: Array
    }
}
</script>