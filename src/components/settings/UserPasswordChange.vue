<template>
  <v-card>
    <v-col cols="12" class="pa-0">
      <v-card class="pa-0 brown lighten-4">
        <v-card-text class="text-center" style="font-size: 2em;">Jelszóváltoztatás</v-card-text>
      </v-card>
    </v-col>
    <v-form @submit.prevent="save" class="pa-0">
      <v-row class="pb-4 ma-0">
        <v-col cols="12" class="pa-6 pb-0">
          <v-text-field type="password" v-model="oldPassword" label="Régi jelszó"></v-text-field>
        </v-col>
        <v-col cols="12" class="pa-6 pb-0">
          <v-text-field type="password" v-model="newPassword" label="Új jelszó"></v-text-field>
        </v-col>
        <v-col cols="12" class="pa-6 pb-0">
          <v-text-field type="password" v-model="confirmPassword" label="Új jelszó újra"></v-text-field>
        </v-col>
        <v-btn type="submit" class="ml-6 ma-4">Mentés</v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import userService from '@/service/userService';

export default {
  name: 'UserPasswordChange',
  data: () => ({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }),
  methods: {
    async save() {
      try {
        await userService.changePassword({
          user_email: this.$store.state.loggedInUserEmail,
          oldPassword: this.oldPassword,
          password: this.newPassword,
          confirmPassword: this.confirmPassword,
        });
        this.$store.dispatch('openSnackbar', {
          message: 'Jelszó sikeresen megváltoztatva.',
          type: 'success',
        });
        Object.assign(this.$data, this.$options.data());
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Hiba történt a jelszó megváltoztatása során!',
          type: 'error',
        });
      }
    },
  },
};
</script>
