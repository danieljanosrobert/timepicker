<template>
  <v-card :elevation="0" width="400">
    <v-toolbar color="brown lighten-4">
      <v-toolbar-title>Szolgáltató belépés</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form class="pa-2 text-center" @submit.prevent="adminLogin" id="login-form">
        <v-text-field label="E-mail" name="login" prepend-icon="mdi-account" v-model="email" type="text"
                      :error-messages="emailErrors" required @input="$v.email.$touch()" @blur="$v.email.$touch()">
        </v-text-field>

        <v-text-field id="password" label="Jelszó" v-model="password" name="password"
                      prepend-icon="mdi-lock" type="password" required :error-messages="passwordErrors"
                      @input="$v.password.$touch()" @blur="$v.password.$touch()">
        </v-text-field>
      </v-form>
      <div class="text-center">
        <router-link class="link-disable-decoration" to="/admin/register">Előbb regisztrálnék!</router-link>
      </div>
    </v-card-text>
    <v-card-actions class="pa-0 pr-2 pb-2">
      <v-spacer></v-spacer>
      <v-btn type="submit" :disabled="buttonDisabled" color="brown lighten-3" form="login-form">Belépés</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import adminUserService from '@/service/adminUserService';
  import serviceService from '@/service/serviceService';
  import constants from '@/utils/constants';
  import { required, email, minLength } from 'vuelidate/lib/validators';

  export default {
    name: 'AdminLoginMenu',
    data: () => ({
      email: '',
      password: '',
      buttonDisabled: false,
    }),
    validations: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
    computed: {
      emailErrors() {
        const errors = [];
        if (!this.$v.email.$dirty) {
          return errors;
        }
        !this.$v.email.email && errors.push(constants.validationErrorMessages.email);
        !this.$v.email.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) {
          return errors;
        }
        !this.$v.password.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.password.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
    },
    methods: {
      async adminLogin() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.buttonDisabled = true;
        this.$root.$emit('startLoading');
        try {
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
          this.$root.$emit('loggedIn');
          this.$store.dispatch('openSnackbar', {
            message: 'Sikeres bejelentkezés',
            type: 'success',
          });
          if (this.$router.currentRoute.path !== '/') {
            this.$router.push('/');
          }
        } catch (err) {
          this.$store.dispatch('openSnackbar', {
            message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
              || 'Hiba történt bejelentkezés során. Kérem próbálja újra később',
            type: 'error',
          });
        } finally {
          this.buttonDisabled = false;
          this.$root.$emit('stopLoading');
        }
      },
    },
  };
</script>

<style scoped>

</style>
