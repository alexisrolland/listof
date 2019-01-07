Vue.component('form-list', {
    template: `
        <div>
            <div class="form-group row">
                <label for="listName" class="col-sm-2 col-form-label">
                    Name:
                </label>
                <input id="listName" type="text" class="form-control form-control-sm col-sm" placeholder="List name" />
            </div>

            <div class="form-group row">
                <label for="listDescription" class="col-sm-2 col-form-label">
                    Description:
                </label>
                <textarea id="listDescription" class="form-control form-control-sm col-sm" placeholder="List description" rows="3" />
            </div>

            <!-- Button Menu -->
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