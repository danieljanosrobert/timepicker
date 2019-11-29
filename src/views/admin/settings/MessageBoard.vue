<template>
  <v-container :style="setToFullScreen" fluid class="px-12 pb-0 text-justify" id="container">
    <MessageBoardEditor/>
    <v-dialog v-model="deleteDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan törölni szeretné az üzenetet?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="cancelDelete">Mégsem</v-btn>
          <v-btn dark color="error darken-4" @click="confirmDelete">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>

      <v-col cols="12">
        <v-card class=" brown lighten-4">
          <v-card-text class="text-center" style="font-size: 2em;"> Üzenőfal szerkesztése </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="pa-0">
        <template>
          <v-col cols="12">
            <v-btn block style="font-size: 1.5em;" @click.stop="addMessage">+ Új üzenet</v-btn>
          </v-col>
          <v-card-text v-if="!messages[0]" class="text-center py-6" style="font-size: 2em;"> Nem található üzenet </v-card-text>
        </template>
      </v-col>

      <v-col v-for="(item, index) in messages" :key="index" cols="12">

      <v-card class="pb-2 ">
        <v-row>
          <v-col class="py-0" cols="12" sm="8" order="2" order-sm="1">
            <v-card-title v-text="item.title"></v-card-title>
          </v-col>
          <v-col cols="12" sm="4" order="1" order-sm="2" class="text-right pr-8 ma-auto">
            <v-btn icon @click.stop="openEditor(index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click.stop="openDeleteDialog(index)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div class="mx-4">
            <span v-text="item.sub"></span>
          </div>
          <div class=" my-2">
            <v-card-text class="pre-wrap grey--text text--darken-2" v-text="item.content">
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import MessageBoardEditor from '@/components/settings/MessageBoardEditor';
  import messageService from '@/service/messageService';

  export default {
    name: 'MessegeBoard',
    data: () => ({
      deleteIndex: null,
      deleteDialogVisible: false,
      messages: [],
    }),
    components: {
      MessageBoardEditor,
    },
    computed: {
      setToFullScreen() {
        return {
          'min-height': `${window.innerHeight}px`,
        };
      },
    },
    methods: {
      async fetchMessages() {
        this.$root.$emit('startLoading');
        try {
          await messageService.getMessagesSettings(this.$store.state.ownServiceId)
            .then( (messages) => {
              this.messages = messages.data.messages;
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      openEditor(index) {
        this.$root.$emit('editMessage', {message: this.messages[index], index, new: false});
      },
      addMessage() {
        this.$root.$emit('editMessage', {new: true});
      },
      openDeleteDialog(index) {
        this.deleteIndex = index;
        this.deleteDialogVisible = true;
      },
      cancelDelete() {
        this.deleteIndex = null;
        this.deleteDialogVisible = false;
      },
      confirmDelete() {
        if (this.deleteIndex >= 0) {
          this.messages.splice(this.deleteIndex, 1);
        }
        this.save();
        this.deleteDialogVisible = false;
      },
      async save() {
        this.$root.$emit('startLoading');
        try {
          await messageService.saveMessages({
            user_email: this.$store.state.loggedInUserEmail,
            messages: JSON.stringify(this.messages),
          });
          this.fetchMessages();
          this.$store.dispatch('openSnackbar', {
            message: 'Üzenőfalon történő változtatások elmentve',
            type: 'success',
          });
        } catch {
          this.$store.dispatch('openSnackbar', {
            message: 'Hiba történt az üzenőfal változtatása során!',
            type: 'error',
          });
        } finally {
          this.$root.$emit('enableMessageBoardSaveButton');
          this.$root.$emit('stopLoading');
        }
      },
    },
    async mounted() {
      this.$root.$on('saveEditedMessage', async (data) => {
        if (data.new) {
          this.messages.unshift(_.cloneDeep(data.message));
          this.save();
        } else {
          this.$set(this.messages, data.index, _.cloneDeep(data.message));
          this.save();
        }
      });
      await this.fetchMessages();
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  .pre-wrap {
    line-height: 1.4;
    white-space: pre-wrap;
  }

  #container {
    background-color: $_yellow;
  }

</style>
