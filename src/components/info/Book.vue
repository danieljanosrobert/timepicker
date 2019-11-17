<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>

    <v-col cols="12">
          <v-card class=" brown lighten-4">
            <v-row class="pa-0">
              <v-col offset="1" cols="10" class="pa-0">
                <v-card-text class="text-center" style="font-size: 2em;"> Időpontfoglalás </v-card-text>
              </v-col>
              <v-col cols="1" class="pa-0 text-right pr-8 ma-auto">
                <v-btn v-if="isUserServiceOwner()" icon @click.stop="$router.push('/settings/book')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

    <v-col>

      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">
            Mai nap
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>

            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Nap</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Hét</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Hónap</v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="800">
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="hu" :events="events"
                :event-color="getEventColor" :event-margin-bottom="3" :now="today" :short-weekdays="false"
                :type="type" :weekdays="weekdays" @click:event="showEvent" @click:more="viewWeek"
                @click:date="viewWeek" @change="updateRange" interval-minutes="30" first-interval="14"
                    :event-overlap-threshold="-1"></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>

          <v-card color="grey lighten-4" in-width="350px" flat>
            <v-toolbar :color="setColorFromAllapot(selectedEvent.allapot)" dark>
              <!--<v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>-->
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <!--<v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>-->
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="secondary" @click="closeEventDetails">
                Mégse
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="secondary" @click="openBookingDialog(selectedEvent)">
                Foglalás
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-menu>
      </v-sheet>

    </v-col>
  </v-row>
</template>

<script>
  import * as _ from 'lodash';

  export default {
    name: 'Book',
    data: () => ({
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      today: '2019-01-01',
      focus: '2019-01-01',
      type: 'month',
      typeToLabel: {
        month: 'Hónap',
        week: 'Hét',
        day: 'Nap',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [
        {
          name: 'Vacation',
          details: 'Going to the beach!',
          start: '2019-01-01 9:30',
          end: '2019-01-01 10:00',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'Meeting',
          details: 'Spending time on how we do not have enough time',
          start: '2019-01-01 09:00',
          end: '2019-01-01 09:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'Large Event',
          details: 'This starts in the middle of an event and spans over multiple events',
          start: '2019-01-01 10:00',
          end: '2019-01-01 10:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: '3rd to 7th',
          details: 'Testing',
          start: '2019-01-01 10:30',
          end: '2019-01-01 11:00',
          allapot: 'foglalt',
          color: '',
        },
        {
          name: 'Big Meeting',
          details: 'A very important meeting about nothing',
          start: '2019-01-01 11:00',
          end: '2019-01-01 11:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'Another Meeting',
          details: 'Another important meeting about nothing',
          start: '2019-01-01 11:30',
          end: '2019-01-01 12:30',
          allapot: 'szunet',
          color: '',
        },
        {
          name: '7th to 8th',
          start: '2019-01-01 12:30',
          end: '2019-01-01 13:00',
          allapot: 'foglalt',
          color: '',
        },
        {
          name: 'Lunch',
          details: 'Time to feed',
          start: '2019-01-01 13:00',
          end: '2019-01-01 13:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: '30th Birthday',
          details: 'Celebrate responsibly',
          start: '2019-01-01 13:30',
          end: '2019-01-01 14:00',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'New Year',
          details: 'Eat chocolate until you pass out',
          start: '2019-01-01 14:00',
          end: '2019-01-01 14:30',
          allapot: 'szunet',
          color: '',
        },
        {
          name: 'Conference',
          details: 'The best time of my life',
          start: '2019-01-01 14:30',
          end: '2019-01-01 15:00',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'Hackathon',
          details: 'Code like there is no tommorrow',
          start: '2019-01-01 15:00',
          end: '2019-01-01 15:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'event 1',
          start: '2019-01-01 15:30',
          end: '2019-01-01 16:00',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'event 2',
          start: '2019-01-02 08:00',
          end: '2019-01-02 08:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'event 5',
          start: '2019-01-02 08:30',
          end: '2019-01-02 09:00',
          allapot: 'foglalt',
          color: '',
        },
        {
          name: 'event 3',
          start: '2019-01-02 09:00',
          end: '2019-01-02 09:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'event 4',
          start: '2019-01-02 10:00',
          end: '2019-01-02 10:30',
          allapot: 'szabad',
          color: '',
        },
        {
          name: 'event 6',
          start: '2019-01-02 10:30',
          end: '2019-01-02 11:00',
          allapot: 'foglalt',
          color: '',
        },
        {
          name: 'event 7',
          start: '2019-01-02 11:00',
          end: '2019-01-02 12:30',
          allapot: 'szunet',
          color: '',
        },
      ],
    }),
    computed: {
      title() {
        const { start, end } = this;
        if (!start || !end) {
          return '';
        }

        const startMonth = this.monthFormatter(start);
        const endMonth = this.monthFormatter(end);
        const suffixMonth = startMonth === endMonth ? '' : endMonth;

        const startYear = start.year;
        const endYear = end.year;
        const suffixYear = startYear === endYear ? '' : endYear;

        const startDay = start.day + this.nth(start.day);
        const endDay = end.day + this.nth(end.day);

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`;
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`;
        }
        return '';
      },
      monthFormatter() {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        });
      },
    },
    mounted() {
      _.forEach(this.events, (evt) => {
        evt.color = this.setColorFromAllapot(evt.allapot);
      });
      this.$refs.calendar.checkChange();
    },
    methods: {
      isUserServiceOwner() {
        return this.$store.state.loggedInAsAdmin && this.$store.state.ownServiceId === this.$route.params.service_id;
      },
      viewWeek({ date }) {
        this.focus = date;
        this.type = 'week';
      },
      getEventColor(event) {
        return event.color;
      },
      setToday() {
        this.focus = this.today;
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      },
      showEvent({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          setTimeout(() => this.selectedOpen = true, 10);
        };

        if (this.selectedOpen) {
          this.selectedOpen = false;
          setTimeout(open, 10);
        } else {
          open();
        }

        nativeEvent.stopPropagation();
      },
      updateRange({ start, end }) {
        // You could load events from an outside source (like database)
        // now that we have the start and end dates on the calendar
        this.start = start;
        this.end = end;
      },
      nth(d) {
        return d > 3 && d < 21
            ? 'th'
            : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
      },
      closeEventDetails() {
        this.selectedOpen = false;
      },
      openBookingDialog(event) {
        this.closeEventDetails();
        this.$root.$emit('bookingDialog', event);
      },
      setColorFromAllapot(allapot) {
        switch (allapot) {
          case ('szabad'):
            return 'blue';
          case ('foglalt'):
            return 'red';
          case ('szunet'):
            return 'grey';
        }
        return 'green';
      },
    },
  };
</script>

<style scoped>

</style>
