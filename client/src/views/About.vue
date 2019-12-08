<template>
  <v-container fluid class="text-center pa-0" :style="setToFullScreen">
    <v-dialog v-model="dialog" max-width="400">
      <Contact></Contact>
    </v-dialog>
    <BookingDialog></BookingDialog>
    <v-row class="margin-with-navbar mr-0">
      <v-col cols="12" class="pa-0 px-2">
        <MessageBoard v-if="visibleContent==='messageBoard'" ></MessageBoard>
        <Book v-if="visibleContent==='book'" ></Book>
      </v-col>
    </v-row>
    <Sidebar></Sidebar>
  </v-container>
</template>
<script>
  import Sidebar from '@/components/info/Sidebar.vue';
  import MessageBoard from '@/components/info/MessageBoard.vue';
  import Contact from '@/components/info/Contact.vue';
  import Book from '@/components/info/Book.vue';
  import BookingDialog from '@/components/info/book-on-event/BookingDialog.vue';

  export default {
    components: {BookingDialog, Book, Contact, MessageBoard, Sidebar},
    data: () => ({
      visibleContent: 'messageBoard',
      dialog: false,
    }),
    mounted() {
      this.$root.$on('aboutEvent', (data) => {
        if (data !== 'about') {
          this.visibleContent = data;
        } else {
          this.dialog = true;
        }
      });
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

<style scoped>
  .margin-with-navbar {
    margin-left: 4px !important;
  }
  @media (min-width: 960px) {
    .margin-with-navbar {
      margin-left: 204px !important;
    }
  }
</style>
