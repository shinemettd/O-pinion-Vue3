<script setup>
import axios, {HttpStatusCode} from "axios";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import ArticlePageComponent from "@/components/ArticlePageComponent.vue";
import store from "@/store/store";

const currentArticle = ref('');
const currentArticleComments = ref('');
const dataFetched = ref(false);

const route = useRoute();
const articleId = route.params.articleId;


const getArticle = async () => {
  if (store.state.isAuthorized) {
    currentArticle.value = await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}`, store.state.config);
  } else {
    currentArticle.value = await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}`);
  }
}

const getComments = async () => {
  currentArticleComments.value = await axios.get(`http://194.152.37.7:8812/api/article-comments/${articleId}`);
}

function cutImagePath(absolutePath) {
  if (absolutePath === null) {
    return null;
  }
  const shortPath = absolutePath.substring(absolutePath.indexOf("/images/"));
  console.log(shortPath);
  return shortPath;
}

const isAuthorized = async () => {
  if (store.state.nickname === null) {
    return false;
  }
  try {
    const response = await axios.get(`http://194.152.37.7:8812/api/users/my-profile`);
    return response.status === HttpStatusCode.Ok;
  } catch (e) {
    return false;
  }
}

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  if (!dataFetched.value) {
    await getArticle();
    await getComments();
  }
});
</script>



<template>
  <ArticlePageComponent
    :authors-avatar-url = "cutImagePath(currentArticle.data.author.avatar) || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
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
  />

</template>

<style scoped>

</style>
