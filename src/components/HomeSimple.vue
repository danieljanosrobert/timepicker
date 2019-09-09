<template>
  <v-carousel hide-delimiters show-arrows-on-hover>
    <v-carousel-item
            v-for="(detail) in details"
            :key="detail"
    >
      <v-sheet
              :color=gray
              height="100%"
              tile
      >
        <v-row
                class="fill-height"
                align="center"
                justify="center"
        >
          <div class="display-3 text-dark-mahogany">{{detail}}</div>
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
          'Időpontfoglalás otthonról',
          'Egyszerű kereséssel',
          'Helymeghatározással',
          'Azonnal',
      ],
    }),
    name: 'HomeSimple',
  };
</script>

<style scoped>

</style>
