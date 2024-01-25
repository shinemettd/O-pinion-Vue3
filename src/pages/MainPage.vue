<script>
  import axios from 'axios';
  import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
  export default {
    components: {ArticlePreviewComponent},
    data() {
      return {
        articles: [],
        sortToggle: 0,
        showToggle: 0,
        sortBy: 'Popularity',
        showContent: 'All'
      }
    },
    methods: {
      async getArticles() {
        let articles = await axios.get('http://194.152.37.7:8812/api/articles');
        this.articles = articles.data.content;
      }
    },
    mounted() {
      this.getArticles();
    }
  }
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100">
      <div class = "sorter w-20 h-20 my-5">
        <div class = "w-100 justify-between mb-5 text-center">
          Отображать:
          <v-btn-toggle v-model="showToggle" color="#350454" class = "ml-5">
            <v-btn @click="this.showContent = 'All'">Всё</v-btn>
            <v-btn @click="this.showContent = 'Articles'">Статьи</v-btn>
            <v-btn @click="this.showContent = 'Announcements'">Объявления</v-btn>
          </v-btn-toggle>
        </div>
        <div class = "text-center">
          Сортировка:
          <v-btn-toggle v-model="sortToggle" color="#350454"  class = "ml-5">
            <v-btn @click="this.sortBy = 'Popularity'">По популярности</v-btn>
            <v-btn @click="this.sortBy = 'Date'">По дате</v-btn>
          </v-btn-toggle>
        </div>
      </div>
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
