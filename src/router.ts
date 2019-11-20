import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import adminAuth from '@/middleware/adminAuth';
import userAuth from '@/middleware/userAuth';
import middlewarePipeline from '@/middleware/middlewarePipeline';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Search from '@/views/Search.vue';
import Register from '@/views/admin/Register.vue';
import Settings from '@/views/Settings.vue';
import Service from '@/views/admin/settings/SearchingResultSettings.vue';
import Contact from '@/views/admin/settings/ContactSettings.vue';
import Book from '@/views/admin/settings/BookSettings.vue';
import MessageBoard from '@/views/admin/settings/MessageBoard.vue';
import PasswordSettings from '@/views/admin/settings/PasswordSettings.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about/:service_id',
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
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        middleware: [
          userAuth,
        ],
      },
    },
    {
      path: '/settings/service',
      name: 'service',
      component: Service,
      meta: {
        middleware: [adminAuth],
      },
    },
    {
      path: '/settings/contact',
      name: 'contact',
      component: Contact,
      meta: {
        middleware: [adminAuth],
      },
    },
    {
      path: '/settings/book',
      name: 'book',
      component: Book,
      meta: {
        middleware: [adminAuth],
      },
    },
    {
      path: '/settings/message-board',
      name: 'message-board',
      component: MessageBoard,
      meta: {
        middleware: [adminAuth],
      },
    },
    {
      path: '/settings/change-password',
      name: 'change-password',
      component: PasswordSettings,
      meta: {
        middleware: [adminAuth],
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next();
  }
  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    router,
    next,
    store,
  };


  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
   });

});

export default router;
