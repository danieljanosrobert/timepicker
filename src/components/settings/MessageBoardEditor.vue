<template>
  <v-dialog v-model="editorVisible" fluid max-width="100%" class="text-justify ma-0">
    <v-card>
      <v-col cols="12">
        <v-card class=" brown lighten-4">
          <v-card-text class="text-center" style="font-size: 2em;">{{title}}</v-card-text>
        </v-card>
      </v-col>
      <v-row class="ma-0">
        <v-col cols="12 pb-0">
          <v-text-field
                  v-model="message.title"
                  label="Cím">
          </v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-text-field
                  v-model="message.sub"
                  label="Alcím">
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
                  v-model="message.content"
                  label="Szövegtörzs"
                  rows="15"
          ></v-textarea>
        </v-col>
        <v-col class="text-center" cols="12">
          <v-btn @click.stop="editorVisible = false" dark color="brown darken-2" class="mx-2">
            Mégsem
          </v-btn>
          <v-btn autofocus @click.stop="saveMessage" dark color="brown" class="mx-2">
            Mentés
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    name: 'MessageBoardEditor',
    data: () => ({
      title: '',
      editorVisible: false,
      newMessage: false,
      message: {
        title: '',
        sub: '',
        content: '',
      },
      index: null,
    }),
    mounted() {
      this.$root.$on('editMessage', (data) => {
        this.editorVisible = true;
        this.newMessage = data.new;
        if (!data.new) {
          this.title = 'Szerkesztés';
          this.message = _.cloneDeep(data.message);
          this.index = data.index;
        } else {
          this.title = 'Új üzenet';
          this.message = {};
          this.index = null;
        }
      });
    },
    methods: {
      saveMessage() {
        this.editorVisible = false;
        this.$root.$emit('saveEditedMessage', {message: this.message, index: this.index, new: this.newMessage });
      },
    },
  };
</script>

<style scoped>

</style>
