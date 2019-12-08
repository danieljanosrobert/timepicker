import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import * as _ from 'lodash';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'timepicker',
  storage: window.localStorage,
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    loggedInAsAdmin: false,
    loggedInAsUser: false,
    bearerToken: '',
    loggedInUserEmail: '',
    ownServiceId: '',
    snackbarVisible: false,
    snackbarText: '',
    snackbarColor: '',
  },
  mutations: {
    _logInAsAdmin(state: any) {
      state.loggedInAsAdmin = true;
    },
    _logInAsUser(state: any) {
      state.loggedInAsUser = true;
    },
    _logOutAsAdmin(state: any) {
      state.loggedInAsAdmin = false;
    },
    _logOutAsUser(state: any) {
      state.loggedInAsUser = false;
    },
    _refreshBearerToken(state: any, value: string) {
      state.bearerToken = value;
    },
    _updateUserEmail(state: any, value: string) {
      state.loggedInUserEmail = value;
    },
    _setOwnServiceId(state: any, value: string) {
      state.ownServiceId = value;
    },
    _openSnackbar(state: any) {
      state.snackbarVisible = true;
    },
    _closeSnackbar(state: any) {
      state.snackbarVisible = false;
    },
    _setSnackbarText(state: any, value: string) {
      state.snackbarText = value;
    },
    _setSnackbarColor(state: any, value: string) {
      state.snackbarColor = value;
    },
  },
  actions: {
    adminLogin({commit}: any, value: string) {
      commit('_logInAsAdmin');
      commit('_setOwnServiceId', value);
    },
    userLogin({commit}: any) {
      commit('_logInAsUser');
    },
    refreshBearerToken({commit}: any, value: string) {
      commit('_refreshBearerToken', value);
    },
    logout({commit}: any) {
      commit('_logOutAsAdmin');
      commit('_setOwnServiceId', '');
      commit('_refreshBearerToken', '');
      commit('_updateUserEmail', '');
      commit('_logOutAsUser');
    },
    updateUserEmail({commit}: any, value: string) {
      commit('_updateUserEmail', value);
    },
    openSnackbar({commit}: any, options: any) {
      commit('_openSnackbar');
      commit('_setSnackbarText', options.message);
      commit('_setSnackbarColor', options.type);
    },
    closeSnackbar({commit}: any) {
      commit('_closeSnackbar');
    },
  },
  getters: {
    adminAuth: (state) => state.loggedInAsAdmin,
    userAuth: (state) => state.loggedInAsUser,
  },
});
