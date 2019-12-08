<template>
  <v-container fluid id="container" class="pa-0">
    <v-col xl="8" offset-xl="2"
           md="10" offset-md="1"
           xs="12" offset-xs="0"
    class="pa-0">
      <DataCards/>
    </v-col>
  </v-container>
</template>

<script>
  import DataCards from '@/components/search/DataCards.vue';

  export default {
    name: 'Search',
    components: {DataCards},
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  #container {
    background-color: $_yellow;
  }
</style>
