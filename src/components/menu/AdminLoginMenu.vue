<template>
  <v-card :elevation="0" width="400">
    <v-toolbar color="brown lighten-4">
      <v-toolbar-title>Adminisztrátori belépés</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form class="pa-2 text-center">
        <v-text-field label="Felhasználónév" name="login" prepend-icon="mdi-account" v-model="username" type="text">
        </v-text-field>

        <v-text-field id="password" label="Jelszó" v-model="password" name="password" prepend-icon="mdi-lock"
                      type="password"></v-text-field>
        <span>Elfelejtett jelszó?</span>
      </v-form>
    </v-card-text>
    <v-card-actions class="pa-0 pr-2 pb-2">
      <v-spacer></v-spacer>
      <v-btn color="brown lighten-3" @click="adminLogin">Belépés</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'AdminLoginMenu',
    data: () => ({
      fav: true,
      message: false,
      hints: true,
      username: '',
      password: '',
    }),
    methods: {
      adminLogin() {

        this.$store.dispatch('adminLogin');
        this.$root.$emit('adminLoggedIn');
      },
    },
  };
</script>

<style scoped>

</style>
