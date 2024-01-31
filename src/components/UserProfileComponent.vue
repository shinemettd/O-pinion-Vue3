<script setup>
import axios from "axios";
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";

const props = defineProps({
  userId: {
    type: Number,
    default: null
  },
  userNickname: {
    type: String,
    default: 'username'
  },
  userAvatarUrl: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/10/10938.png'
  },
  userFirstName: {
    type: String,
    default: 'Имя'
  },
  userLastName: {
    type: String,
    default: 'Фамилия'
  },
  userEmail: {
    type: String,
    default: 'default_email@gmail.com'
  },
  userBirthdate: {
    type: String,
    default: 'ДД-ММ-ГГГГ'
  },
  isFirstNameVisible: {
    type: Boolean,
    default: false
  },
  isLastNameVisible: {
    type: Boolean,
    default: false
  },
  isEmailVisible: {
    type: Boolean,
    default: false
  },
  isBirthdateVisible: {
    type: Boolean,
    default: false
  }
})

const route = useRoute();
const userNickname = route.params.userNickname;

const articles = ref([]);

const getUserArticles = async () => {
  if (props.userId !== null) {
    articles.value = (await axios.get('http://194.152.37.7:8812/api/articles/' + props.userId + '/articles')).data.content;
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
          <div class = "user-names" :v-if = "isFirstNameVisible && isLastNameVisible">
              {{ userFirstName }} {{ userLastName }}
          </div>
          <div class = "user-birthday" :v-if = "isBirthdateVisible">
            Дата рождения: {{ userBirthdate }}
          </div>
          <div class = "user-email" :v-if = "isEmailVisible">
            {{ userEmail }}
          </div>
        </div>
      </div>
      <hr class = "mt-5">
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
      <hr class = "my-5">
    </div>

  </main>
</template>

<style scoped>

</style>
