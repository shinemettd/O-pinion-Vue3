<script setup>
import axios from "axios";
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router';
import ArticlePageComponent from "@/components/ArticlePageComponent.vue";

const currentArticle = ref('');
const currentArticleComments = ref('');
const currentArticleCommentsReplies = ref('');
const dataFetched = ref(false);

const route = useRoute();
const articleId = route.params.articleId;

const getArticle = async () => {
  currentArticle.value = await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}`);
  dataFetched.value = true;
}

const getComments = async () => {
  currentArticleComments.value = await axios.get(`http://194.152.37.7:8812/api/article-comments/${articleId}`);
  currentArticleCommentsReplies.value = await axios.get(`http://194.152.37.7:8812/api/article-comments/${articleId}/replies`);
}

onBeforeMount(() => {
  if (!dataFetched.value) {
    getArticle();
    getComments();
  }
});
</script>

<template>
  <ArticlePageComponent
    :authors-avatar-url = "currentArticle.data.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
    :authors-nickname = "currentArticle.data.author.nickname"
    :posted-time-ago = "currentArticle.data.date_time"
    :article-id = "currentArticle.data.id"
    :article-title = "currentArticle.data.title"
    :article-content = "currentArticle.data.content"
    :article-rating = "currentArticle.data.rating"
    :article-in-favourites = "currentArticle.data.in_favourites"
    :article-total-favourites = "currentArticle.data.total_favourites"
    :article-total-comments = "currentArticle.data.total_comments"
    :article-total-views = "currentArticle.data.total_views"
    :article-comments = "currentArticleComments.data"
    :article-comments-replies = "currentArticleCommentsReplies.data"
  />

</template>

<style scoped>

</style>