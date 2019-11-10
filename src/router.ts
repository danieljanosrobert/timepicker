import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Search from './views/Search.vue';
import Register from './views/admin/Register.vue';
import Service from './views/admin/settings/SearchingResultSettings.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/admin/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/settings/service',
      name: 'service',
      component: Service,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
