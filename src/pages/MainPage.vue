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
          :authors-nickname="cutImagePath(article.author.nickname)"
          :authors-avatar-url="article.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
          :postedTimeAgo="article.date_time"
          :article-id="article.id"
          :article-title="article.title"
          :article-main-picture-url="cutImagePath(article.cover_image)"
          :article-short-description="article.short_description"
          :article-rating="article.rating"
          :article-in-favourites="article.in_favourites"
          :article-total-favourites="article.total_favourites"
          :article-total-comments="article.total_comments"
          :article-total-views="article.total_views"
        />
      </div>
      <div v-else class="text-center mt-7">Нет доступных статей.</div>
      <div class="pagination">
        <button @click="setPage(currentPage - 1)" :disabled="currentPage === 0">Предыдущая</button>
        <span>Страница {{ currentPage + 1 }}</span>
        <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages - 1">Следующая</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
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

const getArticles = async () => {
  const config = {
    params: {
      page: currentPage.value,
      size: pageSize.value,
      sort: sortBy.value,
    }
  };

  if (store.state.isAuthorized) {
    config.headers = {
      'Authorization': `Bearer ${store.state.userToken}`
    };
  }

  try {
    const response = await axios.get('http://194.152.37.7:8812/api/articles', config);
    articles.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Не удалось загрузить статьи:', error);
  }
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

function cutImagePath(absolutePath) {
  if (absolutePath === null) {
    return null;
  }
  const shortPath = absolutePath.substring(absolutePath.indexOf("/images/"));
  console.log(shortPath);
  return shortPath;
}

onBeforeMount(() => {
  getArticles();
})
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
  }
}

</style>
