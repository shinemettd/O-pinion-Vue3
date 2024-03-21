<template>
  <main class="container mx-auto">
    <div class="scroll mx-auto border w-full lg:w-2/3 xl:w-1/2 h-auto lg:h-100">
      <hr class="mt-5">
      <div class="sorter w-full lg:w-1/2 h-auto my-5 flex flex-col lg:flex-row items-center justify-between">
        <div class="w-full lg:w-auto mb-5 lg:mb-0 text-center lg:text-left">
          Отображать:
          <v-btn-toggle v-model="showToggle" color="#ff6347" class="ml-5" mandatory>
            <v-btn @click="showContent = 'articles'">Статьи</v-btn>
            <v-btn @click="showContent = 'announcements'">Объявления</v-btn>
          </v-btn-toggle>
        </div>
        <div class="w-full lg:w-auto text-center lg:text-right">
          Сортировка:
          <v-btn-toggle v-model="sortToggle" color="#20b2aa" class="ml-5" mandatory>
            <v-btn @click="sortByDateTime">По новизне</v-btn>
            <v-btn @click="sortByPopularity">По популярности</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <hr>
      <div v-if="articles.length > 0" v-for="article in articles" :key="article.id" class="scroll-content my-7">
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
      <div v-if="loading" class="loading-spinner">
        <div class="loading-content">
          <img src="/icons/loading.gif" alt="Loading..." style="margin: auto;">
        </div>
      </div>
      <div v-else class="text-center mt-7 pb-5"> Нет доступных статей </div>
      <div v-if = "articles.length" v-observe-visibility="handleScrolledToBottom"> </div>
    </div>
  </main>
</template>

<script setup>
import axios, {HttpStatusCode} from 'axios';
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import {onBeforeMount, ref} from "vue";
import store from "@/store/store";

const currentPage = ref(0);
const pageSize = ref(10);
const articles = ref([]);
const sortToggle = ref(0);
const showToggle = ref(0);
const sortBy = ref('dateTime,desc');
const showContent = ref('articles');
const totalPages = ref(0);
const loading = ref(true);

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
    const response = await axios.get(`${store.state.API_URL}/api/articles?page=${currentPage.value}`, config);
    loading.value = false;
    articles.value.push(...response.data.content);
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Не удалось загрузить статьи:', error);
  }
}

const handleScrolledToBottom = (isVisible) => {
  if (!isVisible) { return };
  if (currentPage.value >= totalPages.value) { return };
  currentPage.value += 1;
  getArticles();
}

const sortByDateTime = () => {
  sortBy.value = 'dateTime,desc';
  setPage(0);
}

const sortByPopularity = () => {
  sortBy.value = 'viewsCount,desc';
  setPage(0);
}

const setPage = async (page) => {
  currentPage.value = page;
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

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  await getArticles();
});

</script>

<style scoped>
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
  width: 100%; 
  height: 100%; 
  background-color: rgb(0, 0, 0);  
  background-color: rgba(0, 0, 0, 0.4); 
}

.loading-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%
}

@media screen and (max-width: 767px) {
  .sorter {
    flex-direction: column;
  }
  .sorter div {
    width: 100%;
    margin-bottom: 1rem;
  }
  .sorter div:last-child {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 768px) {

  .scroll {
    width: 50%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
}

</style>
