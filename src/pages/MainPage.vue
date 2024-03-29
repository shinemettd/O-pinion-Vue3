<template>
  <main class="container mx-auto">
    <div class="scroll mx-auto border w-full lg:w-2/3 xl:w-1/2 h-auto lg:h-100">
      <hr class="mt-5">
      <div class="sorter w-full lg:w-1/2 h-auto my-5 flex flex-col lg:flex-row items-center justify-between">
        <div class="sort-buttons w-full lg:w-auto mb-5 lg:mb-0 text-center lg:text-left">
          Отображать:
          <v-btn-toggle v-model="showToggle" color="#ff6347" class="ml-5" mandatory>
            <v-btn @click="changeContent('article')">Статьи</v-btn>
            <v-btn @click="changeContent('announcement')">Объявления</v-btn>
          </v-btn-toggle>
        </div>
        <div  v-if="content === 'article'"  class="w-full lg:w-auto text-center lg:text-right">
          Сортировка:
          <v-btn-toggle v-model="sortToggle" color="#20b2aa" class="ml-5" mandatory>
            <v-btn @click="sortByDateTime">По новизне</v-btn>
            <v-btn @click="sortByPopularity">По популярности</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <hr>
      <div  v-if="content === 'article' && articles.length > 0" class="scroll-content my-7" v-for="article in articles" :key="article.id" >
        <ArticlePreviewComponent
          :authors-nickname="article.author.nickname"
          :authors-avatar-url="article.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
          :postedTimeAgo="article.date_time"
          :article-id="article.id"
          :article-title="article.title"
          :article-main-picture-url="article.cover_image"
          :article-short-description="article.short_description"
          :article-rating="article.rating"
          :article-in-favourites="article.in_favourites"
          :article-total-favourites="article.total_favourites"
          :article-total-comments="article.total_comments"
          :article-total-views="article.total_views"
        />
      </div>
      <div v-else-if="content === 'announcement' && announcements.length > 0" v-for="announcement in announcements" :key="announcement.id" class="scroll-content my-7">
        <AnnouncementPreviewComponent
          :postedTimeAgo="announcement.date_time"
          :announcement-id="announcement.id"
          :announcement-title="announcement.title"
          :announcement-content = "announcement.content"
          :announcement-main-picture-url="announcement.cover_image"
          :announcement-total-favourites="announcement.total_favourites"
          :announcement-in-favourites="announcement.in_favourites"
          :announcement-total-comments="announcement.total_comments"
          :announcement-total-views="announcement.total_views"
        />
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="loading-content">
          <img src="/icons/loading.gif" alt="Loading...">
        </div>
      </div>

      <div v-else-if="!isDataFetched" class="text-center mt-7 pb-5"> Нет доступных статей </div>
      <div v-if = "articles.length" v-observe-visibility="handleScrolledToBottom"> </div>

    </div>
  </main>
</template>

<script setup>
import axios, {HttpStatusCode} from 'axios';
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import AnnouncementPreviewComponent from '@/components/AnnouncementPreviewComponent.vue';
import {onBeforeMount, ref} from "vue";
import store from "@/store/store";

const content = ref('article');
const currentArticlePage = ref(0);
const currentAnnouncementPage = ref(0);

const articles = ref([]);
const announcements = ref([]);
const sortToggle = ref(0);
const showToggle = ref(0);
const sortBy = ref('dateTime,desc');


const articleTotalPages = ref(0);
const announcementTotalPages = ref(0);

const loading = ref(false);
const isDataFetched = ref(true);


const changeContent = (contentType) => {
  content.value = contentType;
  console.log("content type : " + content.value);
}

const getArticles = async () => {
  loading.value = true;
  const config = {
    params: {
      sort: sortBy.value
    }
  };

  if (store.state.isAuthorized) {
    config.headers = {
      'Authorization': `Bearer ${store.state.userToken}`
    };
  }

  try {
    const response = await axios.get(`${store.state.API_URL}/api/articles?page=${currentArticlePage.value}`, config);
    loading.value = false;
    isDataFetched.value = true;
    articles.value.push(...response.data.content);
    articleTotalPages.value = response.data.totalPages;
  } catch (error) {
    loading.value = false;
    isDataFetched.value = false;
    console.error('Не удалось загрузить статьи:', error);
  }
}

const getAnnouncements = async () => {
  loading.value = true;
  const config = {
    params: {
      sort: sortBy.value
    }
  };

  if (store.state.isAuthorized) {
    config.headers = {
      'Authorization': `Bearer ${store.state.userToken}`
    };
  }

  try {
    const response = await axios.get(`${store.state.API_URL}/api/announcements?page=${currentAnnouncementPage.value}`, config);
    loading.value = false;
    announcements.value.push(...response.data.content);
    announcementTotalPages.value = response.data.totalPages;
  } catch (error) {
    loading.value = false;
    console.error('Не удалось загрузить объявления:', error);
  }
}

const handleScrolledToBottom = (isVisible) => {
  if (!isVisible) { return };
  if(content.value === 'article') {
    if (currentArticlePage.value >= articleTotalPages.value) { return };
    currentArticlePage.value += 1;
    getArticles();
  } else if(content.value === 'announcement') {
    if (currentAnnouncementPage.value >= announcementTotalPages.value) { return };
    currentAnnouncementPage.value += 1;
    getAnnouncements();
  }
}

const sortByDateTime = () => {
  sortBy.value = 'dateTime,desc';
  articles.value.splice(0, articles.value.length);
  setPage(0);
}

const sortByPopularity = () => {
  sortBy.value = 'viewsCount,desc';
  articles.value.splice(0, articles.value.length);
  setPage(0);
}

const setPage = async (page) => {
  currentArticlePage.value = page;
  await getArticles();
}

const isAuthorized = async () => {
  if (store.state.nickname === null) {
    return false;
  }
  try {
    const response = await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config);
    return response.status === HttpStatusCode.Ok;
  } catch (e) {
    return false;
  }
}

const checkNotifications = async () => {
  try {
    const notificationCount = (await axios.get(`${store.state.API_URL}/api/user-notifications/not-read`, store.state.config)).data.totalElements;
    store.commit('setNotificationCount', notificationCount);
  } catch (e) {
    console.error(e);
  }
}

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  } else {
    await checkNotifications();
  }
  await getAnnouncements();
  await getArticles();
});

</script>

<style scoped>
.scroll {
  width: 50%;
  box-shadow: 0px 100px 100px rgba(0, 0, 0, 0.1);
}

.pagination {

  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background: linear-gradient(21deg, #86278a, #652ae5);
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 0%;
  height: 0%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.loading-content img {
  position: fixed;
  max-width: 20%;
  min-height: 20%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%
}

@media screen and (max-width: 1920px) {
  .scroll {
    width: 50%;
  }
}

@media screen and (max-width: 1280px) {
  .scroll {
    width: 66%;
  }
}

@media screen and (max-width: 768px) {
  .scroll {
    width: 100%;
  }
}
</style>
