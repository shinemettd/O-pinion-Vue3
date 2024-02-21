import {createRouter, createWebHistory} from 'vue-router';
import HelloWorldPage from "@/pages/HelloWorldPage.vue";
import MainPage from "@/pages/MainPage.vue";
import About from '@/components/About.vue';


import Notification from "@/components/Notification.vue";
import Register from "@/components/Register.vue";
import Auth from "@/components/Auth.vue";
import ArticlePage from "@/pages/ArticlePage.vue";
import UserProfilePage from "@/pages/UserProfilePage.vue";
import ArticleCreatePage from "@/pages/ArticleCreatePage.vue";
import SuccessArticleCreationPage from "@/pages/SuccessArticleCreationPage";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainPage
    },
    {
      path: '/hello-world',
      component: HelloWorldPage
    },
    {
      path: '/article/:articleId',
      component: ArticlePage
    },
    {
      path: '/user/:userNickname',
      component: UserProfilePage
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/user',
      name: 'user',
      component: About
    },
    {
      path: '/create-article',
      name: 'ArticleCreatePage',
      component: ArticleCreatePage
    },
    {
      path: '/create-article/success',
      name: 'SuccessArticleCreationPage',
      component: SuccessArticleCreationPage
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification
    },
    {
      component: Auth,
      name: 'Auth',
      path: '/auth'
    },
    {
      component: Auth,
      name: 'Auth',
      path: '/auth'
    },
    {
      component: Register,
      name: 'Register',
      path: '/register'
    }
  ]
})
