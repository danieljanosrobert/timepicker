<template>
  <v-container :style="setToFullScreen" fluid class="pa-0">
    <v-parallax class="full-height" src="@/assets/images/doctor.jpg" dark>
      <v-row
              align="center"
              justify="center"
      >
        <h1 class="display-4 font-weight-thick mb-12 text-dark-blue shadow-text-light-blue ">Pick-a-Time</h1>
        <h4 class="display-1 text-dark-blue shadow-text-light-blue">Foglalj időpontot most!</h4>
      </v-row>
    </v-parallax>
  </v-container>
</template>

<script type="ts">
  export default {
    name: 'HomeParallax',
    computed: {
      setToFullScreen() {
        return {
          height: `${window.innerHeight}px`,
        };
      },
    },
  };
</script>
