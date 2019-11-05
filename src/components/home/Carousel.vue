<template>
  <v-carousel hide-delimiters show-arrows-on-hover>
    <v-carousel-item v-for="(detail, idx) in details" :key="idx">
      <v-sheet :color=gray height="100%" tile>
        <v-row class="fill-height" align="center" justify="center">
          <div class="text-dark-mahogany">{{detail}}</div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
  export default {
    data: () => ({
      gray: '#EDEAE5',
      details: [
          'Gif az oldal használatáról#1 - keresés',
          'Gif az oldal használatáról#2 - elérhetőségek vagy hírek böngészése',
          'Gif az oldal használatáról#3 - foglalás',
      ],
    }),
    name: 'Carousel',
  };
</script>

<style scoped>

</style>
