<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import {useStore} from 'vuex';

const props = defineProps({
  userId: {
    type: Number,
    default: 0
  },
  userNickname: {
    type: String,
  },
  userAvatarUrl: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/10/10938.png'
  },
  userFirstName: {
    type: String,
  },
  userLastName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  userBirthdate: {
    type: String,
  }
})

const route = useRoute();
const store = useStore();
const userLink = route.params.userNickname;
const isUserAuthorized = store.state.isAuthorized;

const articles = ref([]);
const isArticlesFound = ref();

function isUserItself() {
  return isUserAuthorized && userLink === store.state.nickname;
}

const getUserArticles = async () => {
  if (props.userId !== null) {
    if (isUserItself()) {
      const userToken = store.state.userToken;
      console.log(userToken);
      articles.value = (await axios.get('http://194.152.37.7:8812/api/articles/my-articles', store.state.config)).data.content;
    } else {
      articles.value = (await axios.get('http://194.152.37.7:8812/api/articles/' + props.userId + '/articles')).data.content;
    }
    isArticlesFound.value = articles.value.length > 0;
  }
}

onMounted(() => {
  getUserArticles();
});

watch(() => props.userId, () => {
  getUserArticles();
});
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100 px-3 py-3">
      <hr class = "mb-5 mt-3">
      <div class = "header border-collapse" style = "display: flex">
        <div class = "avatar mr-5">
          <img :src = "userAvatarUrl" alt="user avatar" style = "height: 10em; width: 10em; border-radius: 5em">
        </div>
        <div class = "user-data">
          <div class = "nickname-data">
            <strong> <p style = "font-size: 2.5em"> {{ userNickname }}</p> </strong>
          </div>
          <div class = "user-names">
              {{ userFirstName }} {{ userLastName }}
          </div>
          <div class = "user-birthday" v-if = "userBirthdate !== undefined">
            Дата рождения: {{ userBirthdate }}
          </div>
          <div class = "user-email">
            {{ userEmail }}
          </div>
        </div>
      </div>
      <hr class = "mt-5">
      <div v-if="isArticlesFound === true">
        <div class = "my-5">
          <strong style = "font-size: 1.5em"> Статьи пользователя: </strong>
        </div>
        <div v-for="article in articles" :key="article.id" class = "scroll-content my-7">
          <ArticlePreviewComponent
            :show-without-header = "true"
            :authors-avatar-url = "null"
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
      <div v-else-if = "isArticlesFound === false" class = "text-center my-5">
        <h2> У пользователя пока нет статей :( </h2>
      </div>
      <hr class = "my-5">
    </div>

  </main>
</template>

<style scoped>

</style>
