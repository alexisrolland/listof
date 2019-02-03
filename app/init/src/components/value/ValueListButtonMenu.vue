<template>
    <div>
        <router-link v-bind:to="'values/new'">
            <button type="button" class="btn btn-secondary">
                Add Value
            </button>
        </router-link>

        <router-link v-bind:to="'/'">
            <button type="button" class="btn btn-outline-secondary">
                Close
            </button>
        </router-link>
    </div>
</template>