<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-col cols="12" class="pa-0">
      <v-card class="pa-0 brown lighten-4">
        <v-card-text class="text-center" style="font-size: 2em;">Szabadságok beállításai</v-card-text>
      </v-card>
    </v-col>
    <v-row class="px-6">

      <v-col cols="12" class="pa-6 pb-0">
        <v-row class="pb-4">
          <v-row v-if="leaves[0]">
            <v-col v-for="(item, index) in leaves" :key="index" cols="12" class="py-0">
              <v-row>
                  <v-col cols="10">
                    <v-menu
                      transition="scale-transition"
                      :close-on-content-click="false"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field v-model="item.label" label="Szabadság intervalluma" :disabled="isEndBeforeToday(item.leaveInterval[1])" readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker
                        locale="hu"
                        v-model="item.leaveInterval"
                        :min="today"
                        :max="endOfNextYear"
                        @click:date="validateLeaveAndUpdateLabel(index)"
                        no-title
                        scrollable
                        range
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                <v-col cols="6" sm="2" class="text-right ma-auto">
                  <v-btn block small outlined color="error" @click.stop="deleteLeave(index)">Törlés</v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-col>
          </v-row>

          <v-col cols="12" class="pb-0">
            <v-btn text @click.stop="addLeave()">+ Szabadság létrehozása</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <form class="pa-6">
      <v-divider class="pb-2"></v-divider>
      <v-text-field
        id="leavepassword"
        label="Mentéshez szükséges jelszó"
        v-model="password"
        name="password"
        type="password"
      ></v-text-field>
      <v-btn class="mr-4" @click="save">Mentés</v-btn>
    </form>
  </v-card>
</template>

<script>
import bookService from '@/service/bookService';

export default {
name: 'SetLeaveTimes',
  data: () => ({
    password: '',
    leaves: [],
  }),
  async mounted() {
    await this.fetchLeaveSettings();
  },
  computed: {
    today() {
      return new Date().toISOString();
    },
    endOfNextYear() {
      const dateOfToday = new Date();
      return `${dateOfToday.getFullYear() + 1}-12-31`;
    },
  },
  methods: {
    async fetchLeaveSettings() {
      this.password = '';
      await bookService.getLeaveSettings(this.$store.state.ownServiceId)
        .then( (leaves) => {
          this.leaves = leaves.data.leaves;
        });
    },
    async save() {
      await bookService.saveLeaves({
        user_email: this.$store.state.loggedInUserEmail,
        password: this.password,
        leaves: JSON.stringify(this.leaves),
      });
      this.fetchLeaveSettings();
    },
    addLeave() {
      this.leaves.push( {leaveInterval: [], label: ''} );
    },
    deleteLeave(index) {
        this.leaves.splice(index, 1);
    },
    validateLeaveAndUpdateLabel(index) {
      if (this.leaves[index].leaveInterval[1] < this.leaves[index].leaveInterval[0]) {
        this.leaves[index].leaveInterval[0] = undefined;
        this.leaves[index].leaveInterval[1] = undefined;
      }
      const startOfInterval = this.leaves[index].leaveInterval[0];
      const endOfInterval = this.leaves[index].leaveInterval[1];
      this.leaves[index].label = `${startOfInterval ? startOfInterval + ' - ' : ''}${endOfInterval ? endOfInterval : ''}`;
    },
    isEndBeforeToday(date) {
      if (!date) {
        return false;
      }
      const selectedDate = new Date(date).getTime();
      const actualDate = new Date(this.getToday()).getTime();
      return selectedDate < actualDate ? true : false;
    },
    getToday() {
      const result = new Date();
      return `${result.getFullYear()}-${result.getMonth() + 1}-${result.getDate()}`;
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
