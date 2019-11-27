<template>
  <v-container fluid id="container" class="pa-0">
    <v-dialog v-model="acceptDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan el szeretné fogadni a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="endOperation">Mégsem</v-btn>
          <v-btn dark color="success" @click="confirmAccept">Elfogadás</v-btn>
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
          <v-btn dark color="brown darken-1 pa-2" @click="endOperation">Mégsem</v-btn>
          <v-btn dark color="error darken-4" @click="confirmRefuse">Elutasítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialogVisible" persistent max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">Biztosan törölni szeretné a foglalást?</v-card-title>
        <v-card-text>A művelet nem visszavonható</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="brown darken-1 pa-2" @click="endOperation">Mégsem</v-btn>
          <v-btn dark color="error darken-4" @click="confirmDelete">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialogVisible" max-width="460">
      <v-card>
        <v-card-title class="headline" style="word-break: normal">
          Foglalás adatai
        </v-card-title>
          <v-text-field class="mx-6" v-if="expanded[0]" readonly label="Foglaló neve" v-model="expanded[0].name"></v-text-field>
          <v-text-field class="mx-6" v-if="expanded[0]" readonly label="Foglalt időpont" v-model="expanded[0].date"></v-text-field>
          <v-text-field class="mx-6" v-if="expanded[0]" readonly label="Foglalás állapota" v-model="expanded[0].status"></v-text-field>
          <v-textarea class="mx-6" v-if="expanded[0]" readonly label="Megjegyzés" v-model="expanded[0].comment"></v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="brown darken-1" @click="detailsDialogVisible = false">OK</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container class="pa-0 mt-8 bg-color-white" :style="setToFullScreen">
      <v-card>
        <v-col cols="12" class="pa-0">
          <v-card class="pa-0 brown lighten-4">
            <v-card-text class="text-center" style="font-size: 2em;"> Foglalások áttekintése </v-card-text>
          </v-card>
        </v-col>
        <v-expansion-panels focusable popout class="mb-12 pt-6">
          <v-expansion-panel>
            <v-expansion-panel-header hide-actions>
              <template v-slot:default="{ open }">
                <v-row no-gutters>
                  <v-col cols="4">Szűrés</v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="pa-0">
                <v-col cols="12">
                  <v-text-field v-model="filters.name" label="Foglaló neve"></v-text-field>
                </v-col>
                <v-col cols="11">
                  <v-menu
                    transition="scale-transition"
                    :close-on-content-click="false"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="filters.intervallLabel"
                        label="Foglalás intervalluma"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      locale="hu"
                      v-model="filters.intervall"
                      @click:date="validateIntervalAndUpdateLabel()"
                      no-title
                      scrollable
                      range
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="1" class="ma-auto">
                  <v-btn class="ma-auto" block text @click.stop="deleteIntervallFilter()">X</v-btn>
                </v-col>
                <v-col cols="12">
                  <v-select v-model="filters.status" :items="[''].concat(reservationStatuses)" label="Státusz"></v-select>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    class="no-hover"
                    v-model="filters.onlyAfterEqualToday"
                    label="Ne jelenjenek meg múltbeli keresések"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
        <v-data-table
          no-data-text="Még nincsenek foglalások."
          no-results-text="A megadott szűrésre nem található foglalás"
          :headers="headers"
          :items="reservations"
          single-expand
          :expanded.sync="expanded"
          item-key="date"
          show-expand
          class="elevation-1"
          sort-by="date"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td class="text-right" :colspan="headers.length">
              <v-btn dark class="mr-2" color="brown lighten-1" @click.stop="detailsDialogVisible = true">
                Megtekintés
              </v-btn>
              <v-btn class="mr-2" dark outlined color="success" v-if="expandedAndStatusIsNotAccepted"
                @click.stop="initAccept(expanded[0])" :disabled="disableIfBeforeToday">Elfogadás
              </v-btn>
              <v-btn v-if="expandedAndStatusIsRefusable" dark outlined color="red darken-4" @click.stop="initRefuse(expanded[0])"
                :disabled="disableIfBeforeToday">Elutasítás
                </v-btn>
              <v-btn v-if="expandedAndStatusIsAccepted" dark outlined color="red darken-4" @click.stop="initDelete(expanded[0])"
                :disabled="disableIfBeforeToday">Törlés
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import dateUtil from '@/utils/dateUtil';
import constants from '@/utils/constants';
import reservationService from '@/service/reservationService';
import { Base64 } from 'js-base64';

export default {
  name: 'Reservations',
  data() {
    return {
      filters: {
        status: '',
        intervall: [],
        name: '',
        intervallLabel: '',
        onlyAfterEqualToday: true,
      },
      operationDate: '',
      acceptDialogVisible: false,
      refuseDialogVisible: false,
      deleteDialogVisible: false,
      detailsDialogVisible: false,
      refuseMessage: '',
      expanded: [],
      reservations: [],
      headers: [
        {
          text: 'Foglaló neve',
          value: 'name',
          filter: (value) => {
            if (!this.filters.name) {
              return true;
            }

            const search = this.filters.name.toLowerCase();
            const text = value.toLowerCase();
            return text.indexOf(search) > -1;
          },
        },
        {
          text: 'Foglalt időpont',
          value: 'date',
          align: 'center',
          filter: (value) => {
            if (!this.filters.onlyAfterEqualToday && _.isEmpty(this.filters.intervall)) {
              return true;
            }

            const dateFromValue = _.split(value, ' ')[0];
            if (this.filters.intervall[0] && this.filters.intervall[1]) {
              return (dateUtil.isAfterEquals(dateFromValue, this.filters.intervall[0])
                  && dateUtil.isBeforeEquals(dateFromValue, this.filters.intervall[1]));
            }
            if (this.filters.onlyAfterEqualToday) {
              return dateUtil.isAfterEquals(dateFromValue, this.getToday());
            }

            return true;
          },
        },
        {
          text: 'Állapot',
          value: 'status',
          align: 'center',
          filter: (value) => {
            if (!this.filters.status) {
              return true;
            }

            return value === this.filters.status;
          },
        },
        { text: 'Műveletek', align: 'center', value: 'data-table-expand' },
      ],
    };
  },
  async mounted() {
    await this.fetchReservations();
  },
  computed: {
    setToFullScreen() {
      return {
        'min-height': `${window.innerHeight}px`,
      };
    },
    getExpandedItem() {
      return this.expanded[0] ? this.expanded[0].name : '';
    },
    reservationStatuses() {
      return constants.reservationStatuses;
    },
    expandedAndStatusIsNotAccepted() {
      return this.expanded[0] && this.expanded[0].status === constants.reservationStatuses[1];
    },
    expandedAndStatusIsRefusable() {
      return this.expanded[0] && (this.expanded[0].status === constants.reservationStatuses[1]
        || this.expanded[0].status === constants.reservationStatuses[2]);
    },
    expandedAndStatusIsAccepted() {
      return this.expanded[0] && this.expanded[0].status === constants.reservationStatuses[0];
    },
    disableIfBeforeToday() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.expanded[0] && dateUtil.isBefore(this.expanded[0].date, today);
    },
  },
  methods: {
    async fetchReservations() {
      try {
        await reservationService
          .getReservations({
            service_id: this.$store.state.ownServiceId,
            user_email: Base64.encode(this.$store.state.loggedInUserEmail),
            all_dates: true,
          }).then( (reservations) => {
            const fetchedReservations = [];
            _.forEach(reservations.data, (reservation) => {
              fetchedReservations.push({
                name: `${reservation.lastName} ${reservation.firstName}`,
                date: reservation.start,
                status: reservation.status,
                comment: reservation.comment,
              });
            });
            this.reservations = fetchedReservations;
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
      try {
        await reservationService.acceptReservation({
          service_id: this.$store.state.ownServiceId,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
          start: reservationDate,
        });
        this.refreshExpandedStatus(constants.reservationStatuses[0]);
        await this.fetchReservations();
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
    },
    async deleteReservation(reservationDate, refuseMessage = '') {
      if (!this.operationDate) {
        this.$store.dispatch('openSnackbar', {
          message: 'Kérem jelöljön ki egy foglalást a művelet végrehajtásához',
          type: 'warning',
        });
        return;
      }
      try {
        await reservationService.deleteReservation({
          service_id: this.$store.state.ownServiceId,
          user_email: Base64.encode(this.$store.state.loggedInUserEmail),
          start: reservationDate,
          refuse_message: refuseMessage,
        });
        await this.fetchReservations();
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
    },
    refreshExpandedStatus(status) {
      this.expanded[0].status = status;
    },
    async confirmAccept() {
      await this.acceptReservation(this.operationDate);
      this.endOperation();
    },
    async confirmRefuse() {
      await this.deleteReservation(this.operationDate, this.refuseMessage);
      this.refuseMessage = '';
      this.endOperation();
    },
    async confirmDelete() {
      await this.deleteReservation(this.operationDate);
      this.endOperation();
    },
    initAccept(reservation) {
      this.operationDate = reservation.date;
      this.acceptDialogVisible = true;
    },
    initRefuse(reservation) {
      this.operationDate = reservation.date;
      this.refuseDialogVisible = true;
    },
    initDelete(reservation) {
      this.operationDate = reservation.date;
      this.deleteDialogVisible = true;
    },
    endOperation() {
      this.operationDate = '';
      this.acceptDialogVisible = false;
      this.refuseDialogVisible = false;
      this.deleteDialogVisible = false;
    },
    validateIntervalAndUpdateLabel() {
      if (this.filters.intervall[1] < this.filters.intervall[0]) {
        this.deleteIntervallFilter();
      }
      const startOfInterval = this.filters.intervall[0];
      const endOfInterval = this.filters.intervall[1];
      this.filters.intervallLabel = `${
        startOfInterval ? startOfInterval + ' - ' : ''
      }${endOfInterval ? endOfInterval : ''}`;
      if (
        this.filters.intervall[0] &&
        dateUtil.isBefore(this.filters.intervall[0], this.getToday())
      ) {
        this.filters.onlyAfterEqualToday = false;
      }
    },
    deleteIntervallFilter() {
      this.filters.intervall = [];
      this.filters.intervallLabel = '';
    },
    getToday() {
      const result = new Date();
      return `${result.getFullYear()}-${result.getMonth() +
        1}-${result.getDate()}`;
    },
    getColor(status) {
      switch (status) {
        case constants.reservationStatuses[0]:
          return constants.colorOfReservationStatus[0];
        case constants.reservationStatuses[1]:
          return constants.colorOfReservationStatus[1];
        case constants.reservationStatuses[2]:
          return constants.colorOfReservationStatus[2];
      }
      return 'error';
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
