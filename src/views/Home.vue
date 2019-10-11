<template>
  <v-container fluid class="pa-0 noselect">
    <Parallax/>
    <Carousel ref="home-simple"></Carousel>
    <Features/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Parallax from '@/components/home/Parallax.vue';
import Carousel from '@/components/home/Carousel.vue';
import Features from '@/components/home/Features.vue';

const MENU_HEIGHT = 64;

export default Vue.extend({
  name: 'Home',
  components: {Parallax, Carousel, Features},
  methods: {
    scrollTo(refName: string): void {
      const element: number = ((this.$refs[refName]) as Vue & { $el: HTMLElement}).$el.offsetTop - MENU_HEIGHT;
      window.scrollTo(0, element);
    },
  },
});
</script>
