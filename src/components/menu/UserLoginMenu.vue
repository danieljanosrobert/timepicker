<template>
  <v-card :elevation="0" width="400">
    <v-toolbar color="brown lighten-4">
      <v-toolbar-title>Felhasználó belépés</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form class="pa-2 text-center" @submit.prevent="login" id="login-form">
        <v-text-field label="E-mail" name="login" prepend-icon="mdi-account" v-model="email" type="text">
        </v-text-field>

        <v-text-field id="password" label="Jelszó" v-model="password" name="password" prepend-icon="mdi-lock"
                      type="password"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="pa-0 pr-2 pb-2">
      <v-spacer></v-spacer>
      <v-btn type="submit" color="brown lighten-3" form="login-form">Belépés</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import userService from '@/service/userService';
  import serviceService from '@/service/serviceService';

  export default {
    name: 'UserLoginMenu',
    data: () => ({
      email: '',
      password: '',
    }),
    methods: {
      async login() {
        try {
          const response = await userService.login({
            email: this.email,
            password: this.password,
          });
          this.$store.dispatch('refreshBearerToken', response.data.token);
          this.$store.dispatch('updateUserEmail', this.email);
          this.$store.dispatch('userLogin');
          this.$root.$emit('loggedIn');
          this.$store.dispatch('openSnackbar', {
              message: 'Sikeres bejelentkezés',
              type: 'success',
            });
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
