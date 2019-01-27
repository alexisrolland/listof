<template>
    <div id="app">
        <top-header></top-header>
        <error-message></error-message>
        <div id="main" class="row justify-content-center">
            <router-view :key="$route.fullPath"></router-view>
        </div>
    </div>
</template>

<script>
import TopHeader from './components/TopHeader.vue'
import ErrorMessage from './components/ErrorMessage.vue'

export default {
    name: 'app',
    components: {
        'top-header': TopHeader,
        'error-message': ErrorMessage
    }
}
</script>

<style>
</style>
