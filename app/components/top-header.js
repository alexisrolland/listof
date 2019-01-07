Vue.component('top-header', {
    template: `
        <nav class="navbar bg-light text-dark">
            <span class="navbar-brand">
                <a href=index.html>ListOf...</a>
            </span>
            <button class="btn btn-success btn-sm" v-on:click="goToCreate">
                Create
            </button>
        </nav>
    `,
    methods: {
      goToCreate() {
        window.location.href = 'edit-list.html';
      }
    }
});