// Application home page
Vue.component('home', {
    template: `
        <div class="col-7" style="min-width: 1080px;">
            <h1>
                ListOf...
            </h1>
            <p class="lead">
                Create a new list of values...
            </p>
            <button class="btn btn-success btn-lg" v-on:click="goToCreate">
                Create
            </button>
        </div>
    `,
    methods: {
      goToCreate() {
        window.location.href = 'edit-list.html';
      }
    }
});