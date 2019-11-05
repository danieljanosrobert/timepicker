<template>
  <v-container fluid fill-height class="brown-menu-gradient">
    <v-layout align-center justify-center>
      <v-card width="600">
        <v-toolbar color="brown lighten-4">
          <v-toolbar-title>Adminisztrátor regisztráció</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form class="pa-2 text-center">
            <v-text-field label="E-mail" name="login" prepend-icon="mdi-account" v-model="email" type="text">
            </v-text-field>

            <v-text-field label="Név" name="name" prepend-icon="fa-signature" v-model="name" type="text">
            </v-text-field>

            <v-text-field label="Szolgáltatás neve" name="service" prepend-icon="fa-briefcase" v-model="servicename"
                          type="text">
            </v-text-field>

            <v-text-field id="password" label="Jelszó" v-model="password" name="password" prepend-icon="mdi-lock"
                          type="password"></v-text-field>
            <v-text-field id="confirmPassword" label="Jelszó újra" v-model="confirmPassword" name="passwordagain"
                          prepend-icon="mdi-lock" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-6">
          <v-spacer></v-spacer>
          <v-btn color="brown lighten-4" @click.stop="$router.go(-1)">Vissza</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="brown lighten-3" @click.stop="register">Regisztráció</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import adminUserService from '@/service/adminUserService';

  export default {
    name: 'Register',
    data: () => ({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      servicename: '',
    }),
    methods: {
      async register() {
        try {
          const response = await adminUserService.register({
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
            name: this.name,
            servicename: this.servicename,
          });
          this.$store.dispatch('refreshBearerToken', response.data.token);
          this.$store.dispatch('setServiceName', this.servicename);
          this.$store.dispatch('setUserName', this.name);
          this.$store.dispatch('openSnackbar', {
            message: 'Sikeres regisztráció',
            type: 'success',
          });
          this.$router.go(-1);
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
