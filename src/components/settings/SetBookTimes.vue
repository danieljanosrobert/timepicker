<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-dialog v-model="warnDialog" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan meg szeretné változtatni az időpontokat?</v-card-title>
        <v-card-text>Ezzel a művelettel a foglalások elkerülnek helyükről. Továbbá a szünetek törlésre kerülnek. 
          Új szüneteket felvehet a 'Szünetek beállításai' részen. A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="warnDialog = false">Mégsem</v-btn>
          <v-btn dark color="error darken-4" :disabled="buttonDisabled" @click="save()">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12" class="pa-0">
      <v-card class="pa-0 brown lighten-4">
        <v-card-text class="text-center" style="font-size: 2em;">Időpontok beállításai</v-card-text>
      </v-card>
    </v-col>
    <v-row class="px-6">
      <v-col cols="12" sm="4" md="3">
        <v-menu
          v-model="dateMotnhsMenu"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="lastMonth" label="Szolgáltatás vége" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker
            v-model="lastMonth"
            type="month"
            :min="monthOfToday"
            :max="endOfNextYear"
            locale="hu"
            no-title
            scrollable
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-menu
          ref="startTime"
          v-model="startTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="startTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="startTime"
              label="Munkaidő kezdete"
              readonly
              v-on="on"
              :error-messages="startTimeErrors"
              @input="$v.startTime.$touch()"
              @blur="$v.startTime.$touch()"
            ></v-text-field>
          </template>
          <v-time-picker
            :allowed-minutes="allowedMinutes"
            format="24hr"
            v-if="startTimeMenu"
            v-model="startTime"
            full-width
            @click:minute="$refs.startTime.save(startTime)"
          ></v-time-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-menu
          ref="endTime"
          v-model="endTimeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="endTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="endTime" 
              label="Munkaidő vége"
              :error-messages="endTimeErrors"
              @input="$v.endTime.$touch()"
              @blur="$v.endTime.$touch()" 
              readonly 
              v-on="on">
            </v-text-field>
          </template>
          <v-time-picker
            :allowed-minutes="allowedMinutes"
            format="24hr"
            v-if="endTimeMenu"
            v-model="endTime"
            full-width
            @click:minute="$refs.endTime.save(endTime)"
          ></v-time-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-text-field 
          v-model="bookDuration"
          type="number"
          suffix="perc"
          :error-messages="bookDurationErrors"
          @input="$v.bookDuration.$touch()"
          min="5"
          max="120"
          step="5"
          @blur="setBookDuration"
          label="Foglalás időtartama">
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="8" md="12" class="pb-0">
        <v-autocomplete
          v-model="selectedWeekdays"
          :error-messages="selectedWeekdaysErrors"
          @input="$v.selectedWeekdays.$touch()"
          @blur="$v.selectedWeekdays.$touch()"
          :items="weekdays"
          filled
          chips
          label="Munkanapok"
          item-text="name"
          item-value="name"
          multiple
          class="pb-0"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item)"
            >{{ data.item }}</v-chip>
          </template>
          <template v-slot:item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title v-html="data.item"></v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-form class="pa-6" @submit.prevent="openWarnDialog">
      <v-divider class="pb-2"></v-divider>
      <v-text-field
        id="password"
        label="Mentéshez szükséges jelszó"
        v-model="password"
        name="password"
        type="password"
        required
        :error-messages="passwordErrors"
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>

      <v-btn class="mr-4" @click="openWarnDialog">Mentés</v-btn>
    </v-form>
  </v-card>
</template>

<script>
  import bookService from '@/service/bookService';
  import { required, minLength } from 'vuelidate/lib/validators';
  import constants from '@/utils/constants';

  export default {
    name: 'SetBookTimes',
    data: () => ({
      warnDialog: false,
      password: '',
      lastMonth: '',
      dateMotnhsMenu: false,
      startTime: '',
      startTimeMenu: false,
      endTime: '',
      endTimeMenu: false,
      selectedWeekdays: '',
      bookDuration: '',
      weekdays: [
        'Hétfő',
        'Kedd',
        'Szerda',
        'Csütörtök',
        'Péntek',
        'Szombat',
        'Vasárnap',
      ],
      buttonDisabled: false,
    }),
    validations: {
      password: {
        required,
        minLength: minLength(6),
      },
      selectedWeekdays: {
        required,
        minLength: minLength(1),
      },
      startTime: {
        required,
      },
      endTime: {
        required,
      },
      bookDuration: {
        required,
      },
    },
    async mounted() {
      this.lastMonth = `${new Date().getFullYear() + 1}-12`;
      await this.fetchBookSettings();
    },
    computed: {
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) {
          return errors;
        }
        !this.$v.password.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.password.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      selectedWeekdaysErrors() {
        const errors = [];
        if (!this.$v.selectedWeekdays.$dirty) {
          return errors;
        }
        !this.$v.selectedWeekdays.minLength && errors.push(constants.validationErrorMessages.selectedWeekdays);
        !this.$v.selectedWeekdays.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      startTimeErrors() {
        const errors = [];
        if (!this.$v.startTime.$dirty) {
          return errors;
        }
        !this.$v.startTime.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      endTimeErrors() {
        const errors = [];
        if (!this.$v.endTime.$dirty) {
          return errors;
        }
        !this.$v.endTime.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      bookDurationErrors() {
        const errors = [];
        if (!this.$v.bookDuration.$dirty) {
          return errors;
        }
        !this.$v.bookDuration.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      monthOfToday() {
        const dateOfToday = new Date();
        return `${dateOfToday.getFullYear()}-${dateOfToday.getMonth() + 1}`;
      },
      endOfNextYear() {
        const dateOfToday = new Date();
        return `${dateOfToday.getFullYear() + 1}-12`;
      },
      allowedMinutes() {
        return (mod) => mod % 5 === 0;
      },
    },
    methods: {
      openWarnDialog() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.warnDialog = true;
      },
      async fetchBookSettings() {
        this.password = '';
        this.$root.$emit('startLoading');
        try {
          await bookService.getBookSettings(this.$store.state.ownServiceId)
            .then( (book) => {
              this.lastMonth = book.data.lastMonth;
              this.startTime = book.data.startTime;
              this.endTime = book.data.endTime;
              this.bookDuration = book.data.bookDuration;
              this.selectedWeekdays = book.data.selectedWeekdays;
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      async save() {
        this.buttonDisabled = true;
        this.warnDialog = false;
        this.$root.$emit('startLoading');
        try {
          await bookService.saveBook({
            user_email: this.$store.state.loggedInUserEmail,
            password: this.password,
            lastMonth: this.lastMonth,
            startTime: this.startTime,
            endTime: this.endTime,
            bookDuration: this.bookDuration,
            selectedWeekdays: this.selectedWeekdays,
          });
          this.fetchBookSettings();
          this.$store.dispatch('openSnackbar', {
            message: 'Időpontok beállításai mentésre kerültek',
            type: 'success',
          });
          this.$root.$emit('breaksDeleted');
          this.$v.$reset();
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
      remove(item) {
        const index = this.selectedWeekdays.indexOf(item);
        if (index >= 0) {
          this.selectedWeekdays.splice(index, 1);
        }
      },
      setBookDuration() {
        if (this.bookDuration > 120) {
          this.bookDuration = 120;
        } else if (this.bookDuration < 0) {
          this.bookDuration = 0;
        }
        this.bookDuration -= this.bookDuration % 5;
        this.$v.bookDuration.$touch();
      },
    },
  };
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

#container {
  background-color: $_yellow;
}
</style>
