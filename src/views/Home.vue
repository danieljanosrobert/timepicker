<template>
  <v-container fluid class="full-height pa-0">
    <HomeParallax/>
    TEXT FOR HOMEPAGE BECAUSE WITHOUT IT THERE IS NO MENU
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import HomeParallax from '@/components/HomeParallax.vue';

export default Vue.extend({
  components: {
    HomeParallax,
  },
});
</script>
