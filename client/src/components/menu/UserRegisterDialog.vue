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
            <v-btn text :disabled="registerButtonDisabled" @click="register()">Regisztráció</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title>Új felhasználó regisztrálása a rendszerbe</v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-form id="register-form" @submit.prevent="register">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="lastName" label="Vezetéknév*" required :error-messages="lastNameErrors" 
                                @input="$v.lastName.$touch()" @blur="$v.lastName.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="firstName" label="Keresztnév*" required :error-messages="firstNameErrors"
                                @input="$v.firstName.$touch()" @blur="$v.firstName.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="city" label="Város"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="email" label="Email cím*" required :error-messages="emailErrors"
                                @input="$v.email.$touch()" @blur="$v.email.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="password" label="Jelszó*" type="password" :error-messages="passwordErrors"
                                @input="$v.password.$touch()" @blur="$v.password.$touch()" required>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="confirmPassword" label="Jelszó újra*" type="password" :error-messages="confirmPasswordErrors"
                                @input="$v.confirmPassword.$touch()" @blur="$v.confirmPassword.$touch()" required>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*Kitöltés kötelező</small>
          <v-col>
            <v-divider/>
            <v-btn type="submit" class="text-right pa-2 my-2" form="register-form" color="brown lighten-4"
                   block :disabled="registerButtonDisabled">
                   Regisztráció
            </v-btn>
          </v-col>
        </v-card-text>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import constants from '@/utils/constants';
import userService from '@/service/userService';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import { nameRegex } from '@/utils/customValidators';

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
    registerButtonDisabled: false,
  }),
  validations: {
    firstName: {
      required,
      nameRegex,
    },
    lastName: {
      required,
      nameRegex,
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
  watch: {
    dialog(val) {
      document.querySelector('html').classList.toggle('application--dialog-opened', val);
    },
  },
  computed: {
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) {
        return errors;
      }
      !this.$v.lastName.required && errors.push(constants.validationErrorMessages.required);
      !this.$v.lastName.nameRegex && errors.push(constants.validationErrorMessages.nameRegex);
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) {
        return errors;
      }
      !this.$v.firstName.required && errors.push(constants.validationErrorMessages.required);
      !this.$v.firstName.nameRegex && errors.push(constants.validationErrorMessages.nameRegex);
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
  mounted() {
    this.$root.$on('openRegisterDialog', () => {
      this.dialog = true;
    });
  },
  methods: {
    async register() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.registerButtonDisabled = true;
      this.$root.$emit('startLoading');
      try {
        const response = await userService.register({
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          lastName: this.lastName,
          firstName: this.firstName,
          city: this.city,
        });
        this.$store.dispatch('openSnackbar', {
          message: 'Sikeres regisztráció. Lépjen be az oldal használatához.',
          type: 'success',
        });
        this.dialog = false;
        this.$v.$reset();
        this.resetFields();
      } catch (err) {
        this.$store.dispatch('openSnackbar', {
          message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
              || 'Hiba történt az adatok feldolgozása során. Kérem próbálja újra később',
          type: 'error',
        });
      } finally {
        this.registerButtonDisabled = false;
        this.$root.$emit('stopLoading');
      }
    },
    resetFields() {
      this.dialog = false ;
      this.lastName = '' ;
      this.firstName = '' ;
      this.city = '' ;
      this.email = '' ;
      this.password = '' ;
      this.confirmPassword = '' ;
    },
  },
};
</script>

<style scoped>
</style>
