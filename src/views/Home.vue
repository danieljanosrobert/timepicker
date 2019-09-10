<template>
  <v-container fluid class="pa-0">
    <HomeParallax/>
    <HomeSimple ref="home-simple"></HomeSimple>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import HomeParallax from '@/components/HomeParallax.vue';
import HomeSimple from '@/components/HomeSimple.vue';

export default Vue.extend({
  components: {
    HomeParallax,
    HomeSimple,
  },
  methods: {
    scrollTo(refName: string): void {
      const element: number = ((this.$refs[refName]) as Vue & { $el: HTMLElement}).$el.offsetTop;
      window.scrollTo(0, element);
    },
  },
});
</script>
