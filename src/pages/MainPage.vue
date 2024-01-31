<script setup>
  import axios from 'axios';
  import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
  import {onBeforeMount, onMounted, ref} from "vue";

  const articles = ref('');
  const sortToggle = ref(0);
  const showToggle = ref(0);
  const sortBy = ref('Newness');
  const showContent = ref('All');

  const getArticles = async () => {
    let response = await axios.get('http://194.152.37.7:8812/api/articles');
    articles.value = response.data.content;
  }

  const updateArticles = async () => {
    let response = await axios.get('http://194.152.37.7:8812/api/articles');
    articles.value = response.data.content;
  }

  onBeforeMount(() => {
    getArticles();
  })
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100">
      <hr class = "mt-5">
      <div class = "sorter w-20 h-20 my-5">
        <div class = "w-100 justify-between mb-5 text-center">
          Отображать:
          <v-btn-toggle v-model="showToggle" color="#350454" class = "ml-5">
            <v-btn @click="showContent = 'All'">Всё</v-btn>
            <v-btn @click="showContent = 'Articles'">Статьи</v-btn>
            <v-btn @click="showContent = 'Announcements'">Объявления</v-btn>
          </v-btn-toggle>
        </div>
        <div class = "text-center">
          Сортировка:
          <v-btn-toggle v-model="sortToggle" color="#350454"  class = "ml-5">
            <v-btn @click="sortBy = 'Newness'">По новизне</v-btn>
            <v-btn @click="sortBy = 'Popularity'">По популярности</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <hr>
      <div v-for="article in articles" :key="article.id" class = "scroll-content my-7">
        <ArticlePreviewComponent
                          :authors-nickname = "article.author.nickname"
                          :authors-avatar-url = "article.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
                          :postedTimeAgo = "article.date_time"
                          :article-id = "article.id"
                          :article-title = "article.title"
                          :article-main-picture-url = "article.cover_image"
                          :article-short-description= "article.short_description"
                          :article-rating = "article.rating"
                          :article-in-favourites = "article.in_favourites"
                          :article-total-favourites = "article.total_favourites"
                          :article-total-comments = "article.total_comments"
                          :article-total-views = "article.total_views"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
