<template>
  <v-row justify="center">
    <v-dialog v-model="reservationDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Indítsuk a foglalást?</v-card-title>
        <v-card-text>Foglalás elküldése után a foglalás már nem szerkeszthető.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="reservationDialogVisible = false">Mégse</v-btn>
          <v-btn dark color="success darken-2" @click="book">Igen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="brown lighten-4">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{event.start}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="reservationDialogVisible = true">Foglalás</v-btn>
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
            <v-form id="book-form" @submit.prevent="book">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="lastName" :disabled="$store.state.loggedInAsUser" label="Vezetéknév*" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="firstName" :disabled="$store.state.loggedInAsUser" label="Keresztnév*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="email" :disabled="$store.state.loggedInAsUser" label="Email cím*" required></v-text-field>
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
              @click="reservationDialogVisible = true"
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

export default {
  name: 'UserRegister',
  data: () => ({
    dialog: false,
    reservationDialogVisible: false,
    lastName: '',
    firstName: '',
    city: '',
    email: '',
    age: '',
    event: {},
    serviceName: '',
    comment: '',
  }),
  computed: {
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
    async getServiceName() {
      await serviceService.getServiceName(this.$route.params.service_id)
          .then((serviceName) => {
            this.serviceName = serviceName.data;
          });
    },
    async completeFormIfLoggedIn() {
      if (this.$store.getters.userAuth) {
      await userService.fetchUserData({user_email: this.$store.state.loggedInUserEmail})
        .then( (user) => {
          this.email = this.$store.state.loggedInUserEmail;
          this.lastName = user.data.lastName;
          this.firstName = user.data.firstName;
          this.city = user.data.city;
          this.age = user.data.age;
        });
      }
    },
    async book() {
      try {
        await reservationService.reserve({
          serviceId: this.$route.params.service_id,
          email: this.email,
          lastName: this.lastName,
          firstName: this.firstName,
          city: this.city,
          age: this.age,
          comment: this.comment,
          start: this.event.start,
        });
        this.$store.dispatch('openSnackbar', {
          message: 'Sikeres időpontfoglalás',
          type: 'success',
        });
        this.reservationDialogVisible = false;
        this.$root.$emit('newReservation');
        this.dialog = false;
        Object.assign(this.$data, this.$options.data());
        await this.completeFormIfLoggedIn();
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Sikertelen időpontfoglalás. Kérem próbálja újra később',
          type: 'error',
        });
        this.reservationDialogVisible = false;
        this.dialog = false;
        Object.assign(this.$data, this.$options.data());
        await this.completeFormIfLoggedIn();
      }
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
