import {createRouter, createWebHistory} from 'vue-router';
import MainPage from "@/pages/MainPage.vue";
import Notification from "@/components/Notification.vue";
import Register from "@/components/Register.vue";
import Auth from "@/components/Auth.vue";
import ArticlePage from "@/pages/ArticlePage.vue";
import AnnouncementPage from '@/pages/AnnouncementPage.vue';
import UserProfilePage from "@/pages/UserProfilePage.vue";
import ArticleCreatePage from "@/pages/ArticleCreatePage.vue";
import ArticleEditPage from "@/pages/ArticleEditPage.vue";
import SuccessArticleCreationPage from "@/pages/SuccessArticleCreationPage";
import PageNotFound from "@/pages/PageNotFound.vue";
import store from "@/store/store";
import SettingsPage from "@/pages/SettingsPage.vue";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.vue";
import SuccessRegisterPage from "@/pages/SuccessRegisterPage.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage.vue";
import SavedContentPage from '@/pages/SavedContentPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainPage,
      meta: {
        title: 'Главная'
      }
    },
    {
      path: '/saved-content',
      component: SavedContentPage,
      meta: {
        title: 'Понравившиеся'
      }
    },
    {
      path: '/article/:articleId',
      component: ArticlePage,
    },
    {
      path: '/announcement/:announcementId',
      component: AnnouncementPage,
    },
    {
      path: '/user/:userNickname',
      component: UserProfilePage,
      meta: {
        title: `Профиль`
      },
      beforeEnter: (to, from, next) => {
        document.title = `Профиль ${to.params.userNickname}` || 'Профиль пользователя';
        next();
      }
    },
    {
      path: '/create-article',
      name: 'ArticleCreatePage',
      component: ArticleCreatePage,
      meta: {
        title: 'Создание статьи'
      }
    },
    {
      path: '/edit-article/:articleId',
      name: 'ArticleEditPage',
      component: ArticleEditPage,
      meta: {
        title: 'Редактирование статьи'
      }
    },
    {
      path: '/create-article/success',
      name: 'SuccessArticleCreationPage',
      component: SuccessArticleCreationPage,
      meta: {
        title: 'Статья создана'
      }
    },
    {
      path: '/notification',
      name: 'Notification',
      component: Notification,
      meta: {
        title: 'Уведомления'
      }
    },
    {
      name: 'Auth',
      path: '/auth',
      component: Auth,
      meta: {
        title: 'Вход'
      }
    },
    {
      name: 'Register',
      path: '/register',
      component: Register,
      meta: {
        title: 'Регистрация'
      }
    },
    {
      name: 'SuccessRegister',
      path: '/success-registration',
      component: SuccessRegisterPage,
      meta: {
        title: 'Успешная регистрация'
      }
    },
    {
      name: 'ForgotPassword',
      path: '/forgot-password',
      component: ForgotPasswordPage,
      meta: {
        title: 'Сброс пароля'
      }
    },
    {
      name: 'ResetPassword',
      path: '/reset-password/:token',
      component: ResetPasswordPage,
      meta: {
        title: 'Новый пароль'
      }
    },
    {
      name: 'Settings',
      path: '/settings',
      component: SettingsPage,
      meta: {
        title: 'Настройки'
      }
    },
    {
      path: '/:catchAll(.*)',
      component: PageNotFound,
      meta: {
        title: 'Страница не найдена'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ?? 'O!pinion';

  const isAuthorized = store.state.isAuthorized;

  if (isAuthorized && (to.path === '/register' || to.path === '/auth' || to.path === '/forgot-password')) {
    next('/');
  } else {
    next();
  }
});

export default router;
