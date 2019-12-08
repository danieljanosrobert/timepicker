<template>
  <v-footer dark padless fluid>
    <v-col class="pa-0" cols="12">
      <v-card flat tile
              class="brown darken-4 white--text text-center">
        <v-card-text>
          <v-btn v-for="(icon, idx) in icons"
                 :key="idx"
                 class="mx-4 white--text" icon>
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          <v-row>
            <v-col cols="3"
                   v-for="(data, idx) in details"
                   :key="idx">
              {{data}}
            </v-col>
            <v-col cols="8" offset="2" class="pt-6 text-justify">
              <p class="text-center">Ez az alkalmazás egy prototípus. Kérem vegye figyelembe, hogy az oldalon szereplő adatok kitaláltak, bárminemű egyezésük a valósággal csupán a véletlen műve.</p> 
              
              <p>Amennyiben Ön személyes adatokat ad meg, azok mentésre kerülnek az alkalmazás adatbázisában. Személyes adatok törlésére az alkalmazásban egyelőre nincs lehetőség, ezt e-mail-ben kérvényezheti a h650011@stud.u-szeged.hu címen.<br/>
              Személyes adatok törléséhez szükséges a regisztrációkor megadott Név szerepeltetése az e-mailben, illetve ha az e-mail nem a törlendő felhasználó rágisztrációjához használt címről érkezik, akkor a regisztrációkor használt e-mail címre egy megerősítő kódot kérvényezhet, mely megerősítésével törlöm a személyes adatokat. Megértését köszönöm!</p>
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
