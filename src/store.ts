import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'timepicker',
  storage: window.sessionStorage,
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    aboutPage: '',
    loggedInAsAdmin: false,
  },
  mutations: {
    refreshAboutPage(state: any, value: string) {
      state.aboutPage = value;
    },
    logInAsAdmin(state: any) {
      state.loggedInAsAdmin = true;
    },
    logOutAsAdmin(state: any) {
      state.loggedInAsAdmin = false;
    },
  },
  actions: {
    openAboutPage({commit}: any, value: string) {
      commit('refreshAboutPage', value);
    },
    adminLogin({commit}: any) {
      commit('logInAsAdmin');
    },
    adminLogout({commit}: any) {
      commit('logOutAsAdmin');
    },
  },
  getters: {
    isAdminLoggedIn: (state) =>  state.loggedInAsAdmin,
  },
});
