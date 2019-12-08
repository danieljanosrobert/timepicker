<template>
  <v-container fluid class="pa-12 bg-color-light-brown">
    <v-row no-gutters class="text-center">
      <v-col xl="8" offset-xl="2"
             md="10" offset-md="1"
             xs="12" offset-xs="0"
      >
        <v-row dense class="text-center">
          <template v-for="(feature, idx) in features">
            <v-col lg="4" md="6" cols="12" 
                  :offset-lg="idx === features.length - 1 ? 4 : 0"
                  class="py-6"
                  :key="idx">
              <v-row no-gutters>
                <v-col cols="12" class="pb-6">
                  <v-icon x-large>{{feature.icon}}</v-icon>
                </v-col>
                <v-col cols="12">
                  <p style="font-size: 24px">{{feature.title}}</p>
                </v-col>
                <v-col cols="10" offset="1" class="font-alegreya">
                  <p>{{feature.description}}</p>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      features: [
        {
          title: 'E-mail küldés',
          icon: 'mdi-email-multiple',
          description: 'Az alkalmazás e-mail értesítőt küld abban az esetben, ha egy időpont el ' +
              'lett fogadva, vagy vissza lett mondva, benne a foglaláshoz szükséges információkkal. ',
        },
        {
          title: 'Szolgáltatói felület',
          icon: 'mdi-account-card-details',
          description: 'Felület biztosítása szolgáltatók számára, melyen egyszerűen lehet időpontokat, ' +
              'szüneteket és szabadságokat megadni többek közt.',
        },
        {
          title: 'Valós időben',
          icon: 'mdi-timer',
          description: 'Amint egy időpont foglalásra kerül, az újratöltés nélkül megjelenik más felhasználóknak is.',
        },
        {
          title: 'Személyreszabott oldal',
          icon: 'mdi-brush',
          description: 'Biztosítjuk az üzenőfal szabad szerkesztésének lehetőségét.',
        },
        {
          title: 'Napi és heti naptárak',
          icon: 'mdi-calendar-outline',
          description: 'Napi és heti bontásban is böngészhető naptárak megfelelő időpont találására.',
        },
        {
          title: 'Reszponzivitás',
          icon: 'mdi-tablet-cellphone',
          description: 'Bárhonnan elérhető, akár telefonon is foglalható időpont, ugyanígy az adminisztrátorok is ' +
              'kezelhetik oldalaikat telefonról, vagy tabletről.',
        },
        {
          title: 'Saját események megtekintése',
          icon: 'mdi-backburger',
          description: 'Lehetőség van saját foglalásaink böngészésére, lemondására, ' +
              'szolgáltatókén a foglalt időpontok listázására, elfogadására, elutasítására',
        },
        {
          title: 'Időpontfoglalás otthonról',
          icon: 'fa-couch',
          description: 'A felhasználók otthonukból, vagy munkahelyükön is fogalalhatnak időpontot csak néhány ' +
              'kattintással.',
        },
        {
          title: 'Egyszerű keresés',
          icon: 'mdi-table-search',
          description: 'Szolgáltatás keresése név szerint, gyorsan.',
        },
        {
          title: 'Könnyű kezelés',
          icon: 'fa-universal-access',
          description: 'Mindenzt egyszerűen, felhasználóbarát módon',
        },
      ],
    }),
    name: 'Features',
  };
</script>

<style scoped>

</style>
