<template>
  <v-container fluid class="text-justify pa-0">
      <v-row>

        <v-col cols="12">
          <v-card class=" brown lighten-4">
            <v-row class="pa-0">
              <v-col offset="1" cols="10" class="pa-0">
                <v-card-text class="text-center" style="font-size: 2em;"> Üzenőfal </v-card-text>
              </v-col>
              <v-col cols="1" class="pa-0 text-right pr-8 ma-auto">
                <v-btn v-if="isUserServiceOwner()" icon @click.stop="$router.push('/settings/message-board')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col v-for="(item, i) in messages" :key="i" cols="12">
          <v-card class="pb-2 ">
            <v-card-title v-text="item.title"></v-card-title>
            <div class="mx-4">
              <span v-text="item.sub"></span>
            </div>
            <div class="mx-6 my-2">
              <v-card-text class="pre-wrap grey--text text--darken-2" v-text="item.content">
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>
<script>
  import messageService from '@/service/messageService';

  export default {
    data: () => ({
      messages: [],
    }),
    async mounted() {
      this.$root.$on('reFetchContent', () => {
        this.fetchMessages();
      });
      await this.fetchMessages();
    },
    methods: {
      async fetchMessages() {
        this.$root.$emit('startLoading');
        try {
        await messageService.getMessages(this.$route.params.service_id)
            .then((messages) => { this.messages = messages.data.messages; });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      isUserServiceOwner() {
        return this.$store.state.loggedInAsAdmin && this.$store.state.ownServiceId === this.$route.params.service_id;
      },
    },
  };
</script>

<style scoped>
  .pre-wrap {
    line-height: 1.4;
    white-space: pre-wrap;
  }
</style>
