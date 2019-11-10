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
    aboutPage: '',
    loggedInAsAdmin: false,
    bearerToken: '',
    loggedInUserEmail: '',
    serviceName: '',
    userName: '',
    snackbarVisible: false,
    snackbarText: '',
    snackbarColor: '',
  },
  mutations: {
    _refreshAboutPage(state: any, value: string) {
      state.aboutPage = value;
    },
    _logInAsAdmin(state: any) {
      state.loggedInAsAdmin = true;
    },
    _logOutAsAdmin(state: any) {
      state.loggedInAsAdmin = false;
    },
    _refreshBearerToken(state: any, value: string) {
      state.bearerToken = value;
    },
    _updateUserEmail(state: any, value: string) {
      state.loggedInUserEmail = value;
    },
    _setServiceName(state: any, value: string) {
      state.serviceName = value;
    },
    _setUserName(state: any, value: string) {
      state.userName = value;
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
    openAboutPage({commit}: any, value: string) {
      commit('_refreshAboutPage', value);
    },
    adminLogin({commit}: any) {
      commit('_logInAsAdmin');
    },
    adminLogout({commit}: any) {
      commit('_logOutAsAdmin');
      commit('_setUserName', '');
      commit('_setServiceName', '');
    },
    refreshBearerToken({commit}: any, value: string) {
      commit('_refreshBearerToken', value);
    },
    logout({commit}: any) {
      commit('_refreshBearerToken', '');
      commit('_updateUserEmail', '');
    },
    updateUserEmail({commit}: any, value: string) {
      commit('_updateUserEmail', value);
    },
    setServiceName({commit}: any, value: string) {
      commit('_setServiceName', value);
    },
    setUserName({commit}: any, value: string) {
      commit('_setUserName', value);
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
    serviceName: (state) => _.isEmpty(state.serviceName) ? state.userName : state.serviceName,
  },
});
