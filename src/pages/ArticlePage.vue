<script setup>
import axios, {HttpStatusCode} from "axios";
import {onBeforeMount, ref} from "vue";
import { useRoute } from 'vue-router';
import ArticlePageComponent from "@/components/ArticlePageComponent.vue";
import store from "@/store/store";
import router from "@/plugins/router";
import PageNotFound from "@/pages/PageNotFound.vue";

const currentArticle = ref('');
const currentArticleComments = ref('');
const dataFetched = ref(false);

const route = useRoute();
const articleId = route.params.articleId;
const isNotFound = ref(false);

const getArticle = async () => {
  try {
    if (store.state.isAuthorized) {
      currentArticle.value = await axios.get(`${store.state.API_URL}/api/articles/${articleId}`, store.state.config);
    } else {
      currentArticle.value = await axios.get(`${store.state.API_URL}/api/articles/${articleId}`);
    }
    dataFetched.value = true;
  } catch (e) {
    isNotFound.value = true;
  }

}

const getComments = async () => {
  currentArticleComments.value = await axios.get(`${store.state.API_URL}/api/article-comments/${articleId}`);
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
  if (!dataFetched.value) {
    await getArticle();
    await getComments();
  }
});
</script>

<template>
    <ArticlePageComponent v-if="!isNotFound"
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
                    :article-status="currentArticle.data.status"
                    :articleTags="currentArticle.data.tags"
                    :load-comments="getComments"
    />
  <PageNotFound v-if="isNotFound"
                    secondary-message="Статья, которую вы пытаетесь открыть, была скрыта или удалена"/>

</template>

<style scoped>

</style>
