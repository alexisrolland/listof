<template>
    <div>
        <h1 class="mt-5">Edit list</h1>

        <form>
            <div class="form-row">
                <div class="col-md-8">

                    <!-- List Form -->
                    <div class="form-group required">
                        <label for="listName" class="col-form-label">
                            Name:
                        </label>
                        <input class="form-control col-sm"
                            id="listName"
                            type="text"
                            required="required"
                            v-bind:disabled="isReadOnly"
                            v-bind:readonly="isReadOnly"
                            placeholder="Type list name"
                            v-model="list.name" />
                    </div>

                    <div class="form-group required">
                        <label for="listDescription" class="col-form-label">
                            Description:
                        </label>
                        <textarea class="form-control col-sm"
                            id="listDescription"
                            required="true"
                            v-bind:disabled="isReadOnly"
                            v-bind:readonly="isReadOnly"
                            placeholder="Type list description"
                            rows="3"
                            v-model="list.description" />
                    </div>

                    <list-select-user-group
                        v-model="list.userGroupId"
                        v-on:changeUserGroup="getUserGroup">
                    </list-select-user-group>

                    <!-- Button Menu -->
                    <div>
                        <list-button-save
                            v-bind:list="list">
                        </list-button-save>

                        <list-button-add-attribute
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-add-attribute>

                        <list-button-edit-value
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-edit-value>

                        <list-button-close>
                        </list-button-close>

                        <list-button-delete
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-delete>
                    </div>
                </div>
                <div class="col-md-4">
                    <list-meta-data
                        v-if="list.id"
                        v-bind:id="list.id"
                        v-bind:createdDate="list.createdDate"
                        v-bind:createdBy="list.sysUserByCreatedById.email"
                        v-bind:updatedDate="list.updatedDate"
                        v-bind:updatedBy="list.sysUserByUpdatedById.email"
                    ></list-meta-data>
                </div>
            </div>
        </form>

        <!-- List Attributes -->
        <list-attribute-table v-if="list.id" v-bind:list="list"></list-attribute-table>
    </div>
</template>

<script>
import ListSelectUserGroup from './ListSelectUserGroup.vue';
import ListButtonSave from './ListButtonSave.vue';
import ListButtonAddAttribute from './ListButtonAddAttribute.vue';
import ListButtonEditValue from './ListButtonEditValue.vue';
import ListButtonClose from './ListButtonClose.vue';
import ListButtonDelete from './ListButtonDelete.vue';
import ListAttributeTable from './ListAttributeTable.vue';
import MetaDataCard from '../utils/MetaDataCard.vue';

export default {
    components: {
        'list-select-user-group': ListSelectUserGroup,
        'list-button-save': ListButtonSave,
        'list-button-add-attribute': ListButtonAddAttribute,
        'list-button-edit-value': ListButtonEditValue,
        'list-button-close': ListButtonClose,
        'list-button-delete': ListButtonDelete,
        'list-attribute-table': ListAttributeTable,
        'list-meta-data': MetaDataCard
    },
    data: function () {
        return {
            'list': {},
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        },
        isReadOnly(){
            let roles = ['admin', 'advanced']
            return !roles.includes(this.$store.state.currentUser.role)
        }
    },
    created: function () {
        // If listId != new then get data for existing list
        if (this.listId != 'new') {
            let payload = {
                'query': this.$store.state.queryGetList,
                'variables': {
                    'id': parseInt(this.listId)
                }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.list = response.data.data.sysListById;
                    }
                }
            );
        };
    },
    methods: {
        getUserGroup(value) {
            // Get user group from child component
            if (value != null) {
                this.list['userGroupId'] = value;
            } else {
                this.list['userGroupId'] = null;
            }
        }
    }
}
</script>