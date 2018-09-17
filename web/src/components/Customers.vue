<template>
    <v-container fluid>
        <v-dialog
                v-model="notesDialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition">
            <v-card>
                <NoteDialog
                        v-if="notesDialog"
                        :close="closeNotesDialog"
                        :userId="notesFromUser"
                />
            </v-card>
        </v-dialog>
        <v-slide-y-transition mode="out-in">
            <v-layout column>
                <v-layout row wrap>
                    <v-flex xs12 sm8 md8>
                        <v-layout row wrap>
                            <v-flex xs8 sm10>
                                <v-text-field
                                        light
                                        auto-grow
                                        clearable
                                        v-model="searchText"
                                        append-icon="search"
                                        placeholder="Search"
                                        hint="Search users by name, phone, email"
                                        @keyup.enter="search"
                                />
                            </v-flex>
                            <v-flex xs4 sm2>
                                <v-btn @click="search" color="info">
                                    Search
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>

                    <v-flex xs12 sm4 md4 text-xs-right>
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-btn slot="activator" color="primary" dark class="mb-2">New User</v-btn>
                            <v-card v-if="dialog">
                                <v-card-title>
                                    <span class="headline">Add user</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-form ref="form" v-model="valid" lazy-validation>
                                            <v-layout wrap>
                                                <v-flex xs12 sm6 md4>
                                                    <v-text-field v-model="userItem.name"
                                                                  :rules="[rules.required]"
                                                                  label="Name"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4>
                                                    <v-text-field
                                                            v-model="userItem.email"
                                                            :rules="[rules.required, rules.email]"
                                                            label="Email"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4>
                                                    <v-text-field v-model="userItem.phoneNumber"
                                                                  :rules="[rules.required]"
                                                                  label="Phone Number"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4>
                                                    <v-combobox
                                                            :rules="[rules.required]"
                                                            v-model="userItem.status"
                                                            :items="userStatus"
                                                            label="Status"
                                                    ></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                        </v-form>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-flex>
                </v-layout>

                <v-data-table
                        :headers="headers"
                        :items="users"
                        class="elevation-1"
                        :loading="loading"
                        :pagination.sync="pagination"
                        item-key="_id"
                        :total-items="pagination.totalItems"
                        :rows-per-page-items="[5,10,25,50]"
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item._id }}</td>
                        <td class="text-xs-left">{{ props.item.createdAt | formatIsoDateTime }}</td>
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td class="text-xs-left">{{ props.item.email }}</td>
                        <td class="text-xs-left">{{ props.item.phoneNumber }}</td>
                        <td class="text-xs-left">{{ props.item.status }}</td>
                        <td class="text-xs-right">
                            <v-btn color="primary" flat icon @click="viewNotes(props.item._id)">
                                <v-icon>visibility</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-layout>
        </v-slide-y-transition>
    </v-container>
</template>

<script>
  import NoteDialog from './NoteDialog';

  export default {
    name: 'Customers',
    components: {
      NoteDialog
    },
    data() {
      return {
        valid: false,
        dialog: false,
        notesDialog: false,
        searchText: '',
        headers: [
          {
            text: 'ID',
            align: 'left',
            sortable: false,
            value: '_id'
          },
          { text: 'Created', value: 'createdAt', sortable: true },
          { text: 'Name', value: 'name', sortable: true },
          { text: 'Email', value: 'email', sortable: true },
          { text: 'Phone', value: 'phoneNumber', sortable: true },
          { text: 'Status', value: 'status', sortable: true },
          { text: 'Notes', value: 'notesCount', sortable: true }
        ],
        users: [],
        loading: false,
        pagination: {
          page: 1,
          totalItems: 0,
          rowsPerPage: 5,
          sortBy: 'name',
          descending: false,
          search: ''
        },
        userStatus: ['prospective', 'current', 'non-active'],
        userItem: {
          name: '',
          email: '',
          phoneNumber: '',
          status: null
        },
        notesFromUser: null,
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      }
    },
    computed: {},
    methods: {
      closeNotesDialog() {
        this.notesFromUser = null;
        this.notesDialog = false;
      },
      viewNotes(userId) {
        this.notesFromUser = userId;
        this.notesDialog = true;
      },
      saveUser() {
        if (this.$refs.form.validate()) {
          fetch('/api/users', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(this.userItem)
          }).then(() => {
            this.userItem = {
              name: '',
              email: '',
              phoneNumber: '',
              status: null
            };
            this.loadUsers();
            this.close();
          });
        }
        this.valid = true;
      },
      loadUsers() {
        const sort = JSON.stringify({ [this.pagination.sortBy]: this.pagination.descending ? -1 : 1 });
        fetch(`/api/users?page=${this.pagination.page}&size=${this.pagination.rowsPerPage}&sort=${sort}&filter=${this.pagination.search}`)
          .then(res => res.json())
          .then((data) => {
            console.log(data);
            this.users = data.items;
            this.loading = false;
            this.pagination = {
              ...this.pagination,
              totalItems: data.totalItems,
              rowsPerPage: data.size,
              page: data.currentPage
            };
          })
          .catch((err) => {
            this.loading = false;
          });
      },
      search() {
        this.pagination.search = this.searchText || '';
        this.loadUsers();
      },
      close() {
        this.dialog = false;
      },

      save() {
        this.saveUser();
      }
    },
    mounted() {
      this.loading = true;
      this.loadUsers();
    },
    watch: {
      pagination: {
        handler(newVal, oldVal) {
          if (
            newVal.page !== oldVal.page ||
            newVal.rowsPerPage !== oldVal.rowsPerPage ||
            newVal.sortBy !== oldVal.sortBy ||
            newVal.descending !== oldVal.descending ||
            newVal.search !== oldVal.search
          ) {
            this.loadUsers();
          }
        },
        deep: true
      },
      dialog(val) {
        val || this.close()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
