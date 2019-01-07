Vue.component('left-sidebar', {
    template: `
        <div class="col-2" style="min-width: 315px;">
            <form class="form-inline mt-3 mb-2 ml-2">
                <input class="form-control form-control-sm w-75" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-secondary btn-sm ml-1" type="submit">
                    Search
                </button>
            </form>

            <left-menu></left-menu>
        </div>
    `
});