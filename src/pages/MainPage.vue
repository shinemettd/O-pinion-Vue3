<script>
  import axios from 'axios';
  import ArticleComponent from "@/components/ArticleComponent.vue";
  export default {
    components: {ArticleComponent},
    data() {
      return {
        articles: []
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
      <div class = "sorter border w-20 h-20 text-center py-5">
        Сортировка будет здесь
      </div>
      <div v-for="article in articles" :key="article.id" class = "scroll-content my-7">
        <ArticleComponent
                          :authors-nickname = "article.author.nickname"
                          postedTimeAgo = "3 часа назад"
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
