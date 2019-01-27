<template>
    <div class="col-8">
        <h1 class="mt-5">Edit list</h1>
        <list-form></list-form>
    </div>
</template>

<script>
import ListForm from './components/ListForm.vue';

export default {
    components: {
        'list-form': ListForm
    }
}
</script>

