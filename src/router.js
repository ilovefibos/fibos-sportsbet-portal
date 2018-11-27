import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  store.commit('ui/setGlobalSpinnerVisible', true);
  next();
});
router.afterEach(() => {
  store.commit('ui/setGlobalSpinnerVisible', false);
});

export default router;
