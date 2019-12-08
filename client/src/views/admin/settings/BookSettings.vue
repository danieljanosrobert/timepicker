<template>
  <v-container :style="setToFullScreen" fluid class="px-12 pb-0" id="container">
    <v-row class="pa-0 pt-8">
      <v-col cols="12" class="pa-0">
        <SetBookTimes/>
      </v-col>
      <v-col cols="12" class="pa-0 py-8">
        <SetBreakTimes/>
      </v-col>
      <v-col cols="12" class="pa-0 py-8">
        <SetLeaveTimes/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SetBookTimes from '@/components/settings/SetBookTimes';
import SetBreakTimes from '@/components/settings/SetBreakTimes';
import SetLeaveTimes from '@/components/settings/SetLeaveTimes';

export default {
  name: 'BookSettings',
  data: () => ({
  }),
  components: {
    SetBookTimes,
    SetBreakTimes,
    SetLeaveTimes,
  },
  computed: {
    setToFullScreen() {
      return {
        'min-height': `${window.innerHeight}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

#container {
  background-color: $_yellow;
}
</style>
