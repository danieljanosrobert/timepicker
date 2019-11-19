<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="brown lighten-4">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Felhasználó regisztrálása</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="register()">Regisztráció</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title>Új felhasználó regisztrálása a rendszerbe</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-form id="register-form" @submit.prevent="register">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="lastName" label="Vezetéknév*" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="firstName" label="Keresztnév*" required ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="city" label="Város"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="email" label="Email cím*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="password" label="Jelszó*" type="password" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="confirmPassword" label="Jelszó újra*" type="password" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="age"
                          :items="['0-17', '18-24', '25-34', '35-44', '45-54', '54+']"
                          label="Kor"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                          v-model="selectedServiceTags"
                          :items="serviceTags"
                          label="Előnyben részesített szolgáltatások"
                          multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*Kitöltés kötelező</small>
          <v-col>
            <v-divider/>
            <v-btn type="submit" class="text-right pa-2 my-2" form="register-form" color="brown lighten-4" block @click="register()">Regisztráció</v-btn>
          </v-col>
        </v-card-text>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import constants from '@/utils/constants';
import userService from '@/service/userService';

export default {
  name: 'UserRegister',
  data: () => ({
    dialog: false,
    lastName: '',
    firstName: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    selectedServiceTags: [],
  }),
  watch: {
    dialog(val) {
      document.querySelector('html').classList.toggle('application--dialog-opened', val);
    },
  },
  computed: {
    serviceTags() {
      return constants.serviceTags;
    },
  },
  mounted() {
    this.$root.$on('openRegisterDialog', () => {
      this.dialog = true;
    });
  },
  methods: {
    async register() {
        try {
        const response = await userService.register({
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          lastName: this.lastName,
          firstName: this.firstName,
          city: this.city,
          age: this.age,
          selectedServiceTags: JSON.stringify(this.selectedServiceTags),
        });
        this.$store.dispatch('openSnackbar', {
          message: 'Sikeres regisztráció. Lépjen be az oldal használatához.',
          type: 'success',
        });
        this.dialog = false;
        Object.assign(this.$data, this.$options.data());
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Valami hiba történt!',
          type: 'error',
        });
      }
    },
  },
};
</script>

<style scoped>
</style>
