<template>
    <div v-if="articleValid">
        <ArticleCreatePage
            :article="article"
            :editedArticleId="article.id"
            :editedArticleTitle="article.title"
            :editedArticleShortDescription="article.short_description"
            :editedArticleContent="article.content"
            :editedArticleCoverImage="article.cover_image"
        />
    <div v-if="!articleValid">
        <PageNotFound/>
    </div>
    </div>


</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import axios, {HttpStatusCode} from "axios";
import {useRoute} from "vue-router";
import store from "@/store/store";
import ArticleCreatePage from "@/pages/ArticleCreatePage.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
const route = useRoute();
const articleId = route.params.articleId;
const article = ref([]);
const articleValid = ref(false);


const getArticle = async () => {
  try {
    let response;
    response = await axios.get(`${store.state.API_URL}/api/articles/cache/${articleId}`, store.state.config);
    article.value = response.data;
    articleValid.value = true;
  } catch (e) {
    articleValid.value = false;
  }
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

const checkNotifications = async () => {
  try {
    const notificationCount = (await axios.get(`${store.state.API_URL}/api/user-notifications/not-read-count`, store.state.config)).data;
    store.commit('setNotificationCount', notificationCount);
  } catch (e) {
    console.error(e);
  }
}

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  } else {
    await checkNotifications();
  }
  await getArticle();
  console.log(article.value);
  console.log(article.value.tags);
});
</script>
<style scoped>

</style>
