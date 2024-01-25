import {createRouter, createWebHistory} from 'vue-router';
import HelloWorldPage from "@/pages/HelloWorldPage.vue";
import MainPage from "@/pages/MainPage.vue";
import About from '@/components/About.vue';
import Person from '@/components/Person.vue';
import ArticleCreate from "@/components/ArticleCreate.vue";
import Notification from "@/components/Notification.vue";
import Register from "@/components/Register.vue";
import Auth from "@/components/Auth.vue";
import ArticlePage from "@/pages/ArticlePage.vue";
import CreateTab from "@/components/CreateTab.vue";

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
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/person',
      name: 'Person',
      component: Person
    },
    {
      path: '/create-Article',
      name: 'ArticleCreate',
      component: ArticleCreate
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
      component:Register,
      name: 'Register',
      path: '/register'
    },
    {
      component:CreateTab,
      name: 'CreateTab',
      path: '/save/articles'
    }
  ]
})
