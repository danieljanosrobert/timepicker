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
          <v-text-field v-model="lastName" label="Vezetéknév" required></v-text-field>
        </v-col>
        <v-col class="pa-6 pb-0 pl-3" cols="12" sm="6" md="4">
          <v-text-field v-model="firstName" label="Keresztnév" required></v-text-field>
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
      ></v-text-field>
      <v-btn class="mr-4" @click="save">Mentés</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import constants from '@/utils/constants';
import userService from '@/service/userService';

export default {
  name: 'UserPersonalSettings',
  data: () => ({
    lastName: '',
    firstName: '',
    city: '',    
    age: '',
    selectedServiceTags: [],
    password: '',
  }),
  computed: {
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
      await userService.fetchUserData({user_email: this.$store.state.loggedInUserEmail})
        .then( (user) => {
          this.lastName = user.data.lastName;
          this.firstName = user.data.firstName;
          this.city = user.data.city;
          this.age = user.data.age;
          this.selectedServiceTags = user.data.selectedServiceTags;
        });
    },
    async save() {
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
        this.fetchUserData();
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Hiba történt a mentés során!',
          type: 'error',
        });
      }
    },
  },
};
</script>
