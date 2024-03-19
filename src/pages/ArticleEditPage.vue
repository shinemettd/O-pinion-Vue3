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
import axios  from "axios";
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
    response = await axios.get(`${store.state.API_URL}/api/articles/${articleId}`, store.state.config);
    article.value = response.data;
    articleValid.value = true;
  } catch (e) {
    articleValid.value = false;
  }
}

onBeforeMount(async () => {
  await getArticle();
  console.log(article.value);
  console.log(article.value.tags);
});
</script>
<style scoped>

</style>