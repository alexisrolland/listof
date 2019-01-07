Vue.component('form-attribute', {
    template: `
        <div>
            <div class="form-group row">
                <label for="attributeName" class="col-sm-2 col-form-label">
                    Name:
                </label>
                <input id="attributeName" type="text" class="form-control form-control-sm col-sm" placeholder="Attribute name" />
            </div>

            <div class="form-group row">
                <label for="attributeDescription" class="col-sm-2 col-form-label">
                    Description:
                </label>
                <textarea id="attributeDescription" class="form-control form-control-sm col-sm" placeholder="Attribute description" rows="3" />
            </div>

            <div class="form-group row">
                <label for="attributeMandatory" class="col-sm-2 col-form-label">
                    Mandatory:
                </label>
                <div class="form-check form-check-inline">
                    <input id="attributeMandatory" class="form-check-input" type="checkbox" value="" />
                </div>
            </div>

            <div class="form-group row">
                <label for="attributeUnique" class="col-sm-2 col-form-label">
                    Unique:
                </label>
                <div class="form-check form-check-inline">
                    <input id="attributeUnique" class="form-check-input" type="checkbox" value="" />
                </div>
            </div>

            <div class="form-group row">
                <label for="attributeListOfValues" class="col-sm-2 col-form-label">
                    List Of Values:
                </label>
                <select id="attributeListOfValues" class="form-control form-control-sm col-sm">
                    <option selected>Choose...</option>
                    <option>...</option>
                </select>
            </div>

            <div class="form-group row">
                <label for="attributeDataType" class="col-sm-2 col-form-label">
                    Data Type:
                </label>
                <select id="attributeDataType" class="form-control form-control-sm col-sm">
                    <option selected>Choose...</option>
                    <option>...</option>
                </select>
            </div>

            <div class="form-group row">
                <label for="attributeDefaultValue" class="col-sm-2 col-form-label">
                    Default Value:
                </label>
                <input id="attributeDefaultValue" class="form-control form-control-sm col-sm" type="text" placeholder="Attribute default value" />
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



            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
            Launch demo modal
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>

        </div>
    `
});