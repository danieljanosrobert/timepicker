<template>
  <v-row justify="center">
    <v-dialog v-model="reservationDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Indítsuk a foglalást?</v-card-title>
        <v-card-text>Foglalás elküldése után a foglalás már nem szerkeszthető.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="reservationDialogVisible = false">Mégsem</v-btn>
          <v-btn dark color="success darken-2" :disabled="reservationInProgress" @click="book">Igen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="brown lighten-4">
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{event.start}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text :disabled="reservationInProgress" @click="openReservationDialog()">Foglalás</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-col class="pa-8 text-justify">
          <span class="font-size-13">Ön időpontfoglalást szeretne indítani <span class="highlight">{{serviceName}}</span> szolgáltató felé 
          <span class="highlight">{{event.start}}</span> időpontra. Amennyiben az időpont megfelel Önnek, kérem töltse ki az alábbi űrlapot.
          Az űrlap beadásának pillanatában a szolgáltató értesítve lesz az időpontfoglalással kapcsolatban.<br/>
          Amennyiben be van jelentkezve, az űrlap automatikusan kitöltésre kerül.</span>
        </v-col>
        <v-divider/>
        <v-card-text>
          <v-container fluid>
            <v-form id="book-form" @submit.prevent="openReservationDialog()">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="lastName" :disabled="$store.state.loggedInAsUser" label="Vezetéknév*" required 
                                :error-messages="lastNameErrors" @input="$v.lastName.$touch()" @blur="$v.lastName.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="firstName" :disabled="$store.state.loggedInAsUser" label="Keresztnév*" required
                  :error-messages="firstNameErrors" @input="$v.firstName.$touch()" @blur="$v.firstName.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="email" :disabled="$store.state.loggedInAsUser" label="Email cím*" required
                                :error-messages="emailErrors" @input="$v.email.$touch()" @blur="$v.email.$touch()">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="age" :disabled="$store.state.loggedInAsUser" :items="ages" label="Kor"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="city" :disabled="$store.state.loggedInAsUser" label="Város"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="comment" label="Megjegyzés"></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*Kitöltés kötelező</small>
          <v-col>
            <v-divider/>
            <v-btn
              type="submit"
              class="text-right pa-2 my-2"
              form="book-form"
              color="brown lighten-4"
              block
              @click="openReservationDialog()"
              :disabled="reservationInProgress"
            >Foglalás</v-btn>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import constants from '@/utils/constants';
import serviceService from '@/service/serviceService';
import userService from '@/service/userService';
import reservationService from '@/service/reservationService';
import { required, email } from 'vuelidate/lib/validators';
import { nameRegex } from '@/utils/customValidators';

export default {
  name: 'UserRegister',
  data: () => ({
    dialog: false,
    reservationDialogVisible: false,
    reservationInProgress: false,
    lastName: '',
    firstName: '',
    city: '',
    email: '',
    age: '',
    event: {},
    serviceName: '',
    comment: '',
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
    ages() {
      return constants.ages;
    },
  },
  watch: {
    dialog(val) {
      document
        .querySelector('html')
        .classList.toggle('application--dialog-opened', val);
    },
  },
  methods: {
    openReservationDialog() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.reservationDialogVisible = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$v.$reset();
    },
    async getServiceName() {
      this.$root.$emit('startLoading');
      try {
        await serviceService.getServiceName(this.$route.params.service_id)
            .then((serviceName) => {
              this.serviceName = serviceName.data;
            });
      } catch {
      } finally {
        this.$root.$emit('stopLoading');
      }
    },
    async completeFormIfLoggedIn() {
      if (this.$store.getters.userAuth) {
        this.$root.$emit('startLoading');
        try {
          await userService.fetchUserData({user_email: this.$store.state.loggedInUserEmail})
            .then( (user) => {
              this.email = this.$store.state.loggedInUserEmail;
              this.lastName = user.data.lastName;
              this.firstName = user.data.firstName;
              this.city = user.data.city;
              this.age = user.data.age;
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      }
    },
    async book() {
      this.reservationInProgress = true;
      this.reservationDialogVisible = false;
      this.$root.$emit('startLoading');
      try {
        await reservationService.reserve({
          service_id: this.$route.params.service_id,
          email: this.email,
          lastName: this.lastName,
          firstName: this.firstName,
          city: this.city,
          age: this.age,
          comment: this.comment,
          start: this.event.start,
          status: this.isOwnService() ? constants.reservationStatuses[0] : constants.reservationStatuses[2],
        });
        this.$store.dispatch('openSnackbar', {
          message: this.isOwnService() ? 'Sikeres időpontfoglalás'
            : 'Sikeres időpontfoglalás. Az időpont megerősítéséhez szükséges linket e-mailben kapta meg.',
          type: 'success',
        });
        this.$root.$emit('newReservation');
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Sikertelen időpontfoglalás. Kérem próbálja újra később',
          type: 'error',
        });
      } finally {
        this.closeDialog();
        this.resetFields();
        this.reservationInProgress = false;
        await this.completeFormIfLoggedIn();
        this.$root.$emit('stopLoading');
      }
    },
    isOwnService() {
      return this.$store.state.ownServiceId === this.$route.params.service_id;
    },
    resetFields() {
      this.dialog = false;
      this.reservationDialogVisible = false;
      this.lastName = '';
      this.firstName = '';
      this.city = '';
      this.email = '';
      this.age = '';
      this.event = {};
      this.serviceName = '';
      this.comment = '';
    },
  },
  async mounted() {
    this.$root.$on('bookingDialog', (data) => {
      this.dialog = true;
      this.event = data;
    });
    await this.getServiceName();
    await this.completeFormIfLoggedIn();
  },
};
</script>

<style scoped>
  .font-size-13 {
    font-size: 1.3em;
  }
  .highlight {
    font-weight: bold;
    color: brown;
  }
</style>
