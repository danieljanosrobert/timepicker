<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-img src="https://cdn.vuetifyjs.com/images/lists/ali.png" width="400px" height="300px" dark>

        <v-row dense class="float-right fill-height">
          <v-col cols="12" class="text-right pa-2">
            <v-btn dark icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-right align-self-end">
            <v-card-title class="white--text contact-name">
              <div class="display-1">{{$store.state.aboutPage}}</div>
            </v-card-title>
          </v-col>
        </v-row>
      </v-img>

      <v-list two-line>
        <v-list-item @click="">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-phone</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>(650) 555-1234</v-list-item-title>
            <v-list-item-subtitle>Mobile</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="">
          <v-list-item-action></v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>(323) 555-6789</v-list-item-title>
            <v-list-item-subtitle>Work</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item @click="">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-email</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>aliconnors@example.com</v-list-item-title>
            <v-list-item-subtitle>Personal</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="">
          <v-list-item-action></v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>ali_connors@example.com</v-list-item-title>
            <v-list-item-subtitle>Work</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item @click="">
          <v-list-item-icon>
            <v-icon color="indigo">mdi-map-marker</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>1400 Main Street</v-list-item-title>
            <v-list-item-subtitle>Orlando, FL 79938</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'Contact',
    data: () =>  ({
      dialog: false,
    }),
    mounted() {
      this.$root.$on('aboutEvent', (data) => {
        if (data === 'about') {
          this.dialog = true;
        }
      });
    },
  };
</script>

<style scoped>
  .contact-name {
    display: block;
  }
</style>
