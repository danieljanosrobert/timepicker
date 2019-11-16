<template>
  <v-card>
    <v-col cols="12" class="pa-0">
      <v-card class="pa-0 brown lighten-4">
        <v-card-text class="text-center" style="font-size: 2em;">Szünetek beállításai</v-card-text>
      </v-card>
    </v-col>
    <v-row class="px-6">

      <v-col cols="12" class="pa-6 pb-0">
        <v-row class="pb-4">
          <v-row v-if="breaks[0]">
            <v-col v-for="(item, index) in breaks" :key="index" cols="12" class="py-0">
              <v-row>
                <v-col cols="12" sm="4">
                  <v-menu
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="item.date" label="Szünet dátuma" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="item.date"
                      :min="today"
                      :max="endOfNextYear"
                      locale="hu"
                      no-title
                      scrollable
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-menu
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                    ref="startTimeRef"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="item.startTime" label="Szünet kezdete" readonly v-on="on"></v-text-field>
                    </template>
                    <v-time-picker
                      :allowed-minutes="allowedMinutes"
                      format="24hr"
                      v-model="item.startTime"
                      @click:minute="$refs.startTimeRef[index].save(item.startTime)"
                      full-width
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field 
                    v-model="item.duration"
                    type="number"
                    suffix="perc"
                    step="5"
                    min="0"
                    max="120"
                    @blur="setDuration(index)"
                    label="Szünet időtartama">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-checkbox class="text-justify" v-model="item.always" label="Amennyiben a jelölőnégyzet kipipált állapotban van,
                   a megadott szünet minden napra érvényes a kiválasztott dátumtól kezdve.">
                  </v-checkbox>
                </v-col>
                <v-col cols="6" sm="2" class="text-right ma-auto">
                  <v-btn block small outlined color="error" @click.stop="deleteBreak(index)">Törlés</v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-col>
          </v-row>

          <v-col cols="12" class="pb-0">
            <v-btn text @click.stop="addBreak()">+ Szünet létrehozása</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <form class="pa-6">
      <v-divider class="pb-2"></v-divider>
      <v-text-field
        id="breakpassword"
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
import settingsService from '@/service/settingsService';

export default {
name: 'SetBreakTimes',
  data: () => ({
    password: '',
    breaks: [],
    breakMinuteFlag: [],
  }),
  async mounted() {
    await this.fetchBreakSettings();

    this.breaks.forEach((actualBreak, index) => {
      this.breakMinuteFlag.push('breakNr' + index);
    });
  },
  computed: {
    today() {
      return new Date().toISOString();
    },
    endOfNextYear() {
      const dateOfToday = new Date();
      return `${dateOfToday.getFullYear() + 1}-12-31`;
    },
    allowedMinutes() {
      return (mod) => mod % 5 === 0;
    },
  },
  methods: {
    async fetchBreakSettings() {
      await settingsService.getBreakSettings({
          user_email: this.$store.state.loggedInUserEmail,
        }).then( (breaks) => {
          this.breaks = breaks.data.breaks;
        });
    },
    async save() {
      await settingsService.saveBreaks({
        user_email: this.$store.state.loggedInUserEmail,
        password: this.password,
        breaks: JSON.stringify(this.breaks),
      });
    },
    addBreak() {
      this.breaks.push({date: '', startTime: '', duration: '', always: false});
      this.breakMinuteFlag.push('breakNr' + (this.breaks.length - 1));
    },
    deleteBreak(index) {
      this.breaks.splice(index, 1);
      this.breakMinuteFlag.splice(index, 1);
    },
    setDuration(index) {
      if (this.breaks[index].duration > 120) {
        this.breaks[index].duration = 120;
      } else if (this.breaks[index].duration < 0) {
        this.breaks[index].duration = 0;
      }
      this.breaks[index].duration -= this.breaks[index].duration % 5;
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