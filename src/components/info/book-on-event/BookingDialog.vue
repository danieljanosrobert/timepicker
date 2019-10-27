<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="brown">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Időpontfoglalás ({{$store.state.aboutPage}}: {{event.start}})</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false">Foglalás</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Content filtering</v-list-item-title>
              <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Age*"
                        required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                        label="Interests"
                        multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name: 'BookingDialog',
    data: () => ({
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      event: {},
    }),
    watch: {
      dialog(val) {
        document.querySelector('html').classList.toggle('application--dialog-opened', val);
      },
    },
    mounted() {
      this.$root.$on('bookingDialog', (data) => {
        this.dialog = true;
        this.event = data;
      });
    },
  };
</script>

<style scoped>
</style>
