<template>
    <div class="col-8">
        <value-list></value-list>
    </div>
</template>

<script>
import ValueList from './value/ValueList.vue';

export default {
    components: {
        'value-list': ValueList
    }
}
</script>