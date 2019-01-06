// Application home page
Vue.component('form-menu-button', {
    template: `
        <div class="mb-3">
            <button type="submit" class="btn btn-success btn-sm">
                Save
            </button>
            <button type="submit" class="btn btn-danger btn-sm">
                Delete
            </button>
            <button type="button" class="btn btn-secondary btn-sm">
                Cancel
            </button>
        </div>
    `
});