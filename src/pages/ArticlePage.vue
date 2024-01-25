<script setup>
import axios from "axios";
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router';
import ArticlePageComponent from "@/components/ArticlePageComponent.vue";
import CommentComponent from "@/components/CommentComponent.vue";
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";

const currentArticle = ref('');
const currentArticleComments = ref('');

const route = useRoute();
const articleId = route.params.articleId;

const getArticle = async () => {
  currentArticle.value = await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}`);
}

const getComments = async () => {
  currentArticleComments.value = await axios.get(`http://194.152.37.7:8812/api/article-comments/${articleId}`);
  await console.log(currentArticleComments.value.data);
}

onBeforeMount(() => { getArticle(); getComments()});
</script>

<template>
  <ArticlePageComponent
    :authors-avatar-url = "currentArticle.data.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
    :authors-nickname = "currentArticle.data.author.nickname"
    :posted-time-ago = "currentArticle.data.date_time"
    :article-id = "currentArticle.data.id"
    :article-title = "currentArticle.data.title"
    :article-rating = "currentArticle.data.rating"
    :article-in-favourites = "currentArticle.data.in_favourites"
    :article-total-favourites = "currentArticle.data.total_favourites"
    :article-total-comments = "currentArticle.data.total_comments"
    :article-total-views = "currentArticle.data.total_views"
    :article-comments = "currentArticleComments.value"
  />

</template>

<style scoped>

</style>
