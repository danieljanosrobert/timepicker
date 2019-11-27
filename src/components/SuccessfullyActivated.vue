<template>
  <v-container :style="setToFullScreen"></v-container>
</template>

<script>
export default {
  name: 'SuccessfullyActivated',
  computed: {
    setToFullScreen() {
      return {
        'min-height': `${window.innerHeight}px`,
      };
    },
  },
  mounted() {
    this.$router.push({name: 'home'});
  },
};
</script>