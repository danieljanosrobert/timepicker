<template>
  <v-card>
    <v-col cols="12" class="pa-0">
      <v-card class="pa-0 brown lighten-4">
        <v-card-text class="text-center" style="font-size: 2em;">Személyes Adatok</v-card-text>
      </v-card>
    </v-col>
    <v-form class="pa-0" id="register-form" @submit.prevent="register">
      <v-row class="pb-4 ma-0">
        <v-col class="pa-6 pb-0 pr-3" cols="12" sm="6" md="4">
          <v-text-field v-model="lastName" label="Vezetéknév" required :error-messages="lastNameErrors"
                        @input="$v.lastName.$touch()" @blur="$v.lastName.$touch()">
          </v-text-field>
        </v-col>
        <v-col class="pa-6 pb-0 pl-3" cols="12" sm="6" md="4">
          <v-text-field v-model="firstName" label="Keresztnév" required :error-messages="firstNameErrors"
                        @input="$v.firstName.$touch()" @blur="$v.firstName.$touch()">
          </v-text-field>
        </v-col>
        <v-col class="pa-6 pb-0 pr-3" cols="12" sm="6" md="4">
          <v-text-field v-model="city" label="Város"></v-text-field>
        </v-col>
        <v-col class="pa-6 pb-0 pl-3" cols="12" sm="6">
          <v-select v-model="age" :items="ages" label="Kor"></v-select>
        </v-col>
        <v-col class="pa-6 pb-0 pr-3" cols="12" sm="6">
          <v-autocomplete
            v-model="selectedServiceTags"
            :items="serviceTags"
            label="Előnyben részesített szolgáltatások"
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
    <v-form class="pa-6" @submit.prevent="save">
      <v-divider class="pb-2"></v-divider>
      <v-text-field
        id="leavepassword"
        label="Mentéshez szükséges jelszó"
        v-model="password"
        name="password"
        type="password"
        required
        :error-messages="passwordErrors"
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>
      <v-btn class="mr-4" :disabled="buttonDisabled" type="submit">Mentés</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import constants from '@/utils/constants';
import userService from '@/service/userService';
import { required, minLength } from 'vuelidate/lib/validators';
import { nameRegex } from '@/utils/customValidators';

export default {
  name: 'UserPersonalSettings',
  data: () => ({
    lastName: '',
    firstName: '',
    city: '',
    age: '',
    selectedServiceTags: [],
    password: '',
    buttonDisabled: false,
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
    password: {
      required,
      minLength: minLength(6),
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
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) {
        return errors;
      }
      !this.$v.password.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
      !this.$v.password.required && errors.push(constants.validationErrorMessages.required);
      return errors;
    },
    serviceTags() {
      return constants.serviceTags;
    },
    ages() {
      return constants.ages;
    },
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      this.password = '';
      this.$root.$emit('startLoading');
      try {
        await userService.fetchUserData({user_email: this.$store.state.loggedInUserEmail})
          .then( (user) => {
            this.lastName = user.data.lastName;
            this.firstName = user.data.firstName;
            this.city = user.data.city;
            this.age = user.data.age;
            this.selectedServiceTags = user.data.selectedServiceTags;
          });
      } catch {
      } finally {
        this.$root.$emit('stopLoading');
      }
    },
    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.buttonDisabled = true;
      this.$root.$emit('startLoading');
      try {
        await userService.modifyUser({
          user_email: this.$store.state.loggedInUserEmail,
          password: this.password,
          lastName: this.lastName,
          firstName: this.firstName,
          city: this.city,
          age: this.age,
          selectedServiceTags: this.selectedServiceTags,
        });
        this.$store.dispatch('openSnackbar', {
          message: 'Személyes beállítások mentésre kerültek',
          type: 'success',
        });
        this.$v.$reset();
        this.fetchUserData();
      } catch (err) {
        this.$store.dispatch('openSnackbar', {
          message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
            || 'Hiba történt a mentés során!',
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
