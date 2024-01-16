import {createRouter, createWebHistory} from 'vue-router';
import HelloWorldPage from "@/pages/HelloWorldPage.vue";
import MainPage from "@/pages/MainPage.vue";
import TestArticle from "@/pages/TestArticle.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainPage
    },
    {
      path: '/HelloWorld',
      component: HelloWorldPage
    },
    {
      path: '/TestArticle',
      component: TestArticle
    }
  ]
})
