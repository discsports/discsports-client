import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/games',
      name: 'Games',
      component: () => import(/* webpackChunkName: "Games" */ './views/Games.vue'),
    },
    {
      path: '/game/:gameId',
      name: 'GameHistory',
      component: () => import(/* webpackChunkName: "GameHistory" */ './views/GameHistory.vue'),
      props: (route) => {
        const gameId = Number.parseInt(route.params.gameId, 10);
        if (Number.isNaN(gameId)) {
          return 0;
        }
        return { gameId };
      },
    },
    {
      path: '/point/:pointId',
      name: 'Point',
      component: () => import(/* webpackChunkName: "Point" */ './views/Point.vue'),
      props: (route) => {
        const pointId = Number.parseFloat(route.params.pointId, 10);
        if (Number.isNaN(pointId)) {
          return 0;
        }
        return { pointId };
      },
    },
  ],
});
