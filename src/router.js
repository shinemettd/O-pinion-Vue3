import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import Technology from '../components/Technology.vue'; // Импорт компонента "Технологии"

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/technology',
    name: 'Technology',
    component: Technology // Маршрут к компоненту "Технологии"
  },
  // Другие маршруты...
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
