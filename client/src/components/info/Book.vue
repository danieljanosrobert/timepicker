<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row>
    <v-dialog v-model="acceptDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan el szeretné fogadni a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="acceptDialogVisible = false">Mégsem</v-btn>
          <v-btn dark color="success" :disabled="buttonsDisabled" @click="confirmAccept">Elfogadás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="refuseDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan el szeretné utasítani a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-textarea class="mx-6" v-model="refuseMessage" label="Elutasítás oka (opcionális)"> </v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="refuseDialogVisible = false">Mégsem</v-btn>
          <v-btn dark color="error darken-4" :disabled="buttonsDisabled" @click="confirmRefuse">Elutasítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="resignDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan le szeretné mondani a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="resignDialogVisible = false">Mégsem</v-btn>
          <v-btn dark color="error darken-4" :disabled="buttonsDisabled" @click="confirmResign">Lemondás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan törölni szeretné a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="deleteDialogVisible = false">Mégsem</v-btn>
          <v-btn dark color="error darken-4" :disabled="buttonsDisabled" @click="confirmDelete">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>

            <v-card-actions v-if="!isCardDisabled(selectedEvent)">
              <v-btn text color="secondary" @click="closeEventDetails">
                Mégsem
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="canBookOnEvent(selectedEvent)" text color="secondary"
                     @click="openBookingDialog(selectedEvent)" :disabled="buttonsDisabled">
                Foglalás
              </v-btn>
              <v-btn v-if="canAcceptEvent(selectedEvent)" text color="success darken-2"
                     @click="initAccept(selectedEvent)" :disabled="buttonsDisabled">
                Elfogadás
              </v-btn>
              <v-btn v-if="canRefuseEvent(selectedEvent)" text color="error"
                     @click="initRefuse(selectedEvent)" :disabled="buttonsDisabled">
                Elutasítás
              </v-btn>
              <v-btn v-if="canResignEvent(selectedEvent)" text color="error"
                     @click="initResign(selectedEvent)" :disabled="buttonsDisabled">
                Lemondás
              </v-btn>
              <v-btn v-if="canDeleteEvent(selectedEvent)" text color="error"
                     @click="initDelete(selectedEvent)" :disabled="buttonsDisabled">
                Törlés
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
import { Base64 } from 'js-base64';
import constants from '@/utils/constants';
import Pusher from 'pusher-js';

const PUSHER_APP_KEY = '4097d7ebfd8b93a9de44';
const PUSHER_CLUSTER = 'eu';

const FREE_EVENT = 'info';
const OCCUPIED_EVENT = 'error';
const DISABLED_EVENT = 'gray';

export default {
  name: 'Book',
  data: () => ({
    // DIALOGS
    operationDate: '',
    acceptDialogVisible: false,
    refuseDialogVisible: false,
    resignDialogVisible: false,
    deleteDialogVisible: false,
    buttonsDisabled: false,
    refuseMessage: '',

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
  created() {
    this.subscribeToOwnChannel();
  },
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
      await this.refreshEvents();
    });
  },
  methods: {
    subscribeToOwnChannel() {
      const pusher = new Pusher(PUSHER_APP_KEY, { cluster: PUSHER_CLUSTER });
      pusher.subscribe(this.$route.params.service_id);
      pusher.bind('fetch_needed', () => {
        this.refreshEvents();
      });
    },
    async refreshEvents() {
      this.renderedEventDates = [];
      this.events = [];
      await this.fetchBook();
      this.addLeavesToCalendar();
    },
    // API CALLS
    async fetchBook() {
      this.$root.$emit('startLoading');
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
      await this.fetchReservations();
      this.generateEventsFromBook();
      this.$root.$emit('stopLoading');
    },
    async fetchReservations() {
      try {
        await reservationService.getReservations({
          service_id: this.$route.params.service_id,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
        }).then( (reservations) => {
            this.reservations = reservations.data;
          });
      } catch {}
    },
    async acceptReservation(reservationDate) {
      if (!this.operationDate) {
        this.$store.dispatch('openSnackbar', {
          message: 'Kérem jelöljön ki egy foglalást a művelet végrehajtásához',
          type: 'warning',
        });
        return;
      }
      this.buttonsDisabled = true;
      this.$root.$emit('startLoading');
      try {
        await reservationService.acceptReservation({
          service_id: this.$store.state.ownServiceId,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
          start: reservationDate,
        });
        await this.refreshEvents();
        this.$store.dispatch('openSnackbar', {
          message: 'Foglalás elfogadva',
          type: 'success',
        });
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Sikertelen módosítás. Kérem próbálja újra később',
          type: 'error',
        });
      }
      this.buttonsDisabled = false;
      this.$root.$emit('stopLoading');
    },
    async resignReservation(reservationDate) {
      if (!this.operationDate) {
        this.$store.dispatch('openSnackbar', {
          message: 'Kérem jelöljön ki egy foglalást a művelet végrehajtásához',
          type: 'warning',
        });
        return;
      }
      this.buttonsDisabled = true;
      this.$root.emit('startLoading');
      try {
        await reservationService.resignReservation({
          service_id: this.$route.params.service_id,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
          start: reservationDate,
        });
        await this.refreshEvents();
        this.$store.dispatch('openSnackbar', {
          message: 'Foglalás sikeresen lemondva',
          type: 'success',
        });
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Sikertelen lemondás. Kérem próbálja újra később',
          type: 'error',
        });
      }
      this.buttonsDisabled = false;
      this.$root.$emit('stopLoading');
    },
    async deleteReservation(reservationDate, refuseMessage = '') {
      if (!this.operationDate) {
        this.$store.dispatch('openSnackbar', {
          message: 'Kérem jelöljön ki egy foglalást a művelet végrehajtásához',
          type: 'warning',
        });
        return;
      }
      this.buttonsDisabled = true;
      this.$root.$emit('startLoading');
      try {
        await reservationService.deleteReservation({
          service_id: this.$store.state.ownServiceId,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
          start: reservationDate,
          refuse_message: refuseMessage,
        });
        await this.refreshEvents();
        this.$store.dispatch('openSnackbar', {
          message: 'Foglalás sikeresen törölve',
          type: 'success',
        });
      } catch {
        this.$store.dispatch('openSnackbar', {
          message: 'Sikertelen törlés. Kérem próbálja újra később',
          type: 'error',
        });
      }
      this.buttonsDisabled = false;
      this.$root.$emit('stopLoading');
    },

    // BUTTONS
    canReSendEmail(selectedEvent) {
      return this.isUserServiceOwner() && selectedEvent.color === constants.colorOfReservationStatus[2];
    },
    canBookOnEvent(selectedEvent) {
      return selectedEvent.color === FREE_EVENT;
    },
    canAcceptEvent(selectedEvent) {
      return this.isUserServiceOwner() && selectedEvent.color === constants.colorOfReservationStatus[1];
    },
    canRefuseEvent(selectedEvent) {
      return this.isUserServiceOwner() && (selectedEvent.color === constants.colorOfReservationStatus[1]
        || selectedEvent.color === constants.colorOfReservationStatus[2]);
    },
    canResignEvent(selectedEvent) {
      return !this.isUserServiceOwner() && (selectedEvent.color !== FREE_EVENT
        && selectedEvent !== OCCUPIED_EVENT && selectedEvent !== DISABLED_EVENT);
    },
    canDeleteEvent(selectedEvent) {
      return this.isUserServiceOwner() && selectedEvent.color === constants.colorOfReservationStatus[0];
    },

    // DIALOGS
    async confirmAccept() {
      this.acceptDialogVisible = false;
      await this.acceptReservation(this.operationDate);
      this.endOperation();
    },
    async confirmRefuse() {
      this.refuseDialogVisible = false;
      await this.deleteReservation(this.operationDate, this.refuseMessage);
      this.refuseMessage = '';
      this.endOperation();
    },
    async confirmResign() {
      this.resignDialogVisible = false;
      await this.resignReservation(this.operationDate);
      this.endOperation();
    },
    async confirmDelete() {
      this.deleteDialogVisible = false;
      await this.deleteReservation(this.operationDate);
      this.endOperation();
    },
    initAccept(reservation) {
      this.operationDate = reservation.start;
      this.acceptDialogVisible = true;
    },
    initRefuse(reservation) {
      this.operationDate = reservation.start;
      this.refuseDialogVisible = true;
    },
    initResign(reservation) {
      this.operationDate = reservation.start;
      this.resignDialogVisible = true;
    },
    initDelete(reservation) {
      this.operationDate = reservation.start;
      this.deleteDialogVisible = true;
    },
    endOperation() {
      this.operationDate = '';
    },

    // GENERATING
    generateEventsFromBook() {
      this.calculateCalendarSize();
      this.setUpEventsInCalendar();
    },
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
        this.firstInterval = shiftStartingMinute / this.intervalMinutes;
      } else {
        this.intervalCount = slotsNeeded;
        this.firstInterval = shiftStartingMinute / this.intervalMinutes;
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
          color: FREE_EVENT,
        });
      });
    },
    showOccupiedReservations(date, eventTimes) {
      _.forEach(this.reservations, (reservation) => {
        _.forEach(eventTimes, (event) => {
          if (event && dateUtil.equals(reservation.start, event.start)) {
            this.events.push({
              name: `${reservation.status ? reservation.status : 'Foglalt'}`,
              details: `${reservation.status ? reservation.lastName + ' ' + reservation.firstName : ''}`,
              start: reservation.start,
              end: event.end,
              color: this.setColorOfOccupiedEvent(reservation.status),
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
        return _.includes([OCCUPIED_EVENT, 'grey'], event.color);
      }
      return event.color === 'grey';
    },
    setColorOfOccupiedEvent(status) {
      switch (status) {
        case (constants.reservationStatuses[0]):
          return constants.colorOfReservationStatus[0];
        case (constants.reservationStatuses[1]):
          return constants.colorOfReservationStatus[1];
        case (constants.reservationStatuses[2]):
          return constants.colorOfReservationStatus[2];
      }
      return OCCUPIED_EVENT;
    },
    isUserServiceOwner() {
      return this.$store.state.loggedInAsAdmin && this.$store.state.ownServiceId === this.$route.params.service_id;
    },
  },
};
</script>

<style scoped>

</style>
