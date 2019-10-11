<template>
  <v-container :style="setToFullScreen" fluid class="pa-0">
    <v-parallax class="full-height" src="@/assets/images/doctor.jpg" dark>
      <v-row align="center" justify="center"><h1 class="text-yellow" style="font-size: 150px">Logo helye</h1></v-row>
      <v-row align="center" justify="center">
        <h1 class="display-4 font-weight-thick mb-12 text-dark-blue shadow-text-light-blue ">Időpontok egyszerűen kezelve</h1>
      </v-row>
      <v-row align="center" justify="center" class="text-dark-mahogany" style="font-size: 30px">
        <div align="center">
          <p>
            Rugalmas időpontok
            <v-icon>mdi-circle-medium</v-icon>
            Ütemezett foglalások
            <v-icon>mdi-circle-medium</v-icon>
            Egyszerű hirdetés
          </p>
          <p>
            Foglalás nyitvatartási időn kívül is
          </p>
        </div>
      </v-row>
      <v-row align="end" justify="center" class="text-dark-blue ">
          <div @mouseover="hover = true"
               @mouseleave="hover = false"
               align="center">
              <p class="pa-0 hoverable more-arrow-label" :class="hover ? 'display' : 'hide'">Tudjon meg többet!</p>
            <v-icon v-on:click="scrollTo('home-simple')" size="120px" :class="{ jumping: hover }" class="pa-0 ma-0">mdi-chevron-down</v-icon>
          </div>
      </v-row>
    </v-parallax>
  </v-container>
</template>

<script type="ts">
  export default {
    name: 'Parallax',
    data: () => ({
      hover: false,
    }),
    computed: {
      setToFullScreen() {
        return {
          height: `${window.innerHeight}px`,
        };
      },
    },
    methods: {
      scrollTo(refName) {
        this.$parent.scrollTo(refName);
      },
    },
  };
</script>

<style scoped>
  .more-arrow-label {
    margin-bottom: -10%;
  }
</style>
