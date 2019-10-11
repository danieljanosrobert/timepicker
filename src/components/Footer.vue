<template>
  <v-footer dark padless fluid>
    <v-col class="pa-0" cols="12">
      <v-card flat tile
              class="brown darken-4 white--text text-center">
        <v-card-text>
          <v-btn v-for="icon in icons"
                 :key="icon"
                 class="mx-4 white--text" icon>
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          <v-row>
            <v-col cols="3"
                   v-for="(data) in details"
                   :key="data">
              {{data}}
            </v-col>
            <v-col cols="8" offset="2" class="pt-6">
              Ez csak egy prototípus, amely szakdolgozatként funkcionál. Kérem vegye figyelembe, hogy néhány funkció nem
              az előírtak alapján működik. Ilyen funkciók például a footerben található gombok is, mivel nem szerettem
              volna megosztani a szociális médiabeli elérhetőségeimet.
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>timepicker</strong>
        </v-card-text>
      </v-card>
    </v-col>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer',
    data: () => ({
      icons: [
        'fab fa-facebook',
        'fab fa-twitter',
        'fab fa-google-plus',
        'fab fa-linkedin',
        'fab fa-instagram',
      ],
      details: [
        'Daniel János Róbert',
        'HSHAOO',
        'DAYJAAT.SZE',
        'h650011@stud.u-szeged.hu',
      ],
    }),
  };
</script>

<style scoped>

</style>
