<template>
  <v-container fluid fill-height class="brown-menu-gradient">
    <v-layout align-center justify-center>
      <v-card width="600">
        <v-toolbar color="brown lighten-4">
          <v-toolbar-title>Adminisztrátor regisztráció</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form class="pa-2 text-center">
            <v-text-field label="E-mail" name="login" prepend-icon="mdi-account" v-model="email" type="text"
                          :error-messages="emailErrors" required @input="$v.email.$touch()" @blur="$v.email.$touch()">
            </v-text-field>

            <v-text-field label="Név" name="name" prepend-icon="fa-signature" v-model="name" type="text"
                          :error-messages="nameErrors" required @input="$v.name.$touch()" @blur="$v.name.$touch()">
            </v-text-field>

            <v-text-field label="Szolgáltatás neve" name="service" prepend-icon="fa-briefcase"
                          v-model="serviceName" type="text" :error-messages="serviceNameErrors"
                          required @input="$v.serviceName.$touch()" @blur="$v.serviceName.$touch()">
            </v-text-field>

            <v-text-field id="password" label="Jelszó" name="password" prepend-icon="mdi-lock"
                          v-model="password" type="password" :error-messages="passwordErrors"
                          required @input="$v.password.$touch()" @blur="$v.password.$touch()">
            </v-text-field>
            <v-text-field id="confirmPassword" label="Jelszó újra" v-model="confirmPassword" name="passwordagain"
                          prepend-icon="mdi-lock" type="password" :error-messages="confirmPasswordErrors"
                          required @input="$v.confirmPassword.$touch()" @blur="$v.confirmPassword.$touch()">
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-6">
          <v-spacer></v-spacer>
          <v-btn color="brown lighten-4" @click.stop="$router.go(-1)">Vissza</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="brown lighten-3" :disabled="buttonDisabled" @click.stop="register">Regisztráció</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import adminUserService from '@/service/adminUserService';
  import serviceService from '@/service/serviceService';
  import constants from '@/utils/constants';
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
  import { nameRegex, serviceNameRegex } from '@/utils/customValidators';

  export default {
    name: 'Register',
    data: () => ({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      serviceName: '',
      buttonDisabled: false,
    }),
    validations: {
      name: {
        required,
        nameRegex,
      },
      serviceName: {
        required,
        serviceNameRegex,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: {
        required,
        minLength: minLength(6),
        sameAs: sameAs('password'),
      },
    },
    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.name.$dirty) {
          return errors;
        }
        !this.$v.name.required && errors.push(constants.validationErrorMessages.required);
        !this.$v.name.nameRegex && errors.push(constants.validationErrorMessages.nameRegex);
        return errors;
      },
      serviceNameErrors() {
        const errors = [];
        if (!this.$v.serviceName.$dirty) {
          return errors;
        }
        !this.$v.serviceName.required && errors.push(constants.validationErrorMessages.required);
        !this.$v.serviceName.serviceNameRegex && errors.push(constants.validationErrorMessages.serviceNameRegex);
        return errors;
      },
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
      confirmPasswordErrors() {
        const errors = [];
        if (!this.$v.confirmPassword.$dirty) {
          return errors;
        }
        !this.$v.confirmPassword.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.confirmPassword.sameAs && errors.push(constants.validationErrorMessages.passwordSameAs);
        !this.$v.confirmPassword.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
    },
    methods: {
      async register() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.buttonDisabled = true;
        this.$root.$emit('startLoading');
        try {
          const response = await adminUserService.register({
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
            name: this.name,
            serviceName: this.serviceName,
          });
          this.$store.dispatch('openSnackbar', {
            message: 'Sikeres regisztráció. Lépjen be az oldal használatához.',
            type: 'success',
          });
          this.$router.go(-1);
        } catch (err) {
          this.$store.dispatch('openSnackbar', {
            message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
              || 'Hiba történt az adatok feldolgozása során. Kérem próbálja újra később',
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
