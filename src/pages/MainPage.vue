<template>
  <main class="container mx-auto">
    <div class="scroll mx-auto border w-50 h-100">
      <hr class="mt-5">
      <div class="sorter w-20 h-20 my-5">
        <div class="w-100 justify-between mb-5 text-center">
          Отображать:
          <v-btn-toggle v-model="showToggle" color="#ff6347" class="ml-5" mandatory>
            <v-btn @click="showContent = 'articles'">Статьи</v-btn>
            <v-btn @click="showContent = 'announcements'">Объявления</v-btn>
          </v-btn-toggle>
        </div>
        <div class="text-center">
          Сортировка:
          <v-btn-toggle v-model="sortToggle" color="#20b2aa" class="ml-5" mandatory>
            <v-btn @click="sortByDateTime">По дате</v-btn>
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
import { onBeforeMount, ref } from "vue";

const currentPage = ref(0);
const pageSize = ref(10);
const articles = ref([]);
const sortToggle = ref(0);
const showToggle = ref(0);
const sortBy = ref('dateTime');
const showContent = ref('articles');
const totalPages = ref(0);

const getArticles = async () => {
  try {
    const response = await axios.get('http://194.152.37.7:8812/api/articles', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: sortBy.value
      }
    });
    articles.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  }
}

const sortByDateTime = () => {
  sortBy.value = 'dateTime';
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
  background-color: #12c4e3;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
