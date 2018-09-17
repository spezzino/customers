<template>
    <div>
        <v-dialog v-model="newNote" max-width="500px">

            <v-card>
                <v-card-title>
                    <span class="headline">Add note</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-textarea v-model="noteItem.body" label="Content"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="closeNewNoteModal">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="saveNote">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeModal">
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Notes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat dark @click="openNewNoteModal">New Note</v-btn>
                <v-btn dark flat @click="closeModal">Close</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-layout row wrap>
            <v-flex md8 offset-md2>
                <v-data-table
                        :headers="headers"
                        :items="notes"
                        :loading="loading"
                        class="elevation-1"
                        item-key="_id"
                        :rows-per-page-items="[5,10,25,50]"
                >
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.date | formatIsoDateTime }}</td>
                        <td class="text-xs-left">{{ props.item.body }}</td>
                        <td class="text-xs-right">
                            <v-btn color="error" flat icon @click="deleteNote(props.item._id)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
  export default {
    name: 'NoteDialog',
    props: {
      close: {
        type: Function,
        default: () => {
        }
      },
      userId: {
        default: null
      }
    },
    data() {
      return {
        newNote: false,
        noteItem: {
          content: ''
        },
        loading: false,
        headers: [
          { text: 'Created', value: 'createdAt', sortable: true },
          { text: 'Note', value: 'body', sortable: false },
          { text: 'Delete', sortable: false },
        ],
        notes: []
      };
    },
    methods: {
      closeModal() {
        this.$props.close();
      },
      openNewNoteModal() {
        this.newNote = true;
      },
      closeNewNoteModal() {
        this.newNote = false;
      },
      saveNote() {
        fetch(`http://localhost:3000/api/users/${this.$props.userId}/notes`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(this.noteItem)
        }).then(() => {
          this.noteItem = {
            content: ''
          };
          this.loadNotes();
          this.closeNewNoteModal();
        });
      },
      deleteNote(noteId) {
        fetch(`/api/users/${this.$props.userId}/notes/${noteId}`, {
          method: 'DELETE'
        }).then(() => {
          this.loadNotes();
        });
      },
      loadNotes() {
        this.loading = true;
        fetch(`/api/users/${this.$props.userId}/notes`)
          .then(res => res.json())
          .then((data) => {
            this.notes = data.notes;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    mounted() {
      this.loadNotes();
    }
  }
</script>

<style scoped>

</style>
