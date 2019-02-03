<template>
    <div id="app">
        <header-bar></header-bar>
        <error-message></error-message>
        <div id="main" class="row justify-content-center">
            <router-view :key="$route.fullPath"></router-view>
        </div>
    </div>
</template>

<script>
import HeaderBar from './components/header/HeaderBar.vue'
import ErrorMessage from './components/error/ErrorMessage.vue'

export default {
    name: 'app',
    components: {
        'header-bar': HeaderBar,
        'error-message': ErrorMessage
    }
}
</script>

<style>
.form-group.required .col-form-label:after {
    content:"*";
    color:OrangeRed;
}
</style>
