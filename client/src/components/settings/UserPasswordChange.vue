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
          <v-text-field type="password" v-model="oldPassword" label="Régi jelszó" required
                        :error-messages="oldPasswordErrors" @input="$v.oldPassword.$touch()"
                        @blur="$v.oldPassword.$touch()">
          </v-text-field>
        </v-col>
        <v-col cols="12" class="pa-6 pb-0">
          <v-text-field type="password" v-model="newPassword" label="Új jelszó" required
                        :error-messages="newPasswordErrors" @input="$v.newPassword.$touch()"
                        @blur="$v.newPassword.$touch()">
          </v-text-field>
        </v-col>
        <v-col cols="12" class="pa-6 pb-0">
          <v-text-field type="password" v-model="confirmPassword" label="Új jelszó újra" required
                        :error-messages="confirmPasswordErrors" @input="$v.confirmPassword.$touch()"
                        @blur="$v.confirmPassword.$touch()">
          </v-text-field>
        </v-col>
        <v-btn type="submit" :disable="buttonDisabled" class="ml-6 ma-4">Mentés</v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
  import userService from '@/service/userService';
  import { required, minLength, sameAs } from 'vuelidate/lib/validators';
  import constants from '@/utils/constants';

  export default {
    name: 'UserPasswordChange',
    data: () => ({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      buttonDisabled: false,
    }),
    validations: {
      oldPassword: {
        required,
        minLength: minLength(6),
      },
      newPassword: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: {
        required,
        minLength: minLength(6),
        sameAs: sameAs('newPassword'),
      },
    },
    computed: {
      oldPasswordErrors() {
        const errors = [];
        if (!this.$v.oldPassword.$dirty) {
          return errors;
        }
        !this.$v.oldPassword.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.oldPassword.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      newPasswordErrors() {
        const errors = [];
        if (!this.$v.newPassword.$dirty) {
          return errors;
        }
        !this.$v.newPassword.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.newPassword.required && errors.push(constants.validationErrorMessages.required);
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
      async save() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.buttonDisabled = true;
        this.$root.$emit('startLoading');
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
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
          this.$v.$reset();
          this.resetFields();
        } catch (err) {
          this.$store.dispatch('openSnackbar', {
            message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
              || 'Hiba történt a jelszó megváltoztatása során!',
            type: 'error',
          });
        } finally {
          this.buttonDisabled = false;
          this.$root.$emit('stopLoading');
        }
      },
      resetFields() {
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
    },
  };
</script>
