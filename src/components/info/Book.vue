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
            </v-list>

          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="800">
        <v-calendar ref="calendar" v-model="focus" color="primary" locale="hu" :events="events"
                :event-color="getEventColor" :event-margin-bottom="3" :event-overlap-threshold="-1"
                :now="today" :short-weekdays="false" :type="type" :weekdays="weekdays" :date="viewWeek"
                :interval-minutes="intervalMinutes" :first-interval="firstInterval" :interval-count="intervalCount"
                @click:event="showEvent" @click:more="viewWeek" @change="updateRange"> </v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>

          <v-card :disabled="isCardDisabled(selectedEvent)" color="grey lighten-4" in-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
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

            <v-card-actions v-if="!isCardDisabled(selectedEvent)">
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
import bookService from '@/service/bookService';
import reservationService from '@/service/reservationService';
import dateUtil from '@/utils/dateUtil';

export default {
  name: 'Book',
  data: () => ({
    // BOOK
    bookLastMonth: '',
    bookStartTime: '',
    bookEndTime: '',
    bookDuration: '',
    bookSelectedWeekdays: [],
    bookBreaks: [{
      date: '2019-01-01',
      startTime: '08:00',
      duration: 30,
      always: false,
    }],
    bookLeaves: [{
      leaveInterval: ['2019-01-03', '2019-01-04'],
      label: '2019-01-03 - 2019-01-04',
    }],
    reservations: [{
        lastName: '',
        firstName: '',
        start: '',
        end: '',
        createdAt: '',
    }],

    // CALENDAR
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    today: '2019-01-01',
    focus: '2019-01-01',
    type: 'week',
    typeToLabel: {
      week: 'Hét',
      day: 'Nap',
    },
    start: null,
    end: null,
    intervalMinutes: 30,
    firstInterval: 14,
    intervalCount: 24,

    // EVENTS
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    renderedEventDates: [],
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth + ' ';

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear + ' ';

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case 'week':
          return `${startYear} ${startMonth} ${startDay} - ${suffixYear}${suffixMonth}${endDay}`;
        case 'day':
          return `${startYear} ${startMonth} ${startDay}`;
      }
      return '';
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    },
  },
  async mounted() {
    await this.fetchBook();
    _.forEach(this.events, (evt) => {
      evt.color = this.setColorFromAllapot(evt.allapot);
    });
    this.today = dateUtil.createStringFromDate(new Date());
    this.focus = this.today;
    this.$refs.calendar.checkChange();
    this.addLeavesToCalendar();
    this.$root.$on('newReservation', async () => {
      this.renderedEventDates = [];
      this.events = [];
      await this.fetchBook();
      this.addLeavesToCalendar();
    });
  },
  methods: {
    // MOUNT
    async fetchBook() {
      try {
        await bookService.getBooktime(this.$route.params.service_id)
          .then( (book) => {
            this.bookLastMonth = book.data.lastMonth;
            this.bookStartTime = book.data.startTime;
            this.bookEndTime = book.data.endTime;
            this.bookDuration = book.data.bookDuration;
            this.bookSelectedWeekdays = book.data.selectedWeekdays;
          });
      } catch {}
      try {
        await bookService.getBreaks(this.$route.params.service_id)
        .then( (breaks) => {
          this.bookBreaks = breaks.data.breaks;
        });
      } catch {}
      try {
        await bookService.getLeaves(this.$route.params.service_id)
          .then( (leaves) => {
            this.bookLeaves = leaves.data.leaves;
          });
      } catch {}
      try {
        await this.fetchReservations();
      } catch {}
      this.generateEventsFromBook();
    },
    isUserServiceOwner() {
      return this.$store.state.loggedInAsAdmin && this.$store.state.ownServiceId === this.$route.params.service_id;
    },
    async fetchReservations() {
      await reservationService.getReservations(this.$route.params.service_id)
        .then( (reservations) => {
          this.reservations = reservations.data;
        });
    },

    // GENERATING
    generateEventsFromBook() {
      this.calculateCalendarSize();
      this.setUpEventsInCalendar();
    },
    // TODO: fix
    calculateCalendarSize() {
      const shiftStartingMinute = dateUtil.minuteFromHour(this.bookStartTime);
      const shiftEndingMinute = dateUtil.minuteFromHour(this.bookEndTime);
      if (shiftStartingMinute > shiftEndingMinute) {
        this.firstInterval = 0;
        this.intervalMinutes = this.bookDuration;
        this.intervalCount =  24 * 60 / this.intervalMinutes;
        return;
      }
      const overallDuration = shiftEndingMinute - shiftStartingMinute;
      this.intervalMinutes = this.bookDuration < 60 ? this.bookDuration : 60;
      const slotsNeeded = Math.ceil(overallDuration / this.intervalMinutes);
      if (slotsNeeded <= 12 && this.bookDuration % 10 === 0) {
        this.intervalCount = 24;
        this.intervalMinutes /= 2;
        this.firstInterval = 2 * (shiftStartingMinute / this.bookDuration);
      } else {
        this.intervalCount = slotsNeeded;
        this.firstInterval = shiftStartingMinute / this.bookDuration;
      }
    },
    setUpEventsInCalendar() {
      setTimeout(() => {
        const visibleDates = dateUtil.getStringArrayBetweenTwoDates(this.start.date, this.end.date);
        _.forEach(visibleDates, (date) => {
          if (dateUtil.isDateInSelectedWeekday(date, this.bookSelectedWeekdays)) {
            this.createEventsIfNeeded(date);
          }
        });
      }, 1);
    },
    createEventsIfNeeded(date) {
      const [ y, m ] = _.split(this.bookLastMonth, '-');
      const lastDayOfLastMonth = dateUtil.getLastDayInMonth(parseInt(y, 10), parseInt(m, 10));
      if (dateUtil.isDateInRange(date, this.today, `${this.bookLastMonth}-${lastDayOfLastMonth}`)
        && !_.includes(this.renderedEventDates, date)) {
        this.addEventsToCalendar(date);
        this.renderedEventDates.push(date);
      }
    },
    addEventsToCalendar(date) {
      let eventTimes = [];
      const shiftStartingMinute = dateUtil.minuteFromHour(this.bookStartTime);
      const shiftEndingMinute = dateUtil.minuteFromHour(this.bookEndTime);
      if (shiftStartingMinute > shiftEndingMinute) {
        for (let currMin = shiftStartingMinute; currMin < shiftEndingMinute + 1440; currMin += this.bookDuration) {
          const startOfEvent = dateUtil.hourFromMinute(currMin);
          const endOfEvent = shiftEndingMinute + 1440 < currMin + this.bookDuration
            ? dateUtil.hourFromMinute(shiftEndingMinute)
            : dateUtil.hourFromMinute(currMin + this.bookDuration);
          const isOnAnotherDay = currMin % 1440 > dateUtil.minuteFromHour(endOfEvent);
          eventTimes.push({
            start: `${date} ${startOfEvent}`,
            end: `${isOnAnotherDay ? dateUtil.addDaysToDate(date, 1) : date} ${endOfEvent}`,
            label: `${startOfEvent} - ${endOfEvent}`,
          });
        }
      } else {
        for (let currMin = shiftStartingMinute; currMin < shiftEndingMinute; currMin += this.bookDuration) {
          const startOfEvent = dateUtil.hourFromMinute(currMin);
          const endOfEvent = shiftEndingMinute < currMin + this.bookDuration
            ? dateUtil.hourFromMinute(shiftEndingMinute)
            : dateUtil.hourFromMinute(currMin + this.bookDuration);
          eventTimes.push({
            start: `${date} ${startOfEvent}`,
            end: `${date} ${endOfEvent}`,
            label: `${startOfEvent} - ${endOfEvent}`,
          });
        }
      }
      eventTimes = this.alterEventsBasedOnLeaves(date, eventTimes);
      eventTimes = this.createBreaksIfNeeded(date, eventTimes);
      eventTimes = this.showOccupiedReservations(date, eventTimes);
      _.forEach(eventTimes, (eventTime) => {
        this.events.push({
          name: eventTime.label,
          start: eventTime.start,
          end: eventTime.end,
          color: 'info',
        });
      });
    },
    showOccupiedReservations(date, eventTimes) {
      _.forEach(this.reservations, (reservation) => {
        _.forEach(eventTimes, (event) => {
          if (event && dateUtil.equals(reservation.start, event.start)) {
            this.events.push({
              name: `${this.$store.getters.adminAuth ? reservation.lastName : 'Foglalt'}`,
              details: `${this.$store.getters.adminAuth ? reservation.lastName + ' ' + reservation.firstName : ''}`,
              start: reservation.start,
              end: event.end,
              color: 'error',
            });
            _.pull(eventTimes, event);
          }
        });
      });
      return eventTimes;
    },
    createBreaksIfNeeded(date, eventTimes) {
      let filteredEventTimes = eventTimes;
      _.forEach(this.bookBreaks, (currBreak) => {
        if (dateUtil.isAfterEquals(date, this.today) &&
          (dateUtil.equals(currBreak.date, date) || dateUtil.isAfter(date, currBreak.date) && currBreak.always)) {
            const breakStartTime = `${date} ${currBreak.startTime}`;
            const breakEndInMinute = dateUtil.minuteFromHour(currBreak.startTime) + parseInt(currBreak.duration, 10);
            const breakEndTime = `${date} ${dateUtil.hourFromMinute(breakEndInMinute)}`;
            filteredEventTimes =
              this.alterEventsBasedOnBreaks(breakStartTime, breakEndTime, filteredEventTimes);
            this.addBreaksToCalendar(breakStartTime, breakEndTime, filteredEventTimes);
        }
      });
      return filteredEventTimes;
    },
    alterEventsBasedOnBreaks(breakStartTime, breakEndTime, eventTimes) {
      if (dateUtil.isBefore(breakEndTime, breakStartTime)) {
        const [breakEndDate, breakEndTimeInHour] = _.split(breakEndTime, ' ');
        breakEndTime = `${dateUtil.addDaysToDate(breakEndDate, 1)} ${breakEndTimeInHour}`;
      }
      _.remove(eventTimes, (event) => {
        return dateUtil.isAfterEquals(event.start , breakStartTime)
          && dateUtil.isBeforeEquals(event.end, breakEndTime);
      });
      _.forEach(eventTimes, (event) => {
        if (dateUtil.isAfter(event.end, breakStartTime) && dateUtil.isBefore(event.start, breakStartTime)) {
          event.end = breakStartTime;
          event.label = `${_.split(event.start, ' ')[1]} - ${_.split(event.end, ' ')[1]}`;
        }
        if (dateUtil.isBefore(event.start, breakEndTime) && dateUtil.isAfter(event.end, breakEndTime)) {
          event.start = breakEndTime;
          event.label = `${_.split(event.start, ' ')[1]} - ${_.split(event.end, ' ')[1]}`;
        }
      });
      return eventTimes;
    },
    addBreaksToCalendar(startDate, endDate, eventTimes) {
      if (!_.isEmpty(eventTimes)) {
        this.events.push({
          name: 'szünet',
          start: startDate,
          end: endDate,
          color: 'grey',
        });
      }
    },
    alterEventsBasedOnLeaves(date, eventTimes) {
      let filteredEventTimes = eventTimes;
      _.forEach(this.bookLeaves, (leave) =>  {
        const datesBetweenLeaves =
          dateUtil.getStringArrayBetweenTwoDates(leave.leaveInterval[0], leave.leaveInterval[1]);
        if (_.includes(datesBetweenLeaves, date)) {
          filteredEventTimes = [];
        }
      });
      return filteredEventTimes;
    },
    addLeavesToCalendar() {
      _.forEach(this.bookLeaves, (leave) => {
        if (dateUtil.isAfter(leave.leaveInterval[1], this.today)) {
          this.events.push({
          name: 'szabadság',
          start: leave.leaveInterval[0],
          end: leave.leaveInterval[1],
          color: 'grey',
        });
        }
      });
    },

    // CALENDAR VIEW
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
      this.setUpEventsInCalendar();
      this.$refs.calendar.prev();
    },
    next() {
      this.setUpEventsInCalendar();
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
    closeEventDetails() {
      this.selectedOpen = false;
    },
    openBookingDialog(event) {
      this.closeEventDetails();
      this.$root.$emit('bookingDialog', event);
    },
    isCardDisabled(event) {
      if (!this.$store.getters.adminAuth) {
        return _.includes(['error', 'grey'], event.color);
      }
      return event.color === 'grey';
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
