<template>
  <v-card :elevation="0" width="400">
    <v-toolbar color="brown lighten-4">
      <v-toolbar-title>Adminisztrátori belépés</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form class="pa-2 text-center" @submit.prevent="adminLogin" id="login-form">
        <v-text-field label="E-mail" name="login" prepend-icon="mdi-account" v-model="email" type="text">
        </v-text-field>

        <v-text-field id="password" label="Jelszó" v-model="password" name="password" prepend-icon="mdi-lock"
                      type="password"></v-text-field>
      </v-form>
      <div class="text-center">
        <router-link class="link-disable-decoration" to="/admin/register">Előbb regisztrálnék!</router-link>
      </div>
    </v-card-text>
    <v-card-actions class="pa-0 pr-2 pb-2">
      <v-spacer></v-spacer>
      <v-btn type="submit" color="brown lighten-3" form="login-form">Belépés</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import adminUserService from '@/service/adminUserService';
  import serviceService from '@/service/serviceService';

  export default {
    name: 'AdminLoginMenu',
    data: () => ({
      email: '',
      password: '',
    }),
    methods: {
      async adminLogin() {
        const response = await adminUserService.login({
          email: this.email,
          password: this.password,
        });
        this.$store.dispatch('refreshBearerToken', response.data.token);
        this.$store.dispatch('updateUserEmail', this.email);
        const serviceId = await serviceService.postObtainServiceId({
          user_email: this.email,
        });
        this.$store.dispatch('adminLogin', serviceId.data.service_id);
        this.$root.$emit('adminLoggedIn');
      },
    },
  };
</script>

<style scoped>

</style>
