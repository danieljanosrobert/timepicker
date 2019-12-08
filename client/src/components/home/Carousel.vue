<template>
  <v-carousel hide-delimiters show-arrows-on-hover>
    <template v-for="(detail, idx) in details">
      <v-carousel-item :src="detail.src" id="carousel" :key="idx">
          <v-row class="fill-height" align="center" justify="center">
            <div class="bg-color-yellow text-dark-mahogany pa-1"><b>{{detail.text}}</b></div>
          </v-row>
      </v-carousel-item>
    </template>
  </v-carousel>
</template>

<script>
  export default {
    data: () => ({
      gray: '#EDEAE5',
      details: [
          {
            text: 'Gyors dinamikus keresés szolgáltatás neve alapján',
            src: 'https://res.cloudinary.com/timepicker/image/upload/v1575125906/dashboard/search_o3sroc.gif',
          },
          {
            text: 'Saját szolgáltatói oldal, melyet bárki böngészhet',
            src: 'https://res.cloudinary.com/timepicker/image/upload/v1575130395/dashboard/book_s8eqev.gif',
          },
      ],
    }),
    name: 'Carousel',
  };
</script>

<style>
  #carousel .v-image__image{
    background-size: auto, 100%!important;
  }
</style>
