<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
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
            <v-text-field v-model="startTime" label="Munkaidő kezdete" readonly v-on="on"></v-text-field>
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
            <v-text-field v-model="endTime" label="Munkaidő vége" readonly v-on="on"></v-text-field>
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
          min="0"
          max="120"
          step="5"
          @blur="setBookDuration"
          label="Foglalás időtartama">
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="8" md="12" class="pb-0">
        <v-autocomplete
          v-model="selectedWeekdays"
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

    <v-form class="pa-6" @submit.prevent="save">
      <v-divider class="pb-2"></v-divider>
      <v-text-field
        id="password"
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
import bookService from '@/service/bookService';

export default {
name: 'SetBookTimes',
  data: () => ({
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
  }),
  async mounted() {
    this.lastMonth = `${new Date().getFullYear() + 1}-12`;
    await this.fetchBookSettings();
  },
  computed: {
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
    async fetchBookSettings() {
      this.password = '';
      await bookService.getBookSettings(this.$store.state.ownServiceId)
        .then( (book) => {
          this.lastMonth = book.data.lastMonth;
          this.startTime = book.data.startTime;
          this.endTime = book.data.endTime;
          this.bookDuration = book.data.bookDuration;
          this.selectedWeekdays = book.data.selectedWeekdays;
        });
    },
    async save() {
      try {
        await bookService.saveBook({
          user_email: this.$store.state.loggedInUserEmail,
          password: this.password,
          lastMonth: this.lastMonth,
          startTime: this.startTime,
          endTime: this.endTime,
          bookDuration: this.bookDuration,
          selectedWeekdays: JSON.stringify(this.selectedWeekdays),
        });
        this.fetchBookSettings();
        this.$store.dispatch('openSnackbar', {
          message: 'Időpontok beállításai mentésre kerültek',
          type: 'success',
        });
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Hiba történt a mentés során!',
          type: 'error',
        });
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
