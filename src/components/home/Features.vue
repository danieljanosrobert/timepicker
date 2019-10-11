<template>
  <v-container fluid class="pa-12 bg-color-light-brown">
    <v-row no-gutters class="text-center">
      <v-col :xl="8" :offset-xl="2"
             :md="10" :offset-md="1"
             :sm="12" :offset-sm="0">
        <v-row no-gutters class="text-center">
          <v-col :md="6" :sm="12" :lg="4"
                 class="py-6"
                 v-for="(feature) in features"
                 :key="feature">
            <v-row no-gutters>
              <v-col :cols="12" class="pb-6">
                <v-icon x-large>{{feature.icon}}</v-icon>
              </v-col>
              <v-col :cols="12">
                <p style="font-size: 24px">{{feature.title}}</p>
              </v-col>
              <v-col :cols="10" :offset="1">
                <p>{{feature.description}}</p>
              </v-col>
            </v-row>
          </v-col>
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
          description: 'Amint egy felhasználó lefoglal egy időpontot, arról az adminisztrátor e-mail-ben kap ' +
              'értesítést, így nem kell megnyitva legyen az alkalmazás, elég ha csak interneteléréssel rendelkezik.',
        },
        {
          title: 'Admin felület',
          icon: 'mdi-account-card-details',
          description: 'Felület biztosítása, melyben az adminisztrátori feladatokat véghez lehet vinni, mint ' +
              'például ráérések és szünetek megadása.',
        },
        {
          title: 'Valós időben',
          icon: 'mdi-timer',
          description: 'Minden valós időben történik. Amint egy időpont foglalásra kerül egy e-mail kerül ' +
              'kiküldésre annak a személynek, akinél időpont lett foglalva.',
        },
        {
          title: 'Személyreszabott oldal',
          icon: 'mdi-brush',
          description: 'Minden szöveget egyszerűen, felhasználóbarát módon lehet módosítani, törölni, illetve ' +
              'hozzáadni.',
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
          title: 'Múltbeli események megtekintése',
          icon: 'mdi-backburger',
          description: 'Lehetőség van múltban történt foglalások, visszamondások visszanézésére.',
        },
        {
          title: 'Helymeghatározás',
          icon: 'mdi-crosshairs-gps',
          description: 'Amennyiben gps hozzáférés engedélyezve van, lehetőség van arra, hogy a felhasználóhoz ' +
              'legközelebb található helyre történjen időpontfoglalás.',
        },
        {
          title: 'Tájékozódás segítése',
          icon: 'mdi-map',
          description: 'Lehetőség van arra, hogy térképen megjelöljük a szolgáltatásnyújtás helyét, így könnyítve ' +
              'a felhasználók navigációját.',
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
          description: 'Szolgáltatás keresése egyszerűen hely, szolgáltató, vagy típus szerint',
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
