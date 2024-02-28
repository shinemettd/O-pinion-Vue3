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
import PageNotFound from "@/pages/PageNotFound.vue";
import store from "@/store/store";
// потом удалить 
import TagZone from "@/components/TagZone.vue";

const router = createRouter({
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
      name: 'Auth',
      path: '/auth',
      component: Auth
    },
    {
      name: 'Register',
      path: '/register',
      component: Register
    },
    {
      path: '/:catchAll(.*)',
      component: PageNotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthorized = store.state.isAuthorized;

  if (isAuthorized && (to.path === '/register' || to.path === '/auth' )) {
    next('/');
  } else {
    next();
  }
});

export default router;
